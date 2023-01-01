import { NOMO_DEBUG, NOMO_ERROR, NOMO_WARN } from "js/lib.js";
import {VideoBase} from "js/video/video_common.js";

const YTlogo = `<svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="18" height="18" viewBox="0 0 461.001 461.001" style="enable-background:new 0 0 461.001 461.001;" xml:space="preserve">
<g>
    <path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
</g>
</svg>`;

export class VideoYoutube extends VideoBase {
    constructor(options) {
        options.logoSVG = YTlogo;
        super(options);

        if(options.type === GLOBAL.YOUTUBE_VOD){
            this.type = GLOBAL.YOUTUBE_VOD;
            this.ytid = options.id;
            this.ytClipId = undefined;
            this.ytPlaylistId = undefined;
            this.typeName = "YOUTUBE_VOD";
        }
        else if(options.type === GLOBAL.YOUTUBE_CLIP){
            this.type = GLOBAL.YOUTUBE_CLIP;
            this.ytid = undefined;
            this.ytClipId = options.id;
            this.ytPlaylistId = undefined;
            this.typeName = "YOUTUBE_CLIP";
            this.parseDataRequired = true;

            if(this.title && this.title.indexOf("✂️") === "-1"){
                this.title = "✂️ " + this.title;
            }
        }
        else if (options.type === GLOBAL.YOUTUBE_PLAYLIST){
            this.type = GLOBAL.YOUTUBE_CLIP;
            this.ytid = undefined;
            this.ytClipId = undefined;
            this.ytPlaylistId = options.id;
            this.typeName = "YOUTUBE_PLAYLIST";
            this.title = "[Playlist] " + this.title;
        }
        this.start = options.start;
        this.end = options.end;

        NOMO_DEBUG("new VideoYoutube", options);
        
        this.YTPlayer = undefined;

        //  for youtube clip
        this.isDataLoading = false;
        this.isDataLoaded = false;
        this.isDataSucceed = false;
        
        // thumbnail reloaded?
        this.originalThumbnailUrl = options.thumbnailUrl;
        this.isThumbnailReloaded = false;
    }

    static init(){try{
        if(!GM_SETTINGS.useYoutube) return;
        $("head").prepend(`<script async type="text/javascript" src="https://www.youtube.com/iframe_api"></script>`);
    }
    catch(e){
        NOMO_DEBUG("FAIL TO LOAD YOUTUBE IFRAME API. TRY TO INSERT YT API MANUALLY", e);
        // eslint-disable-next-line
        const scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/4c3f79c5\/www-widgetapi.vflset\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}if(!window["YT"])var YT={loading:0,loaded:0};if(!window["YTConfig"])var YTConfig={"host":"https://www.youtube.com"};if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i++)try{l[i]()}catch(e$0){}};YT.setConfig=function(c){for(var k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=document.getElementsByTagName("script")[0];if(!b){document.getElementsByTagName('head')[0].appendChild(a)}else{b.parentNode.insertBefore(a,b)}})()};
    }}

    onYTPlayerReady(event){
        // set_volume_when_stream_starts
        if(event.target.muted){
            event.target.setVolume(0);
        }
        else if(GM_SETTINGS.set_volume_when_stream_starts){
            event.target.setVolume(GM_SETTINGS.target_start_volume * 100.0);
        }
    }

    onYTPlayerStateChange(event){
        //let videoId = event.target.playerInfo.videoData.video_id;
        let seq = event.target.seq;
        // let playerState = event.data == YT.PlayerState.ENDED ? '종료됨' : event.data == YT.PlayerState.PLAYING ? '재생 중' : event.data == YT.PlayerState.PAUSED ? '일시중지 됨' : event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' : event.data == YT.PlayerState.CUED ? '재생준비 완료됨' : event.data == -1 ? '시작되지 않음' : '예외';
        // NOMO_DEBUG("YOUTUBE PLAYER STATE CHANGED", seq, event, playerState);
        //NOMO_DEBUG("VideoBase.videos", event, VideoBase.videos, videoId, VideoBase.videos[videoId]);
        if(GM_SETTINGS.autoPauseOtherClips && event.data === YT.PlayerState.PLAYING){
            VideoBase.videos[seq].eventPlay();
        }
        else if(GM_SETTINGS.autoPlayNextClip && event.data === YT.PlayerState.ENDED){
            VideoBase.videos[seq].eventEnded();
        }
    }
    createIframe(){try{
        if(YT === undefined || !YT.loading) {
            if(!this.recur) this.recur = 0;
            this.recur += 1;
            NOMO_DEBUG("[createIframe] There is no youtube iframe api yet, reload", this.id, this.recur);
            if(this.recur < 10){
                setTimeout(function(){
                    this.createIframe();
                },(this.recur) * 100);
                return;
            }
            else{
                return;
            }
        }

        const YTElemID = "NCCL-"+this.id;
        this.$iframe = (`<div class="NCCL_iframe" id="${YTElemID}"></div>`);
        this.$iframeContainer.append(this.$iframe);

        let YTOptions = {
            "height": "100%",
            "width": "100%",
            "videoTitle": "",
            "playerVars": {
                'autoplay': (this.autoPlay ? 1 : 0),
                'autohide': 1,
                'showinfo': 0,
                'controls':1,
                'loop': 0
            },
            "suggestedQuality":"hd1080", // highres hd1080
            "events": {
                'onReady': this.onYTPlayerReady,
                'onStateChange': this.onYTPlayerStateChange
            }
        };
        if(this.ytid) YTOptions["videoId"] = this.ytid;
        if(this.start) YTOptions["playerVars"]["start"] = this.start;
        if(this.end) YTOptions["playerVars"]["end"] = this.end;
        if(this.clipt) YTOptions["playerVars"]["clipt"] = this.clipt;
        if(this.ytClipId) YTOptions["playerVars"]["clip"] = this.ytClipId;
        if(this.ytPlaylistId){
            YTOptions["playerVars"]["listType"] = "playlist";
            YTOptions["playerVars"]["list"] = this.ytPlaylistId;
        }

        this.YTPlayer = new YT.Player(YTElemID, YTOptions);
        this.YTPlayer.seq = this.seq;
        this.YTPlayer.muted = this.muted;
        NOMO_DEBUG("CREATE YTPlayer", this.id, YTOptions, this.YTPlayer);

        this.$iframe = this.$iframeContainer.find(".NCCL_iframe");
        let that = this;
        setTimeout(function(){that.$iframe.attr("title", "");},1000);
    }
    catch(e){
        NOMO_DEBUG("Error from createYTIframe", e);
    }}

    
    // overwrite video related function
    play(){
        if(!this.$iframe || typeof this.YTPlayer.playVideo !== "function") return;
        this.YTPlayer.playVideo();
    }
    pause(){
        if(!this.$iframe || typeof this.YTPlayer.pauseVideo !== "function") return;
        this.YTPlayer.pauseVideo();
    }
    stop(){
        if(!this.$iframe || typeof this.YTPlayer.stopVideo !== "function") return;
        this.YTPlayer.stopVideo();
    }

    // video related event
    eventPlay(){
        super.eventPlay();
        this.autoPlayPauseOthers("play");
    }
    eventPause(){
    }
    eventEnded(){
        this.autoPlayPauseOthers("ended");
    }

    // maxresdefault 를 찾을 수 없는 경우 hqdefault 로 대체한다.
    thumbnailLoaded(e){
        NOMO_DEBUG("thumbnailLoaded", this.id, e.target.naturalWidth, e.target.naturalHeight);
        let width = e.target.naturalWidth;
        let height = e.target.naturalHeight;

        if(!this.isThumbnailReloaded && width < 150 && height < 150){
            NOMO_DEBUG("thumbnail image is small, replace thumbnail!");
            this.isThumbnailReloaded = true;
            if(this.originalThumbnailUrl){
                e.target.src = this.originalThumbnailUrl;
            }
            else{
                e.target.src = e.target.src.replace("maxresdefault", "hqdefault");
            }
        }
    }

    parseData(){try{
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let that = this;

        NOMO_DEBUG("parseYoutubeClipInfo. try to connect ", that.url);

        GM.xmlHttpRequest({
            method: "GET",
            url: that.url,
            headers: {},
            onload: function(response) {
                if(response.status !== 200){
                    that.isDataLoading = false;
                    that.isDataLoaded = true;
                    that.isDataSucceed = false;
                    that.showParsingError();
                    return;
                }

                const rpt = response.responseText;
                NOMO_DEBUG("parseYoutubeClipInfo, status = 200");
                
                // parse videoId
                const rpt_match_videoId = rpt.match(/,"videoDetails":{"videoId":"([a-zA-Z0-9-_]+)"/i);
                if(rpt_match_videoId === null){
                    NOMO_ERROR("getYTClipPageInfoXHR FAIL - rpt_match_videoId", that.id);
                    NOMO_ERROR("rpt", rpt);
                    that.isDataLoading = false;
                    that.isDataLoaded = true;
                    that.isDataSucceed = false;
                    that.showParsingError();
                    return;
                }
                that.ytid = rpt_match_videoId[1];

                // parse clipt
                const rpt_match_clipt = rpt.match(/clipt=([a-zA-Z0-9-_]+)/i);
                if(rpt_match_clipt !== null){
                    that.clipt = rpt_match_clipt[1];
                }
                else{
                    // clipt parsing 실패한 경우에도 return 하지는 않는다.
                    NOMO_WARN("getYTClipPageInfoXHR partial FAIL - clipt", that.id);
                    that.clipt = undefined;
                }

                // parse embedUrl
                // embedUrl 이 존재하지 않는 경우는 "동영상 소유자가 다른 웹사이트에서 재생할 수 없도록 설정했습니다." 오류가 뜨는 경우이다.
                // 게시자가 직접 설정 or 저작권 음원이 삽입된 경우인 듯하다.
                const rpt_match = rpt.match(/<link itemprop="embedUrl" href="([a-zA-Z0-9-_./:=&;?]+)">/);
                if(rpt_match !== null){
                    // https://www.youtube.com/embed/7n-S2raI420?clip=UgkxlTwoAuIUgUwJbCPDuRNZNEaox2ImiRII&clipt=ENuPdhjdlnc
                    that.iframeUrl = rpt_match[1];
                }
                else{
                    NOMO_ERROR("getYTClipPageInfoXHR FAIL - embedUrl", that.id);
                    that.showError(`[${GLOBAL.scriptName} v${GLOBAL.version}]<br />동영상 소유자가 다른 웹사이트에서 재생할 수 없도록 설정한 것 같습니다. 링크에 직접 접속해주세요.<br /><a href="${that.originalUrl}" target="_blank">${that.originalUrl}</a>`);
                    that.updateThumbnail(that.originalThumbnailUrl);
                    that.$thumbnailContainer.css("cursor","default");
                    that.isDataLoading = false;
                    that.isDataLoaded = true;
                    that.isDataSucceed = false;
                    return;
                    //that.iframeUrl = `https://www.youtube.com/embed/${that.ytid}?clip=${that.ytClipId}${that.clipt ? "&clipt="+that.clipt : ""}`;
                }


                // parse story board
                const rpt_match2 = rpt.match(/"playerStoryboardSpecRenderer":{"spec":"([a-zA-Z0-9-_,./?=|!@#$%^&*():]+)"}/i);
                const rpt_match3 = rpt.match(/"lengthSeconds":"(\d+)"/i);
                const rpt_match4 = rpt.match(/"startTimeMs":"(\d+)"/i);
                const rpt_match5 = rpt.match(/"endTimeMs":"(\d+)"/i);
                if(rpt_match2 !== null && rpt_match3 !== null && rpt_match4 !== null && rpt_match5 !== null){
                    that.storyBoardSpec = rpt_match2[1];
                    that.seconds = rpt_match3[1];
                    that.storyBoard = YTStoryBoard("url", that.storyBoardSpec, true, that.seconds);
                    that.start = Number(rpt_match4[1]) / 1000.0;
                    that.end = Number(rpt_match5[1]) / 1000.0;
                    that.foundStoryBoardUrl = undefined;
                    that.foundStoryBoardSeq = undefined;

                    // find image in storyboard
                    const midTime = (that.end - that.start) / 2.0 + that.start;
                    for(let i=0; i<that.storyBoard.length; i++){
                        const sb = that.storyBoard[i];
                        if(sb.start <= midTime && sb.end > midTime){
                            let seq = Math.floor((midTime - sb.start) / sb.slice) + 1;

                            if(seq < 0){
                                seq = 0;
                            }
                            else if(seq >= (sb.no - 1)){
                                seq = sb.no - 1;
                            }

                            NOMO_DEBUG("found storyboard image", seq, sb.url);
                            that.foundStoryBoardUrl = sb.url;
                            that.foundStoryBoardSeq = seq;

                            that.updateThumbnail(that.foundStoryBoardUrl);

                            // shift image
                            let translateX = "0";
                            let translateY = "0";
                            if(seq >= 0 && seq < 10){
                                translateY = "calc(100% / 5)";
                            }
                            else if(seq >= 15 && seq < 25){
                                translateY = "calc(-100% / 5)";
                            }
                            if(seq % 5 === 0 || seq % 5 === 1){
                                translateX = "calc(100% / 5)";
                            }
                            else if(seq % 5 === 3 || seq % 5 === 4){
                                translateX = "calc(-100% / 5)";
                            }
                            that.$thumbnail.css("border","1px solid #eee").css("transform", `scale(calc(5/3)) translate(${translateX}, ${translateY})`);
                        }
                    }
                }
                else{
                    // story board 관련 data parsing 실패한 경우에도 return 하지는 않는다.
                    NOMO_WARN("getYTClipPageInfoXHR partial FAIL - story board", that.id);
                    NOMO_WARN("rpt", rpt);
                    NOMO_WARN("rpt_match2", rpt_match2);
                    NOMO_WARN("rpt_match3", rpt_match3);
                    NOMO_WARN("rpt_match4", rpt_match4);
                    NOMO_WARN("rpt_match5", rpt_match5);
                }

                NOMO_DEBUG("getYTClipPageInfoXHR Succeed");
                that.isDataLoading = false;
                that.isDataLoaded = true;
                that.isDataSucceed = true;
                that.postParseData();
            }
        });
    }catch(e){
        NOMO_ERROR("getYTClipPageInfoXHR FAIL - catch", this.id, e);
        this.isDataLoading = false;
        this.isDataLoaded = true;
        this.isDataSucceed = false;
        this.showParsingError();
    }}
}


function YTStoryBoard(returnType, spec, hq, seconds) {
    let specParts = spec.split('|');
    let baseUrlHq = specParts[0].split('$')[0] + '2/';
    let baseUrlLq = specParts[0].split('$')[0] + '1/';
    let sgpPart = specParts[0].split('$N')[1];

    let sighPartHq;
    let sighPartLq;

    if (specParts.length === 3) {
        sighPartHq = specParts[2].split('M#')[1];
        sighPartLq = specParts[1].split('M#')[1];
    } else if (specParts.length === 2) {
        sighPartHq = specParts[1].split('t#')[1];
        // sighPartLq = specParts[0].split('M#')[1];

    } else {
        sighPartHq = specParts[3].split('M#')[1];
        sighPartLq = specParts[2].split('M#')[1];
    }

    let amountOfBoards = 0;
    let division = 25;

    let storyboardArray = [];

    if (hq === false) {
        division = 100;
    } /* More frames per image in the case of LQ */

    // let slice = -1;
    // if (seconds < 250) {
    //     slice = 2;
    // } else if (seconds > 250 && seconds < 1000) {
    //     slice = 5;
    // } else if (seconds > 1000) {
    //     slice = 10;
    // }
    let slice = -1;
    if (seconds < 2 * 60) {
        slice = 1;
    } else if (seconds >= 2 * 60 && seconds < 5 * 60) {
        slice = 2;
    } else if (seconds >= 5 * 60 && seconds < 15 * 60) {
        slice = 5;
    } else if (seconds >= 15 * 60) {
        slice = 10;
    }
    amountOfBoards = Math.ceil((seconds / slice) / division);

    let start = 0;
    let end = 0;
    if (hq === true) {
        /* High quality storyboard */
        for (let i = 0; i < amountOfBoards; i++) {
            start = end;
            end = start + slice * division;

            storyboardArray.push({});
            storyboardArray[i].url = baseUrlHq + 'M' + i + sgpPart + '&sigh=' + encodeURIComponent(sighPartHq);
            storyboardArray[i].start = start;
            storyboardArray[i].slice = slice;
            if(i != amountOfBoards - 1){
                storyboardArray[i].end = end;
                storyboardArray[i].no = division;
                // 위에서 계산된 값보다 1개 정도 더 많을 수도 있다.
            }
            else{
                storyboardArray[i].end = Number(seconds);
                storyboardArray[i].no = Math.ceil((storyboardArray[i].end - storyboardArray[i].start) / slice);
            }
        }
    } else {
        /* Low quality storyboard */
        for (let i = 0; i < amountOfBoards; i++) {
            storyboardArray.push(baseUrlLq + 'M' + i + sgpPart + '&sigh=' + sighPartLq);
        }
    }

    if (returnType === "url") {
        return storyboardArray;
    } else if (returnType === "parts") {
        let obj = {
            firstPart: `${baseUrlHq}M`,
            secondPart: `${sgpPart}&sigh=${sighPartHq}`
        };
        return obj;
    } else if (returnType === "keys") {
        let obj = {
            sgp: sgpPart.slice(9),
            sigh: sighPartHq
        };

        return obj;
    }

}


// oembed 를 사용하는 경우
// - url
// https://youtube.com/oembed?url=http://www.youtube.com/watch?v=iwGFalTRHDA&format=json
// - response
// {"title":"Trololo","author_name":"KamoKatt","author_url":"https://www.youtube.com/@KamoKatt","type":"video","height":150,"width":200,"version":"1.0","provider_name":"YouTube","provider_url":"https://www.youtube.com/","thumbnail_height":360,"thumbnail_width":480,"thumbnail_url":"https://i.ytimg.com/vi/iwGFalTRHDA/hqdefault.jpg","html":"\u003ciframe width=\u0022200\u0022 height=\u0022150\u0022 src=\u0022https://www.youtube.com/embed/iwGFalTRHDA?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\u0022 allowfullscreen title=\u0022Trololo\u0022\u003e\u003c/iframe\u003e"}
