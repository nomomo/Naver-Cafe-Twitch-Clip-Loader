import {NOMO_DEBUG} from "js/lib/lib";
import theme_dark from "css/theme_dark.css";

var isDarkModeInitialized = false;
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

        $(document).arrive('.content', function(){
            if(isDarkMode){
                adjustAllText($(this), 0.9, 0.0, 64);
            }
        });
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
            isDarkModeInitialized = true;
            themeCSSElem = GM_addStyle(theme_dark.toString().replace(/(\.skin-1080)/g, "html[data-theme='dark'] body"));
        
            adjustAllText($(".content"), 0.9, 0.1, 32);
            $("html").attr("data-theme","dark");
        }
        else if (isDarkModeInitialized)
        {
            $("html").attr("data-theme","default");
            restoreAllText($(".content"));
        }
    }
    catch(e){
        NOMO_DEBUG("Error from applyTheme", e);
    }
}


// "rgb(r, g, b)" 또는 "rgba(r, g, b, a)" 문자열을 [r, g, b] 배열로 파싱
function parseRGB(str) {
    const m = str.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i);
    return m ? [ +m[1], +m[2], +m[3] ] : null;
}

// 사람 눈에 맞춘 명도 계산 (0~255)
function getBrightness([r, g, b]) {
    return (r * 0.299 + g * 0.587 + b * 0.114);
}

// 밝게: 새로운 채널 = c + (255 - c) * amount
function lighten([r, g, b], amount) {
    return [
        Math.round(r + (255 - r) * amount),
        Math.round(g + (255 - g) * amount),
        Math.round(b + (255 - b) * amount),
    ];
}

// 어둡게: 새로운 채널 = c * (1 - amount)
function darken([r, g, b], amount) {
    return [
        Math.round(r * (1 - amount)),
        Math.round(g * (1 - amount)),
        Math.round(b * (1 - amount)),
    ];
}


  // ——————————————————————————————
  // 텍스트·배경색 조정 함수
  // ——————————————————————————————
  function adjustAllText($container, amtLight, amtDark, thresh) {
    $container.find('*').each(function(){
      var $el = $(this),
          cs  = window.getComputedStyle(this),
          // inline style 우선 읽기
          inlineColor = this.style.color,
          inlineBg    = this.style.backgroundColor;

      // ------------ color 백업 ------------
      if (!$el.attr('data-orig-color')) {
        if(inlineColor){
            $el.attr('data-orig-color', inlineColor);
        }
      }
      // computed에서 parse 후 명도 판단
      var rgbC = parseRGB(cs.color);
      if (rgbC) {
        var b = getBrightness(rgbC),
            newC = b < thresh ? lighten(rgbC, amtLight) : darken(rgbC, amtDark);
        $el.css('color', 'rgb('+ newC.join(',') +')');
      }

      // ---------- background-color 백업 ----------
      if (!$el.attr('data-orig-bg')) {
        var compBg = cs.backgroundColor;
        if(inlineBg){
            $el.attr('data-orig-bg', inlineBg);
        }
      }
      // 투명 아닌 경우만 조정
      var bgC = cs.backgroundColor;
      if (bgC && bgC !== 'transparent' && bgC !== 'rgba(0, 0, 0, 0)') {
        var rgbB = parseRGB(bgC);
        if (rgbB) {
          var bb = getBrightness(rgbB);
          if (bb > thresh) {
            var newB = darken(rgbB, amtLight);
            $el.css('background-color', 'rgb('+ newB.join(',') +')');
          }
        }
      }
    });
  }

  function restoreAllText($container) {
    NOMO_DEBUG("restoreAllText");
    $container.find('*').each(function(){
      var $el = $(this);
  
      // color 복원 혹은 제거
      if ($el.is('[data-orig-color]')) {
        $el.css('color', $el.attr('data-orig-color'))
           .removeAttr('data-orig-color');
      } else {
        $el.css('color', '');
      }
  
      // background-color 복원 혹은 제거
      if ($el.is('[data-orig-bg]')) {
        $el.css('background-color', $el.attr('data-orig-bg'))
           .removeAttr('data-orig-bg');
      } else {
        $el.css('background-color', '');
      }
    });
  }