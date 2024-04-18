import Service from '@ember/service';
import { action } from '@ember/object';

export default class WorkspaceService extends Service {
    @action
    render(workspaceId) {
      const workspace = window.SE.workspace(workspaceId+'-container');
      if (!workspace) {
        window.SE.workspace(elemId);
      }
    }

    @action
    destroy(workspaceId) {
        let workspace = window.SE.workspace(workspaceId+'-container');

        if (workspace) {
          workspace?.destroy();
        }
    
    }
}