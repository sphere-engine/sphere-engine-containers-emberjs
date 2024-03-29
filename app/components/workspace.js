import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceComponent extends Component {
  @tracked workspaceId = this.args.workspaceId;

  /*
  @action
  setupWorkspace() {
    if (!this.created) {
      window.SE?.ready(() => {
        window.SE.workspace(this.elemId);
        console.log('Workspace created');
      });
    }
  }

  @action
  destroyWorkspace() {
    if (this.created) {
      const ws = window?.SE.workspace(this.elemId);
      ws?.destroy();
      console.log('Workspace destroyed');
    }
  }
  */
}
