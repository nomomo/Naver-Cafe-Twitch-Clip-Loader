import { escapeHtml, NOMO_DEBUG, NOMO_WARN } from "js/lib/lib.js";
import { sanitizeUrl } from "js/lib/sanitizeurl.ts";
import { VideoBase } from "js/video/video_common.js";

const TwipLogo = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 256.000000 256.000000" style="background-color:#ffd600;border-radius:18px"><g xmlns="http://www.w3.org/2000/svg" transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)" fill="#811eea" stroke="none"><path d="M0 1280 l0 -1280 1280 0 1280 0 0 1280 0 1280 -1280 0 -1280 0 0 -1280z m1030 300 l0 -130 -94 0 c-52 0 -101 -3 -110 -6 -14 -5 -16 -41 -16 -295 l0 -289 -130 0 -130 0 0 289 c0 254 -2 290 -16 295 -9 3 -58 6 -110 6 l-94 0 0 130 0 130 350 0 350 0 0 -130z m340 -82 c24 -117 45 -228 48 -245 2 -18 8 -33 12 -33 5 0 52 63 104 139 53 77 101 143 107 147 7 4 17 0 23 -9 138 -201 192 -277 198 -277 4 0 10 17 14 38 3 20 25 129 48 242 l42 205 133 3 134 3 -6 -33 c-9 -55 -158 -782 -163 -800 -5 -16 -20 -18 -139 -18 l-134 0 -72 116 -72 116 -44 -68 c-24 -38 -57 -90 -74 -116 l-29 -48 -135 0 c-131 0 -135 1 -140 23 -7 30 -165 819 -165 823 0 2 60 4 133 4 l134 0 43 -212z"/></g></svg>`;
//const viewCountIcon = `<svg style="vertical-align: text-bottom;padding: 0;margin: 0 0 0 15px;" enable-background="new 0 0 32 32" width="18px" height="18px" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g id="background"><rect fill="none" height="32" width="32"/></g><g id="view"><circle cx="16" cy="16" r="6"/><path d="M16,6C6,6,0,15.938,0,15.938S6,26,16,26s16-10,16-10S26,6,16,6z M16,24c-8.75,0-13.5-8-13.5-8S7.25,8,16,8s13.5,8,13.5,8   S24.75,24,16,24z"/></g></svg>`;

export class VideoTwip extends VideoBase {
    constructor(options) {
        options.logoSVG = TwipLogo;
        options.type = GLOBAL.TWIP;
        options.typeName = "TWIP";
        super(options);

        this.vodType = options.vodType; // "clip" or "vod"
        this.parseDataRequired = true;
        // twip 의 경우 iframe 내에 cloudflarestream 에 대한 iframe 이 다시 한 번 삽입됨
        this.iframeUrl = `https://vod.twip.kr/${this.vodType}/${this.id}/embed?start=${this.start}&autoplay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoTwip", options);
    }

    // parse thumbnail image & clip infomation
    async parseData(){
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let requestUrl = "";
        if(this.vodType == "vod"){
            requestUrl = `https://vod-api.twip.kr/replay/${this.id}`;
        }
        else {   // if(this.vodType == "clip")
            requestUrl = `https://vod-api.twip.kr/clip/${this.id}`;
        }

        try {
            let urlFetch = await fetch(requestUrl, {
                "method": "GET"
            });
            if(urlFetch.status === 200){
                let json = await urlFetch.json();
                NOMO_DEBUG("Twip json", json);
                if(json.data){
                    if(json.data.cfVideoThumbnail){
                        let thumbnailUrl = sanitizeUrl(json.data.cfVideoThumbnail);
                        if(thumbnailUrl !== "about:blank"){
                            this.updateThumbnail(thumbnailUrl);
                        }
                    }
                    if(json.data.title){
                        let newTitle = escapeHtml(json.data.title) + " - TWIP " + this.vodType.toUpperCase();
                        // if(json.data.viewCount){
                        //     newTitle += ` ${viewCountIcon} ${escapeHtml(json.data.viewCount)}`;
                        // }
                        this.updateTitle(newTitle);
                    }
                }
                this.postParseData();
            }
            else{
                NOMO_WARN("Twip parsing fail", urlFetch);
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                this.postParseData();
            }
        }
        catch(e){
            NOMO_WARN("Twip parsing error", e);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }

}