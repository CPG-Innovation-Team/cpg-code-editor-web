<template>
  <div class="editor-container">
    <div class="title-block">
      <div class="title-text">Editor</div>
    </div>
    <div ref="editor" class="editor"></div>
    <div class="title-block">
      <div class="title-text">Console</div>
      <div class="button-block">
        <button class="console-button" @click="runCode">Run</button>
        <button class="console-button" @click="clearConsole">Clear</button>
        <button class="console-button" @click="downloadCode">Download</button>
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
</template>

<script>
import * as monaco from 'monaco-editor';
import { io } from 'socket.io-client';
import { getCodeInLocalDb, updateCodeInLocalDb } from '../indexedDb';

export default {
  name: 'Editor',
  data() {
    return {
      editor: null,
      socket: null,
      consoleVisible: true,
      logStyle: '',
      logList: [],
      codeUpdateEnable: true, // Debounce for real-time sync
      debounceTimeout: null,
      roomId: null,
      initStatus: true,
    };
  },
  methods: {
    initEditor() {
      this.editor = monaco.editor.create(this.$refs.editor, {
        language: 'javascript',
      });
    },
    initSocketIO() {
      this.roomId = this.$route.params.roomId;

      const socketUrl = process.env.NODE_ENV === 'test' ? '' : 'ws://localhost:3000';
      this.socket = io(socketUrl, { transports: ['websocket'] });
      this.socket.on('connect', () => {
        if (this.roomId) {
          this.socket.emit('clientEnterRoom', this.roomId);
        }
      });

      this.socket.on('connect_error', async () => {
        if (this.initStatus) {
          this.setCode(await getCodeInLocalDb(this.roomId || 'localDefault'));
          this.initStatus = false;
        }
      });

      // Receive code from server
      this.socket.on('serverCodeSync', (res) => {
        if (this.roomId !== res.roomId) {
          this.$router.push(`/${res.roomId}`);
          this.roomId = res.roomId;
          this.socket.emit('clientEnterRoom', res.roomId);
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
          this.socket.emit('clientUploadCode', { code, roomId: this.roomId });
          updateCodeInLocalDb(code, this.roomId || 'localDefault');
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
      const downloadElement = document.createElement('a');
      downloadElement.style.display = 'none';
      downloadElement.target = '_blank';
      document.body.appendChild(downloadElement);

      const URL = window.URL || window.webkitURL;
      downloadElement.href = URL.createObjectURL(blob);
      downloadElement.download = 'code';
      downloadElement.click();
      document.body.removeChild(downloadElement);
    },
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

<style scoped lang="scss">
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

    .console-button {
      margin-left: 8px;
    }
  }
}

.editor {
  flex: 2;
  width: 100%;
  border-bottom: 1px solid #999;
  text-align: left;
}

.console {
  flex: 1;
  width: 100%;
  overflow-y: auto;

  .log-item {
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
</style>
