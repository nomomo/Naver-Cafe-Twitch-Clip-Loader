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
        html{overflow-y:hidden;};
        body::-webkit-scrollbar { width: 8px; height: 8px; background: #eee; }
        body::-webkit-scrollbar-thumb { background: #ccc; }
        body #GM_setting .GM_setting_list_head {vertical-align:bottom;}
        body #wrap {display:none;}
        body {background-color:#f5f5f5 !important;overflow-y: scroll;  height: 100dvh;}
        body #GM_setting .form-check-input:checked{background-color: #2DB400; border-color: #2DB400;}
        body #GM_setting .btn.btn-primary {filter: hue-rotate(280deg);}
    `);
    var GM_Setting_Bootstrap = 'GM_Setting_Bootstrap';
    if (!document.getElementById(GM_Setting_Bootstrap)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = GM_Setting_Bootstrap;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        //link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css';
        link.crossOrigin ="anonymous";
        link.href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css";
        link.integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9";
        link.media = 'all';
        head.appendChild(link);

        
        GM.addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        #GM_setting, #GM_setting .GM_setting_title, #GM_setting .GM_setting_desc, #GM_setting .GM_setting_logo, #GM_setting .GM_homepage_link
        {font-family: 'Inter',"맑은 고딕",Malgun Gothic,"돋움",dotum,sans-serif;}
        `);
    }

    document.title = "Naver-Cafe-Clip-Loader 상세 설정 페이지";
    GM_setting.createlayout($("body"));
}