
import {autoPauseVideo} from "js/page/page_cafe_main";

export var YTPlayers = {};
export function INSERT_YOUTUBE_SCRIPT(){
    if(!GM_SETTINGS.useYoutube) return;

    try{
        $("head").prepend(`<script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>`);
    }
    catch(e){
        NOMO_DEBUG("FAIL TO LOAD YOUTUBE IFRAME API. TRY TO INSERT YT API MANUALLY", e);
        // eslint-disable-next-line
        var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/4c3f79c5\/www-widgetapi.vflset\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}if(!window["YT"])var YT={loading:0,loaded:0};if(!window["YTConfig"])var YTConfig={"host":"https://www.youtube.com"};if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i++)try{l[i]()}catch(e$0){}};YT.setConfig=function(c){for(var k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=document.getElementsByTagName("script")[0];if(!b){document.getElementsByTagName('head')[0].appendChild(a)}else{b.parentNode.insertBefore(a,b)}})()};
    }

}
export function createYTIframe(clipId, autoPlay, YTID, YTStart, YTEnd, YTclipt, videoWidth, videoHeight){
    try{
        if(YT === undefined) {
            NOMO_DEBUG("There is no youtube iframe api (YT)");
            return;
        }

        var YTElemID = "NCTCL-"+clipId;
        var YTOptions = {
            "height": videoHeight,
            "width": videoWidth,
            "videoId": YTID,
            "playerVars": {
                'autoplay': (autoPlay ? 1 : 0),
                'autohide': 1,
                'showinfo': 0,
                'controls':1,
                'loop': 0,
                'clip': clipId
            },
            "suggestedQuality":"hd1080", // highres hd1080
            "events": {
                'onReady': onYTPlayerReady,
                'onStateChange': onYTPlayerStateChange
            }
        };
        if(YTStart !== undefined) YTOptions["playerVars"]["start"] = YTStart;
        if(YTEnd !== undefined) YTOptions["playerVars"]["end"] = YTEnd;
        if(YTclipt !== undefined) YTOptions["playerVars"]["clipt"] = YTclipt;
        NOMO_DEBUG("CREATE YTPlayer", clipId, YTOptions);
        YTPlayers[clipId] = new YT.Player(YTElemID, YTOptions);
    }
    catch(e){
        NOMO_DEBUG("Error from createYTIframe", e);
    }
}

export function onYTPlayerReady(event) {
    //event.target.playVideo();
    //event.target.loadVideoById({'videoId':YTID, 'startSeconds':30});
    //event.target.pauseVideo();
}
export function onYTPlayerStateChange(event) {
    //console.log("event", event);

    try{
        var dataset;
        if(event.target.o !== undefined && event.target.o.dataset !== undefined){
            dataset = event.target.o.dataset;
        }
        else if(event.target.i !== undefined && event.target.i.dataset !== undefined){
            dataset = event.target.i.dataset;
        }
        else if(event.target.s !== undefined && event.target.s.dataset !== undefined){
            dataset = event.target.s.dataset;
        }

        var clipId = dataset["clipId"];
        var playerState = event.data == YT.PlayerState.ENDED ? '종료됨' : event.data == YT.PlayerState.PLAYING ? '재생 중' : event.data == YT.PlayerState.PAUSED ? '일시중지 됨' : event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' : event.data == YT.PlayerState.CUED ? '재생준비 완료됨' : event.data == -1 ? '시작되지 않음' : '예외';
        NOMO_DEBUG("YOUTUBE PLAYER STATE CHANGED", clipId, event, playerState);
        if(GM_SETTINGS.autoPauseOtherClips){
            if(event.data == YT.PlayerState.PLAYING){
                setTimeout(function(){
                    autoPauseVideo({
                        "origin":"https://clips.twitch.tv",
                        "data":{"type":"NCTCL", "event":"play", "clipId":clipId},
                    });
                },1);
            }
        }
    }
    catch(e){
        NOMO_DEBUG("Error from onYTPlayerStateChange", e);
    }
}
export function stopYTVideo(clipId) {
    YTPlayers[clipId].stopVideo();
}
export function pauseYTVideo(clipId) {
    YTPlayers[clipId].pauseVideo();
}
export function playYTVideo(clipId) {
    YTPlayers[clipId].playVideo();
}