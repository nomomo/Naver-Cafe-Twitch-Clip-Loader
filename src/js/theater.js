import {NOMO_DEBUG} from "js/lib/lib";

var isTheaterMode = false;
var $theaterModeBtn;

function CREATE_THEATER_MODE_BTN(){
    if(GM_SETTINGS.useTheaterMode){
        var src = '';
        var $frontImage = $("#front-cafe a img, [class^='Header_title_img__'] img").eq(0);
        if($frontImage.length !== 0){
            src = $frontImage.attr("src");
        }
        
        if(src !== ''){
            GM_addStyle(`
            html.theaterMode #front-cafe::before,
            html.theaterMode [class^="Header_title_img__"]::before {
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
                transform:scale(1.1);
            }

            html.theaterMode [class^="Header_title_img__"]
            {
                overflow:hidden;
            }
            html.theaterMode [class^="Header_title_img__"] a {
                text-align:center;
            }

            html.theaterMode #front-cafe img,
            html.theaterMode [class^="Header_title_img__"] img {
                position:relative;
                top:0;
                left:0;
                z-index:2;
                width:auto !important;
            }
            `);
        }

        var $gnbmenu = $("#gnb-menu");
        if($gnbmenu.length !== 0 && $("#theaterModeBtn").length === 0){
            $gnbmenu.prepend($theaterModeBtn);
            return;
        }
        
        $gnbmenu = $(".gnb_menu");
        if($gnbmenu.length !== 0 && $("#darkModeBtn").length === 0){
            setTimeout(function(){
                $gnbmenu.prepend($theaterModeBtn);
                $theaterModeBtn.addClass("gnb_item").css("margin-top", "0px");
            },1000);
        }
    }
}

export async function THEATER_INIT(){
    NOMO_DEBUG("THEATER_INIT");
    $theaterModeBtn = $(`<span title="[NCCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다." id="theaterModeBtn">영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
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
        if(GLOBAL.isCafeWritingMode || GLOBAL.isCafeManageMenu) {
            NOMO_DEBUG("CafeWritingMode or isCafeManageMenu - NO TheaterMode");
            return;
        }
            
        var theaterModeCSSText = "";


        if(GLOBAL.isNaverCafeMobile){
            isTheaterMode = false;
        }

        if(isTheaterMode){
            $("html").addClass("theaterMode");
            var cwPure = Number(GM_SETTINGS.useTheaterModeContentWidth) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;

            // 본문 정렬
            if(!GM_SETTINGS.theaterModeAlignCenter){
                theaterModeCSSText += `
                [class^="Layout_wrap__"], [class^="Layout_footer___"], #cafe-body, #content-area, #front-cafe, #front-img, .footer, html.theaterMode #special-menu {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 220px + 60px) !important}
                [class^="Layout_content__"], #cafe_main, .Article, .Article .article_wrap, #content-area #main-area ,html.theaterMode div.MemberProfile.layout_content, html.theaterMode #app .layout_content {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}
                `;
            }
            else{
                theaterModeCSSText += `
                [class^="Layout_wrap__"], [class^="Layout_footer___"], #cafe-body, #content-area, #front-cafe, #front-img, .footer, html.theaterMode #special-menu {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}
                [class^="Layout_content__"], #cafe_main, .Article, .Article .article_wrap, #content-area #main-area ,html.theaterMode div.MemberProfile.layout_content, html.theaterMode #app .layout_content {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}

                #group-area {position:absolute;top:0;left:-230px}
                /*#main-area {position:absolute;top:0;left:0;}*/
                .footer {display:none;}

                [class^="Layout_container__"] { margin-left:-230px }
                `;
            }
//html.theaterMode .CafeViewer .se-viewer .se-caption,
            theaterModeCSSElem = GM_addStyle(theaterModeCSSText+`
                #front-cafe, #front-img {overflow:hidden; object-fit:cover !important;}

                
                html.theaterMode .CafeViewer .se-viewer .se-component-content
                ,html.theaterMode .CafeViewer .se-viewer .se-component-content.se-component-content-fit
                {
                    max-width:${cwPure}px !important;
                    width:${cwPure}px !important;
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
            $("html").removeClass("theaterMode");
            nonTheaterModeCSSElem = GM_addStyle(theaterModeCSSText);
        }

        $theaterModeBtn
            .attr("title", `[NCCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.`)
            .html(`영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c">`);
    }
    catch(e){
        NOMO_DEBUG("Error from applyTheaterMode", e);
    }
}