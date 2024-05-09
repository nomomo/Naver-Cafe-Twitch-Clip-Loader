import { NOMO_DEBUG } from "js/lib/lib.js";
import { VideoBase } from "js/video/video_common.js";

export const ChzzkLogo = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" fill="#000" rx="9"/><path fill="#00FFA3" d="M24.106 24.664v-4.782H16.92l7.911-10.915h-6.41l1.94-2.678h-6.41L8.653 13.6h6.41l-8.02 11.065h17.063Z"/></svg>`;

export class VideoChzzkEmbed extends VideoBase {
    constructor(options) {
        options.logoSVG = ChzzkLogo;
        options.type = GLOBAL.CHZZK_EMBED;
        options.typeName = "CHZZK_EMBED";
        super(options);

        if(GM_SETTINGS.convertMethod === "autoLoad"){
            this.parsingType = 0;
            //this.parseDataRequired = false;
        }
        else{
            this.parsingType = 1;
            this.parseDataRequired = true;
        }
        this.iframeUrl = `https://chzzk.naver.com/embed/clip/${this.id}?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoPlay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoChzzkEmbed", options);
    }

    // "섬네일 클릭 시" 의 경우
    // proxy or GM_xhr 을 사용하지 않으면 CORS 에러가 발생한다.
    // 바로 iframe 을 삽입할 필요가 없으므로 섬네일과 타이틀을 파싱한다.
    async parseData(){
        if(this.parsingType != 1) return;
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        try{
            let xhr = await GM.xmlHttpRequest({
                "method": "GET",
                "url": `https://api.chzzk.naver.com/service/v1/play-info/clip/${this.id}`,
                "headers": {},
                "responseType": "json"
            });
            NOMO_DEBUG("chzzk api GM.xmlHttpRequest", xhr);

            if(xhr.status === 200){
                let data = await xhr.response;
                NOMO_DEBUG("parsed data from chzzk api:", data);
                const contentTitle = data.content?.contentTitle;
                const ownerName = data.content?.ownerChannel?.channelName;
                if (contentTitle) {
                    let newTitle = contentTitle;
                    if(ownerName){
                        newTitle = ownerName + " - " + newTitle;
                    }
                    this.updateTitle(newTitle);
                }
                const contentImage = data.content?.ownerChannel?.channelImageUrl;
                if(contentImage){
                    this.updateThumbnail(data.content.ownerChannel.channelImageUrl);
                }
                this.postParseData();
            }
            else{
                NOMO_WARN("chzzk api parsing fail", xhr);
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                this.postParseData();
            }
        }
        catch(e){    
            NOMO_WARN("error from chzzk parsing", e);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }

    // "페이지 로딩 시"의 경우
    // proxy or GM_xhr 을 사용하지 않으면 CORS 에러가 발생한다.
    // 먼저 iframe 을 생성한 후 타이틀 만을 파싱하여 업데이트 한다.
    async postCreateIframe(){
        super.postCreateIframe();

        if(this.parsingType != 0) return;
        try{
            let xhr = await GM.xmlHttpRequest({
                "method": "GET",
                "url": `https://api.chzzk.naver.com/service/v1/play-info/clip/${this.id}`,
                "headers": {},
                "responseType": "json"
            });
            NOMO_DEBUG("chzzk api GM.xmlHttpRequest", xhr);
    
            if(xhr.status === 200){
                let data = await xhr.response;
                NOMO_DEBUG("parsed data from chzzk api:", data);
                const contentTitle = data.content?.contentTitle;
                const ownerName = data.content?.ownerChannel?.channelName;
                if (contentTitle) {
                    let newTitle = contentTitle;
                    if(ownerName){
                        newTitle = ownerName + " - " + newTitle;
                    }
                    this.updateTitle(newTitle);
                }
                // const contentImage = data.content?.ownerChannel?.channelImageUrl;
                // if(contentImage){
                //     this.updateThumbnail(data.content.ownerChannel.channelImageUrl);
                // }
            }
            else{
                NOMO_WARN("chzzk api parsing fail", xhr);
            }
        }
        catch(e){
            NOMO_WARN("error from chzzk parsing", e);
            // this.isDataLoading = false;
            // this.isDataLoaded = true;
            // this.isDataSucceed = false;
            // this.postParseData();
        }
    }
}

// Example: iframe
// <iframe width="560" height="315" title="CHZZK Player" src="https://chzzk.naver.com/embed/clip/919" frameborder="0" allow="autoplay; clipboard-write; web-share" allowfullscreen></iframe>

// Example: play-info api call
// https://api.chzzk.naver.com/service/v1/play-info/clip/1234
// {
//     "code": 200,
//     "message": null,
//     "content": {
//         "contentType": "CLIP",
//         "contentId": 1234,
//         "videoId": "AD736A2E785B3581A947C4967C0EFEB27775",
//         "vodStatus": "ABR_HLS",
//         "contentTitle": "ㅎㅇㄹ",
//         "adult": false,
//         "inKey": "V12318123eaf3b1794da129717e6f14f6a6fa58849cafe85c79289378e02614b14ca529717e6f14f6a6fa",
//         "userAdultStatus": "ADULT",
//         "ownerChannel": {
//             "channelId": "11558e9cf402f3d455da65ef4b6ecaf5",
//             "channelName": "호수쿤",
//             "channelImageUrl": "https://nng-phinf.pstatic.net/MjAyNDAyMjdfMTk4/MDAxNzA4OTk2MTUyNTIw.4kf6JmFc5RcVamwpnFA50HO0VBjqMuaTvolmU6pxGiwg.5tLTRcsHiG5D0W__VWOKku9OALudgPeHQXNmaVLW3yQg.PNG/KakaoTalk_20240222_152946754yj_05.png",
//             "verifiedMark": false
//         }
//     }
// }

// Example: get vod info                                                           ????
// https://apis.naver.com/neonplayer/vodplay/v1/playback/{videoId}?key={inKey}&sid=2113&env=real&lc=ko_KR&cpl=ko_KR