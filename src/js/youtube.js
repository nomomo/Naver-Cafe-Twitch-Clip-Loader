
import {autoPauseVideo} from "js/page/page_cafe_main";

export var YTPlayers = {};
export function INSERT_YOUTUBE_SCRIPT(){
    if(!GM_SETTINGS.useYoutube) return;

    var YTIframeAPITag = document.createElement('script');
    YTIframeAPITag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(YTIframeAPITag, firstScriptTag);
}
export function createYTIframe(clipId, autoPlay, YTID, YTStart, YTEnd, YTclipt, videoWidth, videoHeight){
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

export function onYTPlayerReady(event) {
    //event.target.playVideo();
    //event.target.loadVideoById({'videoId':YTID, 'startSeconds':30});
    //event.target.pauseVideo();
}
export function onYTPlayerStateChange(event) {
    console.log("event", event);

    var dataset;
    if(event.target.o !== undefined){
        dataset = event.target.o.dataset; 
    }
    else if(event.target.i !== undefined){
        dataset = event.target.i.dataset; 
    }

    var clipId = dataset["clipId"];
    var playerState = event.data == YT.PlayerState.ENDED ? '종료됨' : event.data == YT.PlayerState.PLAYING ? '재생 중' : event.data == YT.PlayerState.PAUSED ? '일시중지 됨' : event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' : event.data == YT.PlayerState.CUED ? '재생준비 완료됨' : event.data == -1 ? '시작되지 않음' : '예외';
    NOMO_DEBUG("YOUTUBE PLAYER STATE CHANGED", clipId, event, playerState);
    if(GM_SETTINGS.autoPauseOtherClips){
        if(event.data == YT.PlayerState.PLAYING){
            autoPauseVideo({
                "origin":"https://clips.twitch.tv",
                "data":{"type":"NCTCL", "event":"play", "clipId":clipId},
            });
        }
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