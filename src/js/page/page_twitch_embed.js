import { NOMO_DEBUG, NOMO_ERROR } from "js/lib.js";
import { PageBase } from "js/page/page_common.js";

export default function PAGE_TWITCH_EMBED(){
    
    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);
    let muted = (urlParam.get("muted") === "true" ? true : false);
    let autoPlay = (urlParam.get("autoplay") === "true" ? true : false);
    let id = "";
    if(GLOBAL.isTwitchClip){
        id = urlParam.get("clip");
    }
    else if(GLOBAL.isTwitchVod){
        id = urlParam.get("video");
    }

    let page = new PageTwitch({
        type: GLOBAL.NAVER_VID,
        id:id,
        seq:urlParam.get("seq"),
        start:urlParam.get("t"),
        autoPlay:autoPlay,
        muted:muted
    });
    
}

class PageTwitch extends PageBase{
    constructor(options){
        super(options);

        this.elemBtnPlay = "button[data-a-target='player-play-pause-button']";
        this.elemBtnPause = "button[data-a-target='player-play-pause-button']";

        this.isSaveTimeAfterEnd = false;
        this.savedTimeAfterEnd = 0.0;

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

        GM_addStyle(`
        html body .player-overlay-background--darkness-5 { background:unset !important; }
        html body button[data-a-target="player-overlay-play-button"] { display:none !important; }
        html body .video-player__container
        ,html body .video-player{
            background:unset;
        }
        `);

        if(GM_SETTINGS.hideTopOverlay){
            GM_addStyle(`    
            html body .top-bar {
                display:none !important;
            }
            `);
        }

        // hideEndOverlay
        if(GM_SETTINGS.hideEndOverlay){
            GM_addStyle(`.player-overlay-background.player-overlay-background--darkness-1{background:none !important;}.player-overlay-background.player-overlay-background--darkness-1 .clip-postplay-recommendations{display:none !important;}`);
            
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
                if(!GLOBAL.isTwitchVod){
                    GM_addStyle(`[data-a-target="player-twitch-logo-button"]{display:none !important}`);
                }
                GM_addStyle(`
                    html body .top-bar{
                        display:none !important;
                    }
                `);

                let backgroundDblclicked = false;
                let dblclickSetTimeout = undefined;
                $(document).on('click', "[data-a-target='player-overlay-click-handler']", (e) => {
                    NOMO_DEBUG('clicked - playing', e);
                    $("button[data-a-target='player-play-pause-button']").trigger("click");
                    
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
                        $("button[data-a-target='player-play-pause-button']").trigger("click");
                    }
                    else{
                        NOMO_DEBUG("There is no recommendations div");
                    }

                    if(backgroundDblclicked){
                        clearTimeout(dblclickSetTimeout);
                        backgroundDblclicked = false;
                        $("button[data-a-target='player-play-pause-button']").trigger("click");
                    }
                });

            } catch (e) {
                NOMO_ERROR("Error from play_and_pause_by_click", e);
            }
        }

        // set_volume_when_stream_starts
        try{
            if(GM_SETTINGS.set_volume_when_stream_starts){
                localStorage.setItem('volume', GM_SETTINGS.target_start_volume);
            }
    
            if((GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume === 0) || this.muted){
                localStorage.setItem('video-muted', {default:true});
            }
            else{
                localStorage.setItem('video-muted', {default:false});
            }
        }
        catch(e){
            NOMO_ERROR("Error from set_volume_when_stream_starts");
        }

        NOMO_DEBUG("new PageTwitch", this);
    }

    onPlayerReady(){

        // set_volume_when_stream_starts
        try {
            if(this.muted){
                this.video.muted = true;
            }
            else if(GM_SETTINGS.set_volume_when_stream_starts){
                this.video.volume = GM_SETTINGS.target_start_volume;
            }
        } catch (e) {
            NOMO_ERROR("Error from set_volume_when_stream_starts", e);
        }

        // show volume controller for 5s
        $(".volume-slider__slider-container").addClass("opacity_1").addClass("opacity_transition");
        if(!GM_SETTINGS.alwaysShowVolumeController){
            setTimeout(function(){
                $(".volume-slider__slider-container").removeClass("opacity_1");
            },5000);
            setTimeout(function(){
                $(".volume-slider__slider-container").removeClass("opacity_transition");
            },6000);
        }
    }

    // play(){
    //     if(this.video && this.video.paused){
    //         $("button[data-a-target='player-play-pause-button']").trigger("click");
    //     }
    // }
    // pause(){
    //     if(this.video && !this.video.paused){
    //         $("button[data-a-target='player-play-pause-button']").trigger("click");
    //     }
    // }

    onPlay(e){
        this.loadSavedTimeAfterEnd(e.target);
        super.onPlay(e);
    }

    onPause(e){
        this.loadSavedTimeAfterEnd(e.target);
        super.onPause(e);
    }

    onPlaying(e){
        this.loadSavedTimeAfterEnd(e.target);
        super.onPlaying(e);
    }

    onEnded(e){
        this.isSaveTimeAfterEnd = true;
        super.onEnded(e);
    }

    onTimeupdate(e){
        this.saveTimeAfterEnd(e.target);
        super.onTimeupdate(e);
    }


    // twitch_clip_time_update_after_end
    loadSavedTimeAfterEnd(target){
        if(!GM_SETTINGS.twitch_clip_time_update_after_end) return;
        if(this.isSaveTimeAfterEnd && target.duration - 0.1 > this.savedTimeAfterEnd){
            target.currentTime = this.savedTimeAfterEnd;
        }
        this.isSaveTimeAfterEnd = false;
        this.savedTimeAfterEnd = 0.0;
    }

    saveTimeAfterEnd(target){
        if(!GM_SETTINGS.twitch_clip_time_update_after_end) return;
        if(!this.isSaveTimeAfterEnd) return;
        NOMO_DEBUG("current time update", target.currentTime);
        this.savedTimeAfterEnd = target.currentTime;
    }

}