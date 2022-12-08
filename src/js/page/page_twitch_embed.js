import { NOMO_DEBUG } from "../lib";

export default function PAGE_TWITCH_EMBED(isTwitchVod, isTwitchMuted){
    GM_addStyle(`
            html body .player-overlay-background--darkness-5{background:rgba(0,0,0,.2);}
            .player-overlay-background--darkness-5:hover [data-a-target='player-overlay-play-button'] {
                background-color:rgba(255,255,255,0.2);
                box-shadow: 0px 0px 1vw rgb(0 0 0 / 40%);
            }
            .NCTCLVideoDeletedNotice{
                position: absolute;
                font-size: 2vw;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                flex: 1 1 100%;
                background-color: #eee;
            }
            .NCTCLVideoDeletedNotice .text{
                text-align:center;
                width:100%;
            }
            .keep_watching_btn{
                font-size: 13px;
                font-weight: 700;
                background: rgb(145, 71, 255);
                color: #fff;
                width: fit-content;
                padding: 5px 10px;
                border-radius: 5px;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor:pointer;
            }
            .keep_watching_btn:hover{
                color:#fff;
                background:rgb(119, 44, 232);
                text-decoration:none;
            }

            .keep_watching_btn.keep_watching_no_vod_btn{
                background:#666;
                cursor:default;
            }
            .keep_watching_btn.keep_watching_no_vod_btn:hover{
                background:#666;
                cursor:default;
            }
            .opacity_1{
                opacity:1 !important;
            }
            .opacity_transition{
                transition: opacity 0.2s !important;
            }
        `);

    // set_volume_when_stream_starts
    var is_volume_changed = false;
    if(GM_SETTINGS.set_volume_when_stream_starts){
        try{
            localStorage.setItem('volume', GM_SETTINGS.target_start_volume);
    
            if(GM_SETTINGS.target_start_volume !== 0){
                localStorage.setItem('video-muted', {default:false});
            }
        }
        catch(e){
            NOMO_DEBUG("Error from set_volume_when_stream_starts");
        }
    }

    // twitch_clip_hide_related_video_after_end
    if(GM_SETTINGS.twitch_clip_hide_related_video_after_end){
        GM_addStyle(`.player-overlay-background.player-overlay-background--darkness-1{background:none !important;}.player-overlay-background.player-overlay-background--darkness-1 .clip-postplay-recommendations{display:none !important;}`);
        
        // $(document).arrive("a.offline-recommendations-video-card", function (elem) {
        //     var $elem = $(elem);
        //     var href = $elem.attr("href");
        //     NOMO_DEBUG("href", href);

        //     if(href.indexOf("https://www.twitch.tv/videos/") !== -1){
        //         $(".keep_watching_btn").remove();
        //         $elem.closest(".player-overlay-background--darkness-1").append(`<a href="${href}" target="_blank" class="keep_watching_btn">계속 시청</a>`);
        //     }
        // });
        $(document).arrive(".clip-postplay-recommendations", function (elem) {
            var $elem = $(elem);

            var $as = $elem.find("a.offline-recommendations-video-card");
            var isVideoFound = false;
            for(var i=0;i<$as.length;i++){
                var $a = $($as[i]);
                var href = $a.attr("href");
                NOMO_DEBUG("href", href);
    
                if(href.indexOf("https://www.twitch.tv/videos/") !== -1){
                    $(".keep_watching_btn").remove();
                    $elem.closest(".player-overlay-background--darkness-1").append(`<a href="${href}" target="_blank" class="keep_watching_btn">VOD 계속 시청</a>`);
                    isVideoFound = true;
                    break;
                }
            }

            if(!isVideoFound){
                $(".keep_watching_btn").remove();
                $elem.closest(".player-overlay-background--darkness-1").append(`<span class="keep_watching_btn keep_watching_no_vod_btn">이용 가능한 전체 동영상이 없습니다.</span>`);
            }

        });
    }
    
    // play_and_pause_by_click
    if(GM_SETTINGS.play_and_pause_by_click){
        try {
            if(!isTwitchVod){
                GM_addStyle(`[data-a-target="player-twitch-logo-button"]{display:none !important}`);
            }
            GM_addStyle(`
                html body .top-bar
                {
                    display:none !important;
                }
            `);

            var backgroundDblclicked = false;
            var dblclickSetTimeout = undefined;

            $(document).on('click', "[data-a-target='player-overlay-click-handler']", (e) => {
                NOMO_DEBUG('clicked - playing', e);
                document.querySelector("button[data-a-target='player-play-pause-button']").click();
                
                backgroundDblclicked = true;
                clearTimeout(dblclickSetTimeout);
                dblclickSetTimeout = setTimeout(function(){
                    backgroundDblclicked = false;
                },300);
            });

            $(document).on('click', ".player-overlay-background", (e)=>{
                NOMO_DEBUG('clicked - end or play', e);
                if($(e.target).find(".clip-postplay-recommendations").length !== 0){
                    NOMO_DEBUG("There is recommendations div");
                    document.querySelector("button[data-a-target='player-play-pause-button']").click();
                }
                else{
                    NOMO_DEBUG("There is no recommendations div");
                }

                if(backgroundDblclicked){
                    clearTimeout(dblclickSetTimeout);
                    backgroundDblclicked = false;
                    $("button[data-a-target='player-fullscreen-button']").click();
                }
            });

        } catch (e) {
            NOMO_DEBUG("ERROR FROM play_and_pause_by_click", e);
        }
    }
    
    var video = undefined;
    var match = document.location.href.match(/^https?:\/\/(?:clips|player)\.twitch\.tv\/(?:embed\?clip=|\?video=)([a-zA-Z0-9-_]+)/);
    var clipId = "";
    if(match !== null && match.length > 1){
        clipId = match[1];
    }
    NOMO_DEBUG("clipId = ", clipId);

    if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip){
        window.addEventListener("message", function(e){
            if(e.origin === "https://cafe.naver.com" && e.data.type === "NCTCL"){
                NOMO_DEBUG("message from naver", e.data);
                if(e.data.clipId === undefined || e.data.clipId === "" || video === undefined) return;
                switch(e.data.event){
                default:
                    break;
                case "pause":
                    if(e.data.clipId !== clipId && typeof video.pause === "function"){
                        video.pause();
                    }
                    break;
                case "play":
                    if(video.paused){
                        document.querySelector("button[data-a-target='player-play-pause-button']").click();
                    }
                    break;
                }
            }
        });
    }

    var videoReady = false;
    var scriptLoadedDate = Number(new Date());
    var isSaveTimeAfterEnd = false;
    var savedTimeAfterEnd = 0.0;

    // twitch_clip_time_update_after_end
    function loadSavedTimeAfterEnd(target){
        if(!GM_SETTINGS.twitch_clip_time_update_after_end) return;
        if(isSaveTimeAfterEnd && target.duration - 0.1 > savedTimeAfterEnd){
            target.currentTime = savedTimeAfterEnd;
        }
        isSaveTimeAfterEnd = false;
        savedTimeAfterEnd = 0.0;
    }
    function saveTimeAfterEnd(target){
        if(!GM_SETTINGS.twitch_clip_time_update_after_end) return;
        if(!isSaveTimeAfterEnd) return;
        NOMO_DEBUG("current time update", target.currentTime);
        savedTimeAfterEnd = target.currentTime;
    }

    $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
        //if(elem === undefined || !elem.src) return;

        video = elem;
        NOMO_DEBUG("VIDEO SRC", video.src);
        video.addEventListener('play', (e) => {
            NOMO_DEBUG("video.networkState = ", video.networkState, ", isLoading? = ", video.networkState === video.NETWORK_LOADING);

            let $e = $(e.target);
            NOMO_DEBUG('twitch clip play()', e);
            loadSavedTimeAfterEnd(e.target);
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"play", "clipId":clipId}, "https://cafe.naver.com");
            
            //$(".keep_watching_btn").remove();

            if($e.hasClass("_FIRSTPLAYED")) return;
            
            // show volume controller for 5s
            $(".volume-slider__slider-container").addClass("opacity_1").addClass("opacity_transition");
            if(!GM_SETTINGS.twitch_clip_always_show_volume_controller){
                setTimeout(function(){
                    $(".volume-slider__slider-container").removeClass("opacity_1");
                },5000);
                setTimeout(function(){
                    $(".volume-slider__slider-container").removeClass("opacity_transition");
                },6000);
            }

            $e.addClass("_FIRSTPLAYED");
            GM_addStyle(`
            html body .player-overlay-background--darkness-5 { background:unset !important; }
            html body button[data-a-target="player-overlay-play-button"] { display:none !important; }
            html body .top-bar
            {
                display:none !important;
            }
            html body .video-player__container
            ,html body .video-player{
                background:unset;
            }
            `);
        });
        video.addEventListener('pause', (e) => {
            NOMO_DEBUG('twitch clip pause()', e);
            loadSavedTimeAfterEnd(e.target);
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"pause", "clipId":clipId}, "https://cafe.naver.com");
            //$(".keep_watching_btn").remove();
        });
        video.addEventListener('ended', (e) => {
            NOMO_DEBUG('twitch clip ended', e);
            isSaveTimeAfterEnd = true;
            if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"ended", "clipId":clipId}, "https://cafe.naver.com");
        });
        // video.addEventListener('waiting', (e) => {
        //     NOMO_DEBUG('twitch clip waiting', e);
        // });
        video.addEventListener('playing', (e) => {
            loadSavedTimeAfterEnd(e.target);
            NOMO_DEBUG('twitch clip playing', e);
            NOMO_DEBUG("DELAY TO PLAY = ", Number(new Date()) - scriptLoadedDate);
        });
        video.addEventListener('loadeddata', (e) => {
            NOMO_DEBUG('twitch clip loadeddata', e);
            $(".NCTCLVideoDeletedNotice").hide();
            videoReady = true;
        });
        video.addEventListener('timeupdate', (e) => {
            saveTimeAfterEnd(e.target);
        });
        
        // set_volume_when_stream_starts
        try {
            if(!isTwitchMuted && GM_SETTINGS.set_volume_when_stream_starts && !is_volume_changed){
                NOMO_DEBUG("set_volume");
                if(video.volume !== undefined){
                    NOMO_DEBUG("MUTE?", video.muted, "CURRENT VOLUME", video.volume, "TARGET VOLUME", GM_SETTINGS.target_start_volume);
                    setTimeout(function(){
                        if(GM_SETTINGS.target_start_volume !== 0.0){
                            video.muted = false;
                        }
                        video.volume = GM_SETTINGS.target_start_volume;
                        is_volume_changed = true;
                    },100);
                }
            }
        } catch (e) {
            NOMO_DEBUG("ERROR FROM set_volume_when_stream_starts", e);
        }
    });

    $(document).ready(function(){
        setTimeout(function(){
            var videoSrc = $("video").attr("src");
            if(!videoReady && (videoSrc === undefined || videoSrc === "")){
                $(".video-ref").append(`<div class="NCTCLVideoDeletedNotice"><div class="text">[Naver Cafe Twitch Clip Loader]<br />클립 또는 VOD가 삭제된 것 같습니다.<br /><a href="${document.location.href}" target="_self">이곳을 클릭하면 새로고침 합니다.</a></div></div>`);
            }
        },5000);
    });
}