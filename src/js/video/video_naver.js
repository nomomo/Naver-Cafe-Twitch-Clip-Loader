import { NOMO_DEBUG, isNumeric, escapeHtml } from "js/lib/lib.js";
import { VideoBase } from "js/video/video_common.js";

const Naverlogo = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;user-select: none;" viewBox="0 0 96 96" height="18px" width="18px"><g id="g10" inkscape:label="Image" inkscape:groupmode="layer"><rect y="5e-07" x="5e-07" height="96" width="96" id="rect865" style="fill:#1dc800;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none" /><path style="fill:#ffffff;stroke:#000000;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 22.810019,26.075075 h 18.03984 l 16.57371,24.254979 V 26.106948 H 75.367786 V 74.106947 H 57.391689 L 40.881729,50.075074 v 24.095618 h -18.16733 z" id="path40" /></g></svg>`;

export class VideoNaver extends VideoBase {
    constructor(options) {
        options.logoSVG = Naverlogo;
        options.type = GLOBAL.NAVER_VID;
        options.typeName = "NAVER_VID";
        super(options);

        this.inkey = options.inkey;
        this.tags = options.tags;
        this.start = (options.start ? options.start : 0);
        this.iframeUrl = `https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${this.id}&inKey=${this.inkey}&wmode=opaque&hasLink=0&autoPlay=${this.autoPlay}&muted=${this.muted}&beginTime=${this.start}&seq=${this.seq}`;
        NOMO_DEBUG("new VideoNaver", options);

        // 동영상 제목이 길어서 잘리는 경우에 대한 처리
        if(this.title && this.title.length > 37){
            let $articleTitle = $("#app div.ArticleContentBox div.article_header div.ArticleTitle h3");
            if($articleTitle.length === 1){
                let articleTitle = escapeHtml($articleTitle.text().trim());
                if(articleTitle.indexOf(this.title) !== -1){
                    this.title = articleTitle;
                }
            }
        }
    }

    static init(){
        window.addEventListener("message", function(e){
            if(e.origin === "https://serviceapi.nmv.naver.com" && e.data.type === "NCCL_NAVERVID_RELOAD"){
                NOMO_DEBUG("NCCL_NAVERVID_RELOAD message from serviceapi.nmv.naver.com", e.data);
                if(e.data.seq !== undefined){
                    VideoBase.videos[e.data.seq].parseNewInkeyAndReloadPlayer(e.data.beginTime);
                }
            }
        });
    }

    // // for cafeMain
    // createIframeLazy(){
    //     NOMO_DEBUG("createIframeLazy - videoNaver");
    //     this.autoPlay = false;
    //     this.iframeUrl = this.iframeUrl.replace(/autoPlay=(true|false)/,`autoPlay=${this.autoPlay}`);
    //     super.createIframeLazy();
    // }

    async parseNewInkeyAndReloadPlayer(beginTime){
        // get new vid data
        const currUrl = document.location.href;
        const regexUrl = /^https:\/\/cafe.naver.com\/ca-fe\/cafes\/(\d+)\/articles\/(\d+)/;
        let matchedUrl = currUrl.match(regexUrl);
        
        NOMO_DEBUG(currUrl, matchedUrl);
        if(matchedUrl === null){
            NOMO_DEBUG("parseNewInkeyAndReloadPlayer match null");
            return;
        }
        let urlFetch = await fetch(`https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/${matchedUrl[1]}/articles/${matchedUrl[2]}?query=&boardType=L&useCafeId=true&requestFrom=A`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-cafe-product": "pc"
            },
            "referrer": currUrl,
            "referrerPolicy": "unsafe-url",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        NOMO_DEBUG("urlFetch", urlFetch);
        
        // fail
        if(urlFetch.status !== 200){
            NOMO_DEBUG("parseNewInkeyAndReloadPlayer - Fail to fetch", urlFetch);
            this.showReloadError();
            return;
        }
        
        var urlText = await urlFetch.json();
        NOMO_DEBUG("urlText", urlText);

        var vid_new = "";
        var articleHtml = urlText.result.article.contentHtml;
        var $contentHtml = $(articleHtml);
        var $scripts = $contentHtml.find("script.__se_module_data");
        var found = false;
        for(var i=0;i<$scripts.length; i++){
            var $script = $($scripts[i]);
            let dataModule = JSON.parse($script.attr("data-module"));
            vid_new = dataModule.data.vid;

            if(this.id == vid_new){
                NOMO_DEBUG("FOUND new inkey", this.inkey, "->", dataModule.data.inkey);
                this.inkey = dataModule.data.inkey;
                found = true;
                break;
            }
        }

        // fail
        if(!found){
            NOMO_DEBUG("FAIL TO GET NEW VID AND INKEY FOR NAVER VIDEO");
            this.showReloadError();
        }
        
        this.iframeUrl = `https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${this.id}&inKey=${this.inkey}&wmode=opaque&hasLink=0&autoPlay=true&beginTime=${isNumeric(beginTime) ? parseInt(beginTime) : 0}&seq=${this.seq}`;
        //this.iframeurl = `https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${this.id}&amp;inKey=${this.inkey}&amp;wmode=opaque&amp;hasLink=0&amp;autoPlay=true&amp;beginTime=0&amp;elemid=${this.id}`;
        this.createIframe();
        return true;

    }
    
    showReloadError(){
        this.showError(`[${GLOBAL.scriptName} v${GLOBAL.version}]<br />플레이어 리로드에 실패했습니다. 페이지를 직접 새로고침 해주세요.</a>`);
    }
}