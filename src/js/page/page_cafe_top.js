import { NOMO_DEBUG } from "../lib/lib.js";

// 설정 메뉴 추가 및 관리
function openSettingsMenu(){
    try{
        if(document === undefined){
            NOMO_DEBUG("Document is undefined from openSettingsMenu");
            return;
        }
        if(!/(^https:\/\/cafe\.naver\.com\/)/.test(document.location.href)){
            NOMO_DEBUG("no naver cafe: return from openSettingsMenu");
            return;
        }
        var GM_Setting_Bootstrap = 'GM_Setting_Bootstrap';
        $("#nomo_settings_container").remove();

        var $container = $( /*html*/ `
        <div id="nomo_settings_container" style="display:none;cursor:pointer;position:fixed;top:0;left:0;width:100%;height:100%;z-index:200000;background:rgba(0,0,0,0.93);">
            <div id="nomo_settings" style="cursor:default;font-size:12px;max-width:850px;max-height:calc(100% - 40px);margin:20px auto;background:#fff;padding:10px 20px;border-radius:5px;overflow-y:scroll;"></div>
        </div>`).appendTo("body");
        $container.on("click", function () {
            $("#GM_Setting_css_temp").remove();
            $("#GM_Setting_Bootstrap").remove();
            $(this).fadeOut(500, function () {
                $(this).remove();
            });
        });
        $container.find("#nomo_settings").on("click", function (e) {
            e.stopPropagation();
        });

        /*!
        * Bootstrap v3.1.1 (http://getbootstrap.com)
        * Copyright 2011-2014 Twitter, Inc.
        * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
        */
        if (!document.getElementById(GM_Setting_Bootstrap)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = GM_Setting_Bootstrap;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css';
            link.media = 'all';
            head.appendChild(link);
        }
        if ($("#GM_Setting_css_temp").length == 0){
            $("head").append(`
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
            <style id='GM_Setting_css_temp' rel='stylesheet' type='text/css'>ul, ol{margin:0; padding:0 !important;}
            #nomo_settings::-webkit-scrollbar { width: 8px; height: 8px; background: #eee; }
            #nomo_settings::-webkit-scrollbar-thumb { background: #ccc; }
            body{overflow-y:hidden;}
            body #GM_setting .GM_setting_list_head {vertical-align:bottom;}

            #GM_setting, #GM_setting .GM_setting_title, #GM_setting .GM_setting_desc, #GM_setting .GM_setting_logo, #GM_setting .GM_homepage_link
            {font-family: 'Inter',"맑은 고딕",Malgun Gothic,"돋움",dotum,sans-serif;}
            </style>`);
        }

        $("#nomo_settings_container").fadeIn(500);
        GM_setting.createlayout($("#nomo_settings"));
    }
    catch(e){
        NOMO_DEBUG("Error from openSettingsMenu function", e);
    }
}
    
export default function PAGE_CAFE_TOP(){
    initializeCafeTopMessage();

    if(typeof GM.registerMenuCommand === "function"){
        GM.registerMenuCommand("상세 설정 열기 (새 창)", function(){
            var ww = $(window).width(),
                wh = $(window).height();
            var wn = (ww > 930 ? 930 : ww/5*4);
            var left  = (ww/2)-(wn/2),
                top = (wh/2)-(wh/5*4/2);
            window.open("https://cafe.naver.com/NaverCafeClipLoaderSettings/","winname",
                "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width="+wn+",height="+wh/5*4+",top="+top+",left="+left);
        });
        GM.registerMenuCommand("상세 설정 열기 (현재 창)", openSettingsMenu);
    }
    
    // document ready
    $(document).ready(function(){
        //alwaysShowFavoriteBoard
        try{
            if(GM_SETTINGS.alwaysShowFavoriteBoard){
                let $favoriteMenuGroupBtn = $("#favoriteMenuGroupBtn");
                if($favoriteMenuGroupBtn.length !== 0 && $favoriteMenuGroupBtn.hasClass("down-btn")){
                    toggleFavoriteMenuGroup();
                }
            }
        }
        catch(e){
            NOMO_DEBUG("Error from alwaysShowFavoriteBoard", e);
        }

        // naverBoardDefaultArticleCount
        try{
            if(GM_SETTINGS.naverBoardDefaultArticleCount !== "0" && Number(GM_SETTINGS.naverBoardDefaultArticleCount) > 0){
                unsafeWindow.oriSearchFrmAfter = unsafeWindow.searchFrmAfter;
                unsafeWindow.searchFrmAfter = function(frm){
                    var oriSearchFrmAfterStr = unsafeWindow.oriSearchFrmAfter.toString();
                    var clubid = oriSearchFrmAfterStr.match(/clubid=(\d+)/);
                    if(clubid !== null && clubid.length >= 2){
                        NOMO_DEBUG("clubid", clubid);
                        $("#cafe_main").attr("src",`/ArticleSearchList.nhn?search.clubid=${clubid[1]}&search.searchBy=0&search.query=${URLEncoder.encode(frm.query.value,"MS949")}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                    }
                    else{
                        unsafeWindow.oriSearchFrmAfter(frm);
                    }
                };

                unsafeWindow.oriDrawFavoriteCafeMenuList = unsafeWindow.drawFavoriteCafeMenuList;
                unsafeWindow.drawFavoriteCafeMenuList = function(favoriteCafeMenuList){
                    unsafeWindow.oriDrawFavoriteCafeMenuList(favoriteCafeMenuList);
                    let $as = $("#cafe-menu #favoriteMenuGroup").find("a");
                    NOMO_DEBUG("$as", $as);
                    $as.each(function(i,v){
                        setTimeout(function(){
                            let $a = $(v);
                            let oriHref = $a.attr("href");
                            if(oriHref.indexOf("userDisplay") === -1){
                                $a.attr("href", `${oriHref}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                            }
                        }, 1);
                    });
                };

                let $as = $("#cafe-menu").find(".cafe-menu-list a[target='cafe_main']");
                $as.each(function(i,v){
                    setTimeout(function(){
                        let $a = $(v);
                        let oriHref = $a.attr("href");
                        if(oriHref.indexOf("userDisplay") === -1){
                            $a.attr("href", `${oriHref}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                        }
                    }, 1);
                });
            }
        }
        catch(e){
            NOMO_DEBUG("Error from naverBoardDefaultArticleCount", e);
        }
    });
}



//////////////////////////////////////////////////////////////////////////////////////////
// show system message
export function messageCafeTop(msg, $elem) {
    if (GLOBAL.isNaverCafeMain){
        window.parent.postMessage({'type': 'NCCL_Message', 'msg': msg }, "https://cafe.naver.com");
        return;
    }
    else if(!GLOBAL.isNaverCafeTop){
        return;
    }

    if ($elem === undefined) {
        return;
    }
    var prefix = "GM_setting_autosaved";
    $elem.find("." + prefix).animate({ bottom: "+=40px" }, { duration: 300, queue: false });
    $("<div class='" + prefix + " NCCL_NaverCafe_MessageBox'>" + msg + "</div>")
        .appendTo($elem)
        .fadeIn("fast")
        .animate({
            opacity: 1
        }, 11000, function () {
            $(this).fadeOut("fast").delay(600).remove();
        })
        .animate({ left: "+=30px" }, { duration: 300, queue: false });

    if(msg.indexOf("NCCL_Message_Count") !== -1){
        let NCCL_Message_Count = setInterval(function(){
            let oriCount = $(".NCCL_Message_Count").text();
            NOMO_DEBUG("oriCount", oriCount);
            oriCount = Number(oriCount);
            let newCount = oriCount - 1;
            if(oriCount == 0){
                clearInterval(NCCL_Message_Count);
            }
            else{
                NOMO_DEBUG("newCount", newCount);
                $(".NCCL_Message_Count").text(newCount);
            }
        },1000);
    }
}

function initializeCafeTopMessage(){
    if(!GLOBAL.isNaverCafeTop) return;

    // add postMessage listener
    window.addEventListener("message", function(event){
        if (event.origin !== "https://cafe.naver.com") return;
        let data;
        switch(event.data.type){
        case "NCCL_Message":
            data = event.data;
            messageCafeTop(data.msg, $("body"));
            break;
        case "NCCL_UpdateHistory":
            data = event.data;
            window.history.replaceState(null, null, data.url);
            break;
        default:
            break;
        }
    }, false);
}