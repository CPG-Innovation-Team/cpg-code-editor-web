<template>
  <div class="fill-height row-container">
    <div class="history-section" v-bind:style="{ width: sectionWidth + 'px' }"></div>
    <div class="resize-bar" ref="resizeBar"></div>
    <div class="editor-section" v-bind:style="{ width: 'calc(100% - ' + sectionWidth + 'px - 75px)' }">
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
      </div>
    </div>

    <div class="toolbar-section">
      <EditorToolbar
        v-bind="$attrs"
        v-on="$listeners"
        :projectName="projectName"
        :syntax="syntax"
        @download="downloadCode"
        @changeLanguage="onCodeLanguageChange"
      />
    </div>
  </div>
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
      lineNumber: 1,
      column: 1,
      sectionWidth: 300,
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
        language: this.syntax,
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
          if (res.code) this.setCode(res.code);
        }

        if (res.currentCursor) {
          let flag = false;
          let index = -1;
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (this.cursors[i].id === res.userId) {
              flag = true;
              index = i;
            }
          }
          let avatar = '';
          for (let i = 0; i < this.users.length; i += 1) {
            if (this.users[i].userId === res.userId) {
              avatar = this.users[i].avatar;
            }
          }
          if (flag === false) {
            this.cursors.push({ id: res.userId, cursor: res.currentCursor, avatar });
          }
          if (flag === true) {
            this.cursors[index].cursor = res.currentCursor;
          }

          console.log(this.cursors);

          const decorations = [];

          for (let i = 0; i < this.cursors.length; i += 1) {
            if (this.cursors[i].id !== storage.getUserInfo().userID) {
              decorations.push({
                range: new monaco.Range(
                  this.cursors[i].cursor.lineNumber,
                  this.cursors[i].cursor.column,
                  this.cursors[i].cursor.lineNumber,
                  this.cursors[i].cursor.column + 1
                ),
                options: { className: `cursor-${this.cursors[i].avatar}`, stickiness: 1 },
              });
            }
          }

          console.log(decorations);

          this.editor.deltaDecorations([], decorations);
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

      const that = this;
      this.editor.onMouseDown((e) => {
        if (e.target.position) {
          that.lineNumber = e.target.position.lineNumber;
          that.column = e.target.position.column;
          that.socket.emit('clientUpdateProjectInfo', {
            projectId: that.projectId,
            userId: that.userId,
            isOnline: true,
            isEditing: true,
            currentCursor: {
              lineNumber: that.lineNumber,
              column: that.column,
            },
          });
        }
      });

      this.editor.onDidChangeModelContent(() => {
        this.initStatus = false;
        if (!this.codeUpdateEnable) {
          clearTimeout(this.debounceTimeout);
        }
        this.codeUpdateEnable = false;

        // Send code to server after no operation for 1 seconds
        this.debounceTimeout = setTimeout(() => {
          // console.original.log(e);
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
    setCode(code) {
      this.editor.setValue(code);
    },
    getCode() {
      return this.editor.getValue();
    },
    addLog(msg, style) {
      this.logList.push({ msg, style });
    },
    downloadCode() {
      const blob = new Blob([this.getCode()], { type: 'text' });
      const URL = window.URL || window.webkitURL;
      const { downloadElement } = this.$refs;
      downloadElement.href = URL.createObjectURL(blob);
      downloadElement.download = `code-${formattedDateTime(new Date())}`;
      downloadElement.click();
    },
    onCodeLanguageChange(value) {
      this.syntax = value;
      this.selectedCodeLanguage = value;
      this.$nextTick(() => {
        const code = this.getCode();
        this.editor.dispose();
        this.initEditor();
        this.setCode(code);
      });
    },
    resizeBarController() {
      const resize = this.$refs.resizeBar;
      resize.onmousedown = (e) => {
        // Color change reminder
        resize.style.background = '#818181';
        let startX = e.clientX;
        resize.left = resize.offsetLeft;
        document.onmousemove = (ex) => {
          // Calculate and apply displacement
          const endX = ex.clientX;
          const moveLen = endX - startX;
          startX = endX;
          this.sectionWidth += moveLen;

          if (this.sectionWidth < 0) {
            this.sectionWidth = 0;
          } else if (this.sectionWidth > window.innerWidth * 0.8) {
            this.sectionWidth = window.innerWidth * 0.8;
          }
        };
        document.onmouseup = () => {
          // color restoration
          resize.style.background = '';
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
  },
  created() {
    this.userId = storage.getUserInfo().userID;
    this.color = getAvatarColor(storage.getUserInfo().userAvatar);
  },
  mounted() {
    this.initEditor();
    this.initSocketIO();
    this.editorEventHandler();
    this.resizeBarController();
  },
  beforeDestroy() {
    this.editor.dispose();
  },
};
</script>

<style scoped lang="scss">
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

.row-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  overflow: hidden;
  position: relative;
  .history-section {
    border-top: 1px solid #eee;
    background-color: #3d4b56;
    position: relative;
  }
  .resize-bar {
    border-top: 1px solid #eee;
    background-color: black;
    height: 100%;
    top: 0;
    right: 0;
    width: 5px;
    cursor: col-resize;
  }
  .editor-section {
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    background-color: #2c333b;
  }

  .toolbar-section {
    width: 75px;
  }
}
</style>
