import {DEBUG, NOMO_DEBUG, escapeHtml} from "js/lib";
import {INSERT_YOUTUBE_SCRIPT, YTPlayers, createYTIframe, onYTPlayerReady, onYTPlayerStateChange, pauseYTVideo, createYTIframeArriveSub, YTClipInfo, getYTClipPageInfoXHR} from "js/youtube";
import css_cafe_main from "css/cafe_main.css";
import {NAVER_VIDEO_EVENT_INIT, SET_NAVER_VIDEO_MAX_QUALITY_SUB} from "js/navervid.js";

// jquery utils
// $.fn.isFired = () => { return $(this).hasClass("fired"); };
// $.fn.getSeVideo = () => { return $(this).closest(".se-video"); };
// $.fn.getSeSectionOglink = () => { return $(this).closest("div.se-section-oglink"); };
// $.fn.getSeComponentContent = () => { return $(this).closest("div.se-component-content"); };
// $.fn.getArticleContainer = () => { return $(this).closest("div.article_container"); };

export function autoPauseVideo(e){
    if(!GM_SETTINGS.autoPauseOtherClips && !GM_SETTINGS.autoPlayNextClip) return;
    if(((e.origin === "https://clips.twitch.tv" || e.origin === "https://player.twitch.tv" || e.origin === "https://vod.afreecatv.com") && e.data.type === "NCTCL") === false) return;
    if(e.data.clipId === undefined || e.data.clipId === "") return;
    
    NOMO_DEBUG("autoPauseVideo", e.data);

    var $iframes = $(document).find("div.NCTCL-container iframe, iframe.NCTCL-YT-CONVERTED");
    NOMO_DEBUG("$iframes", $iframes);
    var endedNextFound = false;
    $iframes.each(function(i, v){
        var newData;
        var postMessageUrl = "https://"+v.src.split("/")[2];
        switch(e.data.event){
        default:
            return false;
        case "play":
            NOMO_DEBUG("YTPlayers", YTPlayers[v.dataset.clipId]);
            if(!GM_SETTINGS.autoPauseOtherClips) return false;
            if(v.dataset.clipId === e.data.clipId) return true;
            
            if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeClipConvert && YTPlayers[v.dataset.clipId] !== undefined){
                pauseYTVideo(v.dataset.clipId);
            }
            else{
                try{
                    newData = {"type":"NCTCL", "event":"pause", "clipId":e.data.clipId};
                    v.contentWindow.postMessage(newData, postMessageUrl);
                }
                catch(e){
                    NOMO_DEBUG("ERROR FROM autoPauseVideo play event", e);
                }
            }
            break;
        case "ended":
            if(!GM_SETTINGS.autoPlayNextClip) return false;
            if(endedNextFound){
                if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeClipConvert && YTPlayers[v.dataset.clipId] !== undefined){
                    //playYTVideo(v.dataset.clipId);
                }
                else{
                    try{
                        newData = {"type":"NCTCL", "event":"play", "clipId":v.dataset.clipId};
                        v.contentWindow.postMessage(newData, postMessageUrl);
                    }
                    catch(e){
                        NOMO_DEBUG("ERROR FROM autoPauseVideo play event", e);
                    }
                }
                return false;
            }

            if(v.dataset.clipId === e.data.clipId){
                endedNextFound = true;
                return true;
            }
            break;
        }
    });

    // for naver video
    if(!GM_SETTINGS.autoPauseOtherClips) return true; //  || !GM_SETTINGS.autoPauseOtherClipsForNaverVideo
    if(e.data.event == "play"){
        var $videos = $(document).find("video");
        $videos.each(function(i, v){
            var $nvideo = $(v);
            var $id = $nvideo.attr("id");
            if(e.data.clipId == $id) return;
            if(!$nvideo.hasClass("_FIRSTPLAYED") || $nvideo[0].paused) return;

            var $sevideo = $nvideo.closest(".se-video");
            if ($sevideo.length == 0) {
                NOMO_DEBUG("no se-video");
                return;
            }

            var $playbtn = $sevideo.find(".u_rmc_play_area button");
            if($playbtn.length == 0) {
                NOMO_DEBUG("no playbtn");
                return;
            }

            $playbtn.trigger("click");
            NOMO_DEBUG("NAVER VIDEO PAUSE");
        });
    }
}

export var contentWidth = 800;
var videoWidth, videoHeight, videoWidthStr, videoHeightStr;
var videoCSSElem = undefined;
var contentWidthInit = false;
export function reCalculateIframeWidth(width){
    if(contentWidthInit && contentWidth === width){
        return;
    }
    contentWidthInit = true;

    if(videoCSSElem !== undefined){
        $(videoCSSElem).remove();
    }
    contentWidth = width;
    videoWidth = Number(GM_SETTINGS.videoWidth)/100.0 * contentWidth;
    videoHeight = Number(videoWidth)/16.0*9.0;// + 30
    videoWidthStr = String(videoWidth) + "px";
    videoHeightStr = String(videoHeight) + "px";

    videoCSSElem = GM_addStyle(`
    .NCTCL-iframe{
       width:${videoWidthStr};
       height:${videoHeightStr};
    }
    .NCTCL-container .se-link{
        width:${videoWidthStr}
    }
    `);
    NOMO_DEBUG("reCalculateIframeWidth", width);
}



// Twitch clip 링크 설명 삽입
const TWITCH_CLIP = 0;
const TWITCH_VOD = 1;
const YOUTUBE_CLIP = 10;
const STREAMABLE = 20;
const AFTV_VOD = 31;
function insertNCTCLContainerDescription(linkType, $elem, clipId, clipurl){
    try{
        var $parentContainer = $elem.closest("div.se-section-oglink");
        var $article_container = $elem.closest("div.article_container");
        $parentContainer.find(".se-oglink-info").hide();
        if($article_container.length !== 0) {
            reCalculateIframeWidth($article_container.width());
        }
        var $title = $parentContainer.find(".se-oglink-title");
        var title = "", titleText = "", clipurlText = clipurl;
        if($title.length !== 0){
            title = escapeHtml($title.text());

            if(linkType === TWITCH_VOD) title = "[VOD] " + title.replace(" - Twitch","");

            titleText = `<span class="NCTCL-titleText">${title}</span>`;
            clipurlText = `<span class="NCTCL-clipurlText">(<span class="UnderLine">${clipurl}</span>)</span>`;
        }
        
        //$("head").append(`<link rel="preload" crossorigin href="https://clips.twitch.tv/embed?clip=${clipId}&parent=${document.location.href.split("/")[2]}&autoplay=false&muted=true" as="document">`);          

        var logoText = "";
        switch(linkType){
        default:
            break;

        case TWITCH_CLIP:
        case TWITCH_VOD:
            logoText = `
            <svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" viewBox="0 0 256 256" xml:space="preserve">
                <g transform="translate(128 128) scale(0.72 0.72)" style="">
                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
                        <path d="M 2.015 15.448 v 63.134 h 21.493 V 90 h 12.09 l 11.418 -11.418 h 17.463 l 23.507 -23.507 V 0 H 8.06 L 2.015 15.448 z M 15.448 8.06 h 64.478 v 42.985 L 66.493 64.478 H 45 L 33.582 75.896 V 64.478 H 15.448 V 8.06 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                        <rect x="58.43" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                        <rect x="36.94" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                    </g>
                </g>
            </svg>`;
            break;

        case YOUTUBE_CLIP:
            logoText = `<svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="18" height="18" viewBox="0 0 461.001 461.001" style="enable-background:new 0 0 461.001 461.001;" xml:space="preserve">
                <g>
                    <path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
                </g>
            </svg>`;
            break;

        case STREAMABLE:
            logoText = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 64 64"><defs><style>.cls-1{fill:#0f90fa;}</style></defs>
                <g>
                    <path class="cls-1" d="M45.11,15.76c-2.84,0-5.8,1.72-7.58,3.4-2.89,2.38-12.44,17-12.44,17l0,.05a8.12,8.12,0,1,1,0-9.39l4.07-6.4A15.77,15.77,0,1,0,18.42,47.7a13.57,13.57,0,0,0,11.06-5.15s5.12-7.07,7.2-10.42c1.89-3,4-8.28,8.59-8.28a8.17,8.17,0,0,1,8.19,8.47,8.58,8.58,0,0,1-8.39,8.75A8.23,8.23,0,0,1,39,38.3l-4,6.32A16.19,16.19,0,0,0,61.35,32,16.27,16.27,0,0,0,45.11,15.76Z"/>
                </g>
            </svg>`;
            break;

        case AFTV_VOD:
            logoText = `
            <svg viewBox="0 0 69.15 75.91" width="18px" height="18px" style="margin-top:-2px;" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.14,65A108.54,108.54,0,0,1,0,43.19a100.16,100.16,0,0,1,1.33-17.07,20.93,20.93,0,0,1,.71-2.77,11.1,11.1,0,0,1,6.35-6.74A28.88,28.88,0,0,1,13.26,15a83.71,83.71,0,0,1,19.15-2.37h.45A78.06,78.06,0,0,1,51.77,15a49.58,49.58,0,0,1,5.15,1.68s5.07,2,6.42,6.67A24.76,24.76,0,0,1,64,26a114.94,114.94,0,0,1,1.36,17.21,110.06,110.06,0,0,1-2.2,21.93v0a10.05,10.05,0,0,1-7.66,7.75l-.36.07a115.36,115.36,0,0,1-22.46,2.2A115.39,115.39,0,0,1,10.26,73l-.5-.1A10,10,0,0,1,4,69.2,8.83,8.83,0,0,1,2.14,65Z" fill="none"/>
            <path d="M50.22,1.27a2.33,2.33,0,0,1-1.36,3.25l-14.11,6.41a4.66,4.66,0,0,1-4.37-.1l-9.12-4.32a2.34,2.34,0,0,1-.61-3.44h0A2.3,2.3,0,0,1,24,2.81l7,5.64a2.47,2.47,0,0,0,2.19.52A3,3,0,0,0,34,8.6L46.91.33a2.35,2.35,0,0,1,3.31.94Z" fill="#0545b1"/>
            <g>
            <path d="m68.24 27.38c-1-7.4-2.7-11.63-12.33-13.81a105.8 105.8 0 0 0-20.14-2.57c-1.09-0.05-2.19-0.05-3.29 0a105.71 105.71 0 0 0-20.13 2.58c-7.13 1.62-9.92 4.35-11.29 8.67-0.24 0.76 2.06-0.45 1.89 0.41s0.53 12.21 0.4 13.17c-1 7.29-4.24 7.61-4.24 7.87a134.72 134.72 0 0 0 0.89 16.3c1 7.4 2.71 11.62 12.34 13.81 8.68 2 15 1.83 20.13 2.06h3.29c5.16-0.23 11.45-0.1 20.14-2.06 9.63-2.19 11.34-6.41 12.33-13.81a132.48 132.48 0 0 0 0.9-16.31c0-0.14-1.45-3-2.88-6.78-0.14-0.37-1.08 1.57-1.22 1.19-1-2.74-1.09-8.12-1.41-10.85-0.04-0.44 4.68 0.56 4.62 0.13z" fill="#0545b1"/>
            <path d="m43.87 33.56c-0.07-2.56-0.1-5.08 0-7.61a5.56 5.56 0 0 1 2.58-4.79 6.39 6.39 0 0 1 5.83-0.29c3 1.33 6.82 3.37 6.82 3.37 2.21 1.2 4.07 2.21 6.39 3.72a2.5 2.5 0 0 1 0.35 0.21 5.63 5.63 0 0 1 0.07 9.45c-2.2 1.46-4.11 2.85-6.37 4.25a60 60 0 0 1-5.93 3.31 7.37 7.37 0 0 1-6.32 0.32 6.14 6.14 0 0 1-3-4.94s-0.29-2.79-0.42-7z" fill="#00bbed"/>
            <path d="m47.75 53.93c-7.31 6.8-23.16 6.81-30.27 0a1.44 1.44 0 0 0-2 2.07c8.21 7.84 25.8 7.85 34.21 0a1.43 1.43 0 1 0-1.95-2.1z" fill="#fff"/>
            <path d="M41.91,42.6a.2.2,0,0,1,0-.07l0-.43-1-10.77,0-.3a5,5,0,0,0-.13-.69,5.55,5.55,0,0,0-4.43-4.13,5.64,5.64,0,0,0-.93-.08h-5.53a5.29,5.29,0,0,0-.8.06,5.56,5.56,0,0,0-4.56,4.14c0,.18-.08.37-.11.55l-.05.58-1,10.7,0,.25a1.15,1.15,0,0,0,0,.19,1.48,1.48,0,0,0,0,.21,5.56,5.56,0,0,0,4.14,5.37,5.45,5.45,0,0,0,1.41.19h7.51a5.5,5.5,0,0,0,.91-.08,5.57,5.57,0,0,0,4.64-5.48Z" fill="#1ac62f"/>
            <path d="m21.11 36.67c-2.13 7.11-8.5 10.73-15.54 9.51-7.31-1.26-12.59-11.6-8.95-18 3.12-5.46 9.92-9.5 17-7.32 7.55 2.35 9.64 8.63 7.49 15.81z" fill="#f2338a"/>
            <circle cx="54.1" cy="33.27" r="4.69" fill="#1a1919"/>
            <circle cx="10.46" cy="33.27" r="4.69" fill="#1a1919"/>
            </g>
            </svg>
            `;
            break;
        }

        $parentContainer.append(`
            <div class="NCTCL-container" data-clip-id="${clipId}">
                <div id="NCTCL-${clipId}" class="NCTCL-iframe-container" data-clip-id="${clipId}"></div>
                <div class="NCTCL-description" data-clip-id="${clipId}" data-clip-url="${clipurl}">
                    <a href="${clipurl}" class="se-link" target="_blank">
                        ${logoText}
                        ${titleText}
                        ${clipurlText}
                    </a>
                </div>
            </div>
        `);
    }
    catch(e){
        NOMO_DEBUG("Error from insertTwitchCilpDescription", e);
    }
}

// Twitch clip 링크를 iframe 으로 변환
var iframeNo = 0;
function convertVideoLinkToIframe($elem, options){
    try{
        var href = options.href;
        var clipId = options.clipId;
        var linkType = options.linkType;
        var autoPlay = options.autoPlay;
        var muted = options.muted;
        var lazy = options.lazy;
        var option = options.option;

        var $parentContainer = $elem.closest("div.se-component-content");
        var $article_container = $elem.closest("div.article_container");
        if($article_container.length !== 0) {
            reCalculateIframeWidth($article_container.width());
        }
        //$parentContainer.find(".se-oglink-thumbnail").hide();
        var tempary = document.location.href.split("/");
        var parentHref = tempary[2];

        var iframeUrl;

        if($(`#NCTCL-${clipId}`).find(`iframe[data-clip-id='${clipId}']`).length !== 0){
            return;
        }

        ///////////////////////////////////////////////////////
        // // get clip info from gql api
        // clipId = "DarkWildVultureKlappa-wMbvD3s1EYj0_Hg0";   // test
        // // get clip info
        // var fetchres = fetch("https://gql.twitch.tv/gql", {
        //     "headers": {
        //         "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        //         "content-type": "text/plain;charset=UTF-8",
        //     },
        //     "referrer": "https://clips.twitch.tv/",
        //     "body": `[{"operationName":"ClipsBroadcasterInfo","variables":{"slug":"${clipId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"ce258d9536360736605b42db697b3636e750fdb14ff0a7da8c7225bdc2c07e8a"}}},{"operationName":"ClipsTitle","variables":{"slug":"${clipId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"f6cca7f2fdfbfc2cecea0c88452500dae569191e58a265f97711f8f2a838f5b4"}}},{"operationName":"ClipsView","variables":{"slug":"${clipId}","isCommunityMomentsFeatureEnabled":true},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"46e80db2f20f65bdc8125b871be148b32dd6a92f0509f27d8d43e02b63386808"}}}]`,
        //     "method": "POST",
        //     "credentials": "omit"
        // });

        // // get VideoAccessToken_Clip
        // fetch("https://gql.twitch.tv/gql", {
        //     "headers": {
        //         "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        //         "content-type": "text/plain;charset=UTF-8",
        //     },
        //     "referrer": "https://clips.twitch.tv/",
        //     "body": `[{"operationName":"VideoAccessToken_Clip","variables":{"slug":"${clipId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11"}}}]`,
        //     "method": "POST",
        //     "credentials": "omit"
        // });
        // var fetchjson = await fetchres.json();
        // NOMO_DEBUG("fetchjson = ", fetchjson);
        ///////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////
        // https://dthumb-phinf.pstatic.net/?src=%22https%3A%2F%2Fclips-media-assets2.twitch.tv%2Fcwhij1r7S00PncrSIvpk1g%2FAT-cm%257Ccwhij1r7S00PncrSIvpk1g-social-preview.jpg%22&type=ff500_300
        // https://clips-media-assets2.twitch.tv/cwhij1r7S00PncrSIvpk1g/AT-cm%7Ccwhij1r7S00PncrSIvpk1g.mp4

        switch(linkType){
        case TWITCH_CLIP:
            // if(DEBUG){
            //     var fetchres = fetch("https://gql.twitch.tv/gql", {
            //         "headers": {
            //             "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            //             "content-type": "text/plain;charset=UTF-8",
            //         },
            //         "referrer": "https://clips.twitch.tv/",
            //         "body": `[{"operationName":"ClipsBroadcasterInfo","variables":{"slug":"${clipId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"ce258d9536360736605b42db697b3636e750fdb14ff0a7da8c7225bdc2c07e8a"}}},{"operationName":"ClipsTitle","variables":{"slug":"${clipId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"f6cca7f2fdfbfc2cecea0c88452500dae569191e58a265f97711f8f2a838f5b4"}}},{"operationName":"ClipsView","variables":{"slug":"${clipId}","isCommunityMomentsFeatureEnabled":true},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"46e80db2f20f65bdc8125b871be148b32dd6a92f0509f27d8d43e02b63386808"}}}]`,
            //         "method": "POST",
            //         "credentials": "omit"
            //     })
            //         .then((response) => response.json())
            //         .then((data) => console.log(data));
            // }
            iframeUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}`;
            $parentContainer.find(".se-oglink-thumbnail").hide();
            $(`#NCTCL-${clipId}`)
                .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="${iframeUrl}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);
            iframeNo += 1;
            break;
            
        case TWITCH_VOD:
            iframeUrl = `https://player.twitch.tv/?video=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}${option}`;
            $parentContainer.find(".se-oglink-thumbnail").hide();
            $(`#NCTCL-${clipId}`)
                .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="${iframeUrl}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);
            iframeNo += 1;
            break;

        case YOUTUBE_CLIP:
            NOMO_DEBUG("YOUTUBE xmlHttpRequest");
            getYTClipPageInfoXHR(clipId, href, 0, function(){
                if(YTClipInfo[clipId] !== undefined && YTClipInfo[clipId].loaded) {
                    iframeUrl = YTClipInfo[clipId].url;
                    $parentContainer.find(".se-oglink-thumbnail").hide();
    
                    var YTID = iframeUrl.match(/\/embed\/([a-zA-Z0-9-_]+)/);
                    if(YTID === null) { return; } else { YTID = YTID[1]; }
                    NOMO_DEBUG("YTID = ", YTID, "clipId = ", clipId);
                    
                    var YTclipt = iframeUrl.match(/clipt=([a-zA-Z0-9-_]+)/);
                    if(YTclipt !== null){ YTclipt = YTclipt[1]; } else { YTclipt = undefined; }
    
                    createYTIframe(clipId, autoPlay, YTID, undefined, undefined, YTclipt, videoWidth, videoHeight, 0);
                    
                    $parentContainer.find(".NCTCLloader").remove();
                    iframeNo += 1;
                }
                else{
                    NOMO_DEBUG("YTClipInfo[clipId] FAIL", YTClipInfo[clipId], $parentContainer);
                    $parentContainer.append(`<a href="${href}" target="_blank"><div class="YTClipFailContainer"><div class="YTClipFailContent">[[${GLOBAL.scriptName} v${GLOBAL.version}]]<br />Youtube Clip 정보를 가져오는데 실패했습니다.<br />클릭하면 Youtube 페이지가 새 창으로 열립니다.</div></div></a>`);
                    $parentContainer.find(".NCTCLloader").remove();
                }
            });
            break;

        case STREAMABLE:
            iframeUrl = `https://streamable.com/e/${clipId}?parent=${parentHref}&autoplay=${autoPlay?"1":"0"}&muted=${muted?"1":"0"}&hd=1&loop=0`;  // &nocontrols=0
            $parentContainer.find(".se-oglink-thumbnail").hide();
            $(`#NCTCL-${clipId}`)
                .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="${iframeUrl}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);
            iframeNo += 1;
            break;

        case AFTV_VOD:
            fetch(`https://openapi.afreecatv.com/vod/embedinfo?vod_url=https://vod.afreecatv.com/player/${clipId}`, {method: 'POST', cors:"no-cors", body: ""})
                .then(response => response.json())
                .then(data => {
                    NOMO_DEBUG("AFTV response", data);

                    var src = data.html.match(/src='([a-zA-Z0-9-_&?=./:]+)'/);
                    if(src === null) return;
                    iframeUrl = src[1];
                    if(iframeUrl.indexOf("autoPlay") !== -1){
                        iframeUrl = iframeUrl.replace(/(autoPlay=)(true|false)/,`$1${autoPlay}`);
                    }
                    if(iframeUrl.indexOf("isEmbedautoPlay") !== -1){
                        iframeUrl = iframeUrl.replace(/(isEmbedautoPlay=)(true|false)/,`$1${autoPlay}`);
                    }
                    if(iframeUrl.indexOf("mutePlay") !== -1){
                        iframeUrl = iframeUrl.replace(/(mutePlay=)(true|false)/,`$1${muted}`);
                    }
                    if(iframeUrl.indexOf("showChat") !== -1){
                        iframeUrl = iframeUrl.replace(/(showChat=)(true|false)/,`$1${GM_SETTINGS.aftvShowChat}`);
                    }

                    // "<iframe width='640' height='360' src='https://vod.afreecatv.com/player/95324326/embed?isAfreeca=false&autoPlay=true&mutePlay=true&showChat=true&szBjId=mkiop9512&nStationNo=15469476&nBbsNo=69265179&nTitleNo=95324326&szCategory=210000&szPart=CLIP&type=station&szSysType=html5' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen=''></iframe>"
                    // https://vod.afreecatv.com/player/95348672/embed?isAfreeca=false&autoPlay=true&mutePlay=true&showChat=true&szBjId=afworldcup01&nStationNo=13363716&nBbsNo=90635238&nTitleNo=95348672&szCategory=20000&szPart=NORMAL&type=station&szSysType=html5
                    iframeUrl = iframeUrl.replace("embed?", `embed?parent=${parentHref}&`);
                    iframeUrl = iframeUrl + option;
                    NOMO_DEBUG("iframeUrl", iframeUrl);
                    $parentContainer.find(".se-oglink-thumbnail").hide();
                    $(`#NCTCL-${clipId}`)
                        .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="${iframeUrl}" frameborder="0" allowfullscreen="true" allow="autoplay; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" scrolling="no"></iframe>`);
                    iframeNo += 1;
                })
                .catch(error => NOMO_DEBUG('AFTV_VOD fetch error', error));
            break;
            
        default:
            break;
        }
    }
    catch(e){
        NOMO_DEBUG("Error from convertVideoLinkToIframe", e);
    }
}

function removeOriginalLinks(url){
    if(!GM_SETTINGS.use) return;
    if(!GM_SETTINGS.removeOriginalLinks) return;
    try{
        var $as = $("a.se-link");
        $as.each(function(i, v){
            var $a = $(v);
            var href = $a.attr("href");
            if(href !== url || $a.hasClass("fired")){
                return true;
            }

            var $p = $a.closest("p");
            if($p.text() === url){
                $p.remove();
            }
            else{
                $a.remove();
            }
        });
    }
    catch(e){
        NOMO_DEBUG("Error from removeOriginalLinks", e);
    }
}


var p0 = 0;
export async function PAGE_CAFE_MAIN(){
    // add dns-prefetch and preconnect header
    $("head").append(`
        <link rel="dns-prefetch" href="https://gql.twitch.tv/">
        <link rel="dns-prefetch" href="https://clips.twitch.tv/">
        <link rel="dns-prefetch" href="https://static.twitchcdn.net/">
        <link rel="dns-prefetch" href="https://production.assets.clips.twitchcdn.net/">
        <link rel="preconnect" href="https://clips.twitch.tv/">
        <link rel="preconnect" href="https://gql.twitch.tv/">
        <link rel="preconnect" href="https://static.twitchcdn.net/">
        <link rel="preconnect" href="https://production.assets.clips.twitchcdn.net/">
    `);

    // 
    window.addEventListener("message", function(e){
        // if(e.origin === "https://www.youtube.com"){
        //     NOMO_DEBUG("POSTMESSAGE from YOUTUBE", e);
        // }
        autoPauseVideo(e);
    });

    // add style
    GM_addStyle(css_cafe_main.toString());
    
    // 콘텐츠 width 계산
    reCalculateIframeWidth(contentWidth);

    // Youtube video
    INSERT_YOUTUBE_SCRIPT();


    // Twitch, Youtube clip 링크 찾기
    $(document).arrive("div.se-module-oglink", { onlyOnce: true, existing: true }, function (elem) {
        try{
            var clipId = undefined, clipUrl, clipOption = "";
            var $elem = $(elem);
            if($elem.hasClass("fired")) return;
            $elem.addClass("fired");
            $elem.parent("div.se-section-oglink").addClass("fired");

            if(DEBUG){
                if(p0 === 0) p0 = Number(new Date());
                NOMO_DEBUG("PERFORMANCE CHECK", Number(new Date()) - p0);
            }

            var linkType;
            var $a = $elem.find("a.se-oglink-thumbnail").first();
            var $imgThumbnail = $elem.find("img.se-oglink-thumbnail-resource").first();
            if($a.length === 0 || $imgThumbnail.length === 0) return; // thumbnail 이 없는 것은 제외한다.
            var href = $a.attr("href");

            // 이미지 로드에 실패하는 경우 대충 안내 메시지를 보여준다.
            $imgThumbnail.on("error", function(e){
                NOMO_DEBUG("IMG ERROR", e);
                if(clipId !== undefined && $("#NCTCL-"+clipId).length !== 0){
                    $("#NCTCL-"+clipId).html(`<div class="thumbnailRemoved" style="min-height:${videoHeight === 0 ? 800.0 / 16.0 * 9.0 : videoHeight}px"><div style="width:100%;text-align:center">[${GLOBAL.scriptName} v${GLOBAL.version}]<br />섬네일 이미지 로드에 실패했습니다. 아마 페이지가 사라진 것 같습니다.</div></div>`);
                }
            });


            ////////////////////////////////////////////////////////////////////////////////////////////////
            setTimeout(function(){
                NOMO_DEBUG("a = ", $a);
                NOMO_DEBUG("img = ", $imgThumbnail);
                const regexs = {};
                if(GM_SETTINGS.use){
                    regexs[TWITCH_CLIP] = /^https?:\/\/(?:clips\.twitch\.tv\/|www\.twitch.tv\/[a-zA-Z0-9-_]+\/clip\/)([a-zA-Z0-9-_]+)/;
                    regexs[TWITCH_VOD] = /(?:^https?:\/\/www\.twitch.tv\/videos\/(\d+)\??(t=[hms0-9]+)?|^https?:\/\/www\.twitch.tv\/.+\/v\/(\d+)\??[a-zA-Z0-9=-_]*(&t=[hms0-9]+)?)/;
                }
                if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeClipConvert){
                    regexs[YOUTUBE_CLIP] = /^https?:\/\/(?:www\.)?youtube\.com\/clip\/([a-zA-Z0-9-_]+)/;
                }
                if(GM_SETTINGS.useStreamable){
                    regexs[STREAMABLE] = /^https?:\/\/streamable\.com\/(?:e\/)?([a-zA-Z0-9-_]+)/;
                }
                if(GM_SETTINGS.useAftv){
                    regexs[AFTV_VOD] = /^https?:\/\/vod\.afreecatv.com\/player\/(\d+)\??(change_second=\d+)?/;
                }

                var matchRes = {"found":false, "type": null, "res": null };
                for(var key in regexs){
                    var match = href.match(regexs[key]);
                    if(match !== null) {
                        matchRes = {"found": true, "type": Number(key), "res": match };
                        break;
                    }
                }
                if(!matchRes.found) return;
                NOMO_DEBUG("matchRes", matchRes);

                switch(matchRes.type){    
                default:
                    NOMO_DEBUG("CANNOT FOUND TYPE", matchRes.type);
                    return;
                    
                case TWITCH_CLIP:
                    linkType = TWITCH_CLIP;
                    clipId = match[1];
                    clipUrl = `https://clips.twitch.tv/${clipId}`;
                    removeOriginalLinks(href);
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    break;

                case TWITCH_VOD:
                    linkType = TWITCH_VOD;
                    if(match[1] === undefined && match[3] !== undefined){
                        clipId = match[3];
                    }
                    else if(match[1] !== undefined && match[3] === undefined){
                        clipId = match[1];
                    }
                    else{
                        return;
                    }
                    
                    if(match[2] !== undefined && match[4] === undefined){
                        clipUrl = `https://www.twitch.tv/videos/${clipId}?${match[2].replace("?","").replace("&","")}`;
                        clipOption = "&"+match[2].replace("?","").replace("&","");
                    }
                    else if(match[2] === undefined && match[4] !== undefined){
                        clipUrl = `https://www.twitch.tv/videos/${clipId}?${match[4].replace("?","").replace("&","")}`;
                        clipOption = "&"+match[4].replace("?","").replace("&","");
                    }
                    else{
                        clipUrl = `https://www.twitch.tv/videos/${clipId}`;
                    }
                    // removeOriginalLinks(href);   // VOD 의 경우 원본 링크를 제거하지 않는다.
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    break;

                case YOUTUBE_CLIP:
                    linkType = YOUTUBE_CLIP;
                    clipId = match[1];
                    clipUrl = href;
                    removeOriginalLinks(href);
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    $elem.closest("div.se-component-content").addClass("youtubeClipFound");

                    // IntersectionObserver to get storyboard image
                    if(GM_SETTINGS.youtubeClipStoryBoardImage){                                
                        const rootMarginHeight = Math.max(1080, window.screen.height) * 1.5;
                        const options = { root: null, threshold:[0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
                        NOMO_DEBUG("typeof IntersectionObserver = ", typeof IntersectionObserver);
                        const io = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                $a = $elem.find("a.se-oglink-thumbnail").first();
                                $imgThumbnail = $elem.find("img.se-oglink-thumbnail-resource").first();
                                if($a.length === 0 || $imgThumbnail.length === 0) return; // thumbnail 이 없는 것은 제외한다.

                                getYTClipPageInfoXHR(clipId, href, 0, function(){
                                    NOMO_DEBUG("getYTClipPageInfoXHR callback by IntersectionObserver");

                                    if(YTClipInfo === undefined || YTClipInfo[clipId] === undefined || YTClipInfo[clipId].foundStoryBoardUrl === undefined || YTClipInfo[clipId].foundStoryBoardSeq === undefined){
                                        var $parentContainer = $elem.closest("div.se-section-oglink");
                                        NOMO_DEBUG("YTClipInfo[clipId] FAIL", YTClipInfo[clipId], $parentContainer);
                                        $parentContainer.append(`<a href="${href}" target="_blank"><div class="YTClipFailContainer"><div class="YTClipFailContent">[[${GLOBAL.scriptName} v${GLOBAL.version}]]<br />Youtube Clip 정보를 가져오는데 실패했습니다.<br />클릭하면 Youtube 페이지가 새 창으로 열립니다.</div></div></a>`);
                                        $parentContainer.find(".NCTCLloader").remove();
                                        return;
                                    }
                                    // se-oglink-thumbnail-resource
                                    $elem.find(".se-oglink-thumbnail-resource").first().fadeOut(50, function(){
                                        $elem.find(".se-oglink-thumbnail-resource").first().attr("src", YTClipInfo[clipId].foundStoryBoardUrl).fadeIn(400);
                                    });
                                });
                                if (entry.intersectionRatio > 0.0) {
                                    observer.unobserve(entry.target);
                                }
                            });
                        }, options);
                        io.observe($elem.closest("div.se-component-content")[0]);
                    }
                    break;

                case STREAMABLE:
                    $elem.closest("div.se-component-content").addClass("streamableFound");
                    $elem.addClass("streamableFound");
                    linkType = STREAMABLE;
                    clipId = match[1];
                    clipUrl = `https://streamable.com/${clipId}`;
                    removeOriginalLinks(href);
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    break;

                case AFTV_VOD:
                    $elem.closest("div.se-component-content").addClass("aftvFound");
                    $elem.addClass("aftvFound");
                    linkType = AFTV_VOD;
                    clipId = match[1];
                    clipUrl = `https://vod.afreecatv.com/player/${clipId}`;
                    if(match[2] !== undefined){
                        clipOption = "&"+match[2];
                        clipUrl = clipUrl + "?" + match[2];
                    }
                    removeOriginalLinks(href);
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    break;
                }


                ////////////////////////////////////////////////////////////////////////////////////////////////
                var isAutoConvert = (GM_SETTINGS.method === "autoLoad");
                if(linkType === YOUTUBE_CLIP) isAutoConvert = false;

                // 자동 변환 시
                if(isAutoConvert){
                    var isAutoPlay = false;
                    var isMuted = false;
                    if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isMuted = true;
                    var NCTCL_Length = iframeNo;//$(".NCTCL-iframe").length;
                    if(GM_SETTINGS.autoPlayFirstClip && NCTCL_Length == 0){
                        isAutoPlay = true;
                        if(GM_SETTINGS.autoPlayFirstClipMuted) isMuted = true;
                        convertVideoLinkToIframe($elem, {"linkType":linkType, "href":href, "clipId":clipId, "autoPlay":isAutoPlay, "muted":isMuted, "option":clipOption, "lazy":false});
                    }
                    else if(NCTCL_Length < GM_SETTINGS.autoLoadLimit){
                        if(NCTCL_Length == 0){
                            convertVideoLinkToIframe($elem, {"linkType":linkType, "href":href, "clipId":clipId, "autoPlay":isAutoPlay, "muted":isMuted, "option":clipOption, "lazy":false});
                        }
                        else{
                            convertVideoLinkToIframe($elem, {"linkType":linkType, "href":href, "clipId":clipId, "autoPlay":isAutoPlay, "muted":isMuted, "option":clipOption, "lazy":true});
                        }
                    }
                    else{
                        if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                        $a.on("click", function(e){
                            e.preventDefault();
                            if($a.hasClass("clicked")) return;
                            $a.addClass("clicked");
                            $a.removeClass("hoverPlayButton");

                            if(linkType === YOUTUBE_CLIP) {
                                $a.prepend(`<div class="NCTCLloader"></div>`);
                            }
                            
                            if(GM_SETTINGS.autoPauseOtherClips){
                                autoPauseVideo({
                                    "origin":"https://clips.twitch.tv",
                                    "data":{"type":"NCTCL", "event":"play", "clipId":clipId},
                                });
                            }

                            var isClickRequiredMuted = false;
                            if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isClickRequiredMuted = true;
                            convertVideoLinkToIframe($(e.target), {"linkType":linkType, "href":href, "clipId":clipId, "autoPlay":GM_SETTINGS.clickRequiredAutoPlay, "muted":isClickRequiredMuted, "option":clipOption, "lazy":false});
                        });
                    }
                }
                // 클릭 변환 시
                else{   // if(GM_SETTINGS.method === "clickRequired")
                    if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                    $a.on("click", function(e){
                        e.preventDefault();
                        if($a.hasClass("clicked")) return;
                        $a.addClass("clicked");
                        $a.removeClass("hoverPlayButton");
                        
                        if(linkType === YOUTUBE_CLIP) {
                            $a.prepend(`<div class="NCTCLloader"></div>`);
                        }

                        if(GM_SETTINGS.autoPauseOtherClips){
                            autoPauseVideo({
                                "origin":"https://clips.twitch.tv",
                                "data":{"type":"NCTCL", "event":"play", "clipId":clipId},
                            });
                        }

                        var isClickRequiredMuted = false;
                        if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isClickRequiredMuted = true;
                        convertVideoLinkToIframe($(e.target), {"linkType":linkType, "href":href, "clipId":clipId, "autoPlay":GM_SETTINGS.clickRequiredAutoPlay, "muted":isClickRequiredMuted, "option":clipOption, "lazy":false});
                    });
                }
                
                $elem.addClass("twitchClipFound");
                $elem.closest("div.se-section-oglink").addClass("twitchClipFound");
                $elem.closest("div.se-component-content").addClass("twitchClipFound");
                
                if(DEBUG){
                    NOMO_DEBUG("PERFORMANCE CHECK", Number(new Date()) - p0);
                }
            },1);
        }
        catch(e){
            NOMO_DEBUG("Error from arrive", e);
        }
    });

    
    // NCTCL-description link click event - autoPauseOtherClips
    if(GM_SETTINGS.autoPauseOtherClips){
        $(document).on("click", ".NCTCL-description a", function(){
            autoPauseVideo({
                "origin":"https://clips.twitch.tv",
                "data":{"type":"NCTCL", "event":"play", "clipId":"STOP_ALL"},
            });
        });
    }


    // 기존에 존재하는 Youtube 영상을 다시 변환한다.
    var YTConvertedCount = 0;
    if(GM_SETTINGS.useYoutube){
        $(document).arrive("div.se-module-oembed iframe", { onlyOnce: true, existing: true }, function (elem) {
            try{
                var $elem = $(elem);
                if($elem.closest(".YTiframeContainer").length !== 0) {
                    return;
                }
                var $container = $(`<div class="YTiframeContainer" style="width:100%;height:100%"></div>`);
                var src = $elem.attr("src");
                $elem.after($container);
                $elem.remove();
                YTConvertedCount += 1;

                if(!GM_SETTINGS.youtubeLazyLoad || YTConvertedCount == 1){
                    createYTIframeArriveSub($container, src, videoWidth, videoHeight, 0);
                }
                // YT lazy load
                else{
                    NOMO_DEBUG("LAZYLOAD", src);
                    const rootMarginHeight = Math.max(1080, window.screen.height) * 1.5;
                    const options = { root: null, threshold:[0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
                    const io = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.intersectionRatio > 0.0) {
                                createYTIframeArriveSub($container, src, videoWidth, videoHeight, 0);
                                observer.unobserve(entry.target);
                            }
                        });
                    }, options);
                    io.observe($container[0]);
                }

            }
            catch(e){
                NOMO_DEBUG("Error from arrive createYTIframeArriveSub", e);
            }
        });
    }

    
    // fixFullScreenScrollChange
    var parentHtml = parent.document.querySelector("html");
    var lastScrollY = parentHtml.scrollTop;
    var checkIsFullScreen = function(){ return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen; };
    try{
        if(GM_SETTINGS.fixFullScreenScrollChange && window.self !== window.top){
            $(document).on ('mozfullscreenchange webkitfullscreenchange fullscreenchange',function(){
                var isFullScreen = checkIsFullScreen();
                NOMO_DEBUG("FullScreen", isFullScreen);
                if(!isFullScreen){
                    if(parentHtml.scrollTop !== lastScrollY){
                        NOMO_DEBUG("parentHtml.scrollTop = ", parentHtml.scrollTop, "lastScrollY = ", lastScrollY);
                    }
                    parentHtml.scrollTop = lastScrollY;
                }
            });

            $(parent.window).scroll(function() {
                var isFullScreen = checkIsFullScreen();
                //NOMO_DEBUG("parent document html scrolltop", parentHtml.scrollTop, "isFullScreen", isFullScreen);
                if(!isFullScreen){
                    //lastScrollY = parent.window.scrollY;
                    lastScrollY = parentHtml.scrollTop;
                }
            });
        }
    }
    catch(e){
        NOMO_DEBUG("Error from fixFullScreenScrollChange", e);
    }


    // naver video 에 autoPauseVideo 적용
    $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
        try{
            var $elem = $(elem);
            if($elem.hasClass("_FIRSTPLAYED")) return;

            $elem.on("play", function (e) {
                NOMO_DEBUG("Naver video played", e);
                let $target = $(e.target);

                // autoPauseOtherClipsForNaverVideo
                if(GM_SETTINGS.autoPauseOtherClips){    //  && GM_SETTINGS.autoPauseOtherClipsForNaverVideo
                    autoPauseVideo({
                        "origin":"https://clips.twitch.tv",
                        "data":{"type":"NCTCL", "event":"play", "clipId":$target.attr("id")},
                    });
                }
                if($target.hasClass("_FIRSTPLAYED")) return;
                $target.addClass("_FIRSTPLAYED");
            });

            $elem.on("playing", function (e) {
                NOMO_DEBUG("Naver video playing", e);
                let $target = $(e.target);

                if(GM_SETTINGS.naverVideoAutoMaxQuality && $target.hasClass("_ENDED")){
                    NOMO_DEBUG("ENDED & RESTART - RUN SET_NAVER_VIDEO_MAX_QUALITY_SUB");
                    $target.removeClass("_ENDED");
                    setTimeout(function(){
                        SET_NAVER_VIDEO_MAX_QUALITY_SUB($target.closest("div.u_rmcplayer_container").find(".u_rmc_definition_ly").first(), true);
                        
                        setTimeout(function(){
                            if(elem.paused){
                                elem.play();
                            }
                        },200);
                    },1);
                }
            });

            $elem.on("pause", function (e) {
                NOMO_DEBUG("Naver video paused", e);
            });
            
            $elem.on("ended", function (e) {
                NOMO_DEBUG("Naver video ended", e);
                $elem.addClass("_ENDED");
            });

            var $seComponentContent = $elem.closest(".se-component-content");
            if(GM_SETTINGS.alwaysShowVolumeController){
                $seComponentContent.find(".u_rmc_volume_area").addClass("u_rmc_volume_control_hover");
            }

            var naverCafeLogo = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;user-select: none;" viewBox="0 0 96 96" height="18px" width="18px"><g id="g10" inkscape:label="Image" inkscape:groupmode="layer"><rect y="5e-07" x="5e-07" height="96" width="96" id="rect865" style="fill:#1dc800;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none" /><path style="fill:#ffffff;stroke:#000000;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 22.810019,26.075075 h 18.03984 l 16.57371,24.254979 V 26.106948 H 75.367786 V 74.106947 H 57.391689 L 40.881729,50.075074 v 24.095618 h -18.16733 z" id="path40" /></g></svg> `;
            $seComponentContent.find(".se-media-meta-info-title").prepend(naverCafeLogo);
            $seComponentContent.find(".se-media-meta-info-description").prepend(naverCafeLogo);
        }
        catch(e){
            NOMO_DEBUG("Error from video arrive", e);
        }

        // if(DEBUG){
        //     var parent_script = $(elem).closest("div.se-video").find("script.__se_module_data");
        //     NOMO_DEBUG("parent_script", parent_script);
        //     var data_module = JSON.parse(parent_script.attr("data-module"));
        //     NOMO_DEBUG("data_module", data_module);
        //     var vid = data_module.data.vid;
        //     var inkey = data_module.data.inkey;
        //     var test = `<iframe name="mplayer" width="740" height="416" src="https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${vid}&amp;inKey=${inkey}&amp;wmode=opaque&amp;hasLink=0&amp;autoPlay=true&amp;beginTime=0" frameborder="0" scrolling="no" allowfullscreen=""></iframe>`;

        //     $(parent_script).after($(test));
        // }
    });


    // Naver Cafe Clip Reload
    NAVER_VIDEO_EVENT_INIT();
    GM_addStyle(`.u_rmc_controls_btn div.naver_player_reload_btn {padding-top:3px;}`);


    // FasterNoticeHide
    try{
        if(DEBUG){
            let savedNOTICE_OPEN = localStorage.getItem('NOTICE_OPEN');
            if(savedNOTICE_OPEN === null){
                savedNOTICE_OPEN = "ON";
            }
            NOMO_DEBUG("NOTICE_OPEN", savedNOTICE_OPEN);
            if(savedNOTICE_OPEN === "OFF"){
                GM_addStyle(`._noticeArticle {display:none;}`);
            }
            $(document).on("change", "#notice_hidden", function(e){
                NOMO_DEBUG("e.target.checked", e.target.checked);
                if(e.target.checked){
                    //
                }
                else{
                    $("._noticeArticle").show();
                }
            });
        }
    }
    catch(e){
        NOMO_DEBUG("Error from FasterNoticeHide", e);
    }


    if(GM_SETTINGS.visitedArticleStyle){
        GM_addStyle(`
        .skin-1080 .article-board .board-list div.inner_list a:visited,
        .skin-1080 .article-board .board-list div.inner_list div.inner_list a:visited *
        div.inner_list a:visited,
        div.inner_list a:visited *
        {
            color:#ddd !important;
        }
        html[data-theme='dark'] body .skin-1080 .article-board .board-list div.inner_list a:visited,
        html[data-theme='dark'] body .skin-1080 .article-board .board-list div.inner_list a:visited *
        html[data-theme='dark'] body div.inner_list a:visited,
        html[data-theme='dark'] body div.inner_list a:visited *
        {
            color:#454545 !important;
        }
        `);
    }
}