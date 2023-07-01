import { NOMO_DEBUG, isNumeric, escapeHtml } from "js/lib/lib.js";
import { VideoNaver } from "js/video/video_naver.js";
import { VideoBase } from "js/video/video_common.js";

const Naverlogo = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;user-select: none;" viewBox="0 0 96 96" height="18px" width="18px"><g id="g10" inkscape:label="Image" inkscape:groupmode="layer"><rect y="5e-07" x="5e-07" height="96" width="96" id="rect865" style="fill:#1dc800;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none" /><path style="fill:#ffffff;stroke:#000000;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 22.810019,26.075075 h 18.03984 l 16.57371,24.254979 V 26.106948 H 75.367786 V 74.106947 H 57.391689 L 40.881729,50.075074 v 24.095618 h -18.16733 z" id="path40" /></g></svg>`;

export class VideoNaverPrism extends VideoBase {
    constructor(options) {
        options.logoSVG = Naverlogo;
        options.type = GLOBAL.NAVER_VID_PRISM;
        options.typeName = "NAVER_VID_PRISM";
        super(options);

        this.inkey = options.inkey;
        this.tags = options.tags;
        this.start = (options.start ? options.start : 0);
        this.iframeUrl = `https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${this.id}&inKey=${this.inkey}&wmode=opaque&hasLink=0&autoPlay=${this.autoPlay}&muted=${this.muted}&beginTime=${this.start}&seq=${this.seq}`;
        NOMO_DEBUG("new VideoNaverPrism", options);

        this.isExitFullscreenAfterEnd = false;

        // only for naver prism
        this.options_ori = options;
        this.$seComponent = undefined;
        this.$seSectionVideo = undefined;
        this.videoFound = false;
        this.isSetMaxQuality = false;
        this.tryToReload = false;
        this.lastTime = 0.0;            // to recover time when reload player

        // 동영상 제목이 길어서 잘리는 경우에 대한 처리
        if(this.title && this.title.length > 37){
            let $articleTitle = $("#app div.ArticleContentBox div.article_header div.ArticleTitle h3");
            if($articleTitle.length === 1){
                let articleTitle = $articleTitle.text().trim();
                if(articleTitle.indexOf(this.title) !== -1){
                    this.title = articleTitle;
                }
            }
        }
    }

    static init(){
        // window.addEventListener("message", function(e){
        //     if(e.origin === "https://serviceapi.nmv.naver.com" && e.data.type === "NCCL_NAVERVID_RELOAD"){
        //         NOMO_DEBUG("NCCL_NAVERVID_RELOAD message from serviceapi.nmv.naver.com", e.data);
        //         if(e.data.seq !== undefined){
        //             VideoBase.videos[e.data.seq].parseNewInkeyAndReloadPlayer(e.data.beginTime);
        //         }
        //     }
        // });

        GM_addStyle(`
            .NCCL_prism_container .se-media-meta { display:none; }
            .NCCL_pzp_qset { border-radius: 8px; color: #fff; padding: 4px 6px !important; opacity:0; transition-property: opacity; transition-duration: 0.2s; }
            .pzp.pzp-pc.pzp-pc--controls .NCCL_pzp_qset { opacity:1; position:relative }
            .pzp.pzp-pc.pzp-pc--controls .NCCL_pzp_qset:hover .NCCL_pzp_qset_tooltip { visibility: visible }
            .pzp.pzp-pc.pzp-pc--controls .NCCL_pzp_qset .NCCL_pzp_qset_tooltip{
            font-family: -apple-system, BlinkMacSystemFont, Helvetica, Apple SD Gothic Neo, sans-serif;
            -webkit-font-smoothing: antialiased;
            color: #fff;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            margin: 0;
            padding: 0;
            position: absolute;
            top: -40px;
            left: 50%;
            height: 27px;
            padding: 0 12px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 14px;
            font-size: 13px;
            line-height: 28px;
            text-align: center;
            color: #fff;
            white-space: nowrap;
            visibility: hidden;
            transition-property: opacity;
            transform: translateX(-50%);
        }
            div.pzp-pc__header .pzp-pc-header__top-shadow { display:none; }
        `);

        if(GM_SETTINGS.alwaysShowVolumeController){
            GM_addStyle(`
            .pzp.pzp-pc .pzp-pc__volume-control > .pzp-pc__volume-slider, .pzp.pzp-pc--active-volume-control .pzp-pc__volume-slider { overflow: visible; width: 80px; }
            .pzp-pc--active-volume-control .pzp-pc__volume-slider, .pzp-pc .pzp-pc__volume-control>.pzp-pc__volume-slider { overflow: visible; width: 80px; }
            `);
        }

        // 3px 초과하여 움직였을 때 click 이 씹히는 것을 개선
        if(GM_SETTINGS.NaverVideoEnhancedClick){
            
            let x, y, paused;
            $(document).on("mousedown", ".NCCL_prism_container video", function(e){
                x = e.pageX;
                y = e.pageY;
                paused = $(e.target).get(0).paused;
                
                NOMO_DEBUG("SAVE x and y", x, y, paused);
            });
            //$(document).on("mouseup", "._click_zone, ._video_thumb", function(e){
            $(document).on("mouseup", ".NCCL_prism_container video", function(e){
                // let i = e.target.tagName;
                // let n = e.target.parentNode.tagName;
                // if (("A" !== i && "A" !== n && "BUTTON" !== i && "BUTTON" !== n) === false) return;
                
                // if ($(e.target).closest("._disable_click_zone").length !== 0) return;
                // // if(!$(e.target).hasClass("_click_zone") && !$(e.target).closest("._click_zone").length === 0) {
                // //     if(((Math.abs(x - e.pageX) > 3 || Math.abs(y - e.pageY) > 3)) === false) return;
                // // }
                NOMO_DEBUG("LOAD x and y", x, y, paused);
                let deltaX = x - e.pageX;
                let deltaY = y - e.pageY;
                let delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if(delta < 10) return;
                setTimeout(function(){
                    if(paused === $(e.target).get(0).paused){
                        NOMO_DEBUG("toggle play-pause by NaverVideoEnhancedClick");
                        $(e.target).closest(".NCCL_prism_container").find(".pzp-pc__playback-switch").trigger("click");
                    }
                },30);
            });
        }

        // // 세로로 길게 표시되는 비디오를 가로로 넓게 표시
        // if(GM_SETTINGS.naverPrismVideoDisableVertical){
        //     GM_addStyle(`
        //         .se-video-vertical.NCCL_prism_container .se-viewer .se-video.se-video-vertical {
        //             object-fit: contain !important;
        //         }
        //         .se-viewer .se-video.se-video-vertical.NCCL_prism_container .se-module-video {
        //             padding-top: 56.25% !important;
        //         }
        //         .se-viewer .se-video.se-video-vertical.NCCL_prism_container .se-section-video {
        //             max-width: none !important;
        //         }
        //         .se-viewer .se-video.se-video-vertical.NCCL_prism_container .pzp-poster {
        //             background-size: contain !important;
        //         }
        //         .se-viewer .se-video.se-video-vertical.NCCL_prism_container .webplayer-internal-video {
        //             object-fit: contain !important;
        //         }
        //     `);
        // }
    }

    // overwrite video related function
    play(){
        NOMO_DEBUG("VideoNaverPrism - play", this.id);
        if(!this.video) return;
        this.video.play();
    }
    pause(){
        NOMO_DEBUG("VideoNaverPrism - pause", this.id);
        if(!this.video) return;
        this.video.pause();
    }
    stop(){
        NOMO_DEBUG("VideoNaverPrism - stop", this.id);
        if(!this.video) return;
        this.video.stop();
    }

    // video related event
    eventPlay(){
        super.eventPlay();
        this.autoPlayPauseOthers("play");
        if(this.$NCCL_pzp_qset && this.$NCCL_pzp_qset.length !== 0){
            this.$NCCL_pzp_qset.fadeOut(300);
        }
    }
    eventPause(){
    }
    eventEnded(){
        this.autoPlayPauseOthers("ended");
        // exitFullscreenAfterEnd
        if(!this.isExitFullscreenAfterEnd && GM_SETTINGS.exitFullscreenAfterEnd && document.fullscreenElement){
            this.isExitFullscreenAfterEnd = true;
            document.exitFullscreen();
        }
    }
    onFirstPlay(){    
    }
    eventLoadeddata(e){
        let that = this;
        // set_volume_when_stream_starts
        if(GM_SETTINGS.set_volume_when_stream_starts){
            if(this.muted){
                this.video.volume = 0.0;
            }
            else if(GM_SETTINGS.set_volume_when_stream_starts){
                this.video.volume = GM_SETTINGS.target_start_volume;
                
                // prism player 의 경우 normalize 를 하는 듯하다.
                setTimeout(function(){
                    let prismVolume = that.$seComponent.find(".pzp-ui-slider--volume").attr("aria-valuenow");
                    let volumeRatioInv = GM_SETTINGS.target_start_volume * 100.0 / prismVolume;
                    let newVolume = volumeRatioInv * GM_SETTINGS.target_start_volume;
                    NOMO_DEBUG("prismVolume", prismVolume, "ratioInv", volumeRatioInv, "newVolume", newVolume);
                    that.video.volume = newVolume;
                },100);
            }
        }
    }
    onTimeupdate(e){
        let currentTime = e.target.currentTime;
        if(currentTime !== 0.0){
            this.lastTime = currentTime;
        }
    }
    setMaxQuality(){
        if(!GM_SETTINGS.naverVideoAutoMaxQuality) return;
        let that = this;
        this.$seComponent.arrive(".pzp-pc-ui-setting-quality-item", { onlyOnce: true, existing: true }, function (subElem) {
            if(that.isSetMaxQuality) return;
            let $subElem = $(subElem);
            let $ul = $subElem.closest("ul");
            let $qlis = $ul.find("li");
            //NOMO_DEBUG("$qlis", $qlis);

            if($qlis.length > 1){
                that.$seComponent.arrive(".pzp-pc-setting-intro-quality", { onlyOnce: true, existing: true}, function(liElem){
                    $qlis[1].click();
                    that.isSetMaxQuality = true;
                    that.$NCCL_pzp_qset = that.$seComponent.find(".NCCL_pzp_qset");

                    that.insertQsetDisplay();
                    let text = $(liElem).find(".pzp-pc-ui-setting-intro-panel__value").text();
                    that.$NCCL_pzp_qset.html(`<span class="NCCL_pzp_qset_tooltip">NCCL에 의해 최고 품질로 자동 설정됨</span>` + text + `<span> (최고 품질)<span>`);    // color:#03C75A;

                    // BANJJAK
                    setTimeout(function(){
                        that.$NCCL_pzp_qset.addClass("BANJJAK");
                    },200);
                    setTimeout(function(){
                        that.$NCCL_pzp_qset.removeClass("BANJJAK");
                        //that.$NCCL_pzp_qset.fadeOut(300);
                    },3000);

                    // new MutationObserver
                    let observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            NOMO_DEBUG(mutation);
                            that.$NCCL_pzp_qset = that.$seComponent.find(".NCCL_pzp_qset");
                            that.insertQsetDisplay();
                            that.$NCCL_pzp_qset.text(mutation.target.wholeText);

                            // fadeIn and fadeOut
                            setTimeout(function(){
                                that.$NCCL_pzp_qset.fadeIn(300);
                            },200);
                            setTimeout(function(){
                                if(that.firstPlayed){
                                    that.$NCCL_pzp_qset.fadeOut(300);
                                }
                            },3000);
                        });    
                    });
                    observer.observe(liElem, { attributes: false, childList: false, characterData: true, subtree: true });
                });
            }
        });
    }
    // flag 1 : max, 0 : normal
    insertQsetDisplay(){
        let that = this;
        if(this.$seComponent.find(".NCCL_pzp_qset").length == 0){
            this.$NCCL_pzp_qset = $(`<div class="NCCL_pzp_qset"></div>`);
            this.$seComponent.find(".pzp-pc__bottom-buttons-right").prepend(this.$NCCL_pzp_qset);
        }
    }

    createIframeContainer($oriElem){
        NOMO_DEBUG("VideoNaverPrism - createIframeContainer", this.id);
        let that = this;

        this.$seComponent = $oriElem;
        this.$seComponent.addClass("NCCL_prism_container");

        //NOMO_DEBUG(this.$seComponent.html());
        this.$seSectionVideo = $oriElem.find(".se-section-video").first();

        // se.component.js 의 _getIsVerticalVideo 에서 vertical 여부를 체크한다.
        // (세로 > 가로 이면 vertical video)
        let isVertical = this.originalHeight > this.originalWidth;
        NOMO_DEBUG("isVertical", isVertical, this.originalWidth, this.originalHeight);

        /////////////////////////////////////////////////////////////////////////////
        // shortsAutoResize
        //if(isVertical && GM_SETTINGS.shortsAutoResize){
        this.$seComponent.attr("NCCL_vertical",this.id); // add special attr to set style
        if(GM_SETTINGS.shortsAutoResize){
            const {newWidth, newHeight, newRatio, newPaddingTop} = this.getNewWidth();
            // add style
            GM_addStyle(`
                .se-viewer .se-video.se-video-vertical.NCCL_prism_container[NCCL_vertical='${this.id}'] .se-section-video {max-width:unset !important; margin:0 auto !important; box-shadow:0px 0px 1px 1px rgb(0 0 0 / 4%);}
                .se-viewer .se-video.se-video-vertical.NCCL_prism_container[NCCL_vertical='${this.id}'] .se-module-video {padding-top:${newPaddingTop}% !important}
                .se-viewer .se-video.se-video-vertical.NCCL_prism_container[NCCL_vertical='${this.id}'] .webplayer-internal-video{object-fit: contain !important;}
                .se-viewer .se-video.se-video-vertical.NCCL_prism_container[NCCL_vertical='${this.id}'] .pzp-poster{background-size: contain !important;}
                .se-viewer .se-video.se-video-vertical.NCCL_prism_container[NCCL_vertical='${this.id}'] video {background: radial-gradient(ellipse at center, rgb(0 0 0 / 0%) 0%,rgb(16 16 16) 70%,rgba(0,0,0,1) 100%);}
                `
            );
            // 세로로 표시되는 경우 550px 미만일 때만 화질 변경 메시지 숨기기
            if(newWidth < 550.0){
                GM_addStyle(`
                .NCCL_prism_container[NCCL_vertical='${this.id}'].se-video-vertical .NCCL_pzp_qset_tooltip,
                .NCCL_prism_container[NCCL_vertical='${this.id}'].se-video-vertical .NCCL_pzp_qset { display:none !important }
                `);
            }
        }
        else{
            // 세로로 표시되는 경우 화질 변경 메시지 숨기기
            GM_addStyle(`
            .NCCL_prism_container.se-video-vertical .NCCL_pzp_qset_tooltip,
            .NCCL_prism_container.se-video-vertical .NCCL_pzp_qset { display:none !important }
            `);
        }
        /////////////////////////////////////////////////////////////////////////////

        //else{
        // set videoWidth for normal case
        this.$seComponent.removeClass("se-component-content-normal").addClass("se-component-content-fit");
        let $seVideo = this.$seComponent.find(".se-section-video");
        $seVideo.css("maxWidth",`${GM_SETTINGS.videoWidth}vw`);
        //}

        // arrive video
        this.$seComponent.arrive("video", { existing: true }, function (subElem) {
            NOMO_DEBUG("arrive naver prism video, id = ", that.id);
            that.video = subElem;
            that.$video = $(subElem);

            that.videoFound = true;

            // play 버튼이 아니라 배경을 클릭해도 재생되도록 함
            that.$seComponent.on("click", ".prismplayer-area.pzp-pc--ended .pzp-ui-dimmed, .prismplayer-area.pzp-pc--beforeplay .pzp-ui-dimmed", function(){
                that.play();
            });

            // bind event
            that.video.addEventListener('play', (e) => {
                that.eventPlay(e);
            });
            that.video.addEventListener('pause', (e) => {
                that.eventPause(e);
            });
            that.video.addEventListener('ended', (e) => {
                that.eventEnded(e);
            });
            that.video.addEventListener('playing', (e) => {
                if(!that.firstPlayed){
                    that.onFirstPlay();
                    that.firstPlayed = true;
                }
            });
            that.video.addEventListener('loadeddata', (e) => {
                that.eventLoadeddata(e);
                that.videoReady = true;
            });
            that.video.addEventListener('timeupdate', (e) => {
                that.onTimeupdate(e);
            });
            
            // error 감지용
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    //NOMO_DEBUG("prismplayer-area", mutation);
                    if(mutation.attributeName !== "class") return;

                    let $mutationTarget = $(mutation.target);
                    if($mutationTarget.hasClass("pzp-pc--error")){
                        let errorText = that.$seComponent.find(".pzp-pc-ui-error-dialog__message").text();
                        NOMO_DEBUG("error!!", errorText);

                        if(errorText.indexOf("네트워크 오류") !== -1 || errorText.indexOf("브라우저에서 재생할 수 없는 영상") !== -1 ){
                            that.$seComponent.find(".pzp-pc-ui-error-dialog__help").remove();
                            that.$seComponent.find(".naver_player_reload").remove();

                            let $btnReload = $(`<div class="naver_player_reload naver_player_reload_error_btn">[${GLOBAL.scriptName} v${GLOBAL.version}]<br />네이버 플레이어를 다시 로드하려면 여기를 클릭하세요.</div>`)
                                .one("click", function(){
                                    if(that.tryToReload) return;
                                    that.$seComponent.find(".pzp-pc__error-dialog").addClass("reloaded");
                                    that.tryToReload = true;
                                    that.parseNewInkeyAndReloadPlayerPrism(that.lastTime);
                                });
                            that.$seComponent.find(".pzp-pc-ui-error-dialog__message").append($btnReload);
                        }
                    }
                });    
            });
            observer.observe(that.$seComponent.find(".prismplayer-area")[0], { attributes: true, childList: false, characterData: false, subtree: false });
        });

        // set quality
        this.setMaxQuality();

        // insert main container
        this.$container = $(`<div class="NCCL_container"></div>`).data("NCCL-type", this.typeName);

        // title and description
        this.$title = $(`<div class="NCCL_title"></div>`)
            .data("NCCL-type", this.typeName)
            .text((this.title ? this.title : (this.desc ? this.desc : "제목없음")));
        let url = (this.url || this.originalUrl);
        if(url){
            this.$desc = $(`<a class="NCCL_description" target="_blank">${this.logoSVG ? this.logoSVG : ""}</a>`)
                .data("NCCL-type", this.typeName)
                .attr("href", this.url);
            this.$link = $(`<div class="NCCL_link"></div>`)
                .data("NCCL-type", this.typeName)
                .text((this.url ? "("+this.url+")" : ""));
            this.$desc.append(this.$title).append(this.$link);
        }
        else{
            this.$desc = $(`<div class="NCCL_description">${this.logoSVG ? this.logoSVG : ""}</div>`)
                .data("NCCL-type", this.typeName);
            this.$desc.append(this.$title);
        }

        // hideDescription
        if(GM_SETTINGS.hideDescription){
            this.$desc.hide();
        }
        this.$container.append(this.$desc);

        // insert
        let $seModuleVideo = this.$seComponent.find(".se-module-video");
        if($seModuleVideo.length !== 0){
            $seModuleVideo.after(this.$container);
        }
        else{
            this.$seSectionVideo.append(this.$container);
        }
    }
    
    async parseNewInkeyAndReloadPlayerPrism(beginTime){
        // get new vid data
        const currUrl = document.location.href;
        const regexUrl = /^https:\/\/cafe.naver.com\/ca-fe\/cafes\/(\d+)\/articles\/(\d+)/;
        let matchedUrl = currUrl.match(regexUrl);
        
        NOMO_DEBUG(currUrl, matchedUrl);
        if(matchedUrl === null){
            NOMO_DEBUG("parseNewInkeyAndReloadPlayer match null");
            return;
        }
        let urlFetch = await fetch(`https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/${matchedUrl[1]}/articles/${matchedUrl[2]}?query=&boardType=L&useCafeId=true&requestFrom=A`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-cafe-product": "pc"
            },
            "referrer": currUrl,
            "referrerPolicy": "unsafe-url",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        NOMO_DEBUG("urlFetch", urlFetch);
        
        // fail
        if(urlFetch.status !== 200){
            NOMO_DEBUG("parseNewInkeyAndReloadPlayer - Fail to fetch", urlFetch);
            this.showReloadError();
            return;
        }
        
        var urlText = await urlFetch.json();
        NOMO_DEBUG("urlText", urlText);

        var vid_new = "";
        var inkey_new = "";
        var articleHtml = urlText.result.article.contentHtml;
        var $contentHtml = $(articleHtml);
        var $scripts = $contentHtml.find("script.__se_module_data");
        var found = false;
        for(var i=0;i<$scripts.length; i++){
            var $script = $($scripts[i]);
            let dataModule = JSON.parse($script.attr("data-module"));
            vid_new = dataModule.data.vid;

            if(this.id == vid_new){
                NOMO_DEBUG("FOUND new inkey", this.inkey, "->", dataModule.data.inkey);
                inkey_new = dataModule.data.inkey;
                found = true;
                break;
            }
        }

        // fail
        if(!found){
            NOMO_DEBUG("FAIL TO GET NEW VID AND INKEY FOR NAVER VIDEO");
            this.showReloadError();
            return false;
        }

        this.options_ori.id = vid_new;
        this.options_ori.inkey = inkey_new;
        this.options_ori.autoPlay = true;
        this.options_ori.start = beginTime;
        let vid = new VideoNaver(this.options_ori);
        vid.createIframeContainer(this.$seComponent);

        //this.createIframe();
        return true;

    }
    
    showReloadError(){
        this.showError(`[${GLOBAL.scriptName} v${GLOBAL.version}]<br />플레이어 리로드에 실패했습니다. 페이지를 직접 새로고침 해주세요.</a>`);
    }
}