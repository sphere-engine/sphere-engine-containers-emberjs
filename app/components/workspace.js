import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceComponent extends Component {
  @tracked workspaceId = this.args.workspaceId;
  @tracked created = false;
  @tracked hasInitialized = false;

  @action
  setupWorkspace() {
    if (!this.created) {
      window.SE?.ready(() => {
        window.SE.workspace(this.elemId);
        this.setCreated(true);
        console.log('Workspace created');
      });
    }
  }

  @action
  destroyWorkspace() {
    if (this.created) {
      const ws = window?.SE.workspace(this.elemId);
      ws?.destroy();
      this.setCreated(false);
      console.log('Workspace destroyed');
    }
  }

  setCreated(value) {
    this.created = value;
  }

  constructor() {
    super(...arguments);
    this.setupWorkspace();
  }

  willDestroy() {
    this.destroyWorkspace();
    super.willDestroy(...arguments);
  }
}
