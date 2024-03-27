import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DemoComponent extends Component {
  @tracked SE_BASE = 'containers.sphere-engine.com';
  @tracked sdkLoaded = false;
  @tracked isModalOpen = false;
  @tracked visible = {};
  @tracked elemId = '';
  @tracked sizes = {};
  @tracked workspaceIds = [];
  @tracked currentWorkspaceId = '';
  @tracked currentWorkspaceVisibility = true;

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
    if (inputElement && inputElement.value !== "") {
      if (this.workspaceIds == []) {
        this.elemId = `${this.currentWorkspaceId}-container`;
      }
      this.workspaceIds = [...this.workspaceIds, inputElement.value];
      this.visible = { ...this.visible, [inputElement.value]: true };
      this.sizes = { ...this.sizes, [inputElement.value]: '100%'};
    }
  }

  @action
  async setCurrentWorkspace(id) {
    this.currentWorkspaceId = id;
    this.elemId = `${this.currentWorkspaceId}-container`;
    this.currentWorkspaceVisibility = this.visible[this.currentWorkspaceId] ? this.visible[this.currentWorkspaceId] : true;
  }

  @action
  async removeWorkspaceId(idToRemove) {
    this.workspaceIds = this.workspaceIds.filter(id => id !== idToRemove);
  }

  @action
  changeSize(id) {
    if (this.sizes.hasOwnProperty(id)) {
      if (this.sizes[id] == '100%') {
        this.sizes = { ...this.sizes, [id]: '80%'};
      } else {
        this.sizes = { ...this.sizes, [id]: '100%'};
      }
    }
  }

  @action
  changeWorkspaceVisibility(id) {
    if (this.visible.hasOwnProperty(id)) {
      this.visible = { ...this.visible, [id]: !this.visible[id] };
      this.currentWorkspaceVisibility = this.visible[this.currentWorkspaceId];
    }
  }

  @action
  renderWorkspace() {
    if (this.currentWorkspaceId) {
      let element = document.getElementById(this.elemId);

      if (!element) {
        element = document.createElement('div');
        element.id = this.elemId;
        if (this.currentWorkspaceId === '') {
          let oldWorkspaceId = localStorage.getItem('workspaceId');
          if (oldWorkspaceId != null) {
            this.currentWorkspaceId = oldWorkspaceId;
          }
        }

        element.setAttribute('data-workspace', this.currentWorkspaceId);

        const ide = document.getElementById("ide");
        if (ide) {
          ide.appendChild(element);
        }
      }

      const workspace = window.SE.workspace(this.elemId);
      if (!workspace) {
        window.SE.create(this.elemId, document.getElementById(this.elemId));
      }
    }
  }

  @action
  destroyWorkspace() {
    let workspace = window.SE.workspace(this.elemId);

    if (workspace) {
      workspace?.destroy();
      console.log('Workspace destroyed');
    }

    this.workspaceIds = this.workspaceIds.filter(id => id !== this.currentWorkspaceId);

    if (this.workspaceIds.length > 0) {
      this.currentWorkspaceId = this.workspaceIds[0];
      this.elemId = `${this.currentWorkspaceId}-container`;
    } else {
      this.currentWorkspaceId = null;
      this.elemId = null;
    }

    let workspaceChoice = document.getElementById('workspace-choice');
    if (workspaceChoice) {
      workspaceChoice.value = '';
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
