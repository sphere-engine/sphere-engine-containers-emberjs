import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class WorkspaceModalComponent extends Component {
  @action
  onClose() {
    if (this.args.onClose) {
      this.args.onClose();
    }
  }

  @action
  showWorkspace() {
    if (this.args.showWorkspace) {
      this.args.showWorkspace();
    }
  }
}
