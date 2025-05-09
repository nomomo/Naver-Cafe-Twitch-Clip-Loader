import {DEBUG_INIT} from "./js/lib/lib";
import GLOBAL_INIT from "./js/global";
import GM_SETTINGS_INIT from "./js/settings";
import PAGE_SETTING from "./js/page/page_setting";
import {PAGE_CAFE_COMMON_INIT} from "./js/page/page_cafe_common";
import PAGE_CAFE_TOP from "./js/page/page_cafe_top";
import {PAGE_CAFE_MAIN} from "./js/page/page_cafe_main";
import PAGE_TWITCH_EMBED from "./js/page/page_twitch_embed";
import PAGE_NAVER_EMBED from "./js/page/page_naver_embed";
import PAGE_YOUTUBE_EMBED from "./js/page/page_youtube_embed";
import PAGE_SOOP_EMBED from "./js/page/page_soop_embed";
import PAGE_STREAMABLE_EMBED from "./js/page/page_streamable_embed";
// import PAGE_TWIP_EMBED from "./js/page/page_twip_embed";
import PAGE_CHZZK_EMBED from "./js/page/page_chzzk_embed";
import {applyTheaterMode} from "./js/theater";
import { PageBase } from "js/page/page_common.js";
import css_common from "css/common.css";

(async () => {
    'use strict';

    GLOBAL_INIT();
    //console.log("GLOBAL", GLOBAL);

    if(GLOBAL.isTopWindow && GLOBAL.isTwitch) return;
    if(GLOBAL.isTopWindow && GLOBAL.isNaverVideoEmbed) return;
    if(!GLOBAL.isTopWindow && GLOBAL.isTwitch && !GLOBAL.isParentNaverCafe) return;

    console.log("[NCCL]   Naver-Cafe-Clip-Loader", document.location.href);
    
    await DEBUG_INIT();
    await GM_SETTINGS_INIT();
    GM_addStyle(css_common.toString());
    
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

    // Embed SOOP
    else if (GLOBAL.isSoopEmbed){
        if(GM_SETTINGS.useAftv){
            PAGE_SOOP_EMBED();
        }
    }

    // else if (GLOBAL.isTwipEmbed){
    //     if(GM_SETTINGS.useTwip){
    //         PAGE_TWIP_EMBED();
    //     }
    // }

    else if (GLOBAL.isChzzkEmbed){
        if(GM_SETTINGS.useChzzk){
            PAGE_CHZZK_EMBED();
        }
    }

})();