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

  it('Render page with editor and console', () => {
    const wrapper = shallowMount(Editor, {
      mocks: {
        $route: {
          params: { roomId: undefined },
        },
      },
    });
    expect.assertions(2);
    expect(wrapper.find('.monaco-editor').isVisible()).toBeTruthy();
    expect(wrapper.find('.console').isVisible()).toBeTruthy();
  });
});
