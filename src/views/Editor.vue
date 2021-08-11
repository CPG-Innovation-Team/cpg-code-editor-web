<template>
  <v-row no-gutters d-flex class="fill-height">
    <v-col class="left"> </v-col>
    <v-col cols="8" class="middle">
      <div class="editor-container">
        <div class="title-block">
          <div class="title-text">Editor</div>
          <div class="button-block">
            <select v-model="selectedCodeLanguage" @change="onCodeLanguageChange" test="codeLanguageSelector">
              <option v-for="option in codeLanguageList" :key="option.langValue" v-bind:value="option.langValue">
                {{ option.langName }}
              </option>
            </select>
            <button class="title-button" @click="downloadCode">Download</button>
            <a ref="downloadElement" v-show="false" target="_blank" />
          </div>
        </div>
        <div ref="editor" class="editor"></div>
        <div v-show="consoleVisible" class="title-block">
          <div class="title-text">Console</div>
          <div class="button-block">
            <button class="title-button" @click="runCode">Run</button>
            <button class="title-button" @click="clearConsole">Clear</button>
          </div>
        </div>
        <div v-show="consoleVisible" class="console">
          <p v-for="item in logList" class="log-item" :key="item.index" :class="item.style">
            {{ item.style === 'warn' ? '&#9888;' : '' }}
            {{ item.style === 'error' ? '&#215;' : '' }}
            {{ item.msg }}
          </p>
        </div>
      </div>
    </v-col>

    <v-col cols="1" class="right">
      <EditorToolbar v-bind="$attrs" v-on="$listeners" />
    </v-col>
  </v-row>
</template>

<script>
import * as monaco from 'monaco-editor';
import { io } from 'socket.io-client';
import { getCodeInLocalDb, updateCodeInLocalDb } from '../indexedDb';
import { formattedDateTime, storage, getAvatarColor } from '../util';
import CODE_LANGUAGE_LIST from '../map';
import EditorToolbar from '../components/EditorToolbar.vue';
import { GET_USER_LIST, GET_PROJECT, GET_PROJECT_ID } from '../query';

export default {
  name: 'Editor',
  components: {
    EditorToolbar,
  },
  data() {
    return {
      editor: null,
      socket: null,
      consoleVisible: true,
      logStyle: '',
      logList: [],
      codeUpdateEnable: true, // Debounce for real-time sync
      debounceTimeout: null,
      projectId: null,
      projectName: '',
      projectHash: '',
      syntax: '',
      userId: '',
      initStatus: true,
      selectedCodeLanguage: 'javascript',
      codeLanguageList: CODE_LANGUAGE_LIST,
      users: [],
      color: '',
      cursors: [],
      line: 0,
      column: 0,
      testline: 0,
    };
  },
  methods: {
    initEditor() {
      const theme = {
        base: 'vs-dark',
        inherit: true,
        colors: {
          'editor.background': '#2C333B',
          'editorCursor.foreground': this.color,
        },
        rules: [],
      };
      monaco.editor.defineTheme('my-dark', theme);
      this.editor = monaco.editor.create(this.$refs.editor, {
        language: this.selectedCodeLanguage,
        theme: 'my-dark',
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
      });
    },
    initSocketIO() {
      this.projectHash = this.$route.params.projectHash;

      const socketUrl = process.env.NODE_ENV === 'test' ? '' : 'ws://localhost:3000';
      this.socket = io(socketUrl, { transports: ['websocket'] });
      this.socket.on('connect', async () => {
        if (this.$apollo) {
          await this.$apollo
            .query({
              query: GET_PROJECT_ID,
              fetchPolicy: 'no-cache',
              variables: { hash: this.projectHash },
            })
            .then((response) => {
              // eslint-disable-next-line no-underscore-dangle
              this.projectId = response.data.project[0]._id;
            });
        }
        if (this.projectId) {
          this.socket.emit('clientEnterProject', this.projectId, this.userId);
        }
      });

      this.socket.on('connect_error', async () => {
        if (this.initStatus) {
          this.setCode(await getCodeInLocalDb(this.projectId || 'localDefault'));
          this.initStatus = false;
        }
      });

      // Receive code from server
      this.socket.on('serverProjectInfoSync', async (res) => {
        if (this.projectId !== res.projectId) {
          this.$router.push(`/${res.projectId}`);
          this.projectId = res.projectId;
          this.socket.emit('clientEnterProject', { projectId: this.projectId, userId: this.userId });
        } else if (res.code !== this.getCode() && this.codeUpdateEnable) {
          // Prevent remote code override local
          this.setCode(res.code);
        }
        if (this.$apollo) {
          // retrive user list from server
          await this.$apollo
            .query({
              query: GET_USER_LIST,
              fetchPolicy: 'no-cache',
              variables: { _id: this.projectId },
            })
            .then((response) => {
              this.users = response.data.project[0].editInfo;
              this.$emit('passUserList', this.users);
            });
          // retrive project info from server
          await this.$apollo
            .query({
              query: GET_PROJECT,
              fetchPolicy: 'no-cache',
              variables: {
                _id: this.projectId,
              },
            })
            .then((response) => {
              this.projectName = response.data.project[0].projectName;
              this.syntax = response.data.project[0].syntax;
            });
        }
      });
    },
    editorEventHandler() {
      // user click event

      this.editor.onMouseDown((e) => {
        // console.log('mouse is down');

        if (e.target.position) {
          // console.log(e.target.position.lineNumber);
          // console.log(e.target.position.column);
        }
      });

      this.editor.onDidChangeModelContent((e) => {
        if (e.changes[0].text === '\n' || e.changes[0].text.slice(0, 1) === '\n') {
          // console.log('换行');
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (
              e.changes[0].range.startLineNumber === this.cursors[i].startLineNumber &&
              e.changes[0].range.startColumn <= this.cursors[i].startColumn
            ) {
              //  console.log(`${i}行内换行`);
              this.cursors[i].startLineNumber += 1;
              this.cursors[i].endLineNumber += 1;
              if (e.changes[0].range.startColumn !== 1) {
                //  console.log(`${i}不在开头`);
                this.cursors[i].startColumn = this.cursors[i].startColumn - e.changes[0].range.startColumn + 1;
                this.cursors[i].endColumn = this.cursors[i].endColumn - e.changes[0].range.endColumn + 1;
              }
            } else if (e.changes[0].range.startLineNumber < this.cursors[i].startLineNumber) {
              // console.log(`${i}前面换行`);
              this.cursors[i].startLineNumber += 1;
              this.cursors[i].endLineNumber += 1;
            }
          }
        } else if (e.changes[0].text === '') {
          // console.log('删除');
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (
              e.changes[0].range.startLineNumber < this.cursors[i].startLineNumber &&
              e.changes[0].range.endLineNumber - e.changes[0].range.startLineNumber === 1
            ) {
              //  console.log('前面删除换行');
              this.cursors[i].startLineNumber -= 1;
              this.cursors[i].endLineNumber -= 1;
              if (e.changes[0].range.endLineNumber - this.cursors[i].startLineNumber === 1) {
                //  console.log('上一行有内容，拼接');
                this.cursors[i].startColumn += e.changes[0].range.startColumn - 1;
                this.cursors[i].endColumn = this.cursors[i].startColumn + 1;
              }
            } else if (
              e.changes[0].range.startLineNumber === this.cursors[i].startLineNumber &&
              e.changes[0].range.startColumn < this.cursors[i].startColumn &&
              e.changes[0].range.endLineNumber - e.changes[0].range.startLineNumber === 0
            ) {
              // console.log('行内删除');
              if (
                e.changes[0].range.startColumn < this.cursors[i].startColumn &&
                e.changes[0].range.endColumn > this.cursors[i].endColumn
              ) {
                //  console.log('选中光标部分删除');
                this.cursors[i].startColumn = e.changes[0].range.startColumn;
                this.cursors[i].endColumn = e.changes[0].range.startColumn + 1;
              } else {
                //  console.log('普通行内删除');
                this.cursors[i].startColumn -= e.changes[0].range.endColumn - e.changes[0].range.startColumn;
                this.cursors[i].endColumn -= e.changes[0].range.endColumn - e.changes[0].range.startColumn;
              }
            } else if (
              e.changes[0].range.startLineNumber <= this.cursors[i].startLineNumber &&
              e.changes[0].range.endLineNumber > this.cursors[i].endLineNumber &&
              e.changes[0].range.startColumn < this.cursors[i].startColumn
            ) {
              //  console.log('选中区块删除');
              this.cursors[i].startLineNumber = e.changes[0].range.startLineNumber;
              this.cursors[i].endLineNumber = e.changes[0].range.startLineNumber;
              this.cursors[i].startColumn = e.changes[0].range.startColumn;
              this.cursors[i].endColumn = e.changes[0].range.startColumn + 1;
            }
          }
        } else if (e.changes[0].text !== '\n' && e.versionId !== 2) {
          //  console.log('增加');
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (e.changes[0].text.includes('\n') === true) {
              // const count = (e.changes[0].text.match(/\n/g) || []).length;
              // console.log(`length is ${count}`);
              //  console.log('区块增加');
              // this.cursors[i].startLineNumber += count;
              // this.cursors[i].endLineNumber += count;
            } else if (
              e.changes[0].range.startLineNumber === this.cursors[i].startLineNumber &&
              e.changes[0].range.startColumn < this.cursors[i].startColumn
            ) {
              //   console.log('行内增加');
              this.cursors[i].startColumn += e.changes[0].text.length;
              this.cursors[i].endColumn += e.changes[0].text.length;
            }
          }
        }

        // user isTyping widget

        const contentWidgets = [];

        for (let i = 0; i < this.cursors.length; i += 1) {
          const lineNumber = this.cursors[i].startLineNumber;
          const column = this.cursors[i].startColumn;
          const { id } = this.cursors[i];
          const color = getAvatarColor(this.cursors[i].avatar);
          contentWidgets.push({
            domNode: null,
            getId() {
              return `content.${id}`;
            },
            getDomNode() {
              if (!this.domNode) {
                this.domNode = document.createElement('div');
                this.domNode.innerHTML = 'is typing...';
                this.domNode.style.color = 'white';
                this.domNode.style.opacity = 0.9;
                this.domNode.style.background = color;
                this.domNode.style['font-size'] = '10px';
                this.domNode.style.width = 'max-content';
              }
              return this.domNode;
            },
            getPosition() {
              return {
                position: {
                  lineNumber,
                  column,
                },
                preference: [
                  monaco.editor.ContentWidgetPositionPreference.ABOVE,
                  monaco.editor.ContentWidgetPositionPreference.BELOW,
                ],
              };
            },
          });
        }

        for (let i = 0; i < contentWidgets.length; i += 1) {
          this.editor.removeContentWidget(contentWidgets[i]);
          this.editor.addContentWidget(contentWidgets[i]);
        }

        const decorations = [];

        for (let i = 0; i < this.cursors.length; i += 1) {
          decorations.push({
            range: new monaco.Range(
              this.cursors[i].startLineNumber,
              this.cursors[i].startColumn,
              this.cursors[i].endLineNumber,
              this.cursors[i].endColumn
            ),
            options: { className: this.cursors[i].avatar, stickiness: 1 },
          });
        }

        this.editor.deltaDecorations([], decorations);

        this.initStatus = false;
        if (!this.codeUpdateEnable) {
          clearTimeout(this.debounceTimeout);
        }
        this.codeUpdateEnable = false;

        // Send code to server after no operation for 1 seconds
        this.debounceTimeout = setTimeout(() => {
          console.original.log(e);
          const code = this.getCode();
          this.socket.emit('clientUpdateProjectInfo', {
            code,
            projectId: this.projectId,
            projectName: this.projectName,
            syntax: this.syntax,
            userId: this.userId,
          });
          updateCodeInLocalDb(code, this.projectId || 'localDefault');
          this.codeUpdateEnable = true;
        }, 1000);
      });
    },
    consoleHandler() {
      console.original = { ...console };
      console.log = (msg) => {
        this.addLog(msg);
      };
      console.info = (msg) => {
        this.addLog(msg);
      };
      console.warn = (msg) => {
        this.addLog(msg, 'warn');
      };
      console.error = (msg) => {
        this.addLog(msg, 'error');
      };
    },
    setCode(code) {
      this.editor.setValue(code);
    },
    getCode() {
      return this.editor.getValue();
    },
    runCode() {
      try {
        // eslint-disable-next-line no-new-func
        Function(this.getCode())();
      } catch (err) {
        console.error(err.toString());
      }
    },
    addLog(msg, style) {
      this.logList.push({ msg, style });
    },
    clearConsole() {
      this.logList = [];
    },
    downloadCode() {
      const blob = new Blob([this.getCode()], { type: 'text' });
      const URL = window.URL || window.webkitURL;
      const { downloadElement } = this.$refs;
      downloadElement.href = URL.createObjectURL(blob);
      downloadElement.download = `code-${formattedDateTime(new Date())}`;
      downloadElement.click();
    },
    onCodeLanguageChange() {
      if (this.selectedCodeLanguage === 'javascript') {
        this.consoleVisible = true;
      } else {
        this.consoleVisible = false;
      }
      this.$nextTick(() => {
        const code = this.getCode();
        this.editor.dispose();
        this.initEditor();
        this.setCode(code);

        const decorations = [];

        for (let i = 0; i < this.cursors.length; i += 1) {
          decorations.push({
            range: new monaco.Range(
              this.cursors[i].startLineNumber,
              this.cursors[i].startColumn,
              this.cursors[i].endLineNumber,
              this.cursors[i].endColumn
            ),
            options: { className: this.cursors[i].avatar, stickiness: 1 },
          });
        }

        this.editor.deltaDecorations([], decorations);
      });
    },
  },
  created() {
    this.userId = storage.getUserInfo().userID;
    this.color = getAvatarColor(storage.getUserInfo().userAvatar);
    this.cursors = [
      { id: '01', avatar: 'avatar1', startLineNumber: 2, startColumn: 10, endLineNumber: 2, endColumn: 11 },
      // { id: '02', avatar: 'avatar2', startLineNumber: 1, startColumn: 8, endLineNumber: 1, endColumn: 9 },
      // { id: '03', avatar: 'avatar3', startLineNumber: 4, startColumn: 7, endLineNumber: 4, endColumn: 8 },
      // { id: '04', avatar: 'avatar2', startLineNumber: 8, startColumn: 1, endLineNumber: 8, endColumn: 2 },
    ];
  },
  mounted() {
    this.initEditor();
    this.initSocketIO();
    this.consoleHandler();
    this.editorEventHandler();
  },
  beforeDestroy() {
    this.editor.dispose();
  },
};
</script>

<style lang="scss">
.editor-container {
  display: flex;
  flex-direction: column;
  height: 88vh;
  width: 100%;
}

.title-block {
  display: flex;
  justify-content: space-between;
  height: 30px;
  line-height: 30px;
  background-color: #ddd;

  .title-text {
    margin-left: 8px;
  }

  .button-block {
    text-align: right;
    margin-right: 8px;

    .title-button {
      margin-left: 8px;
    }
  }
}

.editor {
  flex: 2;
  padding-top: 20px;
  height: 100%;
}

.console {
  flex: 1;
  width: 100%;
  overflow-y: auto;

  .log-item {
    color: white;
    margin: 0;
    padding: 5px 8px;
    border-bottom: 1px solid #eee;

    &.warn {
      color: #990;
    }
    &.error {
      color: #c00;
    }
  }
}

.left {
  border-top: 1px solid #eee;
  background-color: #3d4b56;
}

.middle {
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  background-color: #2c333b;
}

.right {
  min-width: 75px;
  max-width: 100px;
}

.avatar1 {
  background: #c69430;
  width: 2px !important;
}

.avatar2 {
  background: #c6c983;
  width: 2px !important;
}

.avatar3 {
  background: #875d45;
  width: 2px !important;
}
</style>
