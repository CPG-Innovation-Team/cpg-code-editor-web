<template>
  <div class="fill-height row-container">
    <div class="history-section" v-bind:style="{ width: sectionWidth + 'px' }">
      <div v-for="(user, index) in editHistory" :key="index">
        <div
          @click="moveEditor((user.editLinesStart + user.editLinesEnd) / 2)"
          class="highlight-bar"
          :style="{
            top: (user.editLinesStart - 1) * eachLineHeight - editorScroll + highlightTop + 'px',
            height: (user.editLinesEnd - user.editLinesStart + 1) * eachLineHeight + 'px',
            'border-right': 'solid 5px ' + user.color,
          }"
        >
          <a style="color: rgb(190, 198, 201)">{{ user.editTime }}</a>
          <a :style="{ 'margin-left': 130 + 'px', color: user.color }"> {{ user.name }} </a>
        </div>
      </div>
    </div>
    <div class="resize-bar" ref="resizeBar"></div>
    <div class="editor-section" v-bind:style="{ width: 'calc(100% - ' + sectionWidth + 'px - 75px)' }">
      <div class="editor-container">
        <a ref="downloadElement" v-show="false" target="_blank" />
        <div ref="editor" class="editor"></div>
      </div>
    </div>

    <div class="toolbar-section">
      <EditorToolbar
        v-bind="$attrs"
        v-on="$listeners"
        :projectName="projectName"
        :syntax="syntax"
        @downloadCode="downloadCode"
        @changeLanguage="onCodeLanguageChange"
        @changeName="onProjectNameChange"
        @searchText="searchText"
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
      codeUpdateEnable: true, // Debounce for real-time sync
      debounceTimeout: null,
      projectId: null,
      projectName: '',
      projectHash: this.$route.params.projectHash,
      syntax: '',
      userId: '',
      initStatus: true,
      selectedCodeLanguage: 'javascript',
      codeLanguageList: CODE_LANGUAGE_LIST,
      highlightTop: 21, // mannually set as 51, number should be able to change accordingly
      editorScroll: null,
      eachLineHeight: null,
      users: [],
      color: '',
      cursors: [],
      lineNumber: 1,
      column: 1,
      sectionWidth: 300,
      editingUser: '',
      contentWidgets: [],
      decorations: [],
      projectCode: [],
      contentEditLines: [],
      editHistory: [
        {
          name: 'Aha',
          color: 'rgb(127, 86, 105)',
          editTime: '15:20',
          editNumber: 10,
          editLinesStart: 1,
          editLinesEnd: 5,
        },
        {
          name: 'Jeremy',
          color: 'rgb(27, 186, 205)',
          editTime: '15:20',
          editNumber: 10,
          editLinesStart: 10,
          editLinesEnd: 20,
        },
        {
          name: 'Allen',
          color: 'rgb(232, 98, 34)',
          editTime: '12:20',
          editNumber: 25,
          editLinesStart: 21,
          editLinesEnd: 30,
        },
      ],
    };
  },
  props: { projects: Array },
  methods: {
    searchText() {
      this.editor.getAction('actions.find').run('');
    },
    initEditor() {
      console.log(this.syntax);
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
      // Get the line height
      this.editor.setValue('\n');
      this.eachLineHeight = this.editor.getTopForLineNumber(2) - this.editor.getTopForLineNumber(1);
      this.editor.setValue('');
      // set up highlightTop
    },
    initSocketIO() {
      const socketUrl = process.env.VUE_APP_SOCKET_URL;
      this.socket = io(socketUrl, { transports: ['websocket'] });
      this.socket.on('connect', async () => {
        this.socket.on('userDisconnected', async () => {
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
          }
        });

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
      this.socket.on('serverProjectCodeSync', async (res) => {
        console.log('code recieved is:');
        console.log(res);
      });
      // Receive code from server
      this.socket.on('serverProjectInfoSync', async (res) => {
        if (this.projectId !== res.projectId) {
          this.$router.push(`/${res.projectId}`);
          this.projectId = res.projectId;
          this.socket.emit('clientEnterProject', { projectId: this.projectId, userId: this.userId });
        } else if (res.code !== this.getCode() && this.codeUpdateEnable) {
          // Prevent remote code override local
          if (res.code) {
            // remove widget after the user has finished typing
            this.contentWidgets.forEach((contentWidget) => this.editor.removeContentWidget(contentWidget));
            this.setCode(res.code);
          }
          if (res.projectCode) {
            // recieve projectCode from server as enterred
            this.projectCode = res.projectCode;
            console.log('projectCode recieved from server');
            console.log(this.projectCode);
          }
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

        // save user cursors in local
        if (res.currentCursor) {
          let isUserExisted = false;
          let existedUserIndex = -1;
          this.editingUser = res.userId;
          // check if the editing user is already saved in local
          this.cursors.forEach((cursor, i) => {
            if (cursor.id === res.userId) {
              isUserExisted = true;
              existedUserIndex = i;
            }
          });
          let avatar = '';
          let name = '';
          // search for the name and avatar for the editing user
          this.users.forEach((user) => {
            if (user.userId === res.userId) {
              avatar = user.avatar;
              name = user.userName;
            }
          });
          // if the user is not saved in local, add it, otherwise, overwrite it
          if (isUserExisted === false) {
            this.cursors.push({ id: res.userId, cursor: res.currentCursor, avatar, isEditing: res.isEditing, name });
          } else {
            this.cursors[existedUserIndex].cursor = res.currentCursor;
          }
        }

        // add cursor decorations on the editor
        this.editor.deltaDecorations([], this.decorations);

        // add isTyping widget on the editor
        this.contentWidgets.forEach((contentWidget) => {
          // check if the user is editing and ensure it is not the user-self
          if (
            res.isEditing === true &&
            contentWidget.uid === this.editingUser &&
            contentWidget.uid !== storage.getUserInfo().userID
          ) {
            this.editor.addContentWidget(contentWidget);
          }
        });
      });
    },
    editorEventHandler() {
      // user click event
      const that = this;
      this.editor.onMouseDown((e) => {
        if (e.target.position) {
          // listen to user mouse click and save the cursor location to socket
          that.lineNumber = e.target.position.lineNumber;
          that.column = e.target.position.column;
          that.socket.emit('clientUpdateProjectInfo', {
            projectId: that.projectId,
            userId: that.userId,
            isOnline: true,
            currentCursor: {
              lineNumber: that.lineNumber,
              column: that.column,
            },
          });
        }
      });

      this.editor.onDidScrollChange(() => {
        // console.log(e);
        // console.log(this.editor.getContentHeight());
        // console.log(this.editor.getScrollHeight());

        this.editorScroll = this.editor.getScrollTop();
      });

      this.editor.onDidChangeModelContent((e) => {
        // check if the editing user is the current user-self, and save it to socket
        if (storage.getUserInfo().userID === this.editingUser) {
          this.socket.emit('clientUpdateProjectInfo', {
            projectId: this.projectId,
            userId: this.userId,
            isOnline: true,
            isEditing: true,
          });
        }
        const contentEdit = e.changes[0].text;
        // add copy and paste feautre later
        // when the change is typing input
        if (contentEdit.length === 1) {
          this.contentEditLines.push(e.changes[0].range.endLineNumber);
        } else if (contentEdit.slice(0, 1) === '\r') {
          this.addContentListValue(e.changes[0].range.endLineNumber);
          this.contentEditLines.push(e.changes[0].range.endLineNumber + 1);
          this.resizeLeftBarAdd(e.changes[0].range.endLineNumber);
        }
        // when the change is deleting
        if (contentEdit.length === 0) {
          console.log('deleting');
          if (e.changes[0].rangeLength === 2){ // update later
            this.resizeLeftBarDelete(e.changes[0].range.endLineNumber);
          }
        }

        // branches to analyze the user editing event and calculate corresponding cursor position for all users
        if (e.changes[0].text === '\n' || e.changes[0].text.slice(0, 1) === '\n') {
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (
              e.changes[0].range.startLineNumber === this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.startColumn <= this.cursors[i].cursor.column
            ) {
              this.cursors[i].cursor.lineNumber += 1;
              this.lineNumber += 1;
              if (e.changes[0].range.startColumn !== 1) {
                this.cursors[i].cursor.column =
                  this.cursors[i].cursor.column - e.changes[0].range.startColumn + e.changes[0].text.length;
                this.column = this.column - e.changes[0].range.startColumn + e.changes[0].text.length;
              }
              this.updateProjectInfo();
            } else if (e.changes[0].range.startLineNumber < this.cursors[i].cursor.column) {
              this.cursors[i].cursor.lineNumber += 1;
              this.lineNumber += 1;
              this.updateProjectInfo();
            }
          }
        } else if (e.changes[0].text === '') {
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (
              e.changes[0].range.startLineNumber < this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.endLineNumber - e.changes[0].range.startLineNumber === 1
            ) {
              this.cursors[i].cursor.lineNumber -= 1;
              this.lineNumber -= 1;
              if (e.changes[0].range.endLineNumber - this.cursors[i].cursor.lineNumber === 1) {
                this.cursors[i].cursor.column += e.changes[0].range.startColumn - 1;
                this.column += e.changes[0].range.startColumn - 1;
              }
              this.updateProjectInfo();
            } else if (
              e.changes[0].range.startLineNumber === this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.startColumn < this.cursors[i].cursor.column &&
              e.changes[0].range.endLineNumber - e.changes[0].range.startLineNumber === 0
            ) {
              if (
                e.changes[0].range.startColumn < this.cursors[i].cursor.column &&
                e.changes[0].range.endColumn > this.cursors[i].cursor.column
              ) {
                this.cursors[i].cursor.column = e.changes[0].range.startColumn;
                this.column = e.changes[0].range.startColumn;
              } else {
                this.cursors[i].cursor.column -= e.changes[0].range.endColumn - e.changes[0].range.startColumn;
                this.column -= e.changes[0].range.endColumn - e.changes[0].range.startColumn;
              }
              this.updateProjectInfo();
            } else if (
              e.changes[0].range.startLineNumber <= this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.endLineNumber > this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.startColumn < this.cursors[i].cursor.column
            ) {
              this.cursors[i].cursor.lineNumber = e.changes[0].range.startLineNumber;
              this.cursors[i].cursor.column = e.changes[0].range.startColumn;
              this.lineNumber = e.changes[0].range.startLineNumber;
              this.column = e.changes[0].range.startColumn;
              this.updateProjectInfo();
            }
          }
        } else if (e.changes[0].text !== '\n' && e.versionId !== 2) {
          for (let i = 0; i < this.cursors.length; i += 1) {
            if (
              e.changes[0].range.startLineNumber === this.cursors[i].cursor.lineNumber &&
              e.changes[0].range.startColumn <= this.cursors[i].cursor.column
            ) {
              this.cursors[i].cursor.column += e.changes[0].text.length;
              this.column += e.changes[0].text.length;
              this.updateProjectInfo();
            }
          }
        }

        // create isTyping widget for each user corresponding to their cursor location
        this.addContentWidgets();

        // create user cursor corresponding to their cursor location
        this.addCursorDecorations();
      });

      this.editor.onDidChangeModelContent(() => {
        this.initStatus = false;
        if (!this.codeUpdateEnable) {
          clearTimeout(this.debounceTimeout);
        }
        this.codeUpdateEnable = false;

        // Send code to server after no operation for 1 seconds
        this.debounceTimeout = setTimeout(() => {



          console.log(this.contentEditLines);
          this.socket.emit('clientUpdateProjectCode', {
            projectId: this.projectId,
            projectCode: [
              {
                lineNumber: 1,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 2,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 3,
                editType: 'update',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 4,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 5,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 6,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 7,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 8,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
              {
                lineNumber: 9,
                editType: 'add',
                content: 'testing',
                userId: this.userID,
                updateTime: 1635401514384,
              },
            ],
          });

          const code = this.getCode();
          console.log(this.editor.getModel().getLinesContent());
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
    updateProjectInfo() {
      this.socket.emit('clientUpdateProjectInfo', {
        projectId: this.projectId,
        userId: this.userId,
        isOnline: true,
        currentCursor: {
          lineNumber: this.lineNumber,
          column: this.column,
        },
      });
    },
    setCode(code) {
      this.editor.setValue(code);
    },
    passCode(code) {
      this.socket.emit('clientUpdateProjectCode', {
        projectId: this.projectId,
        projectCode: code,
      });
      this.editor.setValue(code);
    },
    compareCode() {
      const editorCode = this.editor.getValue();
      if (editorCode === this.projectCode) {
        return 'SAME CODE';
      }
      return 'DIFFERENT CODE';
    },
    getCode() {
      return this.editor.getValue();
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
      this.$nextTick(() => {
        const code = this.getCode();
        this.editor.dispose();
        this.initEditor();
        this.setCode(code);
      });
      const code = this.getCode();
      this.socket.emit('clientUpdateProjectInfo', {
        code,
        projectId: this.projectId,
        projectName: this.projectName,
        syntax: this.syntax,
        userId: this.userId,
      });
    },
    onProjectNameChange(value) {
      const oldProjectName = this.projectName;
      const index = this.projects.findIndex((project) => project.projectName === oldProjectName);
      this.projects[index].projectName = value;
      this.projectName = value;
      this.$emit('changeProjectName', this.projectName);
      const code = this.getCode();
      this.socket.emit('clientUpdateProjectInfo', {
        code,
        projectId: this.projectId,
        projectName: this.projectName,
        syntax: this.syntax,
        userId: this.userId,
      });
    },
    addContentListValue(addLineNumber) {
      for (let i = 0; i < this.contentEditLines.length; i += 1) {
        if (this.contentEditLines[i] > addLineNumber) {
          this.contentEditLines[i] += 1;
        }
      }
    },

    resizeLeftBarAdd(moveLineNumber) {
      for (let i = 0; i < this.editHistory.length; i += 1) {
        if (this.editHistory[i].editLinesStart > moveLineNumber) {
          console.log('inside loop');
          this.editHistory[i].editLinesStart += 1;
          this.editHistory[i].editLinesEnd += 1;
        }
        if (this.editHistory[i].editLinesStart <= moveLineNumber) {
          if (this.editHistory[i].editLinesEnd >= moveLineNumber) {
            this.editHistory[i].editLinesEnd += 1;
          }
        }
      }
    },

    resizeLeftBarDelete(moveLineNumber) {
      for (let i = 0; i < this.editHistory.length; i += 1) {
        if (this.editHistory[i].editLinesStart > moveLineNumber) {
          this.editHistory[i].editLinesStart -= 1;
          this.editHistory[i].editLinesEnd -= 1;
        }
        if (this.editHistory[i].editLinesStart <= moveLineNumber) {
          if (this.editHistory[i].editLinesEnd >= moveLineNumber) {
            this.editHistory[i].editLinesEnd -= 1;
          }
        }
      }
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
    addCursorDecorations() {
      this.decorations = [];

      this.cursors.forEach((cursor) => {
        if (cursor.id !== storage.getUserInfo().userID) {
          this.decorations.push({
            range: new monaco.Range(
              cursor.cursor.lineNumber,
              cursor.cursor.column,
              cursor.cursor.lineNumber,
              cursor.cursor.column + 1
            ),
            options: { className: `cursor-avatar ${cursor.avatar}`, stickiness: 1 },
          });
        }
      });
    },
    addContentWidgets() {
      this.contentWidgets = [];

      this.cursors.forEach((cursor) => {
        const line = cursor.cursor.lineNumber;
        const col = cursor.cursor.column;
        const uid = cursor.id;
        const username = cursor.name;
        const color = getAvatarColor(cursor.avatar);
        this.contentWidgets.push({
          uid,
          domNode: null,
          getId() {
            return `${uid}`;
          },
          getDomNode() {
            if (!this.domNode) {
              this.domNode = document.createElement('div');
              this.domNode.innerHTML = `${username} is editing...`;
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
                lineNumber: line,
                column: col,
              },
              preference: [
                monaco.editor.ContentWidgetPositionPreference.ABOVE,
                monaco.editor.ContentWidgetPositionPreference.BELOW,
              ],
            };
          },
        });
      });
    },
  },
  moveEditor(moveLineNumber) {
    this.editor.revealLineInCenter(moveLineNumber);
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

.editor {
  flex: 2;
  padding-top: 20px;
  height: 100%;
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
    .highlight-bar {
      padding-left: 20px;
      position: absolute;
      width: 100%;
    }
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
    overflow: hidden;
    position: relative;
  }

  .toolbar-section {
    width: 75px;
  }
}
</style>
