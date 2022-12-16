import {reCalculateIframeWidth, autoPauseVideo} from "js/page/page_cafe_main";
import { NOMO_DEBUG } from "./lib";

export var YTPlayers = {};
export function INSERT_YOUTUBE_SCRIPT(){
    if(!GM_SETTINGS.useYoutube) return;

    try{
        $("head").prepend(`<script async type="text/javascript" src="https://www.youtube.com/iframe_api"></script>`);
    }
    catch(e){
        NOMO_DEBUG("FAIL TO LOAD YOUTUBE IFRAME API. TRY TO INSERT YT API MANUALLY", e);
        // eslint-disable-next-line
        var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/4c3f79c5\/www-widgetapi.vflset\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}if(!window["YT"])var YT={loading:0,loaded:0};if(!window["YTConfig"])var YTConfig={"host":"https://www.youtube.com"};if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i++)try{l[i]()}catch(e$0){}};YT.setConfig=function(c){for(var k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=document.getElementsByTagName("script")[0];if(!b){document.getElementsByTagName('head')[0].appendChild(a)}else{b.parentNode.insertBefore(a,b)}})()};
    }

}

// for yt clip
export function createYTIframe(clipId, autoPlay, YTID, YTStart, YTEnd, YTclipt, videoWidth, videoHeight, recur){
    try{
        if(YT === undefined || !YT.loading) {
            NOMO_DEBUG("[createYTIframe] There is no youtube iframe api yet, reload", clipId, recur);
            if(recur < 10){
                setTimeout(function(){
                    createYTIframe(clipId, autoPlay, YTID, YTStart, YTEnd, YTclipt, videoWidth, videoHeight, recur + 1);
                },(recur + 1) * 100);
                return;
            }
            else{
                return;
            }
        }

        var YTElemID = "NCTCL-"+clipId;
        var YTOptions = {
            "height": videoHeight,
            "width": videoWidth,
            "videoId": YTID,
            "playerVars": {
                'autoplay': (autoPlay ? 1 : 0),
                'autohide': 1,
                'showinfo': 0,
                'controls':1,
                'loop': 0,
                'clip': clipId
            },
            "suggestedQuality":"hd1080", // highres hd1080
            "events": {
                'onReady': onYTPlayerReady,
                'onStateChange': onYTPlayerStateChange
            }
        };
        if(YTStart !== undefined) YTOptions["playerVars"]["start"] = YTStart;
        if(YTEnd !== undefined) YTOptions["playerVars"]["end"] = YTEnd;
        if(YTclipt !== undefined) YTOptions["playerVars"]["clipt"] = YTclipt;
        NOMO_DEBUG("CREATE YTPlayer", clipId, YTOptions);
        YTPlayers[clipId] = new YT.Player(YTElemID, YTOptions);
    }
    catch(e){
        NOMO_DEBUG("Error from createYTIframe", e);
    }
}

// to convert old yt
export function createYTIframeArriveSub(elem, src, videoWidth, videoHeight, recur){
    try{
        if(YT === undefined || !YT.loading) {
            NOMO_DEBUG("[createYTIframeArriveSub] There is no youtube iframe api yet, reload", recur);
            if(recur < 10){
                setTimeout(function(){
                    createYTIframeArriveSub(elem, src, videoWidth, videoHeight, recur + 1);
                },(recur + 1) * 100);
                return;
            }
            else{
                $(elem).closest("div.se-module-oembed").addClass("fired");
                return;
            }
        }

        var $elem = $(elem);
        if($elem.parent(".fired").length !== 0) return;
        $elem.closest("div.se-module-oembed").addClass("fired");
        //var src = $elem.attr("src");

        if(/^https:\/\/www\.youtube\.com\/embed/.test(src)){
            $elem.closest("div.se-module-oembed").addClass("oembed_NCTCL");
            var YTID = src.match(/\/embed\/([a-zA-Z0-9-_]+)/);
            var YTStart = src.match(/start=(\d+)/);
            var YTEnd = src.match(/end=(\d+)/);

            NOMO_DEBUG("Parse Youtube", YTID, YTStart, YTEnd);

            if(YTID === null || YTID.length < 2) return;
            YTID = YTID[1];
            if(YTPlayers[YTID] !== undefined) return;

            NOMO_DEBUG($elem, src);

            var YTElemID = `NCTCL-${YTID}`;
            var $newYTElem = $(`<div id="${YTElemID}" data-clip-id="${YTID}" class="NCTCL-YT-CONVERTED fired"></div>`);
            $elem.append($newYTElem);

            var $article_container = $("div.article_container");
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }

            var YTOptions = {
                "height": videoHeight,
                "width": videoWidth,
                "videoId": YTID,
                "playerVars": {
                    'autoplay': 0,
                    'autohide': 1,
                    'showinfo': 0,
                    'controls': 1
                },
                "suggestedQuality":"hd1080", // highres hd1080
                "events": {
                    'onReady': onYTPlayerReady,
                    'onStateChange': onYTPlayerStateChange
                }
            };
            if(YTStart !== null && YTStart.length > 1) YTOptions["playerVars"]["start"] = YTStart[1];
            if(YTEnd !== null && YTEnd.length > 1) YTOptions["playerVars"]["end"] = YTEnd[1];
            YTPlayers[YTID] = new YT.Player(YTElemID, YTOptions);
            
            //$elem.remove();
            
            NOMO_DEBUG("YT IFRAME CONVERTED", YTID);
        }
    }
    catch(e){
        NOMO_DEBUG("Error from arrive (for youtube)", e);
    }
}

export function onYTPlayerReady(event) {
    //event.target.playVideo();
    //event.target.loadVideoById({'videoId':YTID, 'startSeconds':30});
    //event.target.pauseVideo();
}
export function onYTPlayerStateChange(event) {
    //console.log("event", event);

    try{
        var dataset;
        if(event.target.o !== undefined && event.target.o.dataset !== undefined){
            dataset = event.target.o.dataset;
        }
        else if(event.target.i !== undefined && event.target.i.dataset !== undefined){
            dataset = event.target.i.dataset;
        }
        else if(event.target.s !== undefined && event.target.s.dataset !== undefined){
            dataset = event.target.s.dataset;
        }
        else if(event.target.g !== undefined && event.target.g.dataset !== undefined){
            dataset = event.target.g.dataset;
        }
        else if(event.target.m !== undefined && event.target.m.dataset !== undefined){
            dataset = event.target.m.dataset;
        }



        var clipId = "";
        if(dataset === undefined) {
            NOMO_DEBUG("clipId is undefined", event);
            return;
        }
        else{
            clipId = dataset["clipId"];
        }
        var playerState = event.data == YT.PlayerState.ENDED ? '종료됨' : event.data == YT.PlayerState.PLAYING ? '재생 중' : event.data == YT.PlayerState.PAUSED ? '일시중지 됨' : event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' : event.data == YT.PlayerState.CUED ? '재생준비 완료됨' : event.data == -1 ? '시작되지 않음' : '예외';
        NOMO_DEBUG("YOUTUBE PLAYER STATE CHANGED", clipId, event, playerState);
        if(GM_SETTINGS.autoPauseOtherClips){
            if(event.data == YT.PlayerState.PLAYING){
                setTimeout(function(){
                    autoPauseVideo({
                        "origin":"https://clips.twitch.tv",
                        "data":{"type":"NCTCL", "event":"play", "clipId":clipId},
                    });
                },1);
            }
        }
    }
    catch(e){
        NOMO_DEBUG("Error from onYTPlayerStateChange", e);
    }
}
export function stopYTVideo(clipId) {
    YTPlayers[clipId].stopVideo();
}
export function pauseYTVideo(clipId) {
    YTPlayers[clipId].pauseVideo();
}
export function playYTVideo(clipId) {
    YTPlayers[clipId].playVideo();
}

export var YTClipInfo = {};
export function getYTClipPageInfoXHR(clipId, href, iter, callback) {
    //var YTStart = href.match(/start=(\d+)/);
    //var YTEnd = href.match(/end=(\d+)/);
    //if(YTStart !== null){ YTStart = YTStart[1]; } else { YTStart = undefined; }
    //if(YTEnd !== null){ YTEnd = YTEnd[1]; } else { YTEnd = undefined; }
    if(iter > 100){
        NOMO_DEBUG("getYTClipPageInfoXHR - MAX ITERATION", clipId, iter);
    }

    if(YTClipInfo[clipId] !== undefined){
        if(YTClipInfo[clipId]["loading"]){
            NOMO_DEBUG("NOW LOADING", YTClipInfo[clipId]);
            setTimeout(function(){
                getYTClipPageInfoXHR(clipId, href, iter+1, callback);
            },100);
            return;
        }
        else if(YTClipInfo[clipId]["loaded"]){
            NOMO_DEBUG("ALREADY LOADED", YTClipInfo[clipId]);
            if(callback !== undefined){
                callback();
            }
            return;
        }
    }
    YTClipInfo[clipId] = {"loading":true, "loaded":false};

    GM.xmlHttpRequest({
        method: "GET",
        url: href,
        headers: {},
        onload: function(response) {
            if(response.status === 200){
                var rpt = response.responseText;
                //NOMO_DEBUG("rpt", rpt);
                //https://i.ytimg.com/sb/fMVhKbdsXmU/storyboard3_L$L/$N.jpg?sqp=-oaymwENSDfyq4qpAwVwAcABBqLzl_8DBgjOqr2bBg==|48#27#100#10#10#0#default#rs$AOn4CLDs9EcBxA6-8F51CG6Yeo362ueKDA|80#45#686#10#10#10000#M$M#rs$AOn4CLB6VRt7MmIx6qhJYRpS-km_LCLgxQ|160#90#686#5#5#10000#M$M#rs$AOn4CLB5rxf3hc0c1nW6CY78X1CXPkkyzg
                var rpt_match = rpt.match(/<link itemprop="embedUrl" href="([a-zA-Z0-9-_./:=&;?]+)">/);
                var rpt_match2 = rpt.match(/"playerStoryboardSpecRenderer":{"spec":"([a-zA-Z0-9-_,./?=|!@#$%^&*():]+)"}/);
                var rpt_match3 = rpt.match(/"lengthSeconds":"(\d+)"/);
                var rpt_match4 = rpt.match(/"startTimeMs":"(\d+)"/);
                var rpt_match5 = rpt.match(/"endTimeMs":"(\d+)"/);

                if(rpt_match !== null && rpt_match2 !== null && rpt_match3 !== null && rpt_match4 !== null && rpt_match5 !== null){
                    YTClipInfo[clipId]["loading"] = false;
                    YTClipInfo[clipId]["loaded"] = true;
                    YTClipInfo[clipId].url = rpt_match[1];
                    YTClipInfo[clipId].storyBoardSpec = rpt_match2[1];
                    YTClipInfo[clipId].seconds = rpt_match3[1];
                    YTClipInfo[clipId].storyBoard = YTStoryBoard("url", YTClipInfo[clipId].storyBoardSpec, true, YTClipInfo[clipId].seconds);
                    YTClipInfo[clipId].startTime = Number(rpt_match4[1]) / 1000.0;
                    YTClipInfo[clipId].endTime = Number(rpt_match5[1]) / 1000.0;
                    YTClipInfo[clipId].foundStoryBoardUrl = undefined;
                    YTClipInfo[clipId].foundStoryBoardSeq = undefined;

                    var midTime = (YTClipInfo[clipId].endTime - YTClipInfo[clipId].startTime) / 2.0 + YTClipInfo[clipId].startTime;

                    // find image in storyboard
                    for(var i=0; i<YTClipInfo[clipId].storyBoard.length; i++){
                        var sb = YTClipInfo[clipId].storyBoard[i];
                        if(sb.start <= midTime && sb.end > midTime){
                            var seq = Math.floor((midTime - sb.start) / sb.slice) + 1;

                            if(seq < 0){
                                seq = 0;
                            }
                            else if(seq >= (sb.no - 1)){
                                seq = sb.no - 1;
                            }

                            NOMO_DEBUG("found storyboard image", seq, sb.url);
                            YTClipInfo[clipId].foundStoryBoardUrl = sb.url;
                            YTClipInfo[clipId].foundStoryBoardSeq = seq;
                        }
                    }

                    NOMO_DEBUG("YTClipInfo[clipId]", YTClipInfo[clipId]);
                }
                else{
                    YTClipInfo[clipId]["loading"] = false;
                    YTClipInfo[clipId]["loaded"] = false;
                    NOMO_DEBUG("getYTClipPageInfoXHR FAIL", getYTClipPageInfoXHR);
                    NOMO_DEBUG("rpt_match", rpt_match);
                    NOMO_DEBUG("rpt_match2", rpt_match2);
                }

                if(callback !== undefined){
                    callback();
                }
            }
            else{
                if(callback !== undefined){
                    YTClipInfo[clipId]["loading"] = false;
                    YTClipInfo[clipId]["loaded"] = true;
                    callback();
                }
            }
        }
    });
}

// step
// 1. 화면에 기본 yt thumbnail 이미지가 보이는지 확인
// 2. 보이는 경우, function call
// 3. xhr 로 정보 긁어옴 --> 긁어온것 저장
// 4. image 긁어옴
// 5. image load 시도
// 6. image load 성공한경우, load 된 걸로 갈아치움
// 7. user 가 플레이 버튼 클릭 시, 긁어온게 있는 경우 긁어온걸로 재생 함, 없는 경우 새로 긁어와서 재생함

/**
 * yt-storyboard
 * https://github.com/evanzummeren/yt-storyboard
 * MIT LICENSE
 * 위 코드를 기반으로 수정함
 * @param {string} spec – A string containing the playerStoryboardSpecRenderer.spec
 * @param {boolean} hq – High quality true
 * @param {number} seconds – Duration of the YouTube video
 */
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

function setThumbnailFromStoryBoardImage(clipId, $elem){
    if(YTClipInfo === undefined || YTClipInfo[clipId] === undefined || YTClipInfo[clipId].foundStoryBoardUrl === undefined || YTClipInfo[clipId].foundStoryBoardSeq === undefined){
        return;
    }

    // se-oglink-thumbnail-resource
    $elem.attr("src", YTClipInfo[clipId].foundStoryBoardUrl);
    //YTClipInfo[clipId].foundStoryBoardSeq = seq;
}