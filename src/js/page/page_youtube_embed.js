import { isDEBUG, NOMO_DEBUG } from "../lib/lib";
import { sanitizeUrl } from "js/lib/sanitizeurl.ts";

const YTQ_LIST = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
var $YTPlayer = undefined;
var YTPlayer = undefined;
var YTPlayerReady = false;
var useSetQuality = false;
var isExitFullscreenAfterEnd = false;
var isPlaylist = /listType=playlist/i.test(document.location.href);
var video, firstPlayed = false;

var url = new URL(document.location.href);
var urlParam = new URLSearchParams(url.search);
var isDarkMode = (urlParam.get("darkMode") === "true" ? true : false);
var muted = (urlParam.get("mute") === "true" ? true : false);
var autoplay = (urlParam.get("autoplay") === "true" ? true : false);
var isList = (urlParam.get("list") ? true : false);
var clipt = urlParam.get("clipt");
var clipId = urlParam.get("clip");
var isYoutubeClip = (clipt && clipId);
var storyBoardUrl = urlParam.get("storyBoardUrl");
var storyBoardSeq = urlParam.get("storyBoardSeq");


export default function PAGE_YOUTUBE_EMBED(){
    NOMO_DEBUG("== PAGE_YOUTUBE_EMBED ==");

    // add style
    GM_addStyle(`
    .unstarted-mode {cursor:pointer}
    .ytp-ad-overlay-container {display:none !important}

    #NCCL_popup {
        position: fixed;
        z-index: 99999;
        user-select: none;
        left: 50%;
        background: rgba(0,0,0,0.8);
        transform: translate(-50%, 3px);
        padding: 3px 8px;
        color: #fff;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
        vertical-align: middle;
        animation-duration: 1.3s;
        animation-name:fadeInOut;
        animation-timing-function: ease-in-out;
        animation-iteration-count: 1;
        opacity:0.0;
    }

    @keyframes fadeInOut {
        0%      { opacity: 0.0; transform: translate(-50%, 3px); }
        25% { opacity: 0.85; transform: translate(-50%, 0%); }
        80% { opacity: 0.85; transform: translate(-50%, 0%); }
        100% { opacity: 0.0; transform: translate(-50%, 6px) }
    }

    /* shorts 의 경우 일반 비디오처럼 autohide 시 title 을 숨긴다. */
    .ytp-autohide .ytp-shorts-title-channel { display:none !important; }

    /* 다음에서 보기: YouTube */
    .ytp-impression-link {display:none !important; }

    `);

    // $$$ TEST $$$
    // $(document).on("click", function(){
    //     NOMO_DEBUG("embed youtube document clicked");
    // });

    // unsafeWindow._addEventListener = unsafeWindow.addEventListener;
    // unsafeWindow.addEventListener = function(a,b,c){
    //     if(a === "wheel" || a === "mousewheel" || a === "DOMMouseScroll" || a == "scroll" || a == "touchmove"){
    //         NOMO_DEBUG("window 의 scroll 이벤트 무력화", a, b, c);
    //         return;
    //     }

    //     if(c==undefined)
    //         c=false;
    //     unsafeWindow._addEventListener(a,b,c);
    // };
    // unsafeWindow.document._addEventListener = unsafeWindow.document.addEventListener;
    // unsafeWindow.document.addEventListener = function(a,b,c){
    //     if(a === "wheel" || a === "mousewheel" || a === "DOMMouseScroll" || a == "scroll" || a == "touchmove"){
    //         NOMO_DEBUG("document 의 scroll 이벤트 무력화", a, b, c);
    //         return;
    //     }

    //     if(c==undefined)
    //         c=false;
    //     unsafeWindow.document._addEventListener(a,b,c);
    // };
    
    // Element.prototype._addEventListener = Element.prototype.addEventListener;
    // Element.prototype.addEventListener = function(a,b,c){
    //     if(a === "wheel" || a === "mousewheel" || a === "DOMMouseScroll" || a == "scroll" || a == "touchmove"){
    //         NOMO_DEBUG("Element 의 scroll 이벤트 무력화", a, b, c);
    //         return;
    //     }

    //     if(c==undefined)
    //         c=false;
    //     this._addEventListener(a,b,c);
    // };

    
    if(GM_SETTINGS.youtubeFixClickAfterScrolling) {
        GM_addStyle(`
        video, .ytp-iv-video-content {pointer-events: none;}
        `);
        $(document).on("wheel", function(e){
            NOMO_DEBUG("iframe youtube embed wheel event", e);
            NOMO_DEBUG("send postMessage (embed -> naver), scroll event");
            window.parent.postMessage({"scrollEvent":true}, "https://cafe.naver.com");
        });
    }

    // youtubeSetQuality
    useSetQuality = GM_SETTINGS.youtubeSetQuality !== "default" && YOUTUBE_EMBED_SET_QUALITY_CHECK_QUALITY();
    if(useSetQuality){
        try{
            let YTQ = localStorage.getItem("yt-player-quality");
            if (!YTQ){
                var YTQ_obj = JSON.parse(YTQ);
                //NOMO_DEBUG("Got YTQ localstorage", YTQ_obj);
                if(YTQ_obj && YTQ_obj.data !== GM_SETTINGS.youtubeSetQuality){
                    YTQ_obj.data = GM_SETTINGS.youtubeSetQuality;
                    YTQ_obj.expiration = Number(new Date()) + 24*60*60*1000;
                    YTQ_obj.creation = Number(new Date());
                    localStorage.setItem("yt-player-quality",JSON.stringify(YTQ_obj));
                    NOMO_DEBUG("Set YTQ localstorage", YTQ_obj);
                }
            }
        }
        catch(e){
            NOMO_ERROR("Error from setting YTQ localstorage", e);
        }
    }

    // check youtube player ready & onPlayerReady
    CheckYTPlayerReady();

    // bind firstPlay event
    $(document).arrive("video", { existing: true, onlyOnce: true }, function (elem) {
        video = elem;
        video.addEventListener('playing', (e) => {
            if(firstPlayed) return;
            firstPlayed = true;

            // hideTopOverlay
            if(!isPlaylist && !isList && GM_SETTINGS.hideTopOverlay){
                // GM_addStyle(`
                //     .ytp-gradient-top,
                //     .ytp-chrome-top,
                //     .ytp-show-cards-title {display:none !important}
                // `);

                $(".ytp-gradient-top").fadeOut(250);
                $(".ytp-chrome-top").fadeOut(250);
            }

            // 비디오 비율 or scaling% 등에 따라 화면 좌측에 까만 줄이 생기는 것을 방지하기 위해 배경색을 하얀색으로 변경
            // 다음의 경우에는 처리하지 않음
            // 1. dark mode 의 경우
            // 2. shorts, 4:3, 16:9 비율 등 레터박스가 필요한 비디오의 경우
            // 3. full screen 의 경우
            try{
                if(!isDarkMode){
                    NOMO_DEBUG("no darkMode detected");
                    //$(".html5-main-video").css("left", "0px");
                    let videoCssLeft = $(".html5-main-video").css("left");
                    let videoCssTop = $(".html5-main-video").css("top");
                    let videoCssLeftPxMatch = videoCssLeft.match(/(\d+)\s?px/i);
                    let videoCssTopPxMatch = videoCssTop.match(/(\d+)\s?px/i);
                    if(videoCssLeftPxMatch !== null && videoCssTopPxMatch !== null){
                        let videoCssLeftPxNum = Number(videoCssLeftPxMatch[1]);
                        let videoCssTopPxNum = Number(videoCssTopPxMatch[1]);
                        NOMO_DEBUG("videoCssLeftPxNum", videoCssLeftPxNum, "videoCssTopPxNum", videoCssTopPxNum);
                        if(videoCssLeftPxNum < 5 && videoCssTopPxNum < 5){
                            GM_addStyle(`
                                body, .html5-video-player:not(.ytp-fullscreen):not(.ended-mode) {background:none #fff !important;}
                                body {background-color:#fff !important;}
                            `);
                        }
                    }
                }
                else{
                    NOMO_DEBUG("darkMode detected");
                }
            }
            catch(e){
                NOMO_DEBUG("youtube embed page 에서 Darkmode 체크 중 에러", e);
            }

            // shortsAutoResize
            let $video = $(video);
            try{
                if(GM_SETTINGS.shortsAutoResize && ($video.width() + 1.0 < $video.height()) ){
                    GM_addStyle(`
                    /* Youtube Shorts .ytp-shorts-mode */
                    .html5-video-player { background: radial-gradient(ellipse at center, rgb(0 0 0 / 0%) 0%,rgb(16 16 16) 70%,rgba(0,0,0,1) 100%) !important; }
                    `);
                }
            }
            catch(e){
                NOMO_DEBUG("youtube embed page 에서 shorts 여부 체크 중 에러", e);
            }
        });

        video.addEventListener('ended', (e) => {
            exitFullscreenAfterEnd();
        });
    });

    // hidePauseOverlay
    if(GM_SETTINGS.hidePauseOverlay){
        GM_addStyle(`
        .ytp-pause-overlay-container {display:none !important}
        `);
    }
    
    // hideEndOverlay
    if(GM_SETTINGS.hideEndOverlay){
        GM_addStyle(`
        /*동영상 종료 후 추천 동영상 숨기기*/
        .html5-video-player.ended-mode video.html5-main-video {top:0px !important}

        /* 동영상 종료 후 확대를 막는다. */
        .ytp-fit-cover-video.ended-mode .html5-main-video { object-fit: contain !important }

        /*.html5-endscreen {display:none !important}*/
        .ytp-endscreen-content {display:none !important;}

        /*for youtube shorts*/
        .html5-endscreen.ytp-shorts-branded-ui .ytp-watch-on-youtube-button,
        .ytp-watch-again-on-youtube-endscreen-more-videos-container {display:none !important;}
        `);
        // .videowall-endscreen.html5-endscreen
        $(document).on("mouseup", ".html5-endscreen", function(e){
            NOMO_DEBUG("Clicked youtube endscreen", e, e.target);

            let $target = $(e.target);
            if($target.closest(".ytp-chrome-bottom").length !== 0) return;

            setTimeout(function(){
                $(".ytp-play-button").trigger("click");
            },50);
            setTimeout(function(){
                if($("video").get(0).paused){
                    $(".ytp-play-button").trigger("click");
                }
            },300);

        });
    }

    // youtubeShortsPauseOverlayClear
    if(GM_SETTINGS.youtubeShortsPauseOverlayClear){
        GM_addStyle(`.ytp-shorts-mode .ytp-pause-overlay-backdrop{background:unset !important}`);
    }

    // set_volume_when_stream_starts
    try{
        if(GM_SETTINGS.set_volume_when_stream_starts){
            let currentDate = Number(new Date());
            let data_data = {"volume":100.0*GM_SETTINGS.target_start_volume,"muted":((muted || GM_SETTINGS.target_start_volume === 0.0) ? true : false)};
            let data = {data: JSON.stringify(data_data), expiration: currentDate+2592000000, creation: currentDate};
            localStorage.setItem('yt-player-volume', JSON.stringify(data));

            data = {data: JSON.stringify(data_data), creation: currentDate};
            sessionStorage.setItem('yt-player-volume', JSON.stringify(data));
        }
        //// 아래 주석을 풀면 sessionStorage 를 무시한다.
        // else {
        //     let data = sessionStorage.getItem('yt-player-volume');
        //     if(data){
        //         data = JSON.parse(data);
        //         let data_data = JSON.parse(data.data);
        //         if(data_data.muted != muted){
        //             data_data.muted = muted;
        //             data.data = JSON.stringify(data_data);
        //             sessionStorage.setItem('yt-player-volume', JSON.stringify(data));
        //         }
        //     }
        // }
    }
    catch(e){
        NOMO_DEBUG("Error from set_volume_when_stream_starts");
    }


    if(!autoplay && isYoutubeClip && GM_SETTINGS.youtubeClipStoryBoardImage && storyBoardUrl && storyBoardSeq){
        storyBoardUrl = sanitizeUrl(storyBoardUrl);
        NOMO_DEBUG("storyBoardUrl", storyBoardUrl);
        NOMO_DEBUG("storyBoardSeq", storyBoardSeq);
        
        $(document).arrive(".ytp-cued-thumbnail-overlay-image", { existing: true, onlyOnce: true }, function (elem) {
            if(storyBoardUrl == "about:blank") return;

            // check image exists
            let img = new Image();
            img.onerror = function(e){NOMO_DEBUG("story image fail", e);};
            img.onload = function(){
                NOMO_DEBUG("story image loaded");
                let $thumbnailImage = $(elem);
                $thumbnailImage.css({
                    "background-image": `url(${storyBoardUrl})`
                });

                // shift image
                let translateX = "0";
                let translateY = "0";
                if(storyBoardSeq >= 0 && storyBoardSeq < 10){
                    translateY = "calc(100% / 5)";
                }
                else if(storyBoardSeq >= 15 && storyBoardSeq < 25){
                    translateY = "calc(-100% / 5)";
                }
                if(storyBoardSeq % 5 === 0 || storyBoardSeq % 5 === 1){
                    translateX = "calc(100% / 5)";
                }
                else if(storyBoardSeq % 5 === 3 || storyBoardSeq % 5 === 4){
                    translateX = "calc(-100% / 5)";
                }
                $thumbnailImage.css("transform", `scale(calc(5/3)) translate(${translateX}, ${translateY})`);
            };
            img.src = storyBoardUrl;
        });
    }
}


// player 준비되면 실행
function onPlayerReady(){
    
    // set_volume_when_stream_starts
    if(GM_SETTINGS.set_volume_when_stream_starts && YTPlayer && typeof YTPlayer.setVolume === "function"){
        YTPlayer.setVolume(100.0*GM_SETTINGS.target_start_volume);
    }

    if(useSetQuality){
        let TYTQ = GM_SETTINGS.youtubeSetQuality;
        //let TYTQ_INDEX = YTQ_LIST.indexOf(TYTQ);

        // get current quality
        let CYTQ = YTPlayer.getPlaybackQuality();
        NOMO_DEBUG(`Current YTQ: ${CYTQ}`);

        //let AYTQ = YTPlayer.getAvailableQualityLevels();
        //NOMO_DEBUG(`Current YTQ: ${CYTQ}, Available YTQ : ${AYTQ}`);
        
        // // check current quality and set quality
        // // TARGET >= CURRENT ?
        // if (CYTQ === "unknown" || TYTQ_INDEX >= YTQ_LIST.indexOf(CYTQ))
        // {
        //     if (YTPlayer.setPlaybackQualityRange !== undefined){
        //         YTPlayer.setPlaybackQualityRange(TYTQ);
        //     }
        //     YTPlayer.setPlaybackQuality(TYTQ);

        //     NOMO_DEBUG(`YTQ CHANGED. ${CYTQ} -> ${TYTQ}`);
        // }
        // // TARGET < CURRENT
        // else{
        //     // let AYTQ = YTPlayer.getAvailableQualityLevels();
        //     // NOMO_DEBUG(`Available YTQ : ${AYTQ}`);
            
        //     // for(let i=TYTQ_INDEX;i<YTQ_LIST.length;i++){

        //     // }

        // }

        // embed 된 player 의 경우 항상 CYTQ === "unknown" 인 것으로 보인다.
        if (YTPlayer.setPlaybackQualityRange !== undefined){
            YTPlayer.setPlaybackQualityRange(TYTQ);
        }
        YTPlayer.setPlaybackQuality(TYTQ);
        NOMO_DEBUG(`YTQ CHANGED. ${CYTQ} -> ${TYTQ}`);



        if(isDEBUG()){
            unsafeWindow.YTPlayer = YTPlayer;
            unsafeWindow.video = video;
            GM_addStyle(`
            /* tooltip */
            .ytp-tooltip:not([aria-hidden=true]) {display:none !important}
            `);
        }


        if(isYoutubeClip && GM_SETTINGS.youtubeClipDisableLoop && typeof YTPlayer.getLoopRange === "function" && video){
            let lastTime = -100.0;
            let youtubeClipDisableLoopHandler = function(e){
                //NOMO_DEBUG("clips timeupdate", e);
                let loopRange = YTPlayer.getLoopRange();
                if(loopRange && loopRange.type === "clips"){
                    let currentTime = video.currentTime;
                    let startTime = loopRange.startTimeMs * 0.001;
                    let endTime = loopRange.endTimeMs * 0.001;
                    
                    let cond1 = Math.abs(lastTime - endTime);
                    let cond2 = Math.abs(currentTime - startTime);

                    if(currentTime >= endTime || (endTime - startTime > 4.9 && cond1 < 1.0 && cond2 < 1.0)){
                        NOMO_DEBUG("youtubeClipDisableLoop, Pause video. cond", cond1, cond2);
                        YTPlayer.pauseVideo();
                        //showPopup("Clip 재생이 완료되었습니다.", "60px");
                        YTPlayer.seekTo(startTime);
                        exitFullscreenAfterEnd();
                    }
                    lastTime = currentTime;
                }
                else{
                    removeYoutubeClipDisableLoopHandler(e);
                }
            };
            let removeYoutubeClipDisableLoopHandler = function(e){
                NOMO_DEBUG("removeYoutubeClipDisableLoopHandler");
                video.removeEventListener("timeupdate", youtubeClipDisableLoopHandler);
            };
            video.addEventListener("timeupdate", youtubeClipDisableLoopHandler);
        }
    }

    // autoplay === false 인 경우에만 playlist 를 자동으로 펼침
    if(!autoplay && isPlaylist && $(".ytp-playlist-menu").length > 0 && $(".ytp-playlist-menu-button-icon").length > 0){
        if(!$(".ytp-playlist-menu").is(":visible")){
            $(".ytp-playlist-menu-button-icon").trigger("click");
        }
    }


    // alwaysShowVolumeController
    if(GM_SETTINGS.alwaysShowVolumeController){
        //$(".ytp-chrome-controls").addClass(".ytp-volume-slider-active");
        GM_addStyle(`
        .ytp-time-display-allow-autohide {
            display: none;
        }
        .ytp-volume-panel {
            width: 52px;
            margin-right: 3px;
            -webkit-transition: margin .2s cubic-bezier(0,0,0.2,1),width .2s cubic-bezier(0,0,0.2,1);
            transition: margin .2s cubic-bezier(0,0,0.2,1),width .2s cubic-bezier(0,0,0.2,1);
        }
        .ytp-big-mode .ytp-volume-panel {
            width: 78px;
            margin-right: 5px;
        }
        .ytp-impression-link {
            display:none;
        }
        `);
    }
}


// quality setting 이 가능한 유저 설정인지 확인
function YOUTUBE_EMBED_SET_QUALITY_CHECK_QUALITY(){
    if(GM_SETTINGS.youtubeSetQuality === "default") return false;

    if(!$.inArray(GM_SETTINGS.youtubeSetQuality, YTQ_LIST)){
        NOMO_DEBUG("NO TARGET QUALITY");
        return false;
    }
    else{
        return true;
    }
}


// youtube player 가 quality setting 을 위해 준비되었는지 확인
var iter = 1;
const max_iter = 40;
function CheckYTPlayerReady(){
    NOMO_DEBUG("YOUTUBE_EMBED_SET_QUALITY_POST", iter);

    // check if youtube player is ready
    if(!YTPlayerReady){
        if(iter > max_iter) return;

        $YTPlayer = $(".html5-video-player");
        if($YTPlayer.length !== 0 && $YTPlayer[0].getPlaybackQuality !== undefined){
            YTPlayer = $YTPlayer[0];
            YTPlayerReady = true;
            onPlayerReady();
        }
        else{
            setTimeout(function(){
                iter += 1;
                CheckYTPlayerReady();
            }, 50);
            return;
        }
    }
}

function exitFullscreenAfterEnd(){
    if(!isExitFullscreenAfterEnd && GM_SETTINGS.exitFullscreenAfterEnd && document.fullscreenElement){
        isExitFullscreenAfterEnd = true;
        document.exitFullscreen();
    }
}

function showPopup(html, bottom){
    if($("#NCCL_popup").length !== 0) $("#NCCL_popup").remove();

    let $popup = $(`<div id="NCCL_popup" style="bottom:${bottom}">${html}</div>`);
    $("html").append($popup);
    setTimeout(function(){ $popup.remove(); }, 1500.0);
}