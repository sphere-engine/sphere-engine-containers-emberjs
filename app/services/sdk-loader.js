import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SdkLoaderService extends Service {
  @tracked sdkLoaded = false;
  SE_BASE = 'containers.sphere-engine.com';

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

}