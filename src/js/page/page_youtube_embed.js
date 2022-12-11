import { NOMO_DEBUG } from "../lib";

const YTQ_LIST = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
var $YTPlayer = undefined;
var YTPlayer = undefined;
var YTPlayerReady = false;

export default function PAGE_YOUTUBE_EMBED(){
    NOMO_DEBUG("== PAGE_YOUTUBE_EMBED ==");

    GM_addStyle(`.ytp-ad-overlay-container {display:none !important}`);

    if(GM_SETTINGS.youtubeSetQuality !== "default" && YOUTUBE_EMBED_SET_QUALITY_CHECK_QUALITY()){
        YOUTUBE_EMBED_SET_QUALITY_PRE();
        YOUTUBE_EMBED_SET_QUALITY_POST();
    }

    if(GM_SETTINGS.youtubeHidePauseOverlay){
        GM_addStyle(`
        .ytp-pause-overlay {display:none !important}
        `);
    }


}

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

function YOUTUBE_EMBED_SET_QUALITY_PRE(){
    set_ls_YTQ();
}

var iter = 1;
const max_iter = 40;
function YOUTUBE_EMBED_SET_QUALITY_POST(){
    NOMO_DEBUG("YOUTUBE_EMBED_SET_QUALITY_POST", iter);

    // check if youtube player is ready
    if(!YTPlayerReady){
        if(iter > max_iter) return;

        $YTPlayer = $(".html5-video-player");
        if($YTPlayer.length !== 0 && $YTPlayer[0].getPlaybackQuality !== undefined){
            YTPlayer = $YTPlayer[0];
            YTPlayerReady = true;
        }
        else{
            setTimeout(function(){
                iter += 1;
                YOUTUBE_EMBED_SET_QUALITY_POST();
            }, 50);
            return;
        }
    }

    var TYTQ = GM_SETTINGS.youtubeSetQuality;
    var TYTQ_INDEX = YTQ_LIST.indexOf(TYTQ);

    // get current quality
    var CYTQ = YTPlayer.getPlaybackQuality();
    NOMO_DEBUG(`Current YTQ: ${CYTQ}`);

    //var AYTQ = YTPlayer.getAvailableQualityLevels();
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
    //     // var AYTQ = YTPlayer.getAvailableQualityLevels();
    //     // NOMO_DEBUG(`Available YTQ : ${AYTQ}`);
        
    //     // for(var i=TYTQ_INDEX;i<YTQ_LIST.length;i++){

    //     // }

    // }

    // embed 된 player 의 경우 항상 CYTQ === "unknown" 인 것으로 보인다.
    if (YTPlayer.setPlaybackQualityRange !== undefined){
        YTPlayer.setPlaybackQualityRange(TYTQ);
    }
    YTPlayer.setPlaybackQuality(TYTQ);

    NOMO_DEBUG(`YTQ CHANGED. ${CYTQ} -> ${TYTQ}`);
    


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
        `);
    }
}

function set_ls_YTQ(){
    try{
        var YTQ = localStorage.getItem("yt-player-quality");
        if (!YTQ)
        {
            var YTQ_obj = JSON.parse(YTQ);
            NOMO_DEBUG("GET YTQ TO LOCALSTORATE", YTQ_obj);
            if(YTQ_obj.data !== GM_SETTINGS.youtubeSetQuality){
                YTQ_obj.data = GM_SETTINGS.youtubeSetQuality;
                YTQ_obj.expiration = Number(new Date()) + 24*60*60*1000;
                YTQ_obj.creation = Number(new Date());
                localStorage.setItem("yt-player-quality",JSON.stringify(YTQ_obj));
                NOMO_DEBUG("SET NEW YTQ TO LOCALSTORATE", YTQ_obj);
            }
        }
    }
    catch(e){
        NOMO_DEBUG("error from set_ls_YTQ", e);
    }
}