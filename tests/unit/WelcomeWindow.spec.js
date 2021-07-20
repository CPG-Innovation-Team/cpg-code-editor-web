import { shallowMount } from '@vue/test-utils';
import WelcomeWindow from '@/views/WelcomeWindow.vue';
import Vuetify from 'vuetify';

const vuetify = new Vuetify();

describe('WelcomeWindow.vue', () => {
  const getWrapper = (roomId = undefined) =>
    shallowMount(WelcomeWindow, vuetify, {
      mocks: {
        $route: {
          params: { roomId },
        },
        $router: {
          push: jest.fn(),
        },
      },
    });
  it('Submit a user name with default avatar should render on page succesfully', () => {
    const wrapper = getWrapper();
    wrapper.vm.submit('testuser1');
    expect(wrapper.vm.$data.userName).toBe('testuser1');
  });

  it('Inputting index to selectAvatar() should save the correct avatar to inputAvatar', () => {
    const wrapper = getWrapper();
    wrapper.vm.selectAvatar(0);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar1');
    wrapper.vm.selectAvatar(1);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar2');
    wrapper.vm.selectAvatar(2);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar3');
    wrapper.vm.selectAvatar(3);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar4');
    wrapper.vm.selectAvatar(4);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar5');
    wrapper.vm.selectAvatar(5);
    expect(wrapper.vm.$data.inputAvatar).toBe('avatar6');
  });
});
