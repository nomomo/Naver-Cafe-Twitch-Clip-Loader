import { NOMO_DEBUG } from "js/lib/lib.js";
import { VideoBase } from "js/video/video_common.js";

const AFTVLogo = `<svg viewBox="0 0 69.15 75.91" width="18px" height="18px" style="margin-top:-2px;" xmlns="http://www.w3.org/2000/svg"><path d="M2.14,65A108.54,108.54,0,0,1,0,43.19a100.16,100.16,0,0,1,1.33-17.07,20.93,20.93,0,0,1,.71-2.77,11.1,11.1,0,0,1,6.35-6.74A28.88,28.88,0,0,1,13.26,15a83.71,83.71,0,0,1,19.15-2.37h.45A78.06,78.06,0,0,1,51.77,15a49.58,49.58,0,0,1,5.15,1.68s5.07,2,6.42,6.67A24.76,24.76,0,0,1,64,26a114.94,114.94,0,0,1,1.36,17.21,110.06,110.06,0,0,1-2.2,21.93v0a10.05,10.05,0,0,1-7.66,7.75l-.36.07a115.36,115.36,0,0,1-22.46,2.2A115.39,115.39,0,0,1,10.26,73l-.5-.1A10,10,0,0,1,4,69.2,8.83,8.83,0,0,1,2.14,65Z" fill="none"/><path d="M50.22,1.27a2.33,2.33,0,0,1-1.36,3.25l-14.11,6.41a4.66,4.66,0,0,1-4.37-.1l-9.12-4.32a2.34,2.34,0,0,1-.61-3.44h0A2.3,2.3,0,0,1,24,2.81l7,5.64a2.47,2.47,0,0,0,2.19.52A3,3,0,0,0,34,8.6L46.91.33a2.35,2.35,0,0,1,3.31.94Z" fill="#0545b1"/><g><path d="m68.24 27.38c-1-7.4-2.7-11.63-12.33-13.81a105.8 105.8 0 0 0-20.14-2.57c-1.09-0.05-2.19-0.05-3.29 0a105.71 105.71 0 0 0-20.13 2.58c-7.13 1.62-9.92 4.35-11.29 8.67-0.24 0.76 2.06-0.45 1.89 0.41s0.53 12.21 0.4 13.17c-1 7.29-4.24 7.61-4.24 7.87a134.72 134.72 0 0 0 0.89 16.3c1 7.4 2.71 11.62 12.34 13.81 8.68 2 15 1.83 20.13 2.06h3.29c5.16-0.23 11.45-0.1 20.14-2.06 9.63-2.19 11.34-6.41 12.33-13.81a132.48 132.48 0 0 0 0.9-16.31c0-0.14-1.45-3-2.88-6.78-0.14-0.37-1.08 1.57-1.22 1.19-1-2.74-1.09-8.12-1.41-10.85-0.04-0.44 4.68 0.56 4.62 0.13z" fill="#0545b1"/><path d="m43.87 33.56c-0.07-2.56-0.1-5.08 0-7.61a5.56 5.56 0 0 1 2.58-4.79 6.39 6.39 0 0 1 5.83-0.29c3 1.33 6.82 3.37 6.82 3.37 2.21 1.2 4.07 2.21 6.39 3.72a2.5 2.5 0 0 1 0.35 0.21 5.63 5.63 0 0 1 0.07 9.45c-2.2 1.46-4.11 2.85-6.37 4.25a60 60 0 0 1-5.93 3.31 7.37 7.37 0 0 1-6.32 0.32 6.14 6.14 0 0 1-3-4.94s-0.29-2.79-0.42-7z" fill="#00bbed"/><path d="m47.75 53.93c-7.31 6.8-23.16 6.81-30.27 0a1.44 1.44 0 0 0-2 2.07c8.21 7.84 25.8 7.85 34.21 0a1.43 1.43 0 1 0-1.95-2.1z" fill="#fff"/><path d="M41.91,42.6a.2.2,0,0,1,0-.07l0-.43-1-10.77,0-.3a5,5,0,0,0-.13-.69,5.55,5.55,0,0,0-4.43-4.13,5.64,5.64,0,0,0-.93-.08h-5.53a5.29,5.29,0,0,0-.8.06,5.56,5.56,0,0,0-4.56,4.14c0,.18-.08.37-.11.55l-.05.58-1,10.7,0,.25a1.15,1.15,0,0,0,0,.19,1.48,1.48,0,0,0,0,.21,5.56,5.56,0,0,0,4.14,5.37,5.45,5.45,0,0,0,1.41.19h7.51a5.5,5.5,0,0,0,.91-.08,5.57,5.57,0,0,0,4.64-5.48Z" fill="#1ac62f"/><path d="m21.11 36.67c-2.13 7.11-8.5 10.73-15.54 9.51-7.31-1.26-12.59-11.6-8.95-18 3.12-5.46 9.92-9.5 17-7.32 7.55 2.35 9.64 8.63 7.49 15.81z" fill="#f2338a"/><circle cx="54.1" cy="33.27" r="4.69" fill="#1a1919"/><circle cx="10.46" cy="33.27" r="4.69" fill="#1a1919"/></g></svg>`;

export class VideoAFTV extends VideoBase {
    constructor(options) {
        options.logoSVG = AFTVLogo;
        options.type = GLOBAL.AFTV_VOD;
        options.typeName = "AFTV_VOD";
        super(options);

        this.parseDataRequired = true;
        this.start = options.start;
        NOMO_DEBUG("new VideoAFTV", options);
    }

    // parse thumbnail image
    async parseData(){
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let urlFetch = await fetch(`https://openapi.afreecatv.com/vod/embedinfo?vod_url=https://vod.afreecatv.com/player/${this.id}`, {method: 'POST', cors:"no-cors", body: ""});
        if(urlFetch.status === 200){
            let json = await urlFetch.json();
            NOMO_DEBUG("AFTV response", json);

            let src = json.html.match(/src=['"]([a-zA-Z0-9-_%&?=./:]+)['"]/);
            if(src === null) {
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                return;
            }
            let iframeUrl = src[1];
            iframeUrl = iframeUrl.replace("embed?", `embed?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&`);
            if(iframeUrl.indexOf("autoPlay") !== -1){
                iframeUrl = iframeUrl.replace(/(autoPlay=)(true|false)/,`$1${this.autoPlay}`);
            }
            if(iframeUrl.indexOf("isEmbedautoPlay") !== -1){
                iframeUrl = iframeUrl.replace(/(isEmbedautoPlay=)(true|false)/,`$1${this.autoPlay}`);
            }
            if(iframeUrl.indexOf("mutePlay") !== -1){
                iframeUrl = iframeUrl.replace(/(mutePlay=)(true|false)/,`$1${this.muted}`);
            }
            if(iframeUrl.indexOf("showChat") !== -1){
                iframeUrl = iframeUrl.replace(/(showChat=)(true|false)/,`$1${GM_SETTINGS.aftvShowChat}`);
            }
            if(this.start > 0){
                iframeUrl += `&change_second=${this.start}`;
            }
            this.iframeUrl = iframeUrl;
            this.postParseData();
        }
        else{
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.showParsingError(0);
        }
    }

}