import {DEBUG_INIT} from "./js/lib";
import GLOBAL_INIT from "./js/global";
import GM_SETTINGS_INIT from "./js/settings";
import PAGE_SETTING from "./js/page/page_setting";
import {PAGE_CAFE_COMMON_INIT} from "./js/page/page_cafe_common";
import PAGE_CAFE_TOP from "./js/page/page_cafe_top";
import {PAGE_CAFE_MAIN} from "./js/page/page_cafe_main";
import PAGE_TWITCH_EMBED from "./js/page/page_twitch_embed";
import PAGE_NAVER_EMBED from "./js/page/page_naver_embed";
import PAGE_YOUTUBE_EMBED from "./js/page/page_youtube_embed";
import PAGE_AFTV_EMBED from "./js/page/page_aftv_embed";
import PAGE_STREAMABLE_EMBED from "./js/page/page_streamable_embed";
import {applyTheaterMode} from "./js/theater";
import { PageBase } from "js/page/page_common.js";

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
            applyTheaterMode();
        });
        PAGE_CAFE_COMMON_INIT();
        PAGE_CAFE_MAIN();
        return;
    }

    // Embed Twitch Clip or VOD
    else if(GLOBAL.isTwitch){
        if(GM_SETTINGS.useTwitch){
            PAGE_TWITCH_EMBED();
        }
        return;
    }

    // Embed Naver Video
    else if(GLOBAL.isNaverVideoEmbed){
        PAGE_NAVER_EMBED();
        return;
    }

    // Embed Youtube
    else if(GLOBAL.isYoutubeEmbed){
        if(GM_SETTINGS.useYoutube){
            PAGE_YOUTUBE_EMBED();
        }
        return;
    }

    // Embed Streamable
    else if (GLOBAL.isStreamableEmbed){
        if(GM_SETTINGS.useStreamable){
            PAGE_STREAMABLE_EMBED();
        }
    }

    // Embed AFTV
    else if (GLOBAL.isAftvEmbed){
        if(GM_SETTINGS.useAftv){
            PAGE_AFTV_EMBED();
        }
    }

    else if (GLOBAL.isClippyEmbed){
        let pageBase = new PageBase({
            id:document.location.href.match(/^https?:\/\/clippy\.kr\/clip\/([a-zA-Z0-9-_]+)/)[1],
            url:document.location.href
        });
    }

})();