import 'jest-canvas-mock';
import { shallowMount } from '@vue/test-utils';
import Editor from '@/views/Editor.vue';

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

  const getWrapper = (roomId = undefined) => shallowMount(Editor, {
    mocks: {
      $route: {
        params: { roomId },
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

  it('Run javascript code console.log then add log item in log list', () => {
    const wrapper = getWrapper();
    wrapper.vm.setCode('console.log("TEST_LOG")');
    wrapper.vm.runCode();
    expect(wrapper.vm.$data.logList[0]).toEqual({ msg: 'TEST_LOG', style: undefined });
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
});
