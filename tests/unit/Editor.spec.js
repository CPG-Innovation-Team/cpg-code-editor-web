import 'jest-canvas-mock';
import io from 'socket.io-client';
import MockedSocket from 'socket.io-mock';
import { shallowMount } from '@vue/test-utils';
import Editor from '@/views/Editor.vue';

jest.mock('socket.io-client');
let socket = null;

describe('Editor.vue', () => {
  beforeAll(() => {
    // Mocking matchMedia method not implemented in JSDOM
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    socket = new MockedSocket();
    io.mockReturnValue(socket);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getWrapper = (projectHash = undefined) =>
    shallowMount(Editor, {
      mocks: {
        $route: {
          params: { projectHash },
        },
        $router: {
          push: jest.fn(),
        },
      },
    });

  it('Render page with editor and console', () => {
    const wrapper = getWrapper();
    expect.assertions(2);
    expect(wrapper.find('.monaco-editor').isVisible()).toBeTruthy();
    expect(wrapper.find('.console').isVisible()).toBeTruthy();
  });

  it('Set code and get it in editor', () => {
    const wrapper = getWrapper();
    wrapper.vm.setCode('TEST_CODE');
    expect(wrapper.vm.getCode()).toBe('TEST_CODE');
  });

  it('Run javascript code console.log/info/warn then add log item in log list', () => {
    const wrapper = getWrapper();
    wrapper.vm.setCode('console.log("TEST_LOG")');
    wrapper.vm.runCode();
    wrapper.vm.setCode('console.info("TEST_INFO_LOG")');
    wrapper.vm.runCode();
    wrapper.vm.setCode('console.warn("TEST_WARN_LOG")');
    wrapper.vm.runCode();
    expect(wrapper.vm.$data.logList).toMatchObject([
      { msg: 'TEST_LOG', style: undefined },
      { msg: 'TEST_INFO_LOG', style: undefined },
      { msg: 'TEST_WARN_LOG', style: 'warn' },
    ]);
  });

  it('Run javascript error code then add error log item in log list', () => {
    const wrapper = getWrapper();
    wrapper.vm.setCode('TEST_ERROR');
    wrapper.vm.runCode();
    expect(wrapper.vm.$data.logList[0]).toEqual({ msg: 'ReferenceError: TEST_ERROR is not defined', style: 'error' });
  });

  it('Clear console then no record in log list', () => {
    const wrapper = getWrapper();
    wrapper.vm.setCode('console.log("TEST_LOG")');
    wrapper.vm.runCode();
    wrapper.vm.setCode('TEST_ERROR');
    wrapper.vm.runCode();
    wrapper.vm.clearConsole();
    expect(wrapper.vm.$data.logList).toEqual([]);
  });

  it('Receive server code then emit enter room with projectId', (done) => {
    getWrapper();
    socket.socketClient.on('clientEnterProject', (res) => {
      expect(res.projectId).toBe('TEST_ROOM');
      done();
    });
    socket.socketClient.emit('serverProjectInfoSync', { code: 'TEST_CODE_FROM_MOCK_SERVER', projectId: 'TEST_ROOM' });
  });

  it('Receive server code then show code in editor', (done) => {
    const wrapper = getWrapper('TEST_ROOM_2');
    socket.on('serverProjectInfoSync', async () => {
      const code = await wrapper.vm.getCode();
      expect(code).toBe('TEST_CODE_FROM_MOCK_SERVER_2');
      done();
    });
    socket.socketClient.emit('serverProjectInfoSync', {
      code: 'TEST_CODE_FROM_MOCK_SERVER_2',
      projectId: 'TEST_ROOM_2',
    });
  });

  it('Connect socket server then enter room with projectId in url after', (done) => {
    getWrapper('TEST_ROOM_3');
    socket.socketClient.on('clientEnterProject', (res) => {
      expect(res).toBe('TEST_ROOM_3');
      done();
    });
    socket.socketClient.emit('connect');
  });

  it('Change programing language to Go then hide console, change to Javascript and then show console', async () => {
    const wrapper = getWrapper();
    const selector = wrapper.find('[test="codeLanguageSelector"]');
    await selector.setValue('go');
    expect(wrapper.find('.console').isVisible()).toBe(false);

    await selector.setValue('javascript');
    expect(wrapper.find('.console').isVisible()).toBe(true);
  });
});
