import { NOMO_DEBUG } from "../lib/lib";
import { PageBase } from "js/page/page_common.js";

export default function PAGE_AFTV_EMBED(){
    NOMO_DEBUG("== PAGE_AFTV_EMBED ==");

    // get info
    var match = document.location.href.match(/^https?:\/\/vod\.afreecatv.com\/player\/(\d+)\??(change_second=\d+)?/);
    if(match === null) return;
    let id = match[1];
    let start = 0;
    if(match[2] !== undefined) {
        start = match[2].replace("change_second=", "");
    }

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);

    let page = new PageAFTV({
        type: GLOBAL.AFTV_VOD,
        id:id,
        start:start,
        seq:urlParam.get("seq")
    });
}

export class PageAFTV extends PageBase {
    constructor(options){
        options.typeName = "AFTV_VOD";
        super(options);
        NOMO_DEBUG("new PageNaver", options);

        this.elemBtnPlay = "#btnPlayPause";
        this.elemBtnPause = "#btnPlayPause";

        this.mouseleaveSetTimeout = undefined;  // 레이아웃 빠르게 숨기기용

        let that = this;

        // add style
        GM_addStyle(`#afreecatv_player .player_ctrlBox .volume.bar_show_always .volume_slider {
            margin-left: 0px;
            opacity: 1;
            -moz-opacity: 1;
            filter: alpha(opacity=100)
        }
        `);

        // hidePauseOverlay
        if(GM_SETTINGS.hidePauseOverlay){
            GM_addStyle(`#embed_recommend {display:none !important;}`);
        }
        
        // hideEndOverlay
        if(GM_SETTINGS.hideEndOverlay){
            $(document).arrive("#after_recommend button.cancel", { onlyOnce: true, existing: true }, function (elem) {
                var $elem = $(elem);
                if(!$elem.is(':visible')) return;
        
                NOMO_DEBUG("CANCEL after recommend");
                $(elem).trigger("click");
                $("#after_recommend").remove();
            });
            GM_addStyle(`.recommend_broadcast{opacity:0;}`);
            $(document).on("click", ".recommend_broadcast", function(){
                NOMO_DEBUG(".recommend_broadcast clicked");
                var $btn_refresh = $("button.btn_refresh");
                if($btn_refresh.length !== 0 && that.video.paused && that.video.ended){
                    $btn_refresh.trigger("click");
                }
            });
        }

        // aftvBeautifier
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
                background-color: rgba(0.6, 0.6, 0.6, 0.3) !important;
            }
        
            /*volume slider 투명도*/
            .volume_slider_wrap{
                opacity:0.9;
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
                clearTimeout(that.mouseleaveSetTimeout);
            });
            $(document).on("mouseout", "#webplayer", function(){
                that.mouseleaveSetTimeout = setTimeout(function(){
                    $(".mouseover").removeClass("mouseover");
                },100);
            });
        }

        // something special
        let ss = true;
        if(ss){
            try{
                $(document).ready(function(){
                    if(unsafeWindow.$ === undefined){
                        return;
                    }
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

        // set_volume_when_stream_starts
        if(GM_SETTINGS.set_volume_when_stream_starts){
            try{
                localStorage.setItem('volume', GM_SETTINGS.target_start_volume);
        
                if(GM_SETTINGS.target_start_volume !== 0){
                    localStorage.setItem('muted', {default:Number(false)});
                }
            }
            catch(e){
                NOMO_DEBUG("Error from set_volume_when_stream_starts");
            }
        }

        // alwaysShowVolumeController
        if(GM_SETTINGS.alwaysShowVolumeController){
            GM_addStyle(`
            body #afreecatv_player .player_ctrlBox .volume_slider_wrap .volume_slider {
                margin-left: 0px;
                opacity: 1;
                -moz-opacity: 1;
                filter: alpha(opacity=100);
            }
            `);
        }

        // aftvAutoMaxQuality
        if(GM_SETTINGS.aftvAutoMaxQuality){
            $(document).arrive("button[data-qualityname='original']", { onlyOnce: true, existing: true }, function (elem) {
                var $elem = $(elem);
                if($elem.hasClass("on")) return;

                NOMO_DEBUG("SET AFTV VIDEO SOURCE QUALITY");
                $(elem).trigger("click");
            });
        }

    }
    
    // play(){
    //     if(this.video && this.video.paused){
    //         $("#btnPlayPause").trigger("click");
    //     }
    // }
    // pause(){
    //     if(this.video && !this.video.paused){
    //         $("#btnPlayPause").trigger("click");
    //     }
    // }

    onFirstPlay(){
        super.onFirstPlay();
        
        // hideTopOverlay
        if(GM_SETTINGS.hideTopOverlay){
            GM_addStyle(`
                #player_info {display:none !important}
            `);
        }
    }
}