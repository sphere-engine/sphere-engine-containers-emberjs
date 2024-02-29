import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceComponent extends Component {
  @tracked SE_BASE = 'containers.sphere-engine.com';
  @tracked workspaceId = '';
  @tracked projects = [];
  @tracked isCreateButtonDisabled = true;
  @tracked isRemoveButtonDisabled = true;
  @tracked sdkLoaded = false;

  constructor() {
    super(...arguments);
    this.loadSdk();
  }

  async loadSdk() {
    if (!window.SE) {
      window.SE_BASE = this.SE_BASE;
      window.SE_HTTPS = true;
      const script = document.createElement('script');
      script.src = `https://${this.SE_BASE}/static/sdk/sdk.min.js`;
      script.async = true;
      script.onload = () => {
        window.SE.ready(() => {
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
    }
  }

  /*
  @action
  async createWorkspace() {
    const createApiUrl = `https://containers.sphere-engine.com/api/v1/workspaces?access_token=${this.accessToken}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_id: this.projectId }),
    };

    try {
      const response = await fetch(createApiUrl, requestOptions);
      const data = await response.json();

      if (data.workspace && data.workspace.id) {
        this.WorkspaceId = data.workspace.id;
        localStorage.setItem('workspaceId', this.WorkspaceId);
        this.destroyWorkspace();
        this.renderWorkspace();
      }
    } catch (error) {
      console.error(error);
    }
  }

  @action
  async deleteWorkspace() {
    const oldWorkspaceId = localStorage.getItem('workspaceId');
    if (oldWorkspaceId) {
      const deleteApiUrl = `https://containers.sphere-engine.com/api/v1/workspaces/${oldWorkspaceId}/remove?access_token=${this.accessToken}`;
      const requestOptions = { method: 'PUT' };
      try {
        const response = await fetch(deleteApiUrl, requestOptions);
        await response.json();
        console.log('Workspace removed success.');
        localStorage.removeItem('workspaceId');
        this.workspaceId = '';
        this.destroyWorkspace();
        this.renderWorkspace();
      } catch (error) {
        console.error(error);
      }
    }
  }
  */

  @action
  hideWorkspace() {
    this.destroyWorkspace();
  }

  @action
  showWorkspace() {
    this.destroyWorkspace();
    this.renderWorkspace();
  }

  @action
  renderWorkspace() {
    let element = document.getElementById('seco-workspace');

    if (!element) {
      element = document.createElement('div');
      element.id = 'seco-workspace';
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

    const workspace = window.SE.workspace('seco-workspace');
    if (!workspace) {
      window.SE.create(
        'seco-workspace',
        document.getElementById('seco-workspace'),
      );
    }
  }

  @action
  destroyWorkspace() {
    let workspace = window.SE.workspace('seco-workspace');

    if (workspace) {
      workspace.destroy();
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
    let renderedWorkspace = document.getElementById('seco-workspace');
    if (renderedWorkspace) {
      let workspace = window.SE.workspace('seco-workspace');
      workspace.events.subscribe(selectedEvent, this.handleEvent);
      console.log('Subscribed to event: ' + selectedEvent);
    }
  }

  @action
  unsubscribe() {
    let eventChoice = document.getElementById('eventChoice');
    let selectedEvent = eventChoice.options[eventChoice.selectedIndex].value;
    let renderedWorkspace = document.getElementById('seco-workspace');
    if (renderedWorkspace) {
      let workspace = window.SE.workspace('seco-workspace');
      workspace.events.unsubscribe(selectedEvent, this.handleEvent);
      console.log('Unsubscribed to event: ' + selectedEvent);
    }
  }
}
