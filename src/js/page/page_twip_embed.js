import { PageBase } from "js/page/page_common.js";
import { NOMO_DEBUG } from "../lib/lib.js";

export default function PAGE_TWIP_EMBED(){
    NOMO_DEBUG("== PAGE_TWIP_EMBED ==");

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);

    let muted = urlParam.get("muted") === "true";

    GM_addStyle(`
    #__next > div {overflow-y:hidden;}
    `);
    
    try{
        let oriPlyr = localStorage.getItem('plyr');
        if(!oriPlyr){
            oriPlyr = {};
        }
        else{
            oriPlyr = JSON.parse(oriPlyr);
        }

        // twipAutoMaxQuality
        if(GM_SETTINGS.twipAutoMaxQuality){
            oriPlyr.quality = 1080;
        }

        // set_volume_when_stream_starts
        if(muted || (GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume === 0.0)){
            oriPlyr.muted = true;
        }
        else {
            oriPlyr.muted = false;
            if(GM_SETTINGS.set_volume_when_stream_starts){
                oriPlyr.volume = GM_SETTINGS.target_start_volume;
            }
            else{
                //
            }
        }

        localStorage.setItem('plyr', JSON.stringify(oriPlyr));
    }
    catch(e){
        NOMO_DEBUG("Error from twipAutoMaxQuality", e);
    }

    let page = new PageTwip({
        id:document.location.href.match(/^https?:\/\/vod.twip.kr\/(?:vod|clip)\/([a-zA-Z0-9-_]+)\/embed/)[1],
        type:GLOBAL.STREAMABLE,
        seq:urlParam.get("seq"),
        url:document.location.href,
        muted:(muted ? true : false)
    });

}

class PageTwip extends PageBase{
    constructor(options){
        super(options);

        this.maxqset = false;
    }

    onPlayerReady(){
        let that = this;
        
        super.onPlayerReady();
        
        if(this.muted){
            this.video.volume = 0.0;
        }
        else if(GM_SETTINGS.set_volume_when_stream_starts){
            this.video.volume = GM_SETTINGS.target_start_volume;
        }
    }

}