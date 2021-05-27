<template>
  <div class="editor-container">
    <div class="title-block">
      <div class="title-text">Editor</div>
    </div>
    <div ref="editor" class="editor"></div>
    <div class="title-block">
      <div class="title-text">Console</div>
      <div class="button-block">
        <button class="console-button" @click="runCode">RUN</button>
        <button class="console-button" @click="clearConsole">CLEAR</button>
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

export default {
  name: 'Editor',
  data() {
    return {
      editor: null,
      consoleVisible: true,
      logStyle: '',
      logList: [],
    };
  },
  methods: {
    initEditor() {
      this.editor = monaco.editor.create(this.$refs.editor, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}', 'x();'].join('\n'),
        language: 'javascript',
      });

      this.editor.onDidChangeModelContent((e) => {
        console.log(e);
      });
    },
    consoleHandler() {
      console.original = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
      };
      console.log = (msg) => {
        this.addLog(msg);
        console.original.log(msg);
      };
      console.info = (msg) => {
        this.addLog(msg);
        console.original.info(msg);
      };
      console.warn = (msg) => {
        this.addLog(msg, 'warn');
        console.original.warn(msg);
      };
      console.error = (msg) => {
        this.addLog(msg, 'error');
        console.original.error(msg);
      };
    },
    getCode() {
      return this.editor.getValue();
    },
    runCode() {
      try {
        // eslint-disable-next-line no-new-func
        Function(this.getCode())();
      } catch (e) {
        console.error(e);
      }
    },
    addLog(msg, style) {
      this.logList.push({ msg, style });
    },
    clearConsole() {
      this.logList = [];
    },
  },
  mounted() {
    this.initEditor();
    this.consoleHandler();

    // test for socket.io
    const socket = io('ws://localhost:3000', { transports: ['websocket'] });
    socket.emit('msg', 'test message');
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
