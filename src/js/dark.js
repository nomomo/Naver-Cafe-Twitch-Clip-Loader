import {NOMO_DEBUG} from "js/lib/lib";
import theme_dark from "css/theme_dark.css";

var isDarkMode = false;
var $darkModeBtn = $(`<span title="[NCCL] 클릭 시 다크 모드를 ${isDarkMode ? "비활성화" : "활성화"} 합니다." id="darkModeBtn">어두운 모드 ${isDarkMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
    .on("click", async () => {
        NOMO_DEBUG("어두운 모드", isDarkMode , "->", !isDarkMode);
        isDarkMode = !isDarkMode;
        if(isDarkMode){
            $darkModeBtn.html(`어두운 모드 켜짐<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c">`);
        }
        else{
            $darkModeBtn.html(`어두운 모드 꺼짐<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c">`);
        }
        await GM.setValue("darkMode", isDarkMode);
        if (typeof GM.addValueChangeListener === "function"){
            applyDarkMode();
        }
        else{
            location.reload();
        }
    });
export async function DARKMODE_INIT(){
    isDarkMode = await GM.getValue("darkMode", false);
    if (typeof GM.addValueChangeListener === "function"){
        GM.addValueChangeListener("darkMode", async function (val_name, old_value, new_value, remote) {
            if (remote) {
                NOMO_DEBUG("다른 창에서 설정 변경됨. val_name, old_value, new_value, location:", val_name, old_value, new_value, document.location.href);
                applyDarkMode();
            }
        });
    }
    
    $(document).ready(function(){
        if(GM_SETTINGS.showDarkModeBtn){
            let $gnbmenu = $("#gnb-menu");
            if($gnbmenu.length !== 0 && $("#darkModeBtn").length === 0){
                $gnbmenu.prepend($darkModeBtn);
                return;
            }

            $gnbmenu = $(".gnb_menu");
            if($gnbmenu.length !== 0 && $("#darkModeBtn").length === 0){
                setTimeout(function(){
                    $gnbmenu.prepend($darkModeBtn);
                    $darkModeBtn.addClass("gnb_item").css("margin-top", "0px");
                },1000);
            }
        }
    });
    applyDarkMode();
}

var themeCSSElem = undefined;
async function applyDarkMode(){
    try{
        isDarkMode = await GM.getValue("darkMode", false);
        GLOBAL.isDarkMode = isDarkMode;
        NOMO_DEBUG("어두운 모드", isDarkMode);
        $darkModeBtn.attr("title", `[NCCL] 클릭 시 다크 모드를 ${isDarkMode ? "비활성화" : "활성화"} 합니다.`);
        if(themeCSSElem !== undefined) $(themeCSSElem).remove();
        if(isDarkMode){
            themeCSSElem = GM_addStyle(theme_dark.toString().replace(/(\.skin-1080)/g, "html[data-theme='dark'] body"));
        
            $("html").attr("data-theme","dark");
        }
        else
        {
            $("html").attr("data-theme","default");
        }
    }
    catch(e){
        NOMO_DEBUG("Error from applyTheme", e);
    }
}