import { NOMO_DEBUG } from "../lib/lib";

export default function PAGE_SETTING(){
    NOMO_DEBUG("== PAGE_SETTING ==");
    $("body").empty().css("padding","0px 30px 0px 30px");
    var $styles = $("head").find("style");
    $styles.each(function(i, v){
        var $v = $(v);
        if($v.attr("id") == undefined){
            $v.remove();
        }
    });

    GM_addStyle(`
        body::-webkit-scrollbar { width: 8px; height: 8px; background: #eee; }
        body::-webkit-scrollbar-thumb { background: #ccc; }
        body #GM_setting .GM_setting_list_head {vertical-align:bottom;}
    `);
    var GM_Setting_Bootstrap = 'GM_Setting_Bootstrap';
    if (!document.getElementById(GM_Setting_Bootstrap)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = GM_Setting_Bootstrap;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css';
        link.media = 'all';
        head.appendChild(link);
    }

    document.title = "Naver-Cafe-Clip-Loader 상세 설정 페이지";
    GM_setting.createlayout($("body"));
}