import { PageBase } from "js/page/page_common.js";
import { NOMO_DEBUG } from "../lib/lib.js";

export default function PAGE_CHZZK_EMBED(){
    NOMO_DEBUG("== PAGE_CHZZK_EMBED ==");

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);

    let muted = urlParam.get("muted") === "true";
    let autoPlay = urlParam.get("autoPlay") === "true";

    // set_volume_when_stream_starts
    try{
        if(GM_SETTINGS.set_volume_when_stream_starts){
            NOMO_DEBUG("set embed player volume!!");
            localStorage.setItem('embed-player-volume', `{"value":${GM_SETTINGS.target_start_volume}}`);
        }

        if(muted){
            localStorage.setItem('embed-player-volume-muted', 'true');
        }
        else if(GM_SETTINGS.set_volume_when_stream_starts){
            if(GM_SETTINGS.target_start_volume !== 0){
                localStorage.setItem('embed-player-volume-muted', 'false');
            }
        }
    }
    catch(e){
        NOMO_DEBUG("Error from set_volume_when_stream_starts");
    }

    
    let page = new PageChzzkEmbed({
        id:document.location.href.match(/^https:\/\/chzzk\.naver\.com\/embed\/(?:vod|clip)\/([a-zA-Z0-9-_]+)/)[1],
        type:GLOBAL.CHZZK_EMBED,
        seq:urlParam.get("seq"),
        url:document.location.href,
        muted:(muted ? true : false),
        autoPlay:(autoPlay ? true : false)
    });
}

class PageChzzkEmbed extends PageBase{
    constructor(options){
        super(options);

        this.elemBtnPlay = "button.pzp-pc-playback-switch";
        this.elemBtnPause = "button.pzp-pc-playback-switch";
        let that = this;

        //this.maxqset = false;

        // 배경 클릭하여 재생 & 리플레이
        GM_addStyle(`
            .pzp-dimmed { cursor: pointer; }
        `);
        $(document).on("click", ".pzp-dimmed", function(){
            NOMO_DEBUG("Clicked .pzp-dimmed");
            that.play();
        });
    }

    onPlayerReady(){
        let that = this;
        
        super.onPlayerReady();

        // 무식하게 autoPlay 구현
        if(this.autoPlay && this.video){
            setTimeout(function(){
                if(!that.firstPlayed){
                    that.play();
                }
            },200);
        }
    }

}