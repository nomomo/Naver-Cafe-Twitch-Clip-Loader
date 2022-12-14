import { NOMO_DEBUG } from "./lib";

window.GLOBAL = {};
export default function GLOBAL_INIT(){
    GLOBAL.version = (GM.info.script.version || GM_info.script.version);
    GLOBAL.isTopWindow = window.self === window.top;
    GLOBAL.initLocationUrl = document.location.href;
    GLOBAL.isNaverCafe = /(^https:\/\/cafe\.naver\.com\/)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isNaverCafeMain = (GLOBAL.isNaverCafe && !GLOBAL.isTopWindow);
    GLOBAL.isNaverCafeTop = (GLOBAL.isNaverCafe && GLOBAL.isTopWindow);
    GLOBAL.isNaverCafeMobile = /(^https:\/\/m\.cafe\.naver\.com\/)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isTwitchClip = /(^https:\/\/clips\.twitch\.tv\/)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isTwitchVod = /(^https:\/\/player\.twitch\.tv\/)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isSettingWindow = /(^https:\/\/cafe\.naver\.com\/NaverCafeTwitchClipLoaderSettings)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isTwitch = (GLOBAL.isTwitchClip || GLOBAL.isTwitchVod);
    GLOBAL.isNaverVideoEmbed = /(^https:\/\/serviceapi\.nmv\.naver\.com(\/ugc)?\/view\/ugcPlayer)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isParentNaverCafe = /(parent=(cafe|www)?\.?naver\.com)/.test(GLOBAL.initLocationUrl);
    GLOBAL.isTwitchMuted = (GLOBAL.isTwitch && document.location.href.indexOf("muted=true") !== -1);
    GLOBAL.isYoutubeEmbed = /^https:\/\/www\.youtube\.com\/embed\//.test(GLOBAL.initLocationUrl);
    GLOBAL.isCafeWritingMode = (/^https:\/\/cafe\.naver\.com\/ca-fe\/cafes\/\d+\/articles\/\d+\/modify/.test(GLOBAL.initLocationUrl) || /^https:\/\/cafe\.naver\.com\/ca-fe\/cafes\/\d+\/menus\/\d+\/articles\/write\?/.test(GLOBAL.initLocationUrl));
    GLOBAL.isStreamableEmbed = /^https?:\/\/streamable\.com\/e\//.test(GLOBAL.initLocationUrl);
    GLOBAL.isAftvEmbed = /^https?:\/\/vod\.afreecatv\.com\/player\//.test(GLOBAL.initLocationUrl);
}