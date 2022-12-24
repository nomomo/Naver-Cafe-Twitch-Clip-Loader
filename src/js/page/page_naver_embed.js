import css_navervid from "css/navervid.css";
import { isDEBUG, NOMO_DEBUG, NOMO_WARN } from "js/lib.js";
import { PageBase } from "js/page/page_common.js";

export default function PAGE_NAVER_EMBED(){
    NOMO_DEBUG("== PAGE_NAVER_EMBED ==");

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);
    let muted = (urlParam.get("muted") === "true" ? true : false);
    let autoPlay = (urlParam.get("autoPlay") === "true" ? true : false);
    let loop = (urlParam.get("loop") === "true" ? true : false);

    let page = new PageNaver({
        type: GLOBAL.NAVER_VID,
        id:urlParam.get("vid"),
        seq:urlParam.get("seq"),
        inkey:urlParam.get("inkey"),
        start:urlParam.get("beginTime"),
        loop:loop,
        autoPlay:autoPlay,
        muted:muted
    });
}


export class PageNaver extends PageBase {
    constructor(options){
        options.typeName = "NAVER_VID";
        super(options);
        NOMO_DEBUG("new PageNaver", options);

        this.elemBtnPlay = "span.u_rmc_ic.u_rmc_play_ic";
        this.elemBtnPause = "span.u_rmc_ic.u_rmc_pause_ic";
        this.elemBtnReplay = undefined;

        this.waitSetMaxQuality = false; // set max quality again after reload
        this.inkey = options.inkey;
        this.lastTime = 0.0;            // to recover time when reload player
        this.loop = (options.loop ? options.loop : false);

        // player reload
        this.reloaded = false;

        let that = this;

        // add style
        GM_addStyle(css_navervid.toString());

        if(GM_SETTINGS.hideEndOverlay){
            // embed 된 naver player 의 경우, 동영상 종료 후 연관된 동영상이 나타난다.
            // 연관된 동영상에 대한 xhr을 차단한다.
            unsafeWindow.XMLHttpRequest.prototype.oriOpen = unsafeWindow.XMLHttpRequest.prototype.open;
            unsafeWindow.XMLHttpRequest.prototype.open = function(/*method, url, async, user, password*/){
                if(arguments[1].indexOf("https://serviceapi.nmv.naver.com/ugc/flash/getRelativeMovie") !== -1
                || arguments[1].indexOf("https://serviceapi.nmv.naver.com/flash/getRelativeMovie") !== -1){
                    arguments[1] = "";
                }
                this.oriOpen.apply(this, arguments);
            };
        }

        // naverVideoAutoMaxQuality
        if(GM_SETTINGS.naverVideoAutoMaxQuality){
            $(document).arrive(".u_rmc_definition_ly", { existing: true }, function (elem) {
                that.setMaxQuality(false);
            });
        }

        // u_rmc_volume_control
        if(GM_SETTINGS.alwaysShowVolumeController){
            GM_addStyle(`
            body .u_rmcplayer .u_rmc_progress_controls .u_volume_panel {
                width: 80px;
                margin: 0 7px 0 5px;
                -webkit-transition: width .2s cubic-bezier(0,0,.2,1),padding-right .2s cubic-bezier(0,0,.2,1);
                transition: width .2s cubic-bezier(0,0,.2,1),padding-right .2s cubic-bezier(0,0,.2,1);
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                overflow: visible !important;
            }
            body .u_rmcplayer .u_rmc_volume_slider .u_rmc_handle_ic {
                opacity: 1 !important;
                overflow: visible !important;
            }
            `);
        }

        // set_volume_when_stream_starts
        if(GM_SETTINGS.set_volume_when_stream_starts || this.muted){
            try{
                let NWP_UserData = localStorage.getItem('NWP_UserData');
                if(NWP_UserData === null){
                    NWP_UserData = {"selectedCaption":null,"selectedCaptionType":"cp","useCaption":"false","lastPlayingRegularResolution":null,"lastPlayingRegularResolution_desktop":"1080P","lastPlayingRegularResolution_common":null,"is3GAlertConfirmed":false,"userVolume":1,"3GAlertConfirmExpireTime":0,"subtitleUserOption":{"size":"2","color":"white","isTransparent":false},"shownHelpLayer":"false","qualityLogData":null,"playingLogData":null};
                }
                else{
                    NWP_UserData = JSON.parse(NWP_UserData);
                }
        
                NOMO_DEBUG("muted?", this.muted, typeof this.muted);
                if(this.muted){
                    NWP_UserData.userVolume = 0;
                    localStorage.setItem('NWP_UserData', JSON.stringify(NWP_UserData));
                }
                else if(GM_SETTINGS.set_volume_when_stream_starts){
                    NWP_UserData.userVolume = GM_SETTINGS.target_start_volume;
                    localStorage.setItem('NWP_UserData', JSON.stringify(NWP_UserData));
                }
            }
            catch(e){
                NOMO_DEBUG("Error from set_volume_when_stream_starts", e);
            }
        }

        // 3px 초과하여 움직였을 때 click 이 씹히는 것을 개선
        if(GM_SETTINGS.NaverVideoEnhancedClick){
            let dbclickReady = false;
            let dbcheckSetTimeout = undefined;
            
            let x, y, paused;
            $(document).on("mousedown", "._click_zone, ._video_thumb", function(e){
                x = e.pageX;
                y = e.pageY;
                paused = $("video").get(0).paused;
                
                NOMO_DEBUG("SAVE x and y", x, y, paused);
            });
            GM_addStyle(`
            div[data-video-overlay] {display:block !important}
            .u_rmcplayer .onlyspin {pointer-events:none !important;}
            `);
            //$(document).on("mouseup", "._click_zone, ._video_thumb", function(e){
            $(document).on("mouseup", "._click_zone", function(e){
                let i = e.target.tagName;
                let n = e.target.parentNode.tagName;
                if (("A" !== i && "A" !== n && "BUTTON" !== i && "BUTTON" !== n) === false) return;
                
                // double click --> fullscreen
                if(dbclickReady){
                    dbclickReady = false;
                    $(".u_rmc_full_ic").trigger("click");
                }
                else{
                    dbclickReady = true;
                    clearTimeout(dbcheckSetTimeout);
                    dbcheckSetTimeout = setTimeout(function(){
                        dbclickReady = false;
                    },250);
                }

                if ($(e.target).closest("._disable_click_zone").length !== 0) return;
                // if(!$(e.target).hasClass("_click_zone") && !$(e.target).closest("._click_zone").length === 0) {
                //     if(((Math.abs(x - e.pageX) > 3 || Math.abs(y - e.pageY) > 3)) === false) return;
                // }
                if(((Math.abs(x - e.pageX) > 3 || Math.abs(y - e.pageY) > 3)) === false) return;
                if(paused === $("video").get(0).paused){
                    $("button[data-toolbar-play-button]").trigger("click");
                }
            });
        }

        // bind video reload event
        $(document).arrive(".u_rmcplayer_error_container", { existing: true }, function (elem) {
            try{
                let $elem = $(elem);
                let $btnReload = $(`<div class="naver_player_reload naver_player_reload_error_btn">[${GLOBAL.scriptName} ${GLOBAL.version}]<br />네이버 플레이어를 다시 로드하려면 여기를 클릭하세요.</div>`)
                    .on("click", function(){that.playerReload();});
                $elem.find(".u_rmc_error_txt").append($btnReload);
            }
            catch(e){
                NOMO_ERROR("Error from video arrive", e);
            }
        });

        // loop btn 추가 관련
        $(document).arrive(".u_rmc_controls_btn", { onlyOnce: true, existing: true }, function (elem) {
            try{
                let $elem = $(elem);

                // add loop btn
                if(GM_SETTINGS.NaverVideoAddLoopBtn){
                    let $loop = $(`<div style="color:${that.loop ? '#00e686' : '#eee'}" class="naver_player_reload_btn loop_btn">Loop</div>`).on("click", function(e){
                        that.video.loop = !that.video.loop;
                        that.loop = that.video.loop;
                        if(that.video.loop){
                            $(e.target).css("color","#00e686").addClass("BANJJAK");
                        }
                        else{
                            $(e.target).css("color","#eee").removeClass("BANJJAK");
                        }
                    });
                    $elem.prepend($loop);
                }
                
                // add btn for debug
                if(isDEBUG()){
                    let $reload = $(`<div class="naver_player_reload_btn">Reload</div>`).on("click", function(){
                        that.playerReload();
                    });
                    $elem.prepend($reload);
                    let $genError = $(`<div class="naver_player_reload_btn">Throw error</div>`).on("click", function(){
                        if(that.video){
                            that.video.src = "abcd";
                        }
                    });
                    $elem.prepend($genError);
                }
            }
            catch(e){
                NOMO_ERROR("Error from video arrive", e);
            }
        });

    }

    playerReload(){
        NOMO_DEBUG("playerReload", this.id, this.seq);
        if(this.reloaded) return;
        this.reloaded = true;
        $(".naver_player_reload_error_btn").addClass("reloaded");
        window.parent.postMessage({"type":"NCTCL_NAVERVID_RELOAD", "seq":this.seq, "loop":this.loop, "beginTime":this.lastTime}, "https://cafe.naver.com");
    }

    setMaxQuality(force){
        NOMO_DEBUG("Naver Video - setMaxQuality", this.id);
        var $elem = $(".u_rmc_definition_ly");
        var $u_rmcplayer = $elem.closest(".u_rmcplayer");
        if($u_rmcplayer.length === 0) {
            NOMO_WARN("setMaxQuality - no $u_rmcplayer");
            return;
        }
    
        if(force){
            $u_rmcplayer.removeClass("_QSET");
        }
    
        if($u_rmcplayer.hasClass("_QSET")) {
            NOMO_WARN("setMaxQuality - ALREADY QSET");
            return;
        }
    
        var $qli = $elem.find("li");
        if($qli.length > 2){
            var $last = $qli.last();
            if($last.hasClass("u_rmc_on")) {
                NOMO_WARN("setMaxQuality - u_rmc_on - ALREADY QSET");
                return;
            }
    
            NOMO_DEBUG("setMaxQuality - Best Quality Set", this.id, $last.text());
            $last.find("button").trigger("click");
    
            $u_rmcplayer.addClass("_QSET");

            
            setTimeout(function(){
                $(`[data-model="currentVideo.encodingOption.name"]`).addClass("BANJJAK");
            },200);
            setTimeout(function(){
                $(`[data-model="currentVideo.encodingOption.name"]`).removeClass("BANJJAK");
            },3000);
        }
        else{
            NOMO_WARN("no li elements for QSET");
        }
    }

    // play(){
    //     NOMO_DEBUG("Naver video play", this.id);
    //     $("span.u_rmc_ic.u_rmc_play_ic").trigger("click");
    // }
    // pause(){
    //     NOMO_DEBUG("Naver video pause", this.id);
    //     $("span.u_rmc_ic.u_rmc_pause_ic").trigger("click");
    // }
    
    onFirstPlay(){
        super.onFirstPlay();

        // hideTopOverlay
        if(GM_SETTINGS.hideTopOverlay){
            GM_addStyle(`
                div[data-title-container],
                .u_rmcplayer_video_info {display:none !important}
            `);
        }
    }
    onPlaying(){
        super.onPlaying();

        let that = this;

        // set max quality when replay
        if(this.waitSetMaxQuality){
            this.waitSetMaxQuality = false;
            setTimeout(function(){
                that.setMaxQuality(true);
                setTimeout(function(){
                    if(that.video.paused){
                        that.play();
                    }
                },200);
            },100);
        }
    }
    onEnded(){
        super.onEnded();
        this.waitSetMaxQuality = true;
    }
    onTimeupdate(e){
        let currentTime = e.target.currentTime;
        if(currentTime !== 0.0){
            this.lastTime = currentTime;
        }
    }
}