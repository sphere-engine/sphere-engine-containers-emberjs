import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Workspace from 'ember-sphere-containers/services/workspace';
import SdkLoader from 'ember-sphere-containers/services/sdk-loader';

export default class DemoComponent extends Component {
  @tracked isModalOpen = false;
  @tracked visible = {};
  @tracked elemId = '';
  @tracked sizes = {};
  @tracked subscriptions = {};
  @tracked currentEvent = 'afterScenarioExecution';
  @tracked workspaceIds = [];
  @tracked currentWorkspaceId = '';
  @tracked currentWorkspaceVisibility = true;
  @tracked addedId = null;
  @tracked eventResult = '';
  @tracked workspaceIdInputValue = '';


  constructor() {
    super(...arguments);
    SdkLoader.loadSdk();
  }

  @action
  updateWorkspaceIdInputValue(event) {
    this.workspaceIdInputValue = event.target.value;
  }

  @action
  async addWorkspaceId() {
    if (this.workspaceIdInputValue !== "" && !this.workspaceIds.includes(this.workspaceIdInputValue) ) {
      if (this.workspaceIds == []) {
        this.elemId = `${this.currentWorkspaceId}-container`;
      }
      this.workspaceIds = [...this.workspaceIds, this.workspaceIdInputValue];
      this.visible = { ...this.visible, [this.workspaceIdInputValue]: true };
      this.sizes = { ...this.sizes, [this.workspaceIdInputValue]: '100%'};
      this.addedId = this.workspaceIdInputValue;
    }
  }

  @action
  async setCurrentWorkspace(id) {
    this.currentWorkspaceId = id;
    this.elemId = `${this.currentWorkspaceId}-container`;
    this.currentWorkspaceVisibility = this.visible[this.currentWorkspaceId] || false;
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

      Workspace.render(this.elemId);
    }
  }

  @action
  destroyWorkspace() {
    Workspace.destroy(this.elemId);

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
    let newResult = JSON.stringify(e.data, null, 2);
    this.eventResult = 'workspace: ' + this.currentWorkspaceId + '\n' + newResult + '\n\n' + this.eventResult;
  }

  @action
  subscribe() {
    let eventChoice = document.getElementById('eventChoice');
    let selectedEvent = eventChoice.options[eventChoice.selectedIndex].value;
    if (this.currentWorkspaceId) {
      Workspace.subscribe(this.elemId, selectedEvent, this.handleEvent);
      console.log('Subscribed to event: ' + selectedEvent);
      this.subscriptions = {
        ...this.subscriptions,
        [this.currentWorkspaceId]: {
          ...this.subscriptions[this.currentWorkspaceId],
          [this.currentEvent]: true
        }
      };
    }
  }

  @action
  unsubscribe() {
    let eventChoice = document.getElementById('eventChoice');
    let selectedEvent = eventChoice.options[eventChoice.selectedIndex].value;
    if (this.currentWorkspaceId) {
      Workspace.unsubscribe(this.elemId, selectedEvent, this.handleEvent);
      console.log('Unsubscribed to event: ' + selectedEvent);
      this.subscriptions = {
        ...this.subscriptions,
        [this.currentWorkspaceId]: {
          ...this.subscriptions[this.currentWorkspaceId],
          [this.currentEvent]: false
        }
      };
    }
  }

  @action
  clearEventResults() {
    this.eventResult = '';
  }

  @action
  handleOpenModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }

  @action
  equalsHelper(v1, v2) {
    if (v1 === v2) {
      return true;
    } else {
      return false;
    }
  }

  @action
  async setCurrentEvent(event) {
    this.currentEvent = event;
  }
}
