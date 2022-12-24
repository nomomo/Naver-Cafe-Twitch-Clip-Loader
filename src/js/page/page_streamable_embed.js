import { PageBase } from "js/page/page_common.js";

export default function PAGE_STREAMABLE_EMBED(){
    NOMO_DEBUG("== PAGE_STREAMABLE_EMBED ==");

    let url = new URL(document.location.href);
    let urlParam = new URLSearchParams(url.search);

    let page = new PageStreamable({
        id:document.location.href.match(/^https?:\/\/streamable\.com\/(?:e\/)?([a-zA-Z0-9-_]+)/)[1],
        type:GLOBAL.STREAMABLE,
        seq:urlParam.get("seq"),
        url:document.location.href,
        muted:(urlParam.get("omuted") === "1" ? true : false)
    });
}

class PageStreamable extends PageBase{
    constructor(options){
        super(options);
    }

    onPlayerReady(){
        super.onPlayerReady();
        
        if(this.muted){
            this.video.volume = 0.0;
        }
        else if(GM_SETTINGS.set_volume_when_stream_starts){
            this.video.volume = GM_SETTINGS.target_start_volume;
        }

        //// hd=1 로 iframe 을 삽입하는 경우 자동으로 1080p 가 설정되므로 아래 코드가 필요 없다.
        // let $targetQuality = $(".player-settings-quality-option").first();
        // if(!$targetQuality.hasClass("checked")){
        //     NOMO_DEBUG("streamable Qset");
        //     $targetQuality.trigger("click");
        // }
        // else{
        //     NOMO_DEBUG("streamable Qset - already Qset");
        // }
    }


}