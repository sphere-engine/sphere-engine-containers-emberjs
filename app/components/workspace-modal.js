/* eslint-disable no-unused-vars */
/* eslint-disable ember/no-component-lifecycle-hooks */
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class WorkspaceModalComponent extends Component {
  @action
  onClose() {
    if (this.args.onClose) {
      this.args.onClose();
      let workspace = window.SE.workspace('modal-workspace');

      if (workspace) {
        workspace.destroy();
      }
    }
  }

  @action
  showWorkspace() {
    let element = document.getElementById('modal-workspace');

    if (!element) {
      element = document.createElement('div');
      element.id = 'modal-workspace';
      if (this.workspaceId === '') {
        let oldWorkspaceId = localStorage.getItem('workspaceId');
        if (oldWorkspaceId != null) {
          this.workspaceId = oldWorkspaceId;
        }
      }

      element.setAttribute('data-workspace', this.workspaceId);

      const ide = document.getElementById('modal-body');
      if (ide) {
        ide.appendChild(element);
      }
    }

    const workspace = window.SE.workspace('modal-workspace');
    if (!workspace) {
      window.SE.create(
        'modal-workspace',
        document.getElementById('modal-workspace'),
      );
    }
  }
}
