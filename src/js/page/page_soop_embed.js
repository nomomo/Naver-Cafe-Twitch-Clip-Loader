import { NOMO_DEBUG, isDEBUG } from "../lib/lib";
import { PageBase } from "js/page/page_common.js";

export default function PAGE_SOOP_EMBED(){
    NOMO_DEBUG("== PAGE_SOOP_EMBED ==");

    // get info
    var match = document.location.href.match(/^https?:\/\/vod\.sooplive\.co\.kr\/(?:player|ST)\/(\d+)\??(change_second=\d+)?/);
    if(match === null) return;
    let id = match[1];
    let start = 0;
    if(match[2] !== undefined) {
        start = match[2].replace("change_second=", "");
    }

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);

    let page = new PageSoop({
        type: GLOBAL.SOOP,
        id:id,
        start:start,
        seq:urlParam.get("seq")
    });
}

export class PageSoop extends PageBase {
    constructor(options){
        options.typeName = "Soop";
        options.videoSelector = "video#video.af_video";
        super(options);
        NOMO_DEBUG("new PageSoop", options);

        this.mouseleaveSetTimeout = undefined;  // 레이아웃 빠르게 숨기기용

        let that = this;

        // add style
        GM_addStyle(`
        .NCCLaftvReplayBtn {
            opacity:0.6;
        }
        #player.mouseover .NCCLaftvReplayBtn{
            opacity:0.9;
        }

        .NCCL_Vertical #player .nextvideo{
            background-size: cover !important;
        }
        `);

        // hidePauseOverlay
        if(GM_SETTINGS.hidePauseOverlay){
            GM_addStyle(`#embed_recommend {display:none !important;}`);
        }
        
        // hideEndOverlay
        if(GM_SETTINGS.hideEndOverlay || GM_SETTINGS.aftvDisablePlayNextClipAfterEnd){
            $(document).arrive("#after_recommend button.cancel", { onlyOnce: true, existing: true }, function (elem) {
                var $elem = $(elem);
                if(!$elem.is(':visible')) return;
        
                // click cancel button
                NOMO_DEBUG("CANCEL after recommend");
                $(elem).trigger("click");

                if(GM_SETTINGS.hideEndOverlay){
                    // remove overlay and show replay icon
                    $("#after_recommend")
                        .empty()
                        .css({
                            "width": "100%",
                            "height": "100%",
                            "opacity": 0.5,
                            "cursor": "pointer"
                        })
                        .html(`<svg class="NCCLaftvReplayBtn" xmlns='http://www.w3.org/2000/svg' width='150px' height='150px' viewBox='0 0 25 25' fill='none'><path fill-rule='evenodd' clip-rule='evenodd' d='M8.83 6.884a.5.5 0 0 0 0 .848l3.992 2.495a.5.5 0 0 0 .765-.424V8.109A4.893 4.893 0 0 1 12.5 17.77a4.891 4.891 0 0 1-4.892-4.891 1.087 1.087 0 0 0-2.173 0 7.065 7.065 0 1 0 8.152-6.982V4.814a.5.5 0 0 0-.765-.424L8.83 6.884z' fill='#fff'/></svg>`);
                }
                else{
                    // add background opacity
                    $("#after_recommend")
                        .css({
                            "background-color": "rgba(0,0,0,0.9)",
                            "cursor": "pointer"
                        });
                }

                // click on the background to replay
                $("#after_recommend")
                    .on("click", function(e){
                        if(!$(e.target).is(".NCCLaftvReplayBtn") && !$(e.target).is("#after_recommend") && $(e.target).closest("#after_recommend").length > 0){
                            NOMO_DEBUG("inner element in #after_recommend is clicked", e.target);
                            return;
                        }
                        NOMO_DEBUG("#after_recommend clicked", e.target);
                        var $btn_refresh = $("button.btn_refresh");
                        if($btn_refresh.length !== 0 && $btn_refresh.is(":visible") && that.video.paused){
                            $btn_refresh.trigger("click");
                        }
                        
                        // some clips require the user to click the replay btn and press the play btn again
                        setTimeout(function(){  // async
                            let $nextVideoBtn = $("#player .nextvideo .bg");
                            if($nextVideoBtn.length == 1 && $nextVideoBtn.is(':visible') && that.video.paused){
                                NOMO_DEBUG("Wait to click #player .nextvideo .bg");
                                $nextVideoBtn.trigger("click");
                            }
                            else{
                                NOMO_DEBUG("There is no #player .nextvideo .bg");
                            }
                        },10);
                    });
            });
        }

        // aftvBeautifier
        if(GM_SETTINGS.aftvBeautifier){
            GM_addStyle(`
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

            // 라이브 알림을 끄면 바로 숨긴다
            $(document).arrive("div.live_alert.on button", { onlyOnce: true, existing: true }, function (elem) {
                $(elem).on("click", function(e){
                    NOMO_DEBUG("hide live_alert");
                    $(e.target).closest("div.live_alert").hide();
                });
            });
        }

        // set_volume_when_stream_starts
        if(GM_SETTINGS.set_volume_when_stream_starts){
            try{
                localStorage.setItem('volume', GM_SETTINGS.target_start_volume);
        
                if(GM_SETTINGS.target_start_volume !== 0){
                    localStorage.setItem('muted', `{"default":0}`);
                }
            }
            catch(e){
                NOMO_DEBUG("Error from set_volume_when_stream_starts");
            }
        }

        // alwaysShowVolumeController
        if(GM_SETTINGS.alwaysShowVolumeController){
            GM_addStyle(`
            #player .player_ctrlBox .volume {
                overflow: visible !important;
                position: relative !important;
                z-index: 10 !important;
            }
            #player .player_ctrlBox .volume .volume_slider_wrap {
                overflow: visible !important;
                margin: 6px 5px !important;
            }
            #player .player_ctrlBox .volume .volume_slider {
                opacity: 1 !important;
                width: 50px !important;
            }
            `);
        }

        // aftvAutoMaxQuality
        if(GM_SETTINGS.aftvAutoMaxQuality){
            try{
                document.cookie = "CurrentQuality=original; expires=" + new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toGMTString() + "; path=/; SameSite=None; Secure";
            }
            catch(e){
                NOMO_DEBUG("error from aftvAutoMaxQuality", e);
            }
        }

        if(GM_SETTINGS.aftvHideLiveAlert){
            GM_addStyle(`
               div.live_alert {display:none !important} 
            `);
        }

        // something special when debug mode is on
        let ss = isDEBUG();

        // shortsAutoResizeAftv
        // TODO: Resolve callback hell
        if((GM_SETTINGS.shortsAutoResizeType !== "0" && GM_SETTINGS.shortsAutoResizeAftv) || ss || GM_SETTINGS.aftvNeugeuBlock){
            try {
                let OriginalXMLHttpRequest = XMLHttpRequest;
                let CustomXMLHttpRequest = function() {
                    let xhr = new OriginalXMLHttpRequest();

                    xhr.open = function(method, url, async, user, password) {
                        this._url = url;  // Save the URL to check it later
                        // call original send
                        xhr.__proto__.open.apply(xhr, arguments);
                    };

                    // new send()
                    xhr.send = function(data) {
                        if (this._url && (this._url.includes("deapi.sooplive.co.kr") || this._url.includes("/get_ad.php") )) {

                            NOMO_DEBUG("Blocked request to: " + this._url);
                            // Set readyState to DONE (4)
                            this.readyState = 4;
                            // Call onreadystatechange if it is defined
                            if (typeof this.onreadystatechange === 'function') {
                                this.onreadystatechange();
                            }
                            // Call onload if it is defined
                            if (typeof this.onload === 'function') {
                                this.onload();
                            }
                            return;  // Prevent the request from being sent
                        }

                        let onReadyStateChangeCallback = xhr.onreadystatechange;

                        xhr.onreadystatechange = function() {
                            // // ???????????????????????
                            // try{
                            //     if(ss && (xhr.responseURL.indexOf("https://reqde.afreecatv.com") !== -1 || xhr.responseURL.indexOf("deapi.afreecatv.com") !== -1)){
                            //         // skip send
                            //         NOMO_DEBUG("MONGA HAPPEN", xhr.responseURL);
                            //         return;
                            //     }
                            // }
                            // catch (error) {
                            //     NOMO_DEBUG("error from CustomXMLHttpRequest", error);
                            // }

                            // shortsAutoResizeAftv
                            if (xhr.readyState !== XMLHttpRequest.DONE) {
                                return;
                            }
                            try {
                                if((GM_SETTINGS.shortsAutoResizeType !== "0" && GM_SETTINGS.shortsAutoResizeAftv) && xhr.responseURL.indexOf("sooplive.co.kr/station/video/a/view") !== -1){

                                    let responseData = xhr.responseText;
                                    let parsedData = JSON.parse(responseData);
                                    if (parsedData && parsedData.data && parsedData.data.file_resolution) {
                                        let resolution = parsedData.data.file_resolution.split("x");
                                        let width = parseInt(resolution[0]);
                                        let height = parseInt(resolution[1]);
                
                                        //NOMO_DEBUG("responseText", xhr.responseText);
                                        NOMO_DEBUG("parsedData", parsedData);
                                        if (width < height) {
                                            NOMO_DEBUG("SHORTS 감지됨", width, height);
                                            $("body").addClass("NCCL_Vertical");
                                            that.sendPostMessage({"type":"NCCL", "event":"shorts", "width":width, "height":height});
                                        }
                                    } else {
                                        NOMO_DEBUG("Unexpected data structure from CustomXMLHttpRequest");
                                    }
                                }
            
                                // call original callback
                                if (onReadyStateChangeCallback) {
                                    onReadyStateChangeCallback.apply(xhr);
                                }
                            } catch (error) {
                                NOMO_DEBUG("error from CustomXMLHttpRequest", error);
                            }
                        };

                        // call original send
                        xhr.__proto__.send.apply(xhr, arguments);
                    };

                    return xhr;
                };
                unsafeWindow.XMLHttpRequest = CustomXMLHttpRequest;
            }
            catch(e){
                NOMO_DEBUG("error from shortsAutoResizeAftv", e);
            }
        }

    }
    
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