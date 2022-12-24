import { NOMO_DEBUG } from "js/lib.js";
import { VideoBase } from "js/video/video_common.js";

const gfycatLogo = `<img class="NCCL_video_logo" src="https://gfycat.com/assets/favicons/favicon-32x32.png" width="18px" height"18px" />`;

export class VideoGfycat extends VideoBase {
    constructor(options) {
        options.logoSVG = gfycatLogo;
        options.type = GLOBAL.GFYCAT;
        options.typeName = "GFYCAT";
        super(options);

        this.parseDataRequired = true;
        this.iframeUrl = `https://gfycat.com/ifr/${this.id}?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoPlay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoGfycat", options);
    }

    // parse thumbnail image
    async parseData(){try {
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let urlFetch = await fetch(`https://api.gfycat.com/v1/oembed?url=${this.url}`, {
            "method": "GET",
        });
        NOMO_DEBUG("gfycat fetch", urlFetch);

        if(urlFetch.status === 200){
            let json = await urlFetch.json();
            NOMO_DEBUG("gfycat json", json);

            let src = json.html.match(/src=['"]([a-zA-Z0-9-_%&?=./:]+)['"]/);
            if(src === null) {
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                this.postParseData();
                return;
            }

            // resize
            if(json.width && json.height){
                let ratio = json.width / json.height;       // 500 / 192 = 2.60
                let width = this.$iframeContainer.width();  // 1100
                let new_height = width / ratio + 44;        // 423 + 44 = 467
                let viewportHeight = Math.max((window.parent.innerHeight * 0.8), 800);   // 467
                new_height = parseInt(Math.min(viewportHeight, new_height));  // 467
                NOMO_DEBUG("new_height", new_height);
                
                let new_ratio = width / new_height;
                if(Math.abs(new_ratio - 16.0/9.0) > 0.2){
                    if(new_ratio < 1.0) new_ratio = 1.0;
                    if(new_ratio > 4.0) new_ratio = 4.0;
                    this.$iframeContainer.attr("style",`aspect-ratio:${new_ratio}`);
                }
            }

            let iframeUrl = src[1];
            if(iframeUrl.split("/").pop().indexOf("?") === -1){
                iframeUrl += "?";
            }
            else{
                iframeUrl += "&";
            }

            iframeUrl += `parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoplay=${this.autoPlay}&muted=${this.muted}`;

            this.iframeUrl = iframeUrl;
            this.postParseData();
        }
        else{
            NOMO_WARN("gfycat parsing fail", urlFetch);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }
    catch(e){
        NOMO_WARN("error from gfycat parsing", e);
        this.isDataLoading = false;
        this.isDataLoaded = true;
        this.isDataSucceed = false;
        this.postParseData();
    }}
}

// https://api.gfycat.com/v1/oembed?url=

// https://api.gfycat.com/v1/oembed?url=https://gfycat.com/handydemandingindianhare
// {"version":"1.0","provider_url":"https://gfycat.com","provider_name":"Gfycat","type":"video","title":"0A07AD3E-E29B-48FB-87B2-413677672977","html":"<div style='position:relative;padding-bottom: calc(124.58% + 44px)'><iframe src='https://gfycat.com/ifr/handydemandingindianhare' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>","height":598,"width":480}