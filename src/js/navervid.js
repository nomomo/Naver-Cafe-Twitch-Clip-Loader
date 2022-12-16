
import css_navervid from "css/navervid.css";
import { NOMO_DEBUG } from "./lib";

export function NAVER_VIDEO_EVENT_INIT(){
    GM_addStyle(css_navervid.toString());
    SET_NAVER_VIDEO_MAX_QUALITY();
    BIND_NAVER_VIDEO_RELOAD_EVENT();
    unsafeWindow.RELOAD_NAVER_PLAYER = RELOAD_NAVER_PLAYER;

    NAVER_VIDEO_ENHANCED_CLICK_EVENT();
}

export function SET_NAVER_VIDEO_MAX_QUALITY(){
    if(!GM_SETTINGS.naverVideoAutoMaxQuality){
        return;
    }
    $(document).arrive(".u_rmc_definition_ly", { existing: true }, function (elem) {
        setTimeout(function(){
            try{
                SET_NAVER_VIDEO_MAX_QUALITY_SUB(elem, false);
            }
            catch(e){
                NOMO_DEBUG("Error from naverVideoAutoMaxQuality arrive", e);
            }
        }, 1);
    });
}

export function SET_NAVER_VIDEO_MAX_QUALITY_SUB(elem, force){
    NOMO_DEBUG("TRY TO SET BEST QUALITY");
    var $elem = $(elem);
    var $u_rmcplayer = $elem.closest(".u_rmcplayer");
    if($u_rmcplayer.length === 0) {
        NOMO_DEBUG("no $u_rmcplayer");
        return;
    }

    if(force){
        $u_rmcplayer.removeClass("_QSET");
    }

    if($u_rmcplayer.hasClass("_QSET")) {
        NOMO_DEBUG("ALREADY QSET");
        return;
    }

    var $qli = $(elem).find("li");
    if($qli.length > 2){
        var $last = $qli.last();
        if($last.hasClass("u_rmc_on")) {
            NOMO_DEBUG("u_rmc_on - ALREADY QSET");
            return;
        }

        NOMO_DEBUG("BEST QUALITY SET", $last.text());
        $last.find("button").trigger("click");

        $u_rmcplayer.addClass("_QSET");
    }
    else{
        NOMO_DEBUG("no li elements for QSET");
    }
}

async function RELOAD_NAVER_PLAYER(id, errorelem){
    NOMO_DEBUG("RELOAD_NAVER_PLAYER", id);
    var fail = false;

    var $seModuleVideo = $("#"+id);
    var $seVideo = $seModuleVideo.closest("div.se-video");
    var $seModule = $seModuleVideo.closest("div.se-module");

    // get ori vid data
    var $seModuleData = $seVideo.find("script.__se_module_data");
    NOMO_DEBUG($seVideo, $seModuleData);
    var dataModule = JSON.parse($seModuleData.attr("data-module"));
    NOMO_DEBUG("dataModule", dataModule);
    var inkey_ori = dataModule.data.inkey;
    var vid_ori = dataModule.data.vid;

    // get new vid data
    var currUrl = document.location.href;
    var regexUrl = /^https:\/\/cafe.naver.com\/ca-fe\/cafes\/(\d+)\/articles\/(\d+)?.+menuid=(\d+)/;
    var matchedUrl = currUrl.match(regexUrl);
    NOMO_DEBUG(matchedUrl);

    var urlFetch = await fetch(`https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/${matchedUrl[1]}/articles/${matchedUrl[2]}?query=&menuId=${matchedUrl[3]}&boardType=L&useCafeId=true&requestFrom=A`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-cafe-product": "pc"
        },
        "referrer": currUrl,
        "referrerPolicy": "unsafe-url",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    NOMO_DEBUG("urlFetch", urlFetch);
    
    // fail
    if(urlFetch.status !== 200){
        NOMO_DEBUG("FAIL TO FETCH", urlFetch);
        fail = true;
    }

    if(!fail){
        var urlText = await urlFetch.json();
        NOMO_DEBUG("urlText", urlText);

        var vid_new = "";
        var inkey_new = "";

        var articleHtml = urlText.result.article.contentHtml;
        var $contentHtml = $(articleHtml);
        var $scripts = $contentHtml.find("script.__se_module_data");
        var found = false;
        for(var i=0;i<$scripts.length; i++){
            var $script = $($scripts[i]);
            dataModule = JSON.parse($script.attr("data-module"));
            vid_new = dataModule.data.vid;

            if(vid_ori == vid_new){
                inkey_new = dataModule.data.inkey;
                found = true;
                break;
            }
        }

        // fail
        if(!found){
            NOMO_DEBUG("FAIL TO GET NEW VID AND INKEY FOR NAVER VIDEO");
            fail = true;
        }
        else{
            NOMO_DEBUG("NEW VID AND INKEY", vid_new, inkey_new);

            var $nvidContainer = $(document).find(`div[data-navervid='${id}']`);
            if($nvidContainer.length !== 0){
                $nvidContainer.empty();
            }
            else{
                var $video = $seVideo.find("video").first();
                var videoOriWidth = $video.width();
                var videoOriHeight = $video.height();
                $seModule.hide();
                $nvidContainer = $(`<div data-navervid="${id}" style="width:${videoOriWidth}px;height:${videoOriHeight}px"></div>`);
                $seModule.after($nvidContainer);
            }
            var naverIframe = $(`<iframe name="mplayer" width="100%" height="100%" src="https://serviceapi.nmv.naver.com/view/ugcPlayer.nhn?vid=${vid_new}&amp;inKey=${inkey_new}&amp;wmode=opaque&amp;hasLink=0&amp;autoPlay=true&amp;beginTime=0&amp;elemid=${id}" frameborder="0" scrolling="no" allowfullscreen=""></iframe>`);
            $nvidContainer.first().append(naverIframe);
        }
    }

    if(fail){
        if(errorelem === undefined){
            return false;
        }

        var $errorelem = $(errorelem);

        if($errorelem.hasClass("naver_player_reload_error_btn")){
            $errorelem.html(`[[${GLOBAL.scriptName} v${GLOBAL.version}]]<br /> 플레이어 로드에 실패했습니다. 페이지를 직접 새로고침 하세요.`);
        }
        else{
            $errorelem.hide();
        }
    }
    else{
        return true;
    }
}

export function BIND_NAVER_VIDEO_RELOAD_EVENT(){
    if(!GM_SETTINGS.showNaverVideoRefreshBtn){
        return;
    }
    
    // event bind postmessafe from cafe main
    if(GLOBAL.isNaverCafeMain){
        window.addEventListener("message", function(e){
            if(e.origin === "https://serviceapi.nmv.naver.com" && e.data.type === "NCTCL_NAVERVID_RELOAD"){
                NOMO_DEBUG("message from serviceapi.nmv.naver.com", e.data);
                if(e.data.id !== undefined){
                    RELOAD_NAVER_PLAYER(e.data.id);
                }
            }
        });
    }
    
    // add btn on error
    $(document).arrive(".u_rmcplayer_error_container", { existing: true }, function (elem) {
        try{
            var $elem = $(elem);
            $elem.find(".u_rmc_error_txt").append(`<div class="naver_player_reload naver_player_reload_error_btn">[Naver Cafe Twitch Clip Loader ${GLOBAL.version}]<br />네이버 플레이어를 다시 로드하려면 여기를 클릭하세요.</div>`);
            NOMO_DEBUG("naver player arrive");
        }
        catch(e){
            NOMO_DEBUG("Error from video arrive", e);
        }
    });

    // add btn to naver player
    if(GLOBAL.isNaverVideoEmbed || GM_SETTINGS.showNaverVideoRefreshBtnOnPlayer){
        $(document).arrive(".u_rmc_controls_btn", { onlyOnce: true, existing: true }, function (elem) {
            try{
                var $elem = $(elem);
                $elem.prepend(`<div class="naver_player_reload_btn naver_player_reload" title="[NCTCLC] 클릭 시 네이버 비디오 플레이어를 다시 로드합니다.">Reload</div>`);
            }
            catch(e){
                NOMO_DEBUG("Error from video arrive", e);
            }
        });
    }

    // click reload btn event
    $(document).on("click", ".naver_player_reload", async function(e){
        try{
            if(GLOBAL.isNaverVideoEmbed){
                $(e.target).hide();
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                NOMO_DEBUG("SEND POST MESSAGE", urlParams.get("elemid"));
                window.parent.postMessage({"type":"NCTCL_NAVERVID_RELOAD", "id":urlParams.get("elemid")}, "https://cafe.naver.com");
            }
            else{
                try{
                    let $video = $(e.target).closest(".se-module-video").find("video");
                    if($video.length !== 0) $video[0].pause();
                }
                catch(e){
                    NOMO_DEBUG("Error from naver video pause", e);
                }
                RELOAD_NAVER_PLAYER($(e.target).closest(".se-module-video").attr("id"), e.target);
            }
        }
        catch(e){
            NOMO_DEBUG("Error from naver_player_reload arrive", e);
        }
    });
}

var backgroundDblclicked = false;
var dblclickSetTimeout = undefined;
export function NAVER_VIDEO_ENHANCED_CLICK_EVENT(){
    if(!GM_SETTINGS.NaverVideoEnhancedClickDebug) return;
    NOMO_DEBUG("NAVER_VIDEO_ENHANCED_CLICK_EVENT");
    Element.prototype._addEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(a,b,c){
        if(a.toLowerCase() === "mousedown"){
            NOMO_DEBUG(`[NVEC] MOUSEDOWN EVENT HIJACKING. id = ${this.id}, nodeName = ${this.nodeName}`);
            if(this.id.indexOf("rmcPlayer_") !== -1 && this.nodeName.toLowerCase() === "div"){
                NOMO_DEBUG("[NVEC] FOUND MOUSEDOWN TARGET ELEMENT.", a,b,c,this);
                let _b = b;
                b = function(e){
                    if(!e.NCTCL){
                        return;
                    }
                    else{
                        _b(e);
                    }
                };
            }
        }

        if(a.toLowerCase() === "mouseup"){
            NOMO_DEBUG(`[NVEC] MOUSEUP EVENT HIJACKING. id = ${this.id}, nodeName = ${this.nodeName}`);
            if(this.id.indexOf("rmcPlayer_") !== -1 && this.nodeName.toLowerCase() === "div"){
                NOMO_DEBUG("[NVEC] FOUND MOUSEUP TARGET ELEMENT.", a,b,c,this);
                let _b = b;
                b = function(e){
                    var $target = $(e.target);
                    var $parent = $target.closest(".u_rmcplayer");

                    if($target.hasClass("u_rmcplayer_control") || $target.closest(".u_rmcplayer_control").length !== 0) return;

                    var new_e = {};
                    for(var key in e){
                        if(key == "type"){
                            new_e[key] = "mousedown";
                        }
                        else{
                            new_e[key] = e[key];
                        }
                    }
                    new_e["NCTCL"] = true;

                    _b(new_e);
                    _b(e);
                    
                    if(backgroundDblclicked){
                        clearTimeout(dblclickSetTimeout);
                        backgroundDblclicked = false;
                        $parent.find("button.u_rmc_full_ic").click();
                    }
                    else{
                        backgroundDblclicked = true;
                        clearTimeout(dblclickSetTimeout);
                        dblclickSetTimeout = setTimeout(function(){
                            backgroundDblclicked = false;
                        },300);
                    }           
                };
            }
        }

        if(c==undefined)
            c=false;
        this._addEventListener(a,b,c);
    };
}