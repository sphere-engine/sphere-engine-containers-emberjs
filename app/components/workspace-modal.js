/* eslint-disable no-unused-vars */
/* eslint-disable ember/no-component-lifecycle-hooks */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Workspace from 'ember-sphere-containers/services/workspace';

export default class WorkspaceModalComponent extends Component {
  @tracked isRendered = false;

  @action
  onClose() {
    if (this.args.onClose) {
      this.args.onClose();
      Workspace.destroy('modal-workspace');
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

    Workspace.render('modal-workspace');

    this.isRendered = true;
  }
}
