import {THEATER_INIT} from "js/theater";
import {DARKMODE_INIT} from "js/dark";

// improvedRefresh
function improvedRefresh(){
    try{
        // cafe main
        if(window.self !== window.top){
            if(unsafeWindow.top.refreshChecked){
                NOMO_DEBUG("이미 refresh 여부가 체크되었다.");
                return;
            }

            // condition 0 : refresh 됨
            const parentWindowRefreshed = String(window.top.performance.getEntriesByType("navigation")[0].type) === "reload";
            NOMO_DEBUG("PARENT REFRESHED? = ", parentWindowRefreshed, "CURRENT URL = ", document.location.href);
            unsafeWindow.parent.refreshChecked = true;
            if(!parentWindowRefreshed){
                return;
            }

            // load saved json
            var savedLastCafeMainUrl = {url_top:undefined, url_main:undefined, date:-1};
            try{
                let savedLSLSCMU = localStorage.getItem('lastCafeMainUrl');
                if(savedLSLSCMU === null){
                    NOMO_DEBUG("savedLSLSCMU = null");
                    return;
                }
                savedLastCafeMainUrl = JSON.parse(savedLSLSCMU);
            }
            catch(e){
                NOMO_DEBUG("Error from improvedRefresh JSON.parse", e);
                return;
            }

            // condition 1 : top url 이 같음
            if(parent.location.href !== savedLastCafeMainUrl.url_top){
                NOMO_DEBUG("저장된 url 과 현재 url 이 같지 않다", parent.location.href, savedLastCafeMainUrl.url_top);
                return;
            }

            // condition 2 : main url 이 이전과 다름
            NOMO_DEBUG("savedLastCafeMainUrl", savedLastCafeMainUrl);
            if(document.location.href === savedLastCafeMainUrl.url_main){
                NOMO_DEBUG("저장된 url_main 과 현재 url_main 이 같다", savedLastCafeMainUrl.url_main);
                return;
            }

            // condition 3 : 예외 목록에 있지 않음
            var except = ["https://cafe.naver.com/MyCafeListGNBView.nhn"];
            for(var i=0;i<except.length;i++){
                if(document.location.href.indexOf(except[i]) !== -1){
                    NOMO_DEBUG("예외 목록에 포함된 URL", except[i], document.location.href);
                    return;
                }
            }

            // condition 4 : refresh 한 후 x초 이내
            let refreshDelay = Number(new Date()) - savedLastCafeMainUrl.date;
            if(refreshDelay < 3000.0){
                NOMO_DEBUG("LOAD SAVED IFRAME URL. CURRRENT URL = ", document.location.href, ", SAVED URL = ", savedLastCafeMainUrl.url_main, ", REFRESHDELAY = ", refreshDelay);
                document.location.href = savedLastCafeMainUrl.url_main;
            }
            else{
                NOMO_DEBUG("refresh delay 초과, REFRESHDELAY = ", refreshDelay);
            }
        }
        
        // top
        if(window.self === window.top){
            window.onbeforeunload = function() {
                let $cafeMain = $("#cafe_main");
                if($cafeMain.length !== 0){
                    var lastCafeMainUrl = $cafeMain[0].contentWindow.location.href;
                    localStorage.setItem('lastCafeMainUrl', JSON.stringify({
                        "url_top":document.location.href,
                        "url_main":lastCafeMainUrl,
                        "date":Number(new Date())
                    }));
                }
            };
        }
    }
    catch(e){
        NOMO_DEBUG("Error from improvedRefresh", e);
    }
}

export function PAGE_CAFE_COMMON_INIT(){
    if(GM_SETTINGS.improvedRefresh){
        improvedRefresh();
    }

    // theaterMode & theme
    try{
        THEATER_INIT();
        DARKMODE_INIT();

        // $("head").append(`
        // <link rel="dns-prefetch" href="https://apis.naver.com/">
        // <link rel="preconnect" href="https://apis.naver.com/">
        // <link rel="dns-prefetch" href="https://gfp.veta.naver.com/">
        // <link rel="preconnect" href="https://gfp.veta.naver.com/">
        // `);
    }
    catch(e){
        NOMO_DEBUG("Error from theaterMode", e);
    }

}