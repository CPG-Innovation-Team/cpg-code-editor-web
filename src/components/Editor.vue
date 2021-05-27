<template>
  <div>
    <div ref="editor" class="editor"></div>
    <button @click="runCode">RUN</button>
    <button @click="clearConsole">CLEAR</button>
    <div v-show="consoleVisible" class="console">
      <p v-for="item in logList" :key="item.index" :class="item.style">
        {{ item.style === 'warn' ? '&#9888;' : '' }}
        {{ item.style === 'error' ? '&#215;' : '' }}
        {{ item.msg }}
      </p>
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor';

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
  },
  beforeDestroy() {
    this.editor.dispose();
  },
};
</script>

<style scoped lang="scss">
.editor {
  width: 600px;
  height: 300px;
  text-align: left;
}

.console {
  width: 600px;
  height: 300px;

  .warn {
    color: #990;
  }
  .error {
    color: #c00;
  }
}
</style>
