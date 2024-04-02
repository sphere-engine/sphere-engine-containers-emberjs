# Emberjs Workspace Integration

This project is an example of [Sphere Engine Containers](https://sphere-engine.com/containers) usage in an [Ember.js](https://emberjs.com/) application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone https://github.com/sphere-engine/sphere-engine-containers-emberjs` this repository
* `cd sphere-engine-containers-emberjs`
* `npm install`

## Running / Development

* `npm run start`
* Visit your app at [http://localhost:4200](http://localhost:4200).


## Loading SDK

You should load SDK in a component above where the workspace is to be rendered. To load SDK you need to inject SdkLoaderService and use .loadSdk() in constructor:

```
import { inject as service } from '@ember/service';

export default class YourComponent extends Component {
    @service sdkLoader;

    constructor() {
        super(...arguments);
        this.sdkLoader.loadSdk();
    }

    # Rest of your component
}
```

SdkLoaderService is located in app/services/sdk-loader.js

## Initializing workspace

In hbs template add:
```
<div data-id={{@elemId}} data-workspace={{@workspaceId}}></div>
```
where data-workspace is your workspace id.

You can initialize workspace with:
```
const workspace = window.SE.workspace("<workspace_id>")
```

Then you can destroy it through calling function:
```
workspace.destroy();
```
