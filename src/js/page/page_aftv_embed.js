import { NOMO_DEBUG } from "../lib";

var $player = undefined;
var clipId = "";
var video = undefined;
var mouseleaveSetTimeout = undefined;

export default function PAGE_AFTV_EMBED(){

    NOMO_DEBUG("== PAGE_AFTV_EMBED ==");

    // get info
    var match = document.location.href.match(/^https?:\/\/vod\.afreecatv.com\/player\/(\d+)\??(change_second=\d+)?/);
    if(match !== null){
        clipId = match[1];
    }


    // set css
    GM_addStyle(`#afreecatv_player .player_ctrlBox .volume.bar_show_always .volume_slider {
        margin-left: 0px;
        opacity: 1;
        -moz-opacity: 1;
        filter: alpha(opacity=100)
    }
    `);

    if(GM_SETTINGS.aftvBeautifier){
        GM_addStyle(`/*play and pause 시 하단바가 움직이는 것을 개선한다*/
        #afreecatv_player .player_ctrlBox .play{
            margin-bottom:0px !important;
        }
    
        /*플레이어 상단 메뉴를 조금 더 투명하고 컴팩트하게 만든다*/
        #player_info .title h1 a{
            font-size:18px !important;
        }
        #player_info{
            min-height: 60px !important;
            linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.1), transparent) !important;
        }
        #player_info .bj_thumbnail, #player_info .bj_thumbnail img{
            width:40px !important;
            height:40px !important;
        }
    
        /*재생바 투명도*/
        #afreecatv_player .progress{
            opacity:0.5;
            padding:7px 0 !important; /* mouse on 시 재생바 커지는 것 방지 */
        }
        #afreecatv_player .progress .progress_track{
            height:3px !important; /* mouse on 시 재생바 커지는 것 방지 */
        }
        #afreecatv_player .progress .progress_track .watched{
            background-color: rgba(44, 198, 255, 0.7) !important;
        }
        #afreecatv_player .progress .progress_track .handler{
            opacity:0.7 !important;
        }
        #afreecatv_player .progress .progress_track{
            background-color: rgba(0.6, 0.6, 0.6, 0.1) !important;
        }
    
        /*volume slider 투명도*/
        .volume_slider_wrap{
            opacity:0.6;
        }
    
        /*모두가 afreeca clip 인 것을 알기 때문에 숨긴다.*/
        /*#btn_afreecatv_link {
            display:none !important;
        }*/
        .watermark {
            display:none !important;
        }
        `);

        // 레이아웃을 빠르게 숨긴다
        $(document).on("mouseover", "#webplayer", function(){
            clearTimeout(mouseleaveSetTimeout);
        });
        $(document).on("mouseout", "#webplayer", function(){
            mouseleaveSetTimeout = setTimeout(function(){
                $(".mouseover").removeClass("mouseover");
            },100);
        });
    }

    // aftvHideRecommend
    if(GM_SETTINGS.aftvHideRecommend){
        GM_addStyle(`#embed_recommend {display:none !important;}`);
    }


    // something special
    if(true){
        try{
            $(document).ready(function(){
                unsafeWindow.oriAjax = unsafeWindow.$.ajax;
                unsafeWindow.$.ajax = function(){
                    //NOMO_DEBUG("arguments", arguments);
                    if(arguments[0].url.indexOf("https://reqde.afreecatv.com") === -1){
                        unsafeWindow.oriAjax.apply(this, arguments);
                    }
                    else{
                        //arguments[0].success(JSON.stringify({"type":"no-ad","exist":false}));
                        arguments[0].error({status:1},"","");
                    }
                    
                };
            });
        }
        catch(e){
            NOMO_DEBUG("error from monga...monga...", e);
        }
    }


    // arrive video
    $(document).arrive("video.af_video", { onlyOnce: true, existing: true }, function (elem) {
        NOMO_DEBUG("video element created");
        $player = $(elem);
        video = elem;
        NOMO_DEBUG("VIDEO SRC", video.src);
        video.addEventListener('play', (e) => {
            NOMO_DEBUG("video.networkState = ", video.networkState, ", isLoading? = ", video.networkState === video.NETWORK_LOADING);

            let $e = $(e.target);
            NOMO_DEBUG('aftv vod play()', e);
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"play", "clipId":clipId}, "https://cafe.naver.com");

            if($e.hasClass("_FIRSTPLAYED")) return;
            
            // show volume controller for 5s
            $(".volume").addClass("bar_show_always");
            if(!GM_SETTINGS.alwaysShowVolumeController){
                setTimeout(function(){
                    $(".volume-slider__slider-container").removeClass("bar_show_always");
                },5000);
            }

            $e.addClass("_FIRSTPLAYED");
        });
        video.addEventListener('pause', (e) => {
            NOMO_DEBUG('aftv clip pause()', e);
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"pause", "clipId":clipId}, "https://cafe.naver.com");
        });
        video.addEventListener('ended', (e) => {
            NOMO_DEBUG('aftv clip ended', e);
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"ended", "clipId":clipId}, "https://cafe.naver.com");
        });
        // video.addEventListener('waiting', (e) => {
        //     NOMO_DEBUG('aftv clip waiting', e);
        // });
        video.addEventListener('playing', (e) => {
            NOMO_DEBUG('aftv clip playing', e);
        });
        video.addEventListener('loadeddata', (e) => {
            NOMO_DEBUG('aftv clip loadeddata', e);
        });
        // video.addEventListener('timeupdate', (e) => {
        // });
        
        // // set_volume_when_stream_starts
        // try {
        //     if(!isTwitchMuted && GM_SETTINGS.set_volume_when_stream_starts && !is_volume_changed){
        //         NOMO_DEBUG("set_volume");
        //         if(video.volume !== undefined){
        //             NOMO_DEBUG("MUTE?", video.muted, "CURRENT VOLUME", video.volume, "TARGET VOLUME", GM_SETTINGS.target_start_volume);
        //             setTimeout(function(){
        //                 if(GM_SETTINGS.target_start_volume !== 0.0){
        //                     video.muted = false;
        //                 }
        //                 video.volume = GM_SETTINGS.target_start_volume;
        //                 is_volume_changed = true;
        //             },100);
        //         }
        //     }
        // } catch (e) {
        //     NOMO_DEBUG("ERROR FROM set_volume_when_stream_starts", e);
        // }
    });


    // aftvAutoMaxQuality
    if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip){
        window.addEventListener("message", function(e){
            if(e.origin === "https://cafe.naver.com" && e.data.type === "NCTCL"){
                NOMO_DEBUG("message from naver", e.data);
                if(e.data.clipId === undefined || e.data.clipId === "" || video === undefined) return;
                switch(e.data.event){
                default:
                    break;
                case "pause":
                    if(e.data.clipId !== clipId && !video.paused){
                        $("#btnPlayPause").click();
                        video.pause();
                    }
                    else{
                        NOMO_DEBUG("video.pause", video.pause);
                    }
                    break;
                case "play":
                    if(video.paused){
                        $("#btnPlayPause").click();
                    }
                    break;
                }
            }
        });
    }


    // aftvAutoMaxQuality
    if(GM_SETTINGS.aftvAutoMaxQuality){
        $(document).arrive("button[data-qualityname='original']", { onlyOnce: true, existing: true }, function (elem) {
            var $elem = $(elem);
            if($elem.hasClass("on")) return;

            NOMO_DEBUG("SET AFTV VIDEO SOURCE QUALITY");
            $(elem).click();
        });
    }

    
    // aftvHideRecommendAfterEnd
    if(GM_SETTINGS.aftvHideRecommendAfterEnd){
        $(document).arrive("#after_recommend button.cancel", { onlyOnce: true, existing: true }, function (elem) {
            var $elem = $(elem);
            if(!$elem.is(':visible')) return;
    
            NOMO_DEBUG("CANCEL after recommend");
            $(elem).click();
            $("#after_recommend").remove();
        });
        GM_addStyle(`.recommend_broadcast{opacity:0;}`);
        $(document).on("click", ".recommend_broadcast", function(){
            NOMO_DEBUG(".recommend_broadcast clicked");
            var $btn_refresh = $("button.btn_refresh");
            if($btn_refresh.length !== 0 && video.paused && video.ended){
                $btn_refresh.click();
            }
        });
    }
}