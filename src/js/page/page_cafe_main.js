import css_cafe_main from "css/cafe_main.css";
import { DEBUG, NOMO_DEBUG, escapeHtml } from "js/lib";
import { VideoBase } from "js/video/video_common";
import { VideoYoutube } from "js/video/video_youtube.js";
import { VideoNaver } from "js/video/video_naver.js";
import { VideoStreamable } from "js/video/video_streamable.js";
import { VideoAFTV } from "js/video/video_aftv.js";
import { VideoTwitch } from "js/video/video_Twitch.js";
import { VideoKakao } from "js/video/video_kakao.js";
import { VideoGfycat } from "js/video/video_gfycat.js";
import { VideoTiktok } from "js/video/video_tiktok.js";

export async function PAGE_CAFE_MAIN(){
    // add dns-prefetch and preconnect header
    $("head").append(`
        <link rel="dns-prefetch" href="https://gql.twitch.tv/">
        <link rel="dns-prefetch" href="https://clips.twitch.tv/">
        <link rel="dns-prefetch" href="https://static.twitchcdn.net/">
        <link rel="dns-prefetch" href="https://production.assets.clips.twitchcdn.net/">
        <link rel="preconnect" href="https://clips.twitch.tv/">
        <link rel="preconnect" href="https://gql.twitch.tv/">
        <link rel="preconnect" href="https://static.twitchcdn.net/">
        <link rel="preconnect" href="https://production.assets.clips.twitchcdn.net/">
    `);

    // add style
    GM_addStyle(css_cafe_main.toString());

    VideoBase.init();
    
    if(GM_SETTINGS.useYoutube){
        VideoYoutube.init();    // insert YT script
    }

    if(GM_SETTINGS.useNaver){
        VideoNaver.init();      // bind Naver player reload event
    }

    // 설명란 링크 좌클릭 시 현재 재생 중인 비디오 모두 정지
    $(document).on("click", "a.NCCL_description", function(){
        VideoBase.stopAll();
    });

    let regexs = {};
    if(GM_SETTINGS.useTwitch){
        regexs[GLOBAL.TWITCH_CLIP] = /^https?:\/\/(?:clips\.twitch\.tv\/|www\.twitch.tv\/[a-zA-Z0-9-_]+\/clip\/)([a-zA-Z0-9-_]+)/i;
        regexs[GLOBAL.TWITCH_VOD] = /(?:^https?:\/\/www\.twitch.tv\/videos\/(\d+)\??(t=[hms0-9]+)?|^https?:\/\/www\.twitch.tv\/.+\/v\/(\d+)\??[a-zA-Z0-9=-_]*(&t=[hms0-9]+)?)/i;
    }
    if(GM_SETTINGS.useYoutube && GM_SETTINGS.youtubeClipConvert){
        regexs[GLOBAL.YOUTUBE_CLIP] = /^https?:\/\/(?:www\.)?youtube\.com\/clip\/([a-zA-Z0-9-_]+)/i;
    }
    if(GM_SETTINGS.useStreamable){
        regexs[GLOBAL.STREAMABLE] = /^https?:\/\/streamable\.com\/(?:e\/)?([a-zA-Z0-9-_]+)/i;
    }
    if(GM_SETTINGS.useAftv){
        regexs[GLOBAL.AFTV_VOD] = /^https?:\/\/vod\.afreecatv.com\/player\/(\d+)\??(change_second=\d+)?/i;
    }
    if(GM_SETTINGS.useClippy){
        regexs[GLOBAL.CLIPPY] = /^https?:\/\/clippy\.kr\/clip\/([a-zA-Z0-9-_]+)/i;
    }
    if(GM_SETTINGS.useKakao){
        regexs[GLOBAL.KAKAO_VID] = /^https?:\/\/tv\.kakao\.com\/v\/(\d+)/i;
    }
    if(GM_SETTINGS.useDailymotion){
        // https://www.dailymotion.com/video/x8gkiho
        // https://dai.ly/xxxxxxx
        regexs[GLOBAL.DAILYMOTION] = /^https?:\/\/(?:www\.dailymotion\.com\/video|dai\.ly)\/([a-zA-Z0-9-_]+)/i;
    }
    if(GM_SETTINGS.useGfycat){
        // https://gfycat.com/handydemandingindianhare
        // https://gfycat.com/ko/xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        regexs[GLOBAL.GFYCAT] = /^https?:\/\/gfycat\.com\/(?:[a-zA-Z]{1,3}\/)?([a-zA-Z0-9]+)/i;
    }
    if(GM_SETTINGS.useTiktok){
        regexs[GLOBAL.TIKTOK] = /https:\/\/www\.tiktok.com\/[-A-Z0-9+&@#/%=~_|^ㄱ-ㅎㅏ-ㅣ가-힣]+\/video\/(\d+)/i;
    }

    //$(document).arrive(".se-module-oembed iframe, .se-module-oglink, .se-module-video", { onlyOnce: true, existing: true }, function (elem) {try{
    $(document).arrive(".__se_module_data", { onlyOnce: true, existing: true }, function (elem) {try{
        let $elem = $(elem);
        if($elem.hasClass("fired")) return;
        $elem.addClass("fired");

        // let $seComponent = $elem.closest(".se-component");
        // let $moduleData = $seComponent.find(".__se_module_data");
        let $seComponent = $elem.closest(".se-component");
        let $moduleData = $elem;

        let obj;
        if($moduleData.length !== 0){
            obj = JSON.parse($moduleData.get(0).dataset.module);
        }
        if(!obj || !obj.data) return false;

        NOMO_DEBUG("obj", obj);

        
        let autoPlay = false;
        let muted = false;

        // check autoplay
        if(GM_SETTINGS.convertMethod === "autoLoad" && GM_SETTINGS.autoPlayFirstClip && VideoBase.nvideos === 0){
            autoPlay = true;
        }
        else if(GM_SETTINGS.convertMethod === "clickRequired" && GM_SETTINGS.clickRequiredAutoPlay){
            autoPlay = true;
        }

        // check muted
        if(GM_SETTINGS.convertMethod === "autoLoad" && GM_SETTINGS.autoPlayFirstClip && GM_SETTINGS.autoPlayFirstClipMuted && VideoBase.nvideos === 0){
            muted = true;
        }
        else if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume === 0.0){
            muted = true;
        }

        if(obj.type.indexOf("oglink") !== -1){

            if(!obj.data.link) return;
            
            let src = obj.data.link;
            let title = escapeHtml($seComponent.find(".se-oglink-title").text());
            let desc = escapeHtml($seComponent.find(".se-oglink-summary").text());

            var matchRes = {"found":false, "type": null, "res": null };
            for(var key in regexs){
                var match = src.match(regexs[key]);
                if(match !== null) {
                    matchRes = {"found": true, "type": Number(key), "res": match };
                    break;
                }
            }
            if(!matchRes.found) return;
            NOMO_DEBUG("matchRes", matchRes);

            // let url = new URL(src);
            // let urlParam = new URLSearchParams(url.search);

            switch(matchRes.type){    
            default:
                NOMO_DEBUG("CANNOT FOUND TYPE", matchRes.type);
                return;
                
            case GLOBAL.TWITCH_CLIP:{
                let vid = new VideoTwitch({
                    id:match[1],
                    type:GLOBAL.TWITCH_CLIP,
                    typeName:"TWITCH_CLIP",
                    originalUrl:src,
                    url:src,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                    //thumbnailUrl: `https://thumbs-east.streamable.com/image/${match[1]}.jpg`
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.TWITCH_VOD:{
                let id, vodurl, option_ori="", option = "";
                if(match[1] !== undefined && match[3] === undefined){
                    id = match[1];
                    option_ori = (match[2] ? match[2].replace("?","").replace("&","") : "");
                }
                else if(match[1] === undefined && match[3] !== undefined){
                    id = match[3];
                    option_ori = (match[4] ? match[4].replace("?","").replace("&","") : "");
                }
                else{
                    return;
                }

                if(option_ori){
                    vodurl = `https://www.twitch.tv/videos/${id}?${option_ori}`;
                    option = "&"+option_ori;
                }
                else{
                    vodurl = `https://www.twitch.tv/videos/${id}`;
                }
                
                let vid = new VideoTwitch({
                    id:id,
                    type:GLOBAL.TWITCH_VOD,
                    typeName:"TWITCH_VOD",
                    originalUrl:src,
                    url:vodurl,
                    option:option,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.YOUTUBE_CLIP: {
                let vid = new VideoYoutube({
                    id:match[1],
                    type:GLOBAL.YOUTUBE_CLIP,
                    originalUrl:src,
                    url:src,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.STREAMABLE:{
                let vid = new VideoStreamable({
                    id:match[1],
                    originalUrl:src,
                    url:src,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                    //thumbnailUrl: `https://thumbs-east.streamable.com/image/${match[1]}.jpg`
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.AFTV_VOD:{
                let id = match[1];
                let start = undefined;
                let vodurl = `https://vod.afreecatv.com/player/${id}`;
                if(match[2] !== undefined){
                    start = Number(match[2].replace("change_second=",""));
                    vodurl += "?" + match[2];
                }
                //let change_second = urlParam.get("change_second");
                let vid = new VideoAFTV({
                    id:match[1],
                    originalUrl:src,
                    url:vodurl,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted,
                    start:start
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.CLIPPY:{
                let vid = new VideoBase({
                    logoSVG:`<svg width="18px" height="18px" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 40C5.54688 40 0 34.4531 0 27.5V9.21875C0 4.14062 4.0625 0 9.21875 0C14.2969 0 18.4375 4.14062 18.4375 9.21875V25.625C18.4375 28.9062 15.7031 31.5625 12.5 31.5625C9.21875 31.5625 6.5625 28.9062 6.5625 25.625V12.5C6.5625 11.3281 7.5 10.3125 8.75 10.3125C9.92188 10.3125 10.9375 11.3281 10.9375 12.5V25.625C10.9375 26.5625 11.5625 27.1875 12.5 27.1875C13.3594 27.1875 14.0625 26.5625 14.0625 25.625V9.21875C14.0625 6.5625 11.875 4.375 9.21875 4.375C6.48438 4.375 4.375 6.5625 4.375 9.21875V27.5C4.375 32.0312 7.96875 35.625 12.5 35.625C16.9531 35.625 20.625 32.0312 20.625 27.5V12.5C20.625 11.3281 21.5625 10.3125 22.8125 10.3125C23.9844 10.3125 25 11.3281 25 12.5V27.5C25 34.4531 19.375 40 12.5 40Z" fill="black"></path></svg>`,
                    id:match[1],
                    type:GLOBAL.CLIPPY,
                    typeName:"CLIPPY",
                    originalUrl:src,
                    url:src,
                    // clippy 의 경우 iframe 내에 cloudflarestream 에 대한 iframe 이 다시 한 번 삽입됨
                    //iframeUrl:`https://clippy.kr/clip/${match[1]}/embed?parent=cafe.naver.com&extension=NCCL`,
                    iframeUrl:`https://clippy.kr/clip/${match[1]}/embed`,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.KAKAO_VID:{
                let vid = new VideoKakao({
                    id:match[1],
                    originalUrl:src,
                    url:src,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.DAILYMOTION:{
                let vid = new VideoBase({
                    logoSVG:`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-119 243.5 64 64" width="18px" height="18px"><path d="M-59.745 307.5h-54.5a4.755 4.755 0 0 1-4.745-4.745v-54.5a4.755 4.755 0 0 1 4.745-4.745h54.5A4.755 4.755 0 0 1-55 248.245v54.5a4.77 4.77 0 0 1-4.745 4.745z" fill="#2a62aa"/><path d="M-67.123 249.854v50.937h-10.785v-3.9c-2.842 2.76-6.667 4.264-11.14 4.264-9.782 0-17.83-8.34-17.83-18.8s8.612-18.916 17.83-18.916c4.473 0 8.298 1.588 11.14 4.4v-15.823zm-19.48 41.406a9.1 9.1 0 0 0 9.092-9.092 9.1 9.1 0 0 0-9.092-9.093 9.1 9.1 0 0 0-9.092 9.093 9.1 9.1 0 0 0 9.092 9.092z" fill="#fff"/></svg>`,
                    id:match[1],
                    type:GLOBAL.DAILYMOTION,
                    typeName:"DAILYMOTION",
                    originalUrl:src,
                    url:src,
                    iframeUrl:`https://www.dailymotion.com/embed/video/${match[1]}?parent=cafe.naver.com&extension=NCCL&seq=undefined&autoplay=${autoPlay?"1":"0"}&muted=${muted?"1":"0"}`,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.GFYCAT:{
                let vid = new VideoGfycat({
                    id:match[1],
                    originalUrl:src,
                    url:"https://gfycat.com/"+match[1],
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            case GLOBAL.TIKTOK:{
                let vid = new VideoTiktok({
                    id:match[1],
                    originalUrl:src,
                    url:src,
                    title:title,
                    desc:desc,
                    view:null,
                    origin:document.location.origin,
                    thumbnailUrl: obj.data.thumbnail,
                    autoPlay:autoPlay,
                    muted:muted
                });
                vid.createIframeContainer($seComponent);
                break;
            }

            }
        }
        // Youtube
        else if(GM_SETTINGS.useYoutube && obj.type.indexOf("oembed") !== -1){
            if(!obj.data.html) return false;

            let src = obj.data.html.match(/src="([a-zA-Z0-9-_:/?=&.]+)"/);
            if(!src) return false;
            src = src[1];

            let id = src.match(/^https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9-_]+)/);
            if(!id) return false;
            id = id[1];

            let start = obj.data.inputUrl.match(/start=(\d+)/);
            let end = obj.data.inputUrl.match(/end=(\d+)/);

            let vid = new VideoYoutube({
                id:id,
                type:GLOBAL.YOUTUBE_VOD,
                originalUrl:obj.data.inputUrl,
                url:obj.data.inputUrl,//"https://youtu.be/"+id,
                iframeUrl:src,
                title:escapeHtml(obj.data.title),
                desc:escapeHtml(obj.data.description),
                view:null,
                origin:document.location.origin,
                //thumbnailUrl: (obj.data.thumbnailUrl ? obj.data.thumbnailUrl.replace(/\/(default|mqdefault|sddefault|hqdefault)\./,"/maxresdefault.") : undefined),
                thumbnailUrl: (obj.data.thumbnailUrl ? obj.data.thumbnailUrl.replace(/\/(default|mqdefault|sddefault|hqdefault)\./,"/maxresdefault.") : undefined),
                autoPlay:autoPlay,
                muted:muted,
                start:(start ? start[1] : undefined),
                end:(end ? end[1] : undefined),
                originalWidth:obj.data.originalWidth,
                originalHeight:obj.data.originalHeight,
            });
            vid.createIframeContainer($seComponent);
        }
        // Naver Video
        else if(GM_SETTINGS.useNaver && obj.type.indexOf("video") !== -1){
            if(!obj.data.videoType || obj.data.videoType !== "player") return false;

            let id = obj.data.vid;
            let inkey = obj.data.inkey;

            let vid = new VideoNaver({
                id:id,
                inkey:inkey,
                originalUrl:obj.data.inputUrl,
                url:"",
                title:escapeHtml(obj.data.mediaMeta.title),
                desc:escapeHtml(obj.data.mediaMeta.description),
                tags:obj.data.mediaMeta.tags,
                view:null,
                origin:document.location.origin,
                thumbnailUrl: obj.data.thumbnail,
                autoPlay:autoPlay,
                muted:muted,
                originalWidth:obj.data.width,
                originalHeight:obj.data.height,
            });
            vid.createIframeContainer($seComponent);
        }
        else{
            return false;
        }
    }
    catch(e){
        NOMO_DEBUG("Error from arrive for videos", e);
    }});

    
    // fixFullScreenScrollChange
    var parentHtml = parent.document.querySelector("html");
    var lastScrollY = parentHtml.scrollTop;
    var checkIsFullScreen = function(){ return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen; };
    try{
        if(GM_SETTINGS.fixFullScreenScrollChange && window.self !== window.top){
            $(document).on ('mozfullscreenchange webkitfullscreenchange fullscreenchange',function(){
                var isFullScreen = checkIsFullScreen();
                NOMO_DEBUG("FullScreen", isFullScreen);
                if(!isFullScreen){
                    if(parentHtml.scrollTop !== lastScrollY){
                        NOMO_DEBUG("parentHtml.scrollTop = ", parentHtml.scrollTop, "lastScrollY = ", lastScrollY);
                    }
                    parentHtml.scrollTop = lastScrollY;
                }
            });

            $(parent.window).scroll(function() {
                var isFullScreen = checkIsFullScreen();
                //NOMO_DEBUG("parent document html scrolltop", parentHtml.scrollTop, "isFullScreen", isFullScreen);
                if(!isFullScreen){
                    //lastScrollY = parent.window.scrollY;
                    lastScrollY = parentHtml.scrollTop;
                }
            });
        }
    }
    catch(e){
        NOMO_DEBUG("Error from fixFullScreenScrollChange", e);
    }


    // FasterNoticeHide
    try{
        if(DEBUG){
            let savedNOTICE_OPEN = localStorage.getItem('NOTICE_OPEN');
            if(savedNOTICE_OPEN === null){
                savedNOTICE_OPEN = "ON";
            }
            NOMO_DEBUG("NOTICE_OPEN", savedNOTICE_OPEN);
            if(savedNOTICE_OPEN === "OFF"){
                GM_addStyle(`._noticeArticle {display:none;}`);
            }
            $(document).on("change", "#notice_hidden", function(e){
                NOMO_DEBUG("e.target.checked", e.target.checked);
                if(e.target.checked){
                    //
                }
                else{
                    $("._noticeArticle").show();
                }
            });
        }
    }
    catch(e){
        NOMO_ERROR("Error from FasterNoticeHide", e);
    }


    if(GM_SETTINGS.visitedArticleStyle){
        GM_addStyle(`
        .skin-1080 .article-board .board-list div.inner_list a:visited,
        .skin-1080 .article-board .board-list div.inner_list div.inner_list a:visited *
        div.inner_list a:visited,
        div.inner_list a:visited *
        {
            color:#ddd !important;
        }
        html[data-theme='dark'] body .skin-1080 .article-board .board-list div.inner_list a:visited,
        html[data-theme='dark'] body .skin-1080 .article-board .board-list div.inner_list a:visited *
        html[data-theme='dark'] body div.inner_list a:visited,
        html[data-theme='dark'] body div.inner_list a:visited *
        {
            color:#454545 !important;
        }
        `);
    }

    if(GM_SETTINGS.naverBoardDefaultArticleCount !== "0" && Number(GM_SETTINGS.naverBoardDefaultArticleCount) > 0){
        // $(document).arrive(".BaseButton__txt", { onlyOnce: true, existing: true }, function (elem) {try{
        //     let $elem = $(elem);
        //     let text = $elem.text().replace(/\s/g,"");
        //     if(text === "목록"){
        //         let $a = $elem.closest("a");
        //         let src = $a.attr("href");
        //         src += `%26userDisplay%3D50${GM_SETTINGS.naverBoardDefaultArticleCount}`;
        //         $a.attr("href", src);
        //     }
        // } catch(e){
        //     NOMO_ERROR("Error from FasterNoticeHide", e);
        // }});
        $(function(){try{
            let $elems = $(".BaseButton__txt");
            $elems.each(function(i, elem){
                let $elem = $(elem);
                let text = $elem.text().replace(/\s/g,"");
                if(text === "목록"){
                    let $a = $elem.closest("a");
                    let src = $a.attr("href");
                    src += `%26userDisplay%3D50${GM_SETTINGS.naverBoardDefaultArticleCount}`;
                    $a.attr("href", src);
                }
            });
        } catch(e){
            NOMO_ERROR("Error from naverBoardDefaultArticleCount", e);
        }});
    }
}