import {NOMO_DEBUG} from "js/lib";
import {reCalculateIframeWidth, contentWidth} from "js/page/page_cafe_main";

var isTheaterMode = false;
var $theaterModeBtn = $(`<span title="[NCTCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다." id="theaterModeBtn">영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
    .on("click", async () => {
        NOMO_DEBUG("isTheaterMode", isTheaterMode, " -> ", !isTheaterMode);
        isTheaterMode = !isTheaterMode;
        await GM.setValue("theaterMode", isTheaterMode);
        if (typeof GM.addValueChangeListener === "function"){
            applyTheaterMode();
        }
        else{
            location.reload();
        }
    });

function CREATE_THEATER_MODE_BTN(){
    if(GM_SETTINGS.useTheaterMode){
        var $gnbmenu = $("#gnb-menu");
        if($gnbmenu.length !== 0){
            $gnbmenu.prepend($theaterModeBtn);
        }

        var $frontImage = $("#front-cafe a img");
        if($frontImage.length !== 0){
            var src = $frontImage.attr("src");
            GM_addStyle(`
            html.theaterMode #front-cafe::before{
                content:'-';
                width:100%;
                height:100%;
                position:absolute;
                background-size: cover;
                top:0;
                left:0;
                background-image:url(${src});
                filter:blur(10px);
                z-index:1;
            }

            html.theaterMode #front-cafe img{
                position:relative;
                top:0;
                left:0;
                z-index:2;
            }
            `);
        }
    }
}

export async function THEATER_INIT(){
    NOMO_DEBUG("THEATER_INIT");
    isTheaterMode = await GM.getValue("theaterMode", false);
    if (typeof GM.addValueChangeListener === "function"){
        GM.addValueChangeListener("theaterMode", async function (val_name, old_value, new_value, remote) {
            if (remote) {
                NOMO_DEBUG("다른 창에서 설정 변경됨. val_name, old_value, new_value, location:", val_name, old_value, new_value, document.location.href);
                applyTheaterMode();
            }
        });
    }

    applyTheaterMode();
    $(document).ready(function(){
        if(GLOBAL.isNaverCafeTop){
            CREATE_THEATER_MODE_BTN();
        }
    });
}

var theaterModeCSSElem = undefined;
var nonTheaterModeCSSElem = undefined;
export async function applyTheaterMode(){
    try{
        isTheaterMode = await GM.getValue("theaterMode", false);
        if(theaterModeCSSElem !== undefined) $(theaterModeCSSElem).remove();
        if(nonTheaterModeCSSElem !== undefined) $(nonTheaterModeCSSElem).remove();
        if(GLOBAL.isCafeWritingMode) {
            NOMO_DEBUG("CafeWritingMode - NO TheaterMode");
            return;
        }
            
        var theaterModeCSSText = "";


        if(GLOBAL.isNaverCafeMobile){
            isTheaterMode = false;
        }

        var $article_container;
        if(isTheaterMode){
            $("html").addClass("theaterMode");
            reCalculateIframeWidth(Number(GM_SETTINGS.useTheaterModeContentWidth));
            //var cw = (Number(GM_SETTINGS.useTheaterModeContentWidth) + 60.0) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;
            var cwPure = Number(GM_SETTINGS.useTheaterModeContentWidth) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;
    
            // youtubeForceWidthHeight
            if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeForceWidthHeight){
                theaterModeCSSText += `
                .se-module-oembed {
                    box-sizing:border-box;
                    padding-top:unset !important;
                    width:${cwPure}px !important;
                    height:calc(${cwPure}px / 16.0 * 9.0) !important;
                }
                `;
            }

            // naverVideoForceWidthHeight
            if(GM_SETTINGS.naverVideoForceWidthHeight){
                theaterModeCSSText += `
                .se-section-video
                ,.se-component.se-video
                ,.se-component.se-video .se-component-content
                {
                    max-width:${cwPure}px !important;
                    /*max-height:calc(${cwPure}px / 16.0 * 9.0 + 130px) !important;*/
                    width:${cwPure}px !important;
                }
                `;
            }

            // Youtube clip
            theaterModeCSSText += `
            .youtubeClipFound iframe.NCTCL-iframe-container{
                width:${cwPure}px !important;
                height:calc(${cwPure}px / 16.0 * 9.0) !important;
            }
            `;

            theaterModeCSSElem = GM_addStyle(theaterModeCSSText+`
                #front-cafe, #front-img {overflow:hidden; object-fit:cover !important;}
                #cafe-body, #content-area, #front-cafe, #front-img, .footer {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 220px + 60px) !important}
                #cafe_main, .Article, .Article .article_wrap, #content-area #main-area {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}

                .twitchClipFound .se-oglink-thumbnail
                {
                    width:${cwPure}px !important;
                    height:calc(${cwPure}px / 16.0 * 9.0) !important;
                }

                .se-component-content.twitchClipFound
                {
                    max-width:${cwPure}px !important;
                    max-height:calc(${cwPure}px / 16.0 * 9.0 + 48px) !important;
                    width:${cwPure}px !important;
                }

                .CafeViewer .se-viewer .se-caption, .CafeViewer .se-viewer .se-component-content, .CafeViewer .se-viewer .se-component-content.se-component-content-fit{
                    max-width:${cwPure}px !important;
                    width:${cwPure}px !important;
                }


                .CafeViewer .se-viewer .se-section-oglink.twitchClipFound {
                    max-width:${cwPure}px !important;
                    max-height:calc(${cwPure}px / 16.0 * 9.0 + 48px) !important;
                }
                .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail,
                .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail-resource{
                    max-width:${cwPure}px !important;
                    max-height:calc(${cwPure}px / 16.0 * 9.0) !important;
                }
    
                #front-cafe {text-align:center}
                .ArticleFormBanner.bottom{margin-left:auto;margin-right:auto}
                #cafe-intro .gate-list.border-sub {
                    width:unset !important;
                    float:unset !important;
                    margin:0 auto;
                }
            `);
        }
        else{
            $article_container = $("div.article_container");
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }

            // youtubeForceWidthHeight
            if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeForceWidthHeight){
                theaterModeCSSText += `
                .se-module-oembed {
                    box-sizing:border-box;
                    padding-top:unset !important;
                    width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                    height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0) !important;
                }
                `;
            }

            // naverVideoForceWidthHeight
            if(GM_SETTINGS.naverVideoForceWidthHeight){
                theaterModeCSSText += `
                .se-section-video
                ,.se-component.se-video
                ,.se-component.se-video .se-component-content
                {
                    max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                    width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                    max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0 + 130px) !important;
                }
                `;
            }

            // Youtube clip
            theaterModeCSSText += `
            .youtubeClipFound iframe.NCTCL-iframe-container{
                width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0) !important;
            }
            `;

            $("html").removeClass("theaterMode");
            nonTheaterModeCSSElem = GM_addStyle(theaterModeCSSText + `
            
            .twitchClipFound .se-oglink-thumbnail
            {
                width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0) !important;
            }

            .CafeViewer .se-viewer .se-section-oglink.twitchClipFound .se-oglink-thumbnail-resource{
                object-fit:cover;
            }
            .CafeViewer .se-viewer .se-section-oglink.twitchClipFound {
                max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0 + 48px) !important;
            }
            .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail,
            .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail-resource{
                max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0) !important;
            }
            `);
        }

        $article_container = $("div.article_container");
        if($article_container.length !== 0) {
            reCalculateIframeWidth($article_container.width());
        }

        $theaterModeBtn
            .attr("title", `[NCTCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.`)
            .html(`영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c">`);
    }
    catch(e){
        NOMO_DEBUG("Error from applyTheaterMode", e);
    }
}