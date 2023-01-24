import { escapeHtml, NOMO_DEBUG, NOMO_WARN } from "js/lib/lib.js";
import { sanitizeUrl } from "js/lib/sanitizeurl.ts";
import { VideoBase } from "js/video/video_common.js";

const ClippyLogo = `<svg class="logoClippy" width="18px" height="18px" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 40C5.54688 40 0 34.4531 0 27.5V9.21875C0 4.14062 4.0625 0 9.21875 0C14.2969 0 18.4375 4.14062 18.4375 9.21875V25.625C18.4375 28.9062 15.7031 31.5625 12.5 31.5625C9.21875 31.5625 6.5625 28.9062 6.5625 25.625V12.5C6.5625 11.3281 7.5 10.3125 8.75 10.3125C9.92188 10.3125 10.9375 11.3281 10.9375 12.5V25.625C10.9375 26.5625 11.5625 27.1875 12.5 27.1875C13.3594 27.1875 14.0625 26.5625 14.0625 25.625V9.21875C14.0625 6.5625 11.875 4.375 9.21875 4.375C6.48438 4.375 4.375 6.5625 4.375 9.21875V27.5C4.375 32.0312 7.96875 35.625 12.5 35.625C16.9531 35.625 20.625 32.0312 20.625 27.5V12.5C20.625 11.3281 21.5625 10.3125 22.8125 10.3125C23.9844 10.3125 25 11.3281 25 12.5V27.5C25 34.4531 19.375 40 12.5 40Z" fill="black"></path></svg>`;
//const viewCountIcon = `<svg style="vertical-align: text-bottom;padding: 0;margin: 0 0 0 15px;" enable-background="new 0 0 32 32" width="18px" height="18px" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g id="background"><rect fill="none" height="32" width="32"/></g><g id="view"><circle cx="16" cy="16" r="6"/><path d="M16,6C6,6,0,15.938,0,15.938S6,26,16,26s16-10,16-10S26,6,16,6z M16,24c-8.75,0-13.5-8-13.5-8S7.25,8,16,8s13.5,8,13.5,8   S24.75,24,16,24z"/></g></svg>`;

export class VideoClippy extends VideoBase {
    constructor(options) {
        options.logoSVG = ClippyLogo;
        options.type = GLOBAL.CLIPPY;
        options.typeName = "CLIPPY";
        super(options);

        this.parseDataRequired = true;
        // clippy 의 경우 iframe 내에 cloudflarestream 에 대한 iframe 이 다시 한 번 삽입됨
        //iframeUrl:`https://clippy.kr/clip/${match[1]}/embed?parent=cafe.naver.com&extension=NCCL`,
        this.iframeUrl = `https://clippy.kr/clip/${this.id}/embed?start=${this.start}&autoplay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoClippy", options);
    }

    // parse thumbnail image & clip infomation
    async parseData(){
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        try {
            let urlFetch = await fetch(`https://api.clippy.kr/clip/${this.id}`, {
                "method": "GET"
            });
            if(urlFetch.status === 200){
                let json = await urlFetch.json();
                NOMO_DEBUG("clippy json", json);
                if(json.data){
                    if(json.data.cfVideoThumbnail){
                        let thumbnailUrl = sanitizeUrl(json.data.cfVideoThumbnail);
                        if(thumbnailUrl !== "about:blank"){
                            this.updateThumbnail(thumbnailUrl);
                        }
                    }
                    if(json.data.title){
                        let newTitle = escapeHtml(json.data.title) + " - CLIPPY";
                        // if(json.data.viewCount){
                        //     newTitle += ` ${viewCountIcon} ${escapeHtml(json.data.viewCount)}`;
                        // }
                        this.updateTitle(newTitle);
                    }
                }
                this.postParseData();
            }
            else{
                NOMO_WARN("clippy parsing fail", urlFetch);
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                this.postParseData();
            }
        }
        catch(e){
            NOMO_WARN("clippy parsing error", e);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }

}