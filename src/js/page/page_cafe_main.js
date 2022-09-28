import {DEBUG, NOMO_DEBUG, escapeHtml} from "js/lib";
import {INSERT_YOUTUBE_SCRIPT, YTPlayers, createYTIframe, onYTPlayerReady, onYTPlayerStateChange, pauseYTVideo, createYTIframeArriveSub} from "js/youtube";
import css_cafe_main from "css/cafe_main.css";
import {NAVER_VIDEO_EVENT_INIT, SET_NAVER_VIDEO_MAX_QUALITY_SUB} from "js/navervid.js";

export function autoPauseVideo(e){
    if(!GM_SETTINGS.autoPauseOtherClips && !GM_SETTINGS.autoPlayNextClip) return;
    if(((e.origin === "https://clips.twitch.tv" || e.origin === "https://player.twitch.tv") && e.data.type === "NCTCL") === false) return;
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
        if(linkType === YOUTUBE_CLIP){
            logoText = `<svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="18" height="18" viewBox="0 0 461.001 461.001" style="enable-background:new 0 0 461.001 461.001;" xml:space="preserve">
                <g>
                    <path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
                </g>
            </svg>`;
        }
        else{
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

        switch(linkType){
        case TWITCH_CLIP:
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
            //var YTStart = href.match(/start=(\d+)/);
            //var YTEnd = href.match(/end=(\d+)/);
            //if(YTStart !== null){ YTStart = YTStart[1]; } else { YTStart = undefined; }
            //if(YTEnd !== null){ YTEnd = YTEnd[1]; } else { YTEnd = undefined; }
            GM.xmlHttpRequest({
                method: "GET",
                url: href,
                headers: {},
                onload: function(response) {
                    if(response.status === 200){
                        var rpt = response.responseText;
                        //NOMO_DEBUG("rpt", rpt);
                        var rpt_match = rpt.match(/<link itemprop="embedUrl" href="([a-zA-Z0-9-_./:=&;?]+)">/);
                        if(rpt_match !== null){
                            iframeUrl = rpt_match[1];
                            //NOMO_DEBUG(rpt_match);
                            NOMO_DEBUG(iframeUrl);
                            $parentContainer.find(".se-oglink-thumbnail").hide();

                            var YTID = iframeUrl.match(/\/embed\/([a-zA-Z0-9-_]+)/);
                            if(YTID === null) { return; } else { YTID = YTID[1]; }
                            NOMO_DEBUG("YTID = ", YTID, "clipId = ", clipId);
                            
                            var YTclipt = iframeUrl.match(/clipt=([a-zA-Z0-9-_]+)/);
                            if(YTclipt !== null){ YTclipt = YTclipt[1]; } else { YTclipt = undefined; }

                            ////$(`.NCTCL-iframe-container[data-clip-id='${clipId}']`)
                            // $(`#NCTCL-${clipId}`)
                            //     .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="${iframeUrl}&autoplay=${autoPlay}&muted=${muted}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);                               
                            
                            //createYTIframe(clipId, autoPlay, YTID, YTStart, YTEnd, YTclipt);
                            createYTIframe(clipId, autoPlay, YTID, undefined, undefined, YTclipt, videoWidth, videoHeight, 0);
                            
                            $parentContainer.find(".NCTCLloader").remove();
                            iframeNo += 1;
                        }
                        
                    }
                }
            });
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
    var regex_twitch_clip = /^https?:\/\/(?:clips\.twitch\.tv\/|www\.twitch.tv\/[a-zA-Z0-9-_]+\/clip\/)([a-zA-Z0-9-_]+)/;
    var regex_twitch_vod = /^https?:\/\/www\.twitch.tv\/videos\/(\d+)\?(t=[hms0-9]+)?/;
    var regex_twitch_vod2 = /^https?:\/\/www\.twitch.tv\/.+\/v\/(\d+)\?[a-zA-Z0-9=-_]*(&t=[hms0-9]+)?/;
    var regex_youtube_clip = /^https?:\/\/(?:www\.)?youtube\.com\/clip\/([a-zA-Z0-9-_]+)/;
    $(document).arrive("div.se-module-oglink", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(DEBUG){
                if(p0 === 0){
                    p0 = Number(new Date());
                }
                NOMO_DEBUG("PERFORMANCE CHECK", Number(new Date()) - p0);
            }

            var $elem = $(elem);
            if($elem.hasClass("fired")) return;
            $elem.addClass("fired");
            $elem.parent("div.se-section-oglink").addClass("fired");

            setTimeout(function(){
                var linkType;
                var $a = $elem.find("a.se-oglink-thumbnail").first();
                if($a.length === 0) return; // thumbnail 이 없는 것은 제외한다.

                var href = $a.attr("href");
                var match = href.match(regex_twitch_clip);

                var clipId, clipUrl, clipOption = "";
                if(GM_SETTINGS.use && match !== null){
                    linkType = TWITCH_CLIP;
                    clipId = match[1];
                    clipUrl = `https://clips.twitch.tv/${clipId}`;
                    removeOriginalLinks(href);
                    insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    //NOMO_DEBUG("TWITCH CILP FOUND, CLIP ID = ", clipId);
                }
                else {
                    match = href.match(regex_twitch_vod);
                    if(GM_SETTINGS.use && match === null){
                        match = href.match(regex_twitch_vod2);
                    }
                    if(GM_SETTINGS.use && match !== null){
                        linkType = TWITCH_VOD;
                        clipId = match[1];
                        if(match[2] !== undefined){
                            clipUrl = `https://www.twitch.tv/videos/${clipId}?${match[2].replace("?","").replace("&","")}`;
                            clipOption = "&"+match[2].replace("?","").replace("&","");
                        }
                        else{
                            clipUrl = `https://www.twitch.tv/videos/${clipId}`;
                        }
                        insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                    }
                    else if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeClipConvert){
                        match = href.match(regex_youtube_clip);
                        if(match !== null){                            
                            linkType = YOUTUBE_CLIP;
                            clipId = match[1];
                            clipUrl = href;
                            removeOriginalLinks(href);
                            insertNCTCLContainerDescription(linkType, $elem, clipId, clipUrl);
                            $elem.closest("div.se-component-content").addClass("youtubeClipFound");
                        }
                        else{
                            return;
                        }
                    }
                    else{
                        return;
                    }
                }

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

    // 기존에 존재하는 Youtube 영상을 다시 변환한다.
    if(GM_SETTINGS.useYoutube){
    //if(GM_SETTINGS.youtubeClipConvert || GM_SETTINGS.youtubeSetQuality || GM_SETTINGS.youtubeHidePauseOverlay){
        $(document).arrive("div.se-module-oembed iframe", { onlyOnce: true, existing: true }, function (elem) {
            try{
                createYTIframeArriveSub(elem, videoWidth, videoHeight, 0);
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
            if($(elem).hasClass("_FIRSTPLAYED")) return;

            $(elem).on("play", function (e) {
                NOMO_DEBUG("Naver video played", e);
                var $elem = $(e.target);

                // autoPauseOtherClipsForNaverVideo
                if(GM_SETTINGS.autoPauseOtherClips){    //  && GM_SETTINGS.autoPauseOtherClipsForNaverVideo
                    autoPauseVideo({
                        "origin":"https://clips.twitch.tv",
                        "data":{"type":"NCTCL", "event":"play", "clipId":$elem.attr("id")},
                    });
                }
                if($elem.hasClass("_FIRSTPLAYED")) return;
                $elem.addClass("_FIRSTPLAYED");
            });

            $(elem).on("playing", function (e) {
                NOMO_DEBUG("Naver video playing", e);
                var $elem = $(e.target);

                if(GM_SETTINGS.naverVideoAutoMaxQuality && $elem.hasClass("_ENDED")){
                    NOMO_DEBUG("ENDED & RESTART - RUN SET_NAVER_VIDEO_MAX_QUALITY_SUB");
                    $elem.removeClass("_ENDED");
                    setTimeout(function(){
                        SET_NAVER_VIDEO_MAX_QUALITY_SUB($elem.closest("div.u_rmcplayer_container").find(".u_rmc_definition_ly").first(), true);
                        
                        setTimeout(function(){
                            if(elem.paused){
                                elem.play();
                            }
                        },200);
                    },1);
                }
            });

            $(elem).on("pause", function (e) {
                NOMO_DEBUG("Naver video paused", e);
            });
            
            $(elem).on("ended", function (e) {
                NOMO_DEBUG("Naver video ended", e);
                $(elem).addClass("_ENDED");
            });
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

    //FasterNoticeHide
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