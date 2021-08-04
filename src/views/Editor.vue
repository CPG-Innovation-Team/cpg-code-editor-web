<template>
  <div class="fill-height row-container">
    <div class="left" v-bind:style="{ width: sectionWidth + 'px' }"></div>
    <div class="resize-bar" ref="resizeBar"></div>
    <div class="middle">
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
    </div>

    <div class="right">
      <EditorToolbar />
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor';
import { io } from 'socket.io-client';
import { getCodeInLocalDb, updateCodeInLocalDb } from '../indexedDb';
import { formattedDateTime, storage } from '../util';
import CODE_LANGUAGE_LIST from '../map';
import EditorToolbar from '../components/EditorToolbar.vue';

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
      userId: storage.getUserInfo().userID,
      initStatus: true,
      selectedCodeLanguage: 'javascript',
      codeLanguageList: CODE_LANGUAGE_LIST,
      users: [],
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
      });
    },
    initSocketIO() {
      this.projectId = this.$route.params.projectId;
      console.log(this.projectId);

      const socketUrl = process.env.NODE_ENV === 'test' ? '' : 'ws://localhost:3000';
      this.socket = io(socketUrl, { transports: ['websocket'] });
      this.socket.on('connect', () => {
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
      this.socket.on('serverProjectInfoSync', (res) => {
        if (this.projectId !== res.projectId) {
          this.$router.push(`/${res.projectId}`);
          this.projectId = res.projectId;
          this.socket.emit('clientEnterProject', { projectId: this.projectId, userId: this.userId });
        } else if (res.code !== this.getCode() && this.codeUpdateEnable) {
          // Prevent remote code override local
          this.setCode(res.code);
        }
      });
    },
    editorEventHandler() {
      this.editor.onDidChangeModelContent((e) => {
        this.initStatus = false;
        if (!this.codeUpdateEnable) {
          clearTimeout(this.debounceTimeout);
        }
        this.codeUpdateEnable = false;

        // Send code to server after no operation for 1 seconds
        this.debounceTimeout = setTimeout(() => {
          console.original.log(e);
          const code = this.getCode();
          this.socket.emit('clientUpdateProjectInfo', { code, projectId: this.projectId });
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
  mounted() {
    this.initEditor();
    this.initSocketIO();
    this.consoleHandler();
    this.editorEventHandler();

    this.resizeBarController();
  },
};
</script>

<style scoped lang="scss">
.editor-container {
  display: flex;
  flex-direction: column;
  height: 88vh;
  width: inherit;
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
  .left {
    max-width: 55%;
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
  .middle {
    flex: 1 0 auto;
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    background-color: #2c333b;
  }

  .right {
    width: 75px;
  }
}
</style>
