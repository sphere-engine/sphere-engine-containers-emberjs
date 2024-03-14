import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DemoComponent extends Component {
  @tracked SE_BASE = 'containers.sphere-engine.com';
  @tracked workspaceId = '';
  @tracked isCreateButtonDisabled = true;
  @tracked sdkLoaded = false;
  @tracked isModalOpen = false;
  @tracked visible = true;
  @tracked elemId = '';
  @tracked ideSize = '100%';

  constructor() {
    super(...arguments);
    this.loadSdk();
  }

  async loadSdk() {
    if (!window.SE) {
      window.SE_BASE = this.SE_BASE;
      window.SE_HTTPS = true;
      const seReady = (f) => {
        if (
          document.readyState !== 'loading' &&
          document.readyState !== 'interactive'
        ) {
          f();
        } else {
          window.addEventListener('load', f);
        }
      };
      const script = document.createElement('script');
      script.src = `https://${this.SE_BASE}/static/sdk/sdk.min.js`;
      script.async = true;
      script.onload = () => {
        console.log(window.SE.ready);
        seReady(() => {
          this.sdkLoaded = true;
          // SDK loaded, you can initialize workspace here if needed
        });
      };
      document.body.appendChild(script);
    } else {
      this.sdkLoaded = true;
      // SDK loaded, you can initialize workspace here if needed
    }
  }

  @action
  async addWorkspaceId() {
    const inputElement = document.getElementById('workspaceIdInput');
    if (inputElement) {
      this.workspaceId = inputElement.value;
      this.elemId = `${this.workspaceId}-container`;
    }
  }

  @action
  changeSize() {
    if (this.ideSize == '100%') {
      this.ideSize = '80%';
    } else {
      this.ideSize = '100%';
    }
  }

  @action
  changeWorkspaceVisibility() {
    this.visible = !this.visible;
  }

  @action
  renderWorkspace() {
    let element = document.getElementById(this.elemId);

    if (!element) {
      element = document.createElement('div');
      element.id = this.elemId;
      if (this.workspaceId === '') {
        let oldWorkspaceId = localStorage.getItem('workspaceId');
        if (oldWorkspaceId != null) {
          this.workspaceId = oldWorkspaceId;
        }
      }

      element.setAttribute('data-workspace', this.workspaceId);

      const ide = document.getElementById('ide');
      if (ide) {
        ide.appendChild(element);
      }
    }

    const workspace = window.SE.workspace(this.elemId);
    if (!workspace) {
      window.SE.create(this.elemId, document.getElementById(this.elemId));
    }
  }

  @action
  destroyWorkspace() {
    let workspace = window.SE.workspace(this.elemId);

    if (workspace) {
      workspace?.destroy();
      console.log('Workspace destroyed');
    }
  }

  @action
  handleEvent(e) {
    document.getElementById('result').textContent = JSON.stringify(
      e.data,
      null,
      2,
    );
  }

  @action
  subscribe() {
    let eventChoice = document.getElementById('eventChoice');
    let selectedEvent = eventChoice.options[eventChoice.selectedIndex].value;
    let renderedWorkspace = document.getElementById(this.elemId);
    if (renderedWorkspace) {
      let workspace = window.SE.workspace(this.elemId);
      workspace.events.subscribe(selectedEvent, this.handleEvent);
      console.log('Subscribed to event: ' + selectedEvent);
    }
  }

  @action
  unsubscribe() {
    let eventChoice = document.getElementById('eventChoice');
    let selectedEvent = eventChoice.options[eventChoice.selectedIndex].value;
    let renderedWorkspace = document.getElementById(this.elemId);
    if (renderedWorkspace) {
      let workspace = window.SE.workspace(this.elemId);
      workspace.events.unsubscribe(selectedEvent, this.handleEvent);
      console.log('Unsubscribed to event: ' + selectedEvent);
    }
  }

  @action
  handleOpenModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }
}
