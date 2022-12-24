import {DEBUG, NOMO_DEBUG, escapeHtml} from "js/lib";

export class VideoBase {
    static nvideos = 0;
    static videos = [];
    static videosSequence = [];

    constructor(options) {
        this.type = options.type;
        this.typeName = options.typeName;
        this.id = options.id;
        this.originalUrl = options.originalUrl;
        this.url = options.url;
        this.iframeUrl = options.iframeUrl;
        this.title = options.title;
        this.desc = options.desc;
        this.view = options.vide;
        this.logoSVG = options.logoSVG;
        this.origin = options.origin;
        this.isEmbed = options.isEmbed;
        this.thumbnailUrl = options.thumbnailUrl;
        this.video = options.video;
        this.originalWidth = options.originalWidth;
        this.originalHeight = options.originalHeight;
        this.isSetMaxQuality = false;
        this.lazyLoad = true;
        this.postMessageUrl = (options.iframeUrl ? "https://"+this.iframeUrl.split("/")[2] : undefined);

        // parse data
        this.parseDataRequired = (options.parseDataRequired ? options.parseDataRequired : false);
        this.isDataLoading = false;
        this.isDataLoaded = false;
        this.isDataSucceed = false;
        this.parseDataCallbackQueue = [];

        // player option
        this.autoPlay = (options.autoPlay ? options.autoPlay : false);
        this.muted = (options.muted ? options.muted : false);

        // player state
        this.blockThumbnailClickEvent = false;  // Thumbnail 처음 클릭되면 true
        this.firstPlayed = false;               // 첫 재생 되면 true

        // player element (cafe main)
        this.$iframeContainer = undefined;
        this.$iframe = undefined;
        this.iframeLoaded = false;

        this.$thumbnailContainer = undefined;
        this.$thumbnail = undefined;

        this.$loop = undefined;
        this.$error = undefined;

        // player element (embed page)
        this.$btnPlay = undefined;
        this.$btnPause = undefined;
        this.$btnReplay = undefined;

        this.seq = VideoBase.nvideos;
        VideoBase.nvideos += 1;
        VideoBase.videos.push(this);

        // set seq for VideoBase
        if(this.iframeUrl && this.iframeUrl.indexOf("seq=undefined") !== -1){
            this.iframeUrl = this.iframeUrl.replace("seq=undefined",`seq=${this.seq}`);
        }
        
        // lazyLoad off condition
        if(this.seq === 0 && GM_SETTINGS.autoPlayNextClip){
            this.lazyLoad = false;
        }
    }

    static init(){
        NOMO_DEBUG(document.location.href, "VideoBase - init");
        VideoBase.updateVideoSize();

        window.addEventListener("message", function(e){
            if(e.data.type === "NCTCL"){
                NOMO_DEBUG("received postMessage (embed -> naver)", e.data);
                NOMO_DEBUG("VideoBase.videos", VideoBase.videos);
                if(e.data.seq === undefined || e.data.seq === "") return;
                switch(e.data.event){
                default:
                    break;
                case "play":
                    VideoBase.videos[e.data.seq].autoPlayPauseOthers("play");
                    break;
                case "ended":
                    VideoBase.videos[e.data.seq].autoPlayPauseOthers("ended");
                    break;
                }
            }
        });
    }

    // call this function only once
    static updateVideoSize(){
        NOMO_DEBUG("VideoBase - updateVideoSize");
        var videoWidth = String(Math.max(GM_SETTINGS.videoWidth, 1.0));
        GM_addStyle(`
            .NCTCL_iframe_container {
                width:${videoWidth}%;
                aspect-ratio:calc(16 / 9);
            }
        `);
    }
    
    static stopAll(){
        Object.values(this.videos).forEach(video => {
            video.pause();
        });
    }

    static arriveVideo(){

    }

    setVolumeStart(){

    }


    // video related function
    play(){
        NOMO_DEBUG("VideoBase - play", this.id);
        if(!this.$iframe || !this.iframeLoaded) return;
        this.autoPlayPauseOthers("play");
        let newData = {"type":"NCTCL", "event":"play", "seq":this.seq};
        this.$iframe.get(0).contentWindow.postMessage(newData, this.postMessageUrl);
    }
    pause(){
        NOMO_DEBUG("VideoBase - pause", this.id);
        if(!this.$iframe || !this.iframeLoaded) return;
        let newData = {"type":"NCTCL", "event":"pause", "seq":this.seq};
        this.$iframe.get(0).contentWindow.postMessage(newData, this.postMessageUrl);
    }
    stop(){
        NOMO_DEBUG("VideoBase - stop", this.id);
        if(!this.$iframe || !this.iframeLoaded) return;
        let newData = {"type":"NCTCL", "event":"pause", "seq":this.seq};
        this.$iframe.get(0).contentWindow.postMessage(newData, this.postMessageUrl);
    }


    // video related event
    eventPlay(){

    }
    eventPause(){

    }
    eventEnded(){

    }
    eventPlaying(){

    }
    eventWaiting(){

    }
    eventLoadedData(){

    }
    setMaxQuality(){

    }

    checkParseData(callback){
        if(!this.parseDataRequired) return;

        // 현재 데이터 로딩 중인 경우
        if(this.isDataLoading){
            NOMO_DEBUG("Now clip data loading, insert queue");
            if(!callback && typeof callback === "function"){
                this.parseDataCallbackQueue.push(callback);
            }
            return;
        }
        // 데이터가 아직 로드되지 않은 경우
        else if(!this.isDataLoaded){
            NOMO_DEBUG("No clip data loaded, insert queue and load clip data");
            this.parseDataCallbackQueue.push(callback);
            this.parseData();
        }
        // 데이터가 이미 로드된 경우
        else if(this.isDataSucceed){
            if(!callback && typeof callback === "function"){
                this.parseDataCallbackQueue.push(callback);
                this.postParseData();
                //callback();
            }
        }
        else{
            // 알 수 없는 에러
            NOMO_DEBUG("VideoYoutube insertIframe 에서 clip data 관련 알 수 없는 에러", this);
            return;
        }
    }
    async parseData(){
        // do something
    }
    postParseData(){
        this.$thumbnailContainer.addClass("playbtn");
        this.hideLoader();

        while(this.parseDataCallbackQueue.length > 0){
            NOMO_DEBUG("parseDataCallbackQueue", this.parseDataCallbackQueue.length, this);
            this.parseDataCallbackQueue[0].call(this);
            this.parseDataCallbackQueue.shift(0);
        }
    }

    thumbnailLoaded(){

    }

    createIframeContainer($oriElem){
        NOMO_DEBUG("VideoBase - createIframeContainer", this.id);
        let that = this;

        // insert main container
        this.$container = $(`<div class="NCTCL_container" data-NCTCL-type=${this.typeName}></div>`);
        this.$iframeContainer = $(`<div class="NCTCL_iframe_container" data-NCTCL-type=${this.typeName}></div>`);

        // insert thumbnail container
        this.$thumbnailContainer = $(`<div class="NCTCL_thumbnail_container" data-NCTCL-type=${this.typeName}></div>`);
        if(GM_SETTINGS.convertMethod !== "autoLoad" && this.thumbnailUrl){
            this.$thumbnail = $(`<img loading="lazy" class="NCTCL_thumbnail" src="${this.thumbnailUrl}" data-NCTCL-type=${this.typeName} />`)
                .on("load", function(e){that.thumbnailLoaded(e);});
            this.$thumbnailContainer.append(this.$thumbnail);
        }
        this.$iframeContainer.append(this.$thumbnailContainer);

        // loader
        this.$loader = $(`<div class="NCTCL_loader_container" style="display:none;">
        <div class="NCTCL_loader"></div>
        <div class="NCTCL_loader_desc_container"><div class="NCTCL_loader_desc">Loading...</div></div>
        </div>`);
        this.$thumbnailContainer.append(this.$loader);
        if(this.parseDataRequired){
            this.$loader.fadeIn(100);
        }
        else{
            this.$thumbnailContainer.addClass("playbtn");
        }

        // title and description
        this.$title = $(`<div class="NCTCL_title" data-NCTCL-type=${this.typeName}>${this.title ? this.title : (this.desc ? this.desc : "제목없음")}</div>`);
        let url = (this.url || this.originalUrl);
        if(url){
            this.$desc = $(`
            <a href="${this.url}" class="NCTCL_description" target="_blank" data-NCTCL-type=${this.typeName}>
                ${this.logoSVG ? this.logoSVG : ""}
            </a>
            `);
            this.$link = $(`<div class="NCTCL_link" data-NCTCL-type=${this.typeName}>${this.url ? "("+this.url+")" : ""}</div>`);
            this.$desc.append(this.$title).append(this.$link);
        }
        else{
            this.$desc = $(`
            <div class="NCTCL_description">
                ${this.logoSVG ? this.logoSVG : ""}
            </div>
            `);
            this.$desc.append(this.$title);
        }

        // hideDescription
        if(GM_SETTINGS.hideDescription){
            this.$desc.hide();
        }

        this.$container.append(this.$iframeContainer).append(this.$desc);
        
        // insert
        $oriElem.after(this.$container);

        // remove original element
        $oriElem.remove();

        // parse data if required
        if(this.parseDataRequired){
            const rootMarginHeight = Math.max(1080, window.screen.height) * 0.5;
            const options = { root: null, threshold:[0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
            const io = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0.0) {
                        that.lazyLoad = false;
                        that.checkParseData(that.insertIframe);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);
            io.observe(that.$container[0]);
        }
        else{
            that.insertIframe();
        }

        // removeOriginalLinks
        if(!GLOBAL.isNaverCafeMain) return;
        if(!GM_SETTINGS.removeOriginalLinks) return;
        let $as = $("a.se-link");
        $as.each(function(i, v){
            var $a = $(v);
            var href = $a.attr("href");
            if(href !== that.originalUrl){
                return true;
            }

            var $p = $a.closest("p");
            if($p.text() === that.originalUrl){
                $p.remove();
            }
            else{
                $a.remove();
            }
        });
    }

    // insert iframe to iframeContainer
    insertIframe(){
        let that = this;

        if(GM_SETTINGS.convertMethod === "autoLoad"){
            if(this.lazyLoad){
                this.createIframeLazy();
            }
            else{
                this.preCreateIframe();
                this.createIframe();
                this.postCreateIframe();
            }
        }
        else{
            this.$thumbnailContainer.on("click", function(){
                if(that.blockThumbnailClickEvent) return;
                that.blockThumbnailClickEvent = true;
                
                that.preCreateIframe();
                that.createIframe();
                that.postCreateIframe();
            });
        }
    }

    createIframeLazy(){
        let that = this;
        const rootMarginHeight = Math.max(1080, window.screen.height) * 0.5;
        const options = { root: null, threshold:[0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.0) {
                    NOMO_DEBUG("LAZYLOAD", that, entry);
                    //that.autoPlay = false;
                    that.preCreateIframe();
                    that.createIframe();
                    that.postCreateIframe();
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        io.observe(that.$container[0]);
    }

    createIframe(){
        //NOMO_DEBUG("VideoBase - createIframe");
        let that = this;
        this.iframeLoaded = false;
        this.$iframe = $(`<iframe class="NCTCL_iframe" data-NCTCL-type="${this.typeName}" data-NCTCL-id="${this.id}" src="${this.iframeUrl}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);
        this.$iframe.on("load", function(){
            that.iframeLoaded = true;
        });
        this.$iframeContainer.empty().append(this.$iframe);
    }

    preCreateIframe(){
        //NOMO_DEBUG("VideoBase - preCreateIframe");

        // hide thumbnail
        if(this.$thumbnailContainer) this.$thumbnailContainer.hide();
    }

    postCreateIframe(){
        //NOMO_DEBUG("VideoBase - postCreateIframe");

        // hide loader and error
        this.hideLoader();
        this.hideError();

        // update postMessageUrl
        this.postMessageUrl = "https://"+this.iframeUrl.split("/")[2];
    }

    autoPlayPauseOthers(eventType){
        if(!GM_SETTINGS.autoPauseOtherClips && !GM_SETTINGS.autoPlayNextClip) return;
        
        NOMO_DEBUG("autoPlayPauseOthers", eventType, "id=", this.id, "seq=", this.seq);
        let endedNextFound = false;
        for(let i=0; i<VideoBase.videos.length; i++){
            let seq = VideoBase.videos[i].seq;
            if(eventType === "play"){
                if(!GM_SETTINGS.autoPauseOtherClips) return false;
                if(this.seq === seq) continue;
                
                //NOMO_DEBUG("autoPlayPauseOthers pause - ", i);
                VideoBase.videos[i].pause();
            }
            else if (eventType === "ended"){
                if(!GM_SETTINGS.autoPlayNextClip) return false;
                if(endedNextFound){
                    VideoBase.videos[i].play();
                    break;
                }
    
                if(this.seq === seq){
                    endedNextFound = true;
                    continue;
                }
            }
        }
    }

    playEvent(){
        this.firstPlayed = true;
    }

    updateThumbnail(url){
        this.thumbnailUrl = url;
        if(this.$thumbnail){
            NOMO_DEBUG("update thumbnail url");
            this.$thumbnail.attr("src", this.thumbnailUrl);
        }
        else if(!this.$iframe){
            NOMO_DEBUG("create $thumbnail");
            this.$thumbnail = $(`<img class="NCTCL_thumbnail" src="${this.thumbnailUrl}" data-NCTCL-type=${this.typeName} />`);
            this.$thumbnailContainer.empty().append(this.$thumbnail);
        }
    }

    // loader
    showLoader(){
        if(this.$loader){
            this.$loader.fadeIn(100);
        }        
    }
    hideLoader(){
        if(this.$loader){
            this.$loader.fadeOut(100);
        }
    }

    // error
    showError(html){
        this.hideLoader();
        if(this.$error){
            this.$error.remove();
        }
        this.$error = $(`<div class="NCTCL_error_container"><div class="NCTCL_error">${html}</div></div>`);
        this.$iframeContainer.append(this.$error);
    }
    hideError(){
        if(this.$error){
            this.$error.fadeOut(100);
        }
    }
    showParsingError(){
        this.showError(`[${GLOBAL.scriptName} v${GLOBAL.version}]<br />데이터 가져오기에 실패했습니다. 링크에 직접 접속해주세요.<br /><a href="${this.originalUrl}" target="_blank">${this.originalUrl}</a>`);
        this.$thumbnailContainer.css("cursor","default");
    }

}