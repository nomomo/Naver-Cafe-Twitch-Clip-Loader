import { NOMO_DEBUG } from "js/lib.js";
import { VideoBase } from "js/video/video_common.js";

const StreamableLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 64 64"><defs><style>.cls-1{fill:#0f90fa;}</style></defs><g><path class="cls-1" d="M45.11,15.76c-2.84,0-5.8,1.72-7.58,3.4-2.89,2.38-12.44,17-12.44,17l0,.05a8.12,8.12,0,1,1,0-9.39l4.07-6.4A15.77,15.77,0,1,0,18.42,47.7a13.57,13.57,0,0,0,11.06-5.15s5.12-7.07,7.2-10.42c1.89-3,4-8.28,8.59-8.28a8.17,8.17,0,0,1,8.19,8.47,8.58,8.58,0,0,1-8.39,8.75A8.23,8.23,0,0,1,39,38.3l-4,6.32A16.19,16.19,0,0,0,61.35,32,16.27,16.27,0,0,0,45.11,15.76Z"/></g></svg>`;

// streamable 의 경우 muted=1 일 때 volume controller 가 아예 사라지고 volume control이 불가함에 주의한다.

export class VideoStreamable extends VideoBase {
    constructor(options) {
        options.logoSVG = StreamableLogo;
        options.type = GLOBAL.STREAMABLE;
        options.typeName = "STREAMABLE";
        super(options);

        this.parseDataRequired = true;
        this.iframeUrl = `https://streamable.com/e/${this.id}?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoplay=${this.autoPlay?"1":"0"}&muted=0&omuted=${this.muted?"1":"0"}&hd=1&loop=0`;
        NOMO_DEBUG("new VideoStreamable", options);
    }

    // parse thumbnail image
    async parseData(){
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let urlFetch = await fetch(`https://api.streamable.com/videos/${this.id}`, {
            "method": "GET"
        });
        if(urlFetch.status === 200){
            let json = await urlFetch.json();
            NOMO_DEBUG("streamable json", json);
            this.updateThumbnail(json.thumbnail_url);
            this.postParseData();
        }
        else{
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }

    // // for cafeMain
    // createIframeLazy(){
    //     NOMO_DEBUG("createIframeLazy - videoNaver");
    //     this.autoPlay = false;
    //     this.iframeUrl = this.iframeUrl.replace(/autoPlay=(true|false)/,`autoPlay=${this.autoPlay}`);
    //     super.createIframeLazy();
    // }
}