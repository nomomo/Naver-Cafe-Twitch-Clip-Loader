import {DEBUG, NOMO_DEBUG, escapeHtml, NOMO_ERROR} from "js/lib/lib";

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
        this.originalWidth = (options.originalWidth ? Number(options.originalWidth) : undefined);
        this.originalHeight = (options.originalHeight ? Number(options.originalHeight) : undefined);
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

        // LazyLoad observe
        this.createIframeLazyObserve = false;
        this.parseDataObserve = false;

        // player element (cafe main)
        this.$iframeContainer = undefined;
        this.$iframe = undefined;
        this.iframeLoaded = false;

        this.$thumbnailContainer = undefined;
        this.$thumbnail = undefined;
        this.$logoSVG = undefined;

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
            if(e.data.type === "NCCL"){
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
            .NCCL_iframe_container {
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
        let newData = {"type":"NCCL", "event":"play", "seq":this.seq};
        this.$iframe.get(0).contentWindow.postMessage(newData, this.postMessageUrl);
    }
    pause(){
        NOMO_DEBUG("VideoBase - pause", this.id);
        if(!this.$iframe || !this.iframeLoaded) return;
        let newData = {"type":"NCCL", "event":"pause", "seq":this.seq};
        this.$iframe.get(0).contentWindow.postMessage(newData, this.postMessageUrl);
    }
    stop(){
        NOMO_DEBUG("VideoBase - stop", this.id);
        if(!this.$iframe || !this.iframeLoaded) return;
        let newData = {"type":"NCCL", "event":"pause", "seq":this.seq};
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
        this.$container = $(`<div class="NCCL_container"></div>`).data("NCCL-type", this.typeName);
        this.$iframeContainer = $(`<div class="NCCL_iframe_container"></div>`).data("NCCL-type", this.typeName);

        // insert thumbnail container
        this.$thumbnailContainer = $(`<div class="NCCL_thumbnail_container"></div>`).data("NCCL-type", this.typeName);
        let imgLazy = (this.seq == 0 ? "eager" : "lazy");
        if(GM_SETTINGS.convertMethod !== "autoLoad" && this.thumbnailUrl){
            this.$thumbnail = $(`<img class="NCCL_thumbnail" />`)
                .attr("loading", imgLazy)
                .attr("src", this.thumbnailUrl)
                .data("NCCL-type", this.typeName)
                .on("load", function(e){that.thumbnailLoaded(e);});
            this.$thumbnailContainer.append(this.$thumbnail);
        }
        this.$iframeContainer.append(this.$thumbnailContainer);

        // loader
        this.$loader = $(`<div class="NCCL_loader_container" style="display:none;">
        <div class="NCCL_loader"></div>
        <div class="NCCL_loader_desc_container"><div class="NCCL_loader_desc">Loading…<div class="NCCL_loader_version">NCCL v${GLOBAL.version}</div></div></div>
        </div>`);
        this.$thumbnailContainer.append(this.$loader);
        if(this.parseDataRequired){
            this.$loader.fadeIn(100);
        }
        else{
            this.$thumbnailContainer.addClass("playbtn");
        }

        // title and description
        this.$title = $(`<div class="NCCL_title"></div>`)
            .data("NCCL-type", this.typeName)
            .text((this.title ? this.title : (this.desc ? this.desc : "제목없음")));
        let url = (this.url || this.originalUrl);
        this.$logoSVG = (this.logoSVG ? $(`${this.logoSVG})`) : $("<span style='display:none;'></span>"));
        if(url){
            this.$desc = $(`<a class="NCCL_description" target="_blank"></a>`)
                .data("NCCL-type", this.typeName)
                .attr("href", this.url);
            this.$link = $(`<div class="NCCL_link"></div>`)
                .data("NCCL-type", this.typeName)
                .text((this.url ? "("+this.url+")" : ""));
            this.$desc.append(this.$logoSVG).append(this.$title).append(this.$link);
        }
        else{
            this.$desc = $(`<div class="NCCL_description"></div>`)
                .data("NCCL-type", this.typeName);
            this.$desc.append(this.$logoSVG).append(this.$title);
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
            this.parseDataObserve = true;
            const rootMarginHeight = Math.max(1080, window.screen.height) * 1.5;
            const options = { root: null, threshold:[0, 0.2, 0.4, 0.6, 0.8, 1.0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
            const io = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0.0) {
                        observer.unobserve(entry.target);
                        if(!that.parseDataObserve) return;
                        that.parseDataObserve = false;
                        that.lazyLoad = false;
                        that.checkParseData(that.insertIframe);
                    }
                });
            }, options);
            io.observe(this.$container[0]);
        }
        else{
            this.insertIframe();
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
        this.createIframeLazyObserve = true;
        const rootMarginHeight = Math.max(1080, window.screen.height) * 1.5;
        const options = { root: null, threshold:[0, 0.2, 0.4, 0.6, 0.8, 1.0], rootMargin: `${rootMarginHeight}px 10px ${rootMarginHeight}px 10px`};
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.0) {
                    observer.unobserve(entry.target);
                    NOMO_DEBUG("createIframeLazy LAZYLOAD", that, entry);
                    if(!that.createIframeLazyObserve) return;
                    that.createIframeLazyObserve = false;
                    //that.autoPlay = false;
                    that.preCreateIframe();
                    that.createIframe();
                    that.postCreateIframe();
                }
            });
        }, options);
        io.observe(this.$container[0]);
    }

    createIframe(){
        //NOMO_DEBUG("VideoBase - createIframe");
        let that = this;
        this.iframeLoaded = false;
        this.$iframe = $(`<iframe class="NCCL_iframe" frameborder="0" allowfullscreen="true" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" scrolling="no"></iframe>`)
            .data("NCCL-id", this.id)
            .data("NCCL-type", this.typeName)
            .attr("src", this.iframeUrl);
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
            if(!VideoBase.videos[i]) continue;

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
        if(!url){
            NOMO_ERROR("updateThumbnail - no thumbnail url", url);
            return;
        }
        this.thumbnailUrl = url;
        if(this.$thumbnail){
            NOMO_DEBUG("update thumbnail url", this.id, this.seq, url);
            this.$thumbnail.attr("src", this.thumbnailUrl);
        }
        else if(!this.$iframe){
            NOMO_DEBUG("create $thumbnail");
            this.$thumbnail = $(`<img class="NCCL_thumbnail" />`)
                .data("NCCL-type", this.typeName)
                .attr("src", this.thumbnailUrl);
            this.$thumbnailContainer.empty().append(this.$thumbnail);
        }
    }
    updateTitle(text){
        if(!this.$title) return;
        NOMO_DEBUG("update title", this.id, this.seq, text);
        this.$title.text(text);
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
        this.$error = $(`<div class="NCCL_error_container"><div class="NCCL_error">${html}</div></div>`);
        if(this.$iframeContainer){
            this.$iframeContainer.append(this.$error);
        }
        else if(this.$seComponent){
            this.$seComponent.append(this.$error);
        }
    }
    hideError(){
        if(this.$error){
            this.$error.fadeOut(100);
        }
    }
    showParsingError(type, msg){
        let errormsg = "";
        if(type === undefined) type = 0;
        switch(type){
        default:
            errormsg = msg;
            break;
        case 0:
            errormsg = "데이터 가져오기에 실패했습니다. 링크에 직접 접속해주세요.";
            break;
        case 1:
            errormsg = "동영상 소유자가 다른 웹사이트에서 재생할 수 없도록 설정한 것 같습니다. 링크에 직접 접속해주세요.";
            break;
        }

        this.showError(`[${GLOBAL.scriptName} v${GLOBAL.version}]<br />${errormsg}<br /><a class="errorURL"></a>`);
        this.$container.find(".errorURL").attr("href", this.originalUrl).text(this.originalUrl);
        this.$thumbnailContainer.css("cursor","default");
    }
    resizeByRatio(ratio, viewportRatio, heightMargin){
        let width = this.$iframeContainer.width();
        let new_height = width / ratio + heightMargin;
        let viewportHeight = Math.max((parent.window.innerHeight * viewportRatio), 300);
        new_height = parseInt(Math.min(viewportHeight, new_height));
        NOMO_DEBUG("new_height", new_height);
        
        let new_ratio = width / new_height;
        if(Math.abs(new_ratio - 16.0/9.0) > 0.2){
            if(new_ratio < 1.0) new_ratio = 1.0;
            if(new_ratio > 4.0) new_ratio = 4.0;
            this.$iframeContainer.attr("style",`aspect-ratio:${new_ratio}`);
        }
    }
    getNewWidth(){
        // set default values
        let parentWidth = 800.0;
        let parentHeight = parent.window.innerHeight - 230.0; // 150:
        NOMO_DEBUG("parentHeight", parentHeight);

        // set description height according to hideDescription option
        let descriptionHeight = (GM_SETTINGS.hideDescription ? 0.0 : 40.0);

        // set max width
        let shortsMaxWidth = 300.0;
        let shortsMaxHeight = shortsMaxWidth / 9.0 * 16.0 - descriptionHeight;

        // set shortsMaxHeight from parent window height
        let goodVideoHeight = parentHeight - descriptionHeight;
        if(goodVideoHeight > 0){
            // 하단에 설정될 여백은 30px or 10% 중 작은 것이다
            shortsMaxHeight = Math.max(goodVideoHeight - 30.0, goodVideoHeight * 0.9);
        }

        // set shortsMaxWidth from article_container element width
        let $article_container =  $(".article_container");
        if($article_container.length !== 0 && (parentWidth = $article_container.width())){
            shortsMaxWidth = parentWidth;
        }
        NOMO_DEBUG("originalWidth originalHeight:", this.originalWidth, this.originalHeight);
        NOMO_DEBUG("shortsMaxWidth shortsMaxHeight:", shortsMaxWidth, shortsMaxHeight);

        // get new width
        let originalRatio = this.originalWidth / this.originalHeight;
        let newWidth = shortsMaxHeight * originalRatio;

        // check new width with min condition
        NOMO_DEBUG("original ratio:", originalRatio);
        NOMO_DEBUG("newWidth by original ratio:", newWidth, "new height will be", newWidth / originalRatio);
        if(newWidth <= 300.0){
            NOMO_DEBUG("newWidth: set to 300");
            newWidth = 300.0;
        }
        // check new width with max condition
        else if(newWidth > shortsMaxWidth){
            NOMO_DEBUG("newWidth: set to shortsMaxWidth", shortsMaxWidth);
            newWidth = parseInt(shortsMaxWidth);
        }

        //let newPaddingTop = parseInt(100.0 / originalRatio);
        let newPaddingTop = 100.0 / originalRatio;

        return {"newWidth":newWidth, "newPaddingTop":newPaddingTop};
    }
}