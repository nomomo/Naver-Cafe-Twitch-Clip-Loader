import { NOMO_DEBUG } from "js/lib/lib.js";

export class PageBase {
    constructor(options) {
        let that = this;

        this.type = options.type;      
        this.typeName = options.typeName;
        this.id = options.id;
        this.seq = options.seq;
        this.url = options.url;
        this.origin = (options.origin ? options.origin : document.location.origin);

        this.autoPlay = options.autoPlay;
        this.muted = options.muted;

        this.firstPlayed = false;
        this.videoReady = false;
        this.videoFound = false;
        this.video = undefined;

        this.lastPostMessageDate = undefined;
        this.lastPostMessage = undefined;

        this.elemBtnPlay = undefined;
        this.elemBtnPause = undefined;
        this.elemBtnReplay = undefined;

        this.isExitFullscreenAfterEnd = false;  // 동영상 재생 완료 후 이미 전체화면 해제되었는지 여부

        // bind event;
        $(document).arrive("video", { existing: true }, function (elem) {
            that.video = elem;
            that.videoFound = true;

            that.video.addEventListener('play', (e) => {
                that.onPlay(e);
            });
            that.video.addEventListener('pause', (e) => {
                that.onPause(e);
            });
            that.video.addEventListener('ended', (e) => {
                that.onEnded(e);
            });
            that.video.addEventListener('playing', (e) => {
                if(!that.firstPlayed){
                    that.onFirstPlay();
                    that.firstPlayed = true;
                }
                that.onPlaying(e);
            });
            that.video.addEventListener('loadeddata', (e) => {
                that.onLoadeddata(e);
                that.videoReady = true;
            });
            that.video.addEventListener('timeupdate', (e) => {
                that.onTimeupdate(e);
            });

            that.onPlayerReady();
        });


        window.addEventListener("message", function(e){
            if(e.origin === "https://cafe.naver.com" && e.data.type === "NCCL"){
                NOMO_DEBUG("received postMessage (naver -> embed)", that.seq, that.id, e.data);
                if(e.data.seq === undefined || e.data.seq === "" || that.video === undefined) return;
                switch(e.data.event){
                default:
                    break;
                case "pause":
                    if(!that.video.paused){
                        NOMO_DEBUG("try to pause", that.id);
                        that.pause();
                    }
                    break;
                case "play":
                    if(that.video.paused){
                        NOMO_DEBUG("try to play", that.id);
                        that.play();
                    }
                    break;
                }
            }
        });
    }

    // video related function
    play(){
        if(this.video && this.video.paused){
            if(this.elemBtnPlay){
                $(this.elemBtnPlay).trigger("click");
            }
            else if(this.video.play && typeof this.video.play === "function"){
                this.video.play();
            }
        }
        
    }
    pause(){
        if(this.video && !this.video.paused){
            if(this.elemBtnPause){
                $(this.elemBtnPause).trigger("click");
            }
            else if(this.video.pause && typeof this.video.pause === "function"){
                this.video.pause();
            }
        }
    }

    onPlayerReady(){

    }

    onPlay(e){
        NOMO_DEBUG("Play - ", this.id);
        //if(GM_SETTINGS.autoPauseOtherClips) window.parent.postMessage({"type":"NCCL", "event":"play", "seq":this.seq}, "https://cafe.naver.com");
        if(GM_SETTINGS.autoPauseOtherClips) this.sendPostMessage({"type":"NCCL", "event":"play", "seq":this.seq});
    }
    onPause(e){
        NOMO_DEBUG("Pause - ", this.id);
        //if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCCL", "event":"pause", "clipId":this.id}, "https://cafe.naver.com");
    }
    onEnded(e){
        //if(GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCCL", "event":"ended", "seq":this.seq}, "https://cafe.naver.com");
        if(GM_SETTINGS.autoPlayNextClip) this.sendPostMessage({"type":"NCCL", "event":"ended", "seq":this.seq});

        // exitFullscreenAfterEnd
        if(!this.isExitFullscreenAfterEnd && GM_SETTINGS.exitFullscreenAfterEnd && document.fullscreenElement){
            this.isExitFullscreenAfterEnd = true;
            document.exitFullscreen();
        }
    }
    onPlaying(e){
        //
    }
    onLoadeddata(e){
        //
    }
    onTimeupdate(e){
        //
    }
    onFirstPlay(){
        //
    }
    
    sendPostMessage(obj){
        //// 너무 잦은 동일 postMessage 방지
        // let currentDate = Number(new Date());
        // let isSend = false;
        // if(this.lastPostMessageDate === undefined) {
        //     isSend = true;
        // }
        // else if(JSON.stringify(this.lastPostMessage) !== JSON.stringify(obj)){
        //     isSend = true;
        // }
        // else if(currentDate - this.lastPostMessageDate > 200){
        //     isSend = true;
        // }

        // NOMO_DEBUG("currentDate - this.lastPostMessageDate = ", currentDate - this.lastPostMessageDate);
        // if(isSend){
        //     this.lastPostMessageDate = currentDate;
        //     this.lastPostMessage = JSON.parse(JSON.stringify(obj));
        //     obj.date = currentDate;
        //     window.parent.postMessage(obj, "https://cafe.naver.com");
        // }
        NOMO_DEBUG("send postMessage (embed -> naver)", "id=", this.id, "seq=", this.seq, obj);
        window.parent.postMessage(obj, "https://cafe.naver.com");
    }
}