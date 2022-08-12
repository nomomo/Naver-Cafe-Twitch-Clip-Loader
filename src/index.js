import {DEBUG_INIT, NOMO_DEBUG} from "./js/lib";
import GLOBAL_INIT from "./js/global";
import GM_SETTINGS_INIT from "./js/settings";
import PAGE_SETTING from "./js/page/page_setting";
import {PAGE_CAFE_COMMON_INIT} from "./js/page/page_cafe_common";
import PAGE_CAFE_TOP from "./js/page/page_cafe_top";
import {PAGE_CAFE_MAIN, reCalculateIframeWidth} from "./js/page/page_cafe_main";
import PAGE_TWITCH_EMBED from "./js/page/page_twitch_embed";
import PAGE_NAVER_EMBED from "./js/page/page_naver_embed";
import PAGE_YOUTUBE_EMBED from "./js/page/page_youtube_embed";
import {applyTheaterMode} from "./js/theater";

(async () => {
    'use strict';

    GLOBAL_INIT();
    //console.log("GLOBAL", GLOBAL);

    if(GLOBAL.isTopWindow && GLOBAL.isTwitch) return;
    if(GLOBAL.isTopWindow && GLOBAL.isNaverVideoEmbed) return;
    if(!GLOBAL.isTopWindow && GLOBAL.isTwitch && !GLOBAL.isParentNaverCafe) return;

    console.log("[NCTCL]   Naver-Cafe-Twitch-Clip-Loader", document.location.href);
    
    await DEBUG_INIT();
    await GM_SETTINGS_INIT();
    
    // setting window
    if(GLOBAL.isSettingWindow){
        PAGE_SETTING();
        return;
    }

    // cafe 공통
    if(GLOBAL.isNaverCafe){
        PAGE_CAFE_COMMON_INIT();
    }

    // cafe top
    if(GLOBAL.isNaverCafeTop){
        PAGE_CAFE_TOP();
        return;
    }

    // cafe main
    else if(GLOBAL.isNaverCafeMain){
        PAGE_CAFE_MAIN();
        return;
    }

    // cafe mobile
    else if(GLOBAL.isNaverCafeMobile){
        $(document).arrive("div#postContent .content", { existing: true }, function (elem) {
            reCalculateIframeWidth($(elem).width());
            applyTheaterMode();
        });
        PAGE_CAFE_COMMON_INIT();
        PAGE_CAFE_MAIN();
        return;
    }

    // Embed Twitch Clip or VOD
    else if(GLOBAL.isTwitch){
        if(GM_SETTINGS.use){
            PAGE_TWITCH_EMBED(GLOBAL.isTwitchVod, GLOBAL.isTwitchMuted);
        }
        return;
    }

    // Embed Naver Video
    else if(GLOBAL.isNaverVideoEmbed){
        PAGE_NAVER_EMBED();
        return;
    }

    else if(GLOBAL.isYoutubeEmbed){
        if(GM_SETTINGS.useYoutube){
            PAGE_YOUTUBE_EMBED();
        }
        return;
    }

})();