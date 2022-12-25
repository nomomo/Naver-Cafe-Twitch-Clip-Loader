import { NOMO_DEBUG } from "../lib";

const YTQ_LIST = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
var $YTPlayer = undefined;
var YTPlayer = undefined;
var YTPlayerReady = false;
var useSetQuality = false;

export default function PAGE_YOUTUBE_EMBED(){
    NOMO_DEBUG("== PAGE_YOUTUBE_EMBED ==");

    // add style
    GM_addStyle(`
    .unstarted-mode {cursor:pointer}
    .ytp-ad-overlay-container {display:none !important}
    `);

    // youtubeSetQuality
    useSetQuality = GM_SETTINGS.youtubeSetQuality !== "default" && YOUTUBE_EMBED_SET_QUALITY_CHECK_QUALITY();
    if(useSetQuality){
        try{
            let YTQ = localStorage.getItem("yt-player-quality");
            if (!YTQ){
                var YTQ_obj = JSON.parse(YTQ);
                //NOMO_DEBUG("Got YTQ localstorage", YTQ_obj);
                if(YTQ_obj.data !== GM_SETTINGS.youtubeSetQuality){
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
    let video, firstPlayed = false;
    $(document).arrive("video", { existing: true, onlyOnce: true }, function (elem) {
        video = elem;
        video.addEventListener('playing', (e) => {
            if(firstPlayed) return;
            firstPlayed = true;

            // hideTopOverlay
            if(GM_SETTINGS.hideTopOverlay){
                // GM_addStyle(`
                //     .ytp-gradient-top,
                //     .ytp-chrome-top,
                //     .ytp-show-cards-title {display:none !important}
                // `);

                $(".ytp-gradient-top").fadeOut(250);
                $(".ytp-chrome-top").fadeOut(250);
            }
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
        video.html5-main-video {top:0px !important}
        /*.html5-endscreen {display:none !important}*/
        .ytp-endscreen-content {display:none !important;}
        `);
        $(document).on("mouseup", ".videowall-endscreen.html5-endscreen", function(e){
            NOMO_DEBUG("Clicked youtube endscreen", e, e.target);

            let $target = $(e.target);
            if($target.closest(".ytp-chrome-bottom").length !== 0) return;

            $(".ytp-play-button").trigger("click");
            setTimeout(function(){
                if($("video").get(0).paused){
                    $(".ytp-play-button").trigger("click");
                }
            },300);
        });
    }

    //// moved to onYTPlayerReady in video_youtube.js
    // // set_volume_when_stream_starts
    // if(GM_SETTINGS.set_volume_when_stream_starts){
    //     try{
    //         // let ytPlayerVolume = localStorage.getItem('yt-player-volume');
    //         // if(ytPlayerVolume !== null){
    //         //     let data = JSON.parse(ytPlayerVolume);
    //         //     let data_data = JSON.parse(data.data);
    //         //     data_data.volume = 100.0*GM_SETTINGS.target_start_volume;
    //         //     data.data = JSON.stringify(data_data);
    //         //     data.creation = Number(new Date());
    //         //     data.expiration = Number(new Date())+10000000;
    //         //     localStorage.setItem('yt-player-volume', JSON.stringify(data));
    //         // }

    //         let data_data = {"volume":100.0*GM_SETTINGS.target_start_volume,"muted":(GM_SETTINGS.target_start_volume === 0 ? true : false)};
    //         let data = {data: JSON.stringify(data_data), expiration: Number(new Date())+10000000, creation: Number(new Date())};
    //         localStorage.setItem('yt-player-volume', JSON.stringify(data));
    //     }
    //     catch(e){
    //         NOMO_DEBUG("Error from set_volume_when_stream_starts");
    //     }
    // }
}


// player 준비되면 실행
function onPlayerReady(){
    
    // set_volume_when_stream_starts
    if(GM_SETTINGS.set_volume_when_stream_starts && typeof YTPlayer.setVolume === "function"){
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
