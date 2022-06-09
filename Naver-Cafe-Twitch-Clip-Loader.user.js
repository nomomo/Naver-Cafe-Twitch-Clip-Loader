// ==UserScript==
// @name        Naver-Cafe-Twitch-Clip-Loader
// @namespace   Naver-Cafe-Twitch-Clip-Loader
// @version     0.5.1
// @description Userscript that makes it easy to watch Twitch clips on Naver Cafe
// @author      Nomo
// @include     https://cafe.naver.com/*
// @include     https://clips.twitch.tv/*
// @supportURL  https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues
// @homepage    https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/
// @run-at      document-start
// @grant       GM.addStyle
// @grant       GM_addStyle
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @grant       GM.listValues
// @grant       GM_listValues
// @grant       GM.info
// @grant       GM_info
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM.addValueChangeListener
// @grant       GM_addValueChangeListener
// @grant       GM.removeValueChangeListener
// @grant       GM_removeValueChangeListener
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(async () => {
    'use strict';
    if(window.self === window.top && /(^https:\/\/clips\.twitch\.tv\/)/.test(document.location.href)) return;   
    if(window.self !== window.top && /(^https:\/\/clips\.twitch\.tv\/)/.test(document.location.href) && !(/(parent=(cafe|www)?\.?naver\.com)/.test(document.location.href))) return;

    console.log("[NCTCL]   Naver-Cafe-Twitch-Clip-Loader", document.location.href);
    var DEBUG = await GM.getValue("DEBUG", false);
    unsafeWindow.NCTCL_DEBUG_TOGGLE = function(){DEBUG=!DEBUG;GM.setValue("DEBUG", DEBUG);return `DEBUG = ${DEBUG}`};
    var isTwitch = /(^https:\/\/clips\.twitch\.tv\/)/.test(document.location.href);
    var isTwitchMuted = (isTwitch && document.location.href.indexOf("muted=true") !== -1);

    ////////////////////////////////////////////////////////////////////////////////////
    // libs
    ////////////////////////////////////////////////////////////////////////////////////
    {
        var NOMO_DEBUG = function ( /**/ ) {
            if (DEBUG) {
                var args = arguments, args_length = args.length, args_copy = args;
                for (var i = args_length; i > 0; i--) args[i] = args_copy[i - 1];
                args[0] = "[NCTCL]  ";
                args.length = args_length + 1;
                console.log.apply(console, args);
            }
        };

        /* arrive.js
        * v2.4.1
        * https://github.com/uzairfarooq/arrive
        * MIT licensed
        * Copyright (c) 2014-2017 Uzair Farooq
        */
        // eslint-disable-next-line no-cond-assign
        const Arrive = function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback);}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave");}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n);},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n;};},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback);},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r);},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r;},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t;}};}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null;};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i;},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null);}},e.prototype.beforeAdding=function(e){this._beforeAdding=e;},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e;},e;}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n);});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o;}),i.beforeRemoving(function(e){e.observer.disconnect();}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n);},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1;});},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1;}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1;},i.removeEvent(t);},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1;});},this;},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t;}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t);});}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1;}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a);}c.call(this,e,t,r);},f;},u=function(){function e(){var e={childList:!0,subtree:!0};return e;}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t);});}function r(e,t){return l.matchesSelector(e,t.selector);}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r);},d;},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h;}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);

        /* GM_setting.js
        * Version: May. 19, 2022
        * MIT licensed
        * https://github.com/nomomo/
        * nomotg@gmail.com
        * Copyright (c) 2017-2022 NOMO
        */
        // eslint-disable-next-line
        var GM_setting=function(e,t,n){var i,a=void 0,s="",o=[],r={},l={},_={},d={},c=!1,p=function(){if(c){for(var e=arguments,t=e.length,n=e,i=t;i>0;i--)e[i]=n[i-1];e[0]="+[GM_SETTINGS]  ",e.length=t+1,console.log.apply(console,e)}},g=(navigator.language||navigator.userLanguage).toLowerCase().substring(0,2),u=g,v="ko",f=!1;const h={en:{title_settings:"Settings",title_reset:"Reset",donate:"Donate",buymeacoffee:"Buy me a coffee",buymeacoffeeDesc:"Support my projects by buying me a coffee! ☕",toonation:"Toonation",button_reset_settings:"Reset Settings",confirm_reset_settings:"Are you sure you want to reset the settings?",complete_reset_settings:"Settings reset complete!",button_reset_settings_all:"Script reset (refresh is required)",confirm_reset_settings_all:"Do you really want to reset script?",complete_reset_settings_all:"Script initialization complete!",auto_saved:"Autosaved: ",err_val_req:"A value must be entered.",err_num_req:"Only numbers can be entered.",err_num_over:"The input value must be a number greater than or equal to : ",err_num_not_more_than:"The input value must be a number less than or equal to: ",err_valid_array_string:"Only English letters, numbers, commas (,) and underscores (_) can be entered.",err_value_empty:"Something for which no value exists, such as an empty value.",err_value_dup:"Duplicate value exists: ",err_value_blank:"There is an item of a space in the string: "},ko:{title_settings:"Settings",title_reset:"Reset",donate:"후원하기",buymeacoffee:"Buy me a coffee 로 커피 한 잔 사주기",buymeacoffeeDesc:"커피 한 잔☕ 으로 프로젝트를 지원해주세요~",toonation:"Toonation 으로 후원하기",button_reset_settings:"Reset Settings",confirm_reset_settings:"진짜 설정을 초기화 할까요?",complete_reset_settings:"설정 초기화 완료!",button_reset_settings_all:"전체 초기화(새로고침 필요)",confirm_reset_settings_all:"진짜 스크립트를 모두 초기화 할까요?",complete_reset_settings_all:"스크립트 초기화 완료!",auto_saved:"자동 저장 됨: ",err_val_req:"반드시 값이 입력되어야 합니다.",err_num_req:"숫자만 입력 가능합니다.",err_num_over:"입력 값은 다음 값 이상의 숫자이어야 합니다. : ",err_num_not_more_than:"입력 값은 다음 값 이하의 숫자이어야 합니다. : ",err_valid_array_string:"영문, 숫자, 콤마(,), 언더바(_) 만 입력 가능합니다.",err_value_empty:"공백 값 등 값이 존재하지 않는 항목이 존재합니다.",err_value_dup:"중복된 값이 존재합니다: ",err_value_blank:"문자열 내 공백이 존재하는 항목이 있습니다: "}};var G=function(e){var t="";if("object"==typeof e){var n=Object.keys(e);if(0===n.length)return t;t=void 0!==e[u]?e[u]:void 0!==e[v]?e[u]:e[n[0]]}else t=e;return t},M=function(e){return void 0!==h[u]?h[u][e]:void 0!==h[v]?h[v][e]:""},m=async function(){""!==s&&await GM.setValue(s,_),t[s]=_,e.each(o,function(e,t){void 0!==l[t]&&void 0!==l[t].change&&l[t].change(_[t])}),o=[]},x=async function(){p("load_"),""!==s&&(_=await GM.getValue(s,_)),_.Lang=await y(),t[s]=_},y=async function(){return u=await GM.getValue("GM_SETTING_LANG",g),p("loadLang_",u),u},b=function(t){d={};var n=e(t);i=n,0!==n.find("#GM_setting_container").length&&n.empty();var s=e("<div id='GM_setting_container'></div>"),o=e(`\n<div id='GM_setting_head'>\n<div style='height:25px;display:inline-block;white-space:nowrap'>Settings</div>\n<div style='display:flex;height:25px;float:right;'>\n    <div id='GM_homepage_link' style='align-self: flex-end;'>\n        <a href='${GM.info.script.homepage}' target='_blank' style='font-size:12px;font-weight:normal;align-self:flex-end;'>${GM.info.script.name} v${GM.info.script.version} (${GM.info.script.homepage})</a>\n    </div>\n    <div id='GM_multilang' style='margin-left:15px;'>\n        <select id='GM_multilang_select' class="form-control input-sm">\n            <option value="ko">한국어</option>\n            <option value="en">English</option>\n        </select>\n    </div>\n</div>\n</div>`);void 0!==GM.info&&null!==GM.info&&void 0!==GM.info.script&&null!==GM.info.script&&void 0!==GM.info.script.homepage&&null!==GM.info.script.homepage&&""!==GM.info.script.homepage?o.find("#GM_homepage_link").show():o.find("#GM_homepage_link").hide();var r=o.find("#GM_multilang");if(f){r.show();var c=r.find("#GM_multilang_select");c.val(u),c.on("change",async function(t){var n=u;e("option:selected",this),this.value;u=this.value,p(`LANG VALUE CHANGED FROM ${n} TO ${u}`),await async function(e){null==e?(await GM.setValue("GM_SETTING_LANG",u),p("saveLang_",u)):(await GM.setValue("GM_SETTING_LANG",e),p("saveLang_",e))}(),null!=a?(e(a).empty(),b(a)):p("NO CREATED LAYOUT")})}else r.hide();var g=e("<ul id='GM_setting'></ul>"),v=void 0;for(var h in n.append(s),s.append(o).append(g),l){var m,x,y=l[h].category,w=l[h].depth,$=l[h].type,S=G(l[h].title),L=G(l[h].desc),z=G(l[h].category_name),N=l[h].radio_enable_value,O=e("<div class='GM_setting_input_container form-group'></div>"),E="tag"===$||"textarea"===$;if("radio"===$){var C=l[h].radio;for(var q in m=e("<div GM_setting_type='radio'></div>"),C){var V=e("<label class='radio-inline'>"+G(C[q].title)+"</label>");e("<input name='GM_setting_"+h+"' class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' onfocus='this.blur()' />").attr({value:C[q].value,type:"set"===$?"text"===$:"tag"===$?"textarea":$,GM_setting_type:$,GM_setting_key:h,GM_setting_category:void 0===y?"default":y,GM_setting_radio_enable_value:void 0===N?"none":N}).prependTo(V),m.append(V)}}else if("combobox"===$){var U=l[h].options;for(var j in m=e(`<select name="GM_setting_${h}" class='form-control input-sm select-inline'></select>`).attr({GM_setting_type:$,GM_setting_key:h,GM_setting_category:void 0===y?"default":y,GM_setting_radio_enable_value:void 0===N?"none":N}),U){var I=e(`<option spellcheck='false' value="${j}" onfocus='this.blur()'>${G(U[j].title)}</option>`);m.append(I)}}else m=e(`<${E?"textarea ":"input "} class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' ${"checkbox"===$?"onfocus='this.blur()'":""}${E?"></textarea>":" />"}`).attr({type:"set"===$?"text"===$:"tag"===$?"textarea":$,GM_setting_type:$,GM_setting_key:h,GM_setting_category:void 0===y?"default":y,GM_setting_radio_enable_value:void 0===N?"none":N});x=e(void 0!==z?`<div class='GM_setting_category_name'>${z}</div>`:"<div class='GM_setting_category_blank'></div>");var B=e("<div class='GM_setting_list_head'></div>"),R=e(`<span class='GM_setting_title'>${S}</span>`),F=e(`<span class='GM_setting_desc'>${L}</span>`),H=e(`<li ${void 0!==l[h].radio_enable_value?" GM_setting_radio_enable_value='"+l[h].radio_enable_value+"'":""}\n                GM_setting_key='${h}'\n                GM_setting_depth='${w}'\n                class='${l[h].under_dev?"GM_setting_under_dev ":""} ${void 0!==z&&void 0!==v&&y!==v.category?"GM_setting_category ":""} GM_setting_depth${w}'\n                style='${l[h].under_dev&&!_.under_dev?"display:none;opacity:0":""}'></li>`);if(g.append(H),B.append(R).append(F),"checkbox"===$)e('<label class="btn btn-default btn-xxs"><span class="glyphicon glyphicon-ok"></span></label>').prepend(m).appendTo(O),m.on("change",function(){e(this).is(":checked")?e(this).closest("label").addClass("active"):e(this).closest("label").removeClass("active"),e(this).is(":disabled")?e(this).closest("label").addClass("disable").prop("disabled",!0):e(this).closest("label").removeClass("disable").prop("disabled",!1)});else O.append(m);H.append(x).append(B).append(O),d[h]=m,void 0!==l[h].append&&O.append(l[h].append),v=l[h]}T(),A(n),n.find("input[type='checkbox']").on("click",function(){A(n)}),n.find("input[type='radio']").on("click",function(){A(n)}),n.find("select").on("change",function(){p("GM_setting - select change"),D(e(this),n,d)}),n.find("input, textarea").on("input",function(){p("GM_setting - text change"),D(e(this),n,d)}),g.append(`<li class="GM_setting_category GM_setting_depth1">\n            <div class="GM_setting_category_name">${M("title_reset")}</div>\n            <div class="GM_setting_list_head">\n                <span class="GM_setting_title">\n                    <span class="GM_setting_reset btn btn-primary" style="margin-left:0;">${M("button_reset_settings")}</span>\n                    \x3c!--<span class="GM_setting_reset_all btn btn-primary">button_reset_settings_all</span>--\x3e\n                </span>\n                <span class="GM_setting_desc"></span>\n            </div>\n            <div class="GM_setting_input_container form-group">\n            </div>\n        </li>`),g.find(".GM_setting_reset").on("click",async function(){confirm(M("confirm_reset_settings"))&&(await GM_setting.reset(),GM_setting.createlayout(i),k(M("complete_reset_settings")+(new Date).toLocaleTimeString(),i))}),g.find(".GM_setting_reset_all").on("click",async function(){if(confirm(M("confirm_reset_settings_all"))){for(var e=await GM.listValues(),t=0;t<e.length;t++){var n=e[t];await GM.deleteValue(n)}await GM_setting.reset(),GM_setting.createlayout(i),k(M("complete_reset_settings_all")+(new Date).toLocaleTimeString(),i)}}),g.append(`<li class="GM_setting_category GM_setting_depth1">\n        <div class="GM_setting_category_name">${M("donate")}</div>\n        <div class="GM_setting_list_head">\n            <span class="GM_setting_title">\n                ${M("buymeacoffee")}\n            </span>\n            <span class="GM_setting_desc">\n                ${M("buymeacoffeeDesc")}\n            </span>\n        </div>\n        <div class="GM_setting_input_container form-group">\n        <a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>\n        </div>\n        </li>\n        <li class="GM_setting_depth1">\n        <div class="GM_setting_category_blank"></div>\n            <div class="GM_setting_list_head">\n                <span class="GM_setting_title">\n                    ${M("toonation")}\n                </span>\n                <span class="GM_setting_desc"></span>\n            </div>\n            <div class="GM_setting_input_container form-group">\n            <a href="https://toon.at/donate/636947867320352181" target="_blank"><img src="https://raw.githubusercontent.com/nomomo/Addostream/master/assets/toonation_b11.gif" height="41" alt="Donate with Toonation" /></a>\n            </div>\n        </li>\n    `),g.after(`\n        <div id="GM_setting_footer">\n            <a href="${GM.info.script.homepage}" target="_blank">${GM.info.script.name}</a> v${GM.info.script.version}\n            <div class="footer_divider"></div> GM Setting v22.5.19\n            <div class="footer_divider"></div> ©2017-${(new Date).getFullYear()} <a href="https://nomo.asia/" target="_blank">NOMO</a></div>\n    `)},w=void 0,k=function(t,n){if(void 0!==n){var i="GM_setting_autosaved";n.find("."+i).animate({bottom:"+=40px"},{duration:300,queue:!1}),e("<div style='animation: glow .5s 10 alternate; position:fixed; left:10px; bottom:20px; z-index:10000000;' class='"+i+" btn btn-success'>"+t+"</div>").appendTo(n).fadeIn("fast").animate({opacity:1},6e3,function(){e(this).fadeOut("fast").delay(600).remove()}).animate({left:"+=30px"},{duration:300,queue:!1})}},$=async function(){for(var t in p("read_"),d){var n=d[t],i=S(n);"tag"===l[t].type&&(1===(i=i.split(",")).length&&""===i[0]&&(i=[]),e.each(i,function(e,t){i[e]=t.replace(/^\s*|\s*$/g,"")})),_[t]!==i&&-1===o.indexOf(t)&&o.push(t),_[t]=i}},T=async function(){for(var e in p("write_"),d){var t=d[e];L(t,_[e])}},S=function(e){var t;switch(e.attr("GM_setting_type")){case"checkbox":t=e.prop("checked");break;case"set":case"text":case"tag":case"textarea":t=e.val();break;case"radio":t=e.find("input:checked").val();break;case"combobox":t=e.find("option:selected").val();break;default:t=void 0}return t},L=function(e,t){switch(e.attr("GM_setting_type")){case"checkbox":e.prop("checked",t).trigger("change");break;case"set":case"text":e.val(t);break;case"tag":case"textarea":e.val(t),e.height("auto"),e.height(e.prop("scrollHeight")+"px");break;case"radio":e.find("input[value="+t+"]").prop("checked",!0);break;case"combobox":e.find("option[value="+t+"]").prop("selected",!0)}},A=async function(t){var n=t.find("li");n.removeClass("GM_setting_item_disable"),n.find("input, textarea, select").prop("disabled",!1),n.find("input[type='checkbox']").trigger("change");for(var i,a,s=[!0,!0],o=1e3,r=0;r<n.length;r++){var _=e(n[r]),d=_.attr("GM_setting_depth"),c=_.attr("GM_setting_key"),p=_.attr("GM_setting_radio_enable_value");_.find("[gm_setting_type]").attr("gm_setting_type");if(0==r);else{var g=(i=e(n[r-1])).attr("GM_setting_depth");if(o>=d&&(a=void 0,o=1e3),g==d&&g>0)void 0!==a&&(s[g-1]=a==p);else if(g<d){a=void 0;var u=i.find("input[type='checkbox']"),v=i.find("input[type='radio']"),f=i.find("select");0!==u.length&&u.is(":checked")?s[g]=!0:0!==v.length?(a=i.find("input[type='radio']:checked").val(),o=g,i.find("input[type='radio']:checked").val()==p?s[g]=!0:s[g]=!1):0!==f.length?s[g]=!0:s[g]=!1}}for(var h=0;h<d;h++)if(l[c].disable||!s[h]){_.addClass("GM_setting_item_disable"),_.find("input, textarea, select").prop("disabled",!0),_.find("input[type='checkbox']").trigger("change");break}}},z=function(t,n){var i,a,s,o=!0,r="";if("number"===l[t].valid)o=e.isNumeric(n),""===n?r+=M("err_val_req"):o?void 0!==l[t].min_value&&l[t].min_value>n?(o=!1,r+=M("err_num_over")+l[t].min_value):void 0!==l[t].max_value&&l[t].max_value<n&&(o=!1,r+=M("err_num_not_more_than")+l[t].max_value):r+=M("err_num_req");else if(""!==n&&"array_string"===l[t].valid){i=e.map(n.split(","),e.trim);var _=n.match(/^[A-Za-z0-9 _,]*$/);if(null===_||0===_.length)o=!1,r+=M("err_valid_array_string");else if(-1!==e.inArray("",i))o=!1,r+=M("err_value_empty"),p(i,e.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var d=0;d<i.length-1;d++)s[d+1]==s[d]&&-1===e.inArray(s[d],a)&&a.push(s[d]);r+=M("err_value_dup")+a.join(",")}else for(var c=0;c<i.length;c++)if(-1!==i[c].indexOf(" ")){o=!1,r+=M("err_value_blank")+i[c];break}}else if(""!==n&&"array_word"===l[t].valid)if(i=e.map(n.split(","),e.trim),-1!==e.inArray("",i))o=!1,r+=M("err_value_empty"),p(i,e.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var g=0;g<i.length-1;g++)s[g+1]==s[g]&&-1===e.inArray(s[g],a)&&a.push(s[g]);r+=M("err_value_dup")+a.join(",")}return{valid:o,message:r}},D=function(t,n,i){var a=S(t),s=t.attr("GM_setting_key"),o=z(s,a);t.closest("div").find(".invalid_text").remove(),o.valid?t.closest("div").removeClass("invalid"):(p("validation",o),t.closest("div").addClass("invalid"),t.after("<div class='invalid_text'>"+o.message+"</div>")),clearTimeout(w),w=setTimeout(function(){var t=!0;e.each(i,function(e,n){if(!z(e,S(n)).valid)return t=!1,!1}),t&&($(),m(),k(M("auto_saved")+(new Date).toLocaleTimeString(),n))},1e3)},N=function(e,t){var n=Object.keys(e).sort(),i=Object.keys(t).sort();return JSON.stringify(n)===JSON.stringify(i)};return{init:async function(t,i){s=t,await async function(e){for(var t in p("init_",l),e&&(e.DEBUG&&p("GM_setting - DEBUG",c=!0),e.CONSOLE_MSG&&(p=e.CONSOLE_MSG),e.SETTINGS&&(l=e.SETTINGS),e.MULTILANG&&(f=!0,e.LANG_DEFAULT&&(v=e.LANG_DEFAULT))),l)r[t]=l[t].value;if(r.Lang="",await x(),!N(r,_)){for(t in r)void 0===_[t]&&(_[t]=r[t]);for(t in _)void 0===r[t]&&delete _[t];await m()}}(i),await async function(){"function"==typeof GM.addValueChangeListener&&(p("설정에 대한 addValueChangeListener 바인드"),GM.addValueChangeListener(s,async function(t,n,i,a){a&&(p("다른 창에서 설정 변경됨. val_name, old_value, new_value:",t,n,i),await x(),e.each(n,function(e,t){void 0!==l[e]&&void 0!==l[e].change&&n[e]!==i[e]&&l[e].change(_[e])}),o=[])})),e(n).on("input","input[gm_setting_key='under_dev']",function(){p("실험실 기능 온오프 이벤트"),e(this).is(":checked")?e(".GM_setting_under_dev").css("opacity",0).slideDown("fast").animate({opacity:1},{queue:!1,duration:"fast"}):e(".GM_setting_under_dev").css("opacity",1).slideUp("fast").animate({opacity:0},{queue:!1,duration:"fast"})})}(),GM.addStyle('\n#GM_setting .btn {font-size:12px;}\n.GM_setting_autosaved.btn {\n    max-width:100%;\n    font-size:12px;\n    white-space:pre-wrap;\n    user-select:text;\n}\n#GM_setting .btn-xxs {\n    cursor: pointer;\n    padding: 4px 4px;\n}\n#GM_setting label.btn-xxs {\n    box-sizing: content-box;\n    width:11px;\n    height:11px;\n}\n#GM_setting a{\n    color: #428bca;\n    text-decoration: none;\n}\n#GM_setting a:hover, #GM_setting a:focus {\n    color: #2a6496;\n    text-decoration: underline;\n}\n#GM_setting {clear:both;margin-left:auto; margin-right:auto; padding:0;font-size:13px;max-width:1400px; min-width:750px; box-sizing:content-box;}\n#GM_setting_head{margin-left:auto; margin-right:auto; padding:20px 0px 10px 10px;font-size:18px;font-weight:800;max-width:1400px; min-width:750px; box-sizing:content-box;}\n#GM_setting li {list-style:none;margin:0px;padding:8px;border-top:1px solid #eee;}\n\n#GM_setting .GM_setting_depth1.GM_setting_category {border-top: 2px solid #999;margin-top:30px;padding-top:10px;}\n#GM_setting li[GM_setting_key=\'version_check\'] {margin-top:0px !important}\n\n#GM_setting .GM_setting_category_name{display:table-cell;width:110px;padding:0 0 0 0px;font-weight:700;vertical-align:top;}\n#GM_setting .GM_setting_category_blank{display:table-cell;width:110px;padding:0 0 0 0px;vertical-align:top;}\n\n#GM_setting .GM_setting_list_head{display:table-cell;box-sizing:content-box;vertical-align:top;}\n#GM_setting .GM_setting_depth1 .GM_setting_list_head {padding-left:0px;width:300px;}\n#GM_setting .GM_setting_depth2 .GM_setting_list_head {padding-left:30px;width:270px;}\n#GM_setting .GM_setting_depth3 .GM_setting_list_head {padding-left:60px;width:240px;}\n#GM_setting .GM_setting_depth4 .GM_setting_list_head {padding-left:90px;width:210px;}\n#GM_setting .GM_setting_depth5 .GM_setting_list_head {padding-left:120px;width:180px;}\n\n#GM_setting .GM_setting_title{display:block;font-weight:700;}\n#GM_setting .GM_setting_desc{display:block;font-size:11px;}\n\n#GM_setting .GM_setting_input_container {display:table-cell;padding:0 0 0 30px;vertical-align:top;}\n#GM_setting .GM_setting_input_container span{vertical-align:top;}\n#GM_setting .GM_setting_input_container span.btn{margin:0 0 0 10px;}\n#GM_setting input{display:inline}\n#GM_setting input[type="text"]{ width: 100px; height: 30px; padding: 5px 5px; font-size:12px; }\n#GM_setting textarea{ width: 250px; height: 30px; padding: 5px 5px; font-size:12px; }\n#GM_setting input[type="checkbox"] { display:none; width: 20px;height:20px; padding: 0; margin:0; }\n#GM_setting input[type="radio"] {width: 20px;height:20px; padding: 0; margin:0; }\n\n#GM_setting .radio-inline{ padding-left:0; padding-right:10px; }\n#GM_setting .radio-inline input{ margin:0 5px 0 0; }\n\n#GM_setting .GM_setting_item_disable, #GM_setting .GM_setting_item_disable .GM_setting_title, #GM_setting .GM_setting_item_disable .GM_setting_desc{color:#ccc !important}\n#GM_setting .invalid input, #GM_setting .invalid textarea{border-color:#dc3545;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#dc3545;}\n#GM_setting .invalid input:focus, #GM_setting .invalid textarea:focus{border-color:#dc3545;box-shadow:0 0 0 0.2rem rgba(220,53,69,.25);outline:0;color:#dc3545;}\n#GM_setting .invalid {color:#dc3545}\n#GM_setting .invalid_text {font-size:12px;padding:5px 0 0 5px;}\n\n#GM_setting .GM_setting_under_dev .GM_setting_title{color:#6441a5;font-style:italic}\n\n#GM_setting .btn-xxs {cursor:pointer;padding:4px 4px;} /*padding: 1px 2px;font-size: 9px;line-height: 1.0;border-radius: 3px;margin:0 2px 2px 0;*/\n#GM_setting .btn-xxs .glyphicon{}\n#GM_setting .btn-xxs span.glyphicon {font-size:11px; opacity: 0.1;}\n#GM_setting .btn-xxs.active span.glyphicon {opacity: 0.9;}\n#GM_setting .btn-xxs.disable {opacity: 0.3;cursor:not-allowed;}\n\n#GM_setting_footer { padding: 30px 0 30px 0; margin: 30px 0 0 0; border-top: 1px solid #ccc; text-align: center; font-size:13px; letter-spacing:0.2px; }\n#GM_setting_footer .footer_divider { margin: 0 5px; display: inline-block; width: 1px; height: 13px; background-color: #ebebeb; }\n')},load:async function(){p("GM_setting - load"),await x()},save:async function(){p("GM_setting - save"),await m()},save_overwrite:async function(){var n=_,i=t[s];ADD_DEBUG("_settings",l),e.each(n,function(e,t){void 0!==l[e]&&void 0!==l[e].change&&n[e]!==i[e]&&l[e].change(i[e])}),_=t[s],p("GM_setting - save_overwrite"),await m()},reset:async function(){await GM.setValue(s,r),await x()},createlayout:function(e){a=e,b(e)},getType:function(e){return void 0!==l[e]?l[e].type:void 0},message:function(e,t){k(e,t)}}}(jQuery,window,document);

        // escapeHTML
        var entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
        var escapeHtml = function(string) { return String(string).replace(/[&<>"'`=/]/g, function (s) { return entityMap[s]; }); };
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // Settings
    ////////////////////////////////////////////////////////////////////////////////////
    const _settings = {
        use : {
            category:"general",
            category_name: "General",
            depth: 1,
            type: "checkbox",
            value: true,
            title:"클립 링크 자동 변환",
            desc:"클립 링크 자동 변환 기능을 사용합니다."
        },
        method : {
            category:"type",
            category_name:"동작 방식",
            depth: 2,
            type: "radio",
            value: "clickRequired",
            title:"클립 링크 변환 시점 선택",
            desc:" - 페이지 로딩 시: 섬네일을 비디오로 자동 변환<br /> - 섬네일 클릭 시: 섬네일을 클릭할 때 비디오로 변환", radio: {autoLoad: {title: "페이지 로딩 시", value:"autoLoad"}, clickRequired: {title: "섬네일 클릭 시", value:"clickRequired"}},
        },
        autoLoadLimit : {
            category: "type",
            category_name: "페이지 로딩 시",
            depth:3,
            radio_enable_value: "autoLoad",
            type: "text",
            value: 3,
            valid:"number",
            min_value:1,
            max_value:200,
            title:"최대 자동 변환할 클립 개수 제한", desc:"이 값을 크게 설정하고 스크롤을 빠르게 내릴 경우 한 번에 많은 비디오를 로딩하느라 브라우저가 멈출 수 있으니 주의하세요. 최대 개수를 초과한 클립부터는 섬네일을 클릭하여 비디오로 변환할 수 있습니다. (Default: 3, Range: 1~200)",
        },
        autoPlayFirstClip: {
            category: "type",
            depth: 3,
            radio_enable_value: "autoLoad",
            type: "checkbox",
            value: false,
            title: "첫 번째 클립을 자동 재생",
            desc: "페이지 로딩과 동시에 첫 번째 클립을 자동 재생합니다."
        },
        autoPlayFirstClipMuted: {
            category: "type",
            depth: 3,
            radio_enable_value: "autoLoad",
            type: "checkbox",
            value: true,
            title: "첫 번째 클립 자동 재생 시 음소거",
            desc: "첫 번째 클립 자동 재생 시 음소거 상태로 시작합니다."
        },
        clickRequiredAutoPlay: {
            category: "type",
            category_name: "섬네일 클릭 시",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: true,
            title: "클립 로드 시 자동 재생",
            desc: "섬네일 클릭과 동시에 클립을 자동 재생합니다. 이 옵션을 사용하면 클립이 간혹 음소거 상태로 재생될 수 있습니다."
        },
        set_volume_when_stream_starts: {
            category: "advanced", 
            category_name: "고급 설정",
            depth: 2,
            type: "checkbox",
            value: false,
            title: {en:"Set the volume when stream starts", ko:"클립 로드 시 특정 사운드 볼륨(Volume)으로 설정"},
            desc: "TIP: Chrome 계열 브라우저는 자동 재생되는 클립을 종종 음소거합니다. 음소거 문제를 피하려면 본 옵션을 사용해보세요(안 될 수도 있음)."
        },
        target_start_volume : {
            category:"type", depth:3, type: "text", value: 1.0, valid:"number", min_value:0.0, max_value:1.0,
            title:{en:"Volume", ko:"Volume"},
            desc:{en:"(Max Volume: 1.0, Mute: 0.0, Range: 0.0 ~ 1.0)", ko:"(Max Volume: 1.0, 음소거: 0.0, 범위: 0.0 ~ 1.0)"}
        },
        videoWidth : {
            category:"advanced",
            depth:2,
            under_dev:true,
            type: "text",
            value: 100,
            valid:"number",
            min_value:1,
            max_value:100,
            title:"비디오 가로 사이즈(%)", desc:"본문 사이즈 대비 클립 가로 사이즈를 결정합니다.<br />(Default: 100, Range: 1~100)" },
        autoPauseOtherClips: {
            category:"advanced",
            under_dev:true,
            depth: 2,
            type: "checkbox",
            value: true,
            title:"비디오 재생 시 다른 재생 중인 비디오 일시정지",
            desc:"Twitch Clip 또는 Naver Video 를 재생 시, 다른 재생 중인 모든 Naver Video 와 Twitch Clip 을 일시정지 합니다. 다음 클립을 재생하기 위하여 이전 클립을 정지할 필요가 없습니다. (엄청 편하다!)"
        },
        autoPauseOtherClipsForNaverVideo: {
            category:"advanced",
            under_dev:true,
            depth: 3,
            type: "checkbox",
            value: true,
            title:"네이버 비디오에도 적용",
            desc:"네이버 비디오 관련 재생 문제가 발생 시 본 옵션을 끄세요."
        },
        removeOriginalLinks: {
            category:"advanced",
            under_dev:true,
            depth: 2,
            type: "checkbox",
            value: true,
            title:"클립 원본 링크 삭제",
            desc:"클립 링크를 비디오로 변환 시, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다."
        },
        autoPlayNextClip: {
            category:"advanced",
            under_dev:true,
            depth: 2,
            type: "checkbox",
            value: false,
            title:"다음 클립을 자동으로 이어서 재생",
            desc:"본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생합니다. (편하다!)"
        },
        play_and_pause_by_click : {
            category:"advanced",
            under_dev:true,
            depth: 2,
            type: "checkbox",
            value: true,
            title:"Twitch Clip 페이지 스타일로 표시",
            desc:"클립 화면을 클릭하여 재생 및 일시정지 되도록 만듭니다. (편하다!)<br />일시정지 시 상단 오버레이와 재생 버튼을 숨깁니다. 재생 중 화면을 더블 클릭하여 전체화면을 할 수 있습니다."
        },
        useTheaterMode : {
            category:"theaterMode",
            category_name: "영화관 모드",
            under_dev:true,
            depth: 1,
            type: "checkbox",
            value: true,
            title:"영화관 모드 버튼을 표시",
            desc:"카페 최상단 메뉴에 '영화관 모드' 버튼을 표시합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다."
        },
        useTheaterModeContentWidth : {
            category:"theaterMode",
            depth: 2,
            under_dev:true,
            type: "text",
            value: 1300,
            valid:"number",
            min_value:400,
            max_value:10000,
            title:"본문(컨텐츠) 가로 사이즈(px)",
            desc:"영화관 모드 시 카페 컨텐츠의 가로 사이즈를 결정합니다.<br />(Default: 1300, Range: 400~10000, 권장: 800~1500)",
        },
        naverVideoAutoMaxQuality: {
            category:"etc",
            category_name: "편의 기능",
            depth: 1,
            type: "checkbox",
            value: true,
            title:"네이버 비디오를 항상 최대 화질로 시작",
            desc:"네이버 비디오를 로드할 때 선택 가능한 최대 화질로 자동 설정합니다."
        },
        fixFullScreenScrollChange: {
            category:"etc",
            depth: 1,
            type: "checkbox",
            value: true,
            title:"전체화면 스크롤 동작 개선",
            desc:"비디오를 전체화면 한 후 해제했을 때 스크롤이 다른 위치로 변경되는 문제를 개선합니다. 만약 전체화면 시 스크롤과 관련된 문제가 발생한다면 이 기능을 끄십시오."
        },
        naverBoardDefaultArticleCount: {
            category:"etc",
            depth: 1,
            type: "combobox",
            value: "0",
            title:"게시판 글 기본 개수 설정",
            desc:"게시판에서 기본으로 표시할 글 개수를 설정할 수 있습니다.",
            options:{
                "0":{title:"기본값 사용"},
                "5":{title:"5"},
                "10":{title:"10"},
                "15":{title:"15"},
                "20":{title:"20"},
                "30":{title:"30"},
                "40":{title:"40"},
                "50":{title:"50"}
            }
        },
        alwaysShowFavoriteBoard:{
            under_dev:true,
            category:"etc",
            depth: 1,
            type: "checkbox",
            value: false,
            title:"[실험실] 즐겨찾는 게시판을 항상 펼침",
            desc:""
        },
        improvedRefresh:{
            under_dev:true,
            category:"etc",
            depth: 1,
            type: "checkbox",
            value: false,
            title:"[실험실] 네이버 카페 새로고침 개선",
            desc:"네이버 카페에서 새로고침 시, 메인 화면 대신 이전에 탐색한 페이지를 불러옵니다. 만약 새로고침 시 문제가 발생한다면 이 기능을 끄십시오."
        },
        showDarkModeBtn : {
            category:"etc",
            under_dev:true,
            depth: 1,
            type: "checkbox",
            value: false,
            title:"[실험실] 어두운 모드 버튼을 표시",
            desc:"카페 최상단 메뉴에 '어두운 모드' 버튼을 표시합니다."
        },
        under_dev : { category:"advanced", category_name:"고급", depth:1, type: "checkbox", value: false, title:"숨겨진 고급 기능 설정", desc:"숨겨진 고급 기능과 실험실 기능을 직접 설정할 수 있습니다." },
    };
    GM_addStyle(`
    body #GM_setting {min-width:800px;}
    body #GM_setting .GM_setting_depth1 .GM_setting_list_head{width:370px;}
    body #GM_setting .GM_setting_depth2 .GM_setting_list_head{width:340px;}
    body #GM_setting .GM_setting_depth3 .GM_setting_list_head{width:310px;}

    #GM_setting li[GM_setting_key="set_volume_when_stream_starts"] {
        border-top: 1px solid #ccc !important;
        margin-top: 10px !important;
        padding-top: 10px !important;
    }

    #theaterModeBtn, #darkModeBtn {
        display: inline-block;
        float: left;
        margin-top: 10px;
        font-size: 12px;
        cursor: pointer;
    }

    html body .se-viewer .se-module-oglink.twitchClipFound:before{
        display:none;
    }
    `);
    window.GM_setting = GM_setting;
    //await GM_setting.init("GM_SETTINGS", _settings);
    await GM_setting.init("GM_SETTINGS", {"DEBUG":DEBUG, "SETTINGS":_settings, "CONSOLE_MSG":NOMO_DEBUG, "MULTILANG":false});
    if(typeof GM.registerMenuCommand === "function"){
        GM.registerMenuCommand("상세 설정 열기 (새 창)", function(){
            var ww = $(window).width(),
                wh = $(window).height();
            var wn = (ww > 930 ? 930 : ww/5*4);
            var left  = (ww/2)-(wn/2),
                top = (wh/2)-(wh/5*4/2);
            window.open("https://cafe.naver.com/NaverCafeTwitchClipLoaderSettings/","winname",
                "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width="+wn+",height="+wh/5*4+",top="+top+",left="+left);
        });
        GM.registerMenuCommand("상세 설정 열기 (현재 창)", openSettingsMenu);
    }

    // 설정 메뉴 추가 및 관리
    function openSettingsMenu(){
        try{
            if(document === undefined){
                NOMO_DEBUG("Document is undefined from openSettingsMenu");
                return;
            }
            if(!/(^https:\/\/cafe\.naver\.com\/)/.test(document.location.href)){
                NOMO_DEBUG("no naver cafe: return from openSettingsMenu");
                return;
            }
            NOMO_DEBUG("msg from openSettingsMenu");
            var GM_Setting_Bootstrap = 'GM_Setting_Bootstrap';
            $("#nomo_settings_container").remove();

            var $container = $( /*html*/ `
            <div id="nomo_settings_container" style="display:none;cursor:pointer;position:fixed;top:0;left:0;width:100%;height:100%;z-index:200000;background:rgba(0,0,0,0.93);">
                <div id="nomo_settings" style="cursor:default;font-size:12px;max-width:850px;max-height:calc(100% - 40px);margin:20px auto;background:#fff;padding:10px 20px;border-radius:5px;overflow-y:scroll;"></div>
            </div>`).appendTo("body");
            $container.on("click", function () {
                $("#GM_Setting_css_temp").remove();
                $("#GM_Setting_Bootstrap").remove();
                $(this).fadeOut(500, function () {
                    $(this).remove();
                });
            });
            $container.find("#nomo_settings").on("click", function (e) {
                e.stopPropagation();
            });

            /*!
            * Bootstrap v3.1.1 (http://getbootstrap.com)
            * Copyright 2011-2014 Twitter, Inc.
            * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
            */
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
            if ($("#GM_Setting_css_temp").length == 0){
                $("head").append(`<style id='GM_Setting_css_temp' rel='stylesheet' type='text/css'>ul, ol{margin:0; padding:0 !important;}
                #nomo_settings::-webkit-scrollbar { width: 8px; height: 8px; background: #eee; }
                #nomo_settings::-webkit-scrollbar-thumb { background: #ccc; }
                body{overflow-y:hidden;}</style>`);
            }

            $("#nomo_settings_container").fadeIn(500);
            GM_setting.createlayout($("#nomo_settings"));
        }
        catch(e){
            NOMO_DEBUG("Error from openSettingsMenu function", e);
        }
    }
    // 설정 페이지
    if(/(^https:\/\/cafe\.naver\.com\/NaverCafeTwitchClipLoaderSettings)/.test(document.location.href)){
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

        document.title = "Naver-Cafe-Twitch-Clip-Loader 상세 설정 페이지";
        GM_setting.createlayout($("body"));
        return;
    }
    // Embed Twitch Clip
    else if(isTwitch && GM_SETTINGS.use){
        GM_addStyle(`
            html body .player-overlay-background--darkness-5{background:rgba(0,0,0,.2);}
            .player-overlay-background--darkness-5:hover [data-a-target='player-overlay-play-button'] {
                background-color:rgba(255,255,255,0.2);
                box-shadow: 0px 0px 1vw rgb(0 0 0 / 40%);
            };
        `);

        // set_volume_when_stream_starts
        var is_volume_changed = false;
        if(GM_SETTINGS.set_volume_when_stream_starts){
            localStorage.setItem('volume', GM_SETTINGS.target_start_volume);
    
            if(GM_SETTINGS.target_start_volume !== 0){
                localStorage.setItem('video-muted', {default:false});
            }
        }
        
        // play_and_pause_by_click
        if(GM_SETTINGS.play_and_pause_by_click){
            try {
                GM_addStyle(`
                    html body .top-bar
                    ,[data-a-target="player-twitch-logo-button"]
                    {
                        display:none !important;
                    }
                    html body .video-player__container
                    ,html body .video-player{
                        background:unset;
                    }
                `);

                var backgroundDblclicked = false;
                var dblclickSetTimeout = undefined;

                $(document).on('click', "[data-a-target='player-overlay-click-handler']", (e) => {
                    NOMO_DEBUG('clicked - playing', e);
                    document.querySelector("button[data-a-target='player-play-pause-button']").click();
                    
                    backgroundDblclicked = true;
                    clearTimeout(dblclickSetTimeout);
                    dblclickSetTimeout = setTimeout(function(){
                        backgroundDblclicked = false;
                    },500);
                });

                $(document).on('click', ".player-overlay-background", (e)=>{
                    NOMO_DEBUG('clicked - end or play', e);
                    if($(e.target).find(".clip-postplay-recommendations").length !== 0){
                        NOMO_DEBUG("There is recommendations div");
                        document.querySelector("button[data-a-target='player-play-pause-button']").click();
                    }
                    else{
                        NOMO_DEBUG("There is no recommendations div");
                    }

                    if(backgroundDblclicked){
                        clearTimeout(dblclickSetTimeout);
                        backgroundDblclicked = false;
                        $("button[data-a-target='player-fullscreen-button']").click();
                    }
                });

            } catch (e) {
                NOMO_DEBUG("ERROR FROM play_and_pause_by_click", e);
            }
        }
        
        var video = undefined;
        var match = document.location.href.match(/^https?:\/\/clips\.twitch\.tv\/embed\?clip=([a-zA-Z0-9-_]+)/);
        var clipId = "";
        if(match !== null && match.length > 1){
            clipId = match[1];
            NOMO_DEBUG("clipId = ", clipId);
        }

        if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip){
            window.addEventListener("message", function(e){
                if(e.origin !== "https://cafe.naver.com" || e.data.type !== "NCTCL") return;
                NOMO_DEBUG("message from naver", e.data);
                if(e.data.clipId === undefined || e.data.clipId === "" || video === undefined) return;
                switch(e.data.event){
                    default:
                        break;
                    case "pause":
                        if(e.data.clipId !== clipId && typeof video.pause === "function"){
                            video.pause();
                            break;
                        }
                    case "play":
                        if(video.paused){
                            document.querySelector("button[data-a-target='player-play-pause-button']").click();
                        }
                        break;
                }
            });
        }

        $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
            //if(elem === undefined || !elem.src) return;

            video = elem;
            NOMO_DEBUG("video", video);
            video.addEventListener('play', (e) => {
                let $e = $(e.target);
                NOMO_DEBUG('twitch clip play()', e);
                if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"play", "clipId":clipId}, "https://cafe.naver.com");
                
                if(!$e.hasClass("_FIRSTPLAYED")){
                    $e.addClass("_FIRSTPLAYED");
                    GM_addStyle(`
                    html body .player-overlay-background--darkness-5{background:unset !important;}
                    [data-a-target="player-overlay-play-button"]{display:none;}
                    `);
                }
            });
            video.addEventListener('pause', (e) => {
                NOMO_DEBUG('twitch clip pause()', e);
                if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"pause", "clipId":clipId}, "https://cafe.naver.com");
            })
            video.addEventListener('ended', (e) => {
                NOMO_DEBUG('twitch clip ended', e);
                if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"ended", "clipId":clipId}, "https://cafe.naver.com");
            });
            
            // set_volume_when_stream_starts
            try {
                if(!isTwitchMuted && GM_SETTINGS.set_volume_when_stream_starts && !is_volume_changed){
                    NOMO_DEBUG("set_volume");
                    if(video.volume !== undefined){
                        NOMO_DEBUG("MUTE?", video.muted, "CURRENT VOLUME", video.volume, "TARGET VOLUME", GM_SETTINGS.target_start_volume);
                        setTimeout(function(){
                            if(GM_SETTINGS.target_start_volume !== 0.0){
                                video.muted = false;
                            }
                            video.volume = GM_SETTINGS.target_start_volume;
                            is_volume_changed = true;
                        },100);
                    }
                }
            } catch (e) {
                NOMO_DEBUG("ERROR FROM set_volume_when_stream_starts", e);
            }
        });

        return;
    }

    var autoPauseVideo = function(e){
        if(!GM_SETTINGS.use) return;
        if(!GM_SETTINGS.autoPauseOtherClips && !GM_SETTINGS.autoPlayNextClip) return;
        if(e.origin === "https://clips.twitch.tv" && e.data.type === "NCTCL"){
            NOMO_DEBUG("autoPauseVideo", e.data);
            if(e.data.clipId === undefined || e.data.clipId === "") return;

            var $iframes = $(document).find("div.NCTCL-container iframe");
            var endedNextFound = false;
            $iframes.each(function(i, v){
                switch(e.data.event){
                    default:
                        return false;
                        break;
                    case "play":
                        if(!GM_SETTINGS.autoPauseOtherClips) return false;
                        if(v.dataset.clipId === e.data.clipId) return true;
                        var newData = {"type":"NCTCL", "event":"pause", "clipId":e.data.clipId};
                        v.contentWindow.postMessage(newData, "https://clips.twitch.tv");
                        break;
                    case "ended":
                        if(!GM_SETTINGS.autoPlayNextClip) return false;
                        if(endedNextFound){
                            var newData = {"type":"NCTCL", "event":"play", "clipId":v.dataset.clipId};
                            v.contentWindow.postMessage(newData, "https://clips.twitch.tv");
                            return false;
                        }
                        if(v.dataset.clipId === e.data.clipId){
                            endedNextFound = true;
                            return true;
                        }
                }
            });

            // for naver video
            if(!GM_SETTINGS.autoPauseOtherClips || !GM_SETTINGS.autoPauseOtherClipsForNaverVideo || isTwitch) return true;
            if(e.data.event == "play"){
                var $videos = $(document).find("video");
                $videos.each(function(i, v){
                    var $nvideo = $(v);
                    var $id = $nvideo.attr("id");
                    if(e.data.clipId == $id) return;
                    if(!$nvideo.hasClass("_FIRSTPLAYED") || $nvideo[0].paused) return;

                    var $sevideo = $nvideo.closest(".se-video");
                    if ($sevideo.length == 0) {
                        NOMO_DEBUG("no se-video");
                        return;
                    }

                    var $playbtn = $sevideo.find(".u_rmc_play_area button");
                    if($playbtn.length == 0) {
                        NOMO_DEBUG("no playbtn");
                        return;
                    }

                    $playbtn.trigger("click");
                    NOMO_DEBUG("NAVER VIDEO PAUSE");
                });
            }
        }
    }

    window.addEventListener("message", function(e){
        // if(e.origin === "https://www.youtube.com"){
        //     NOMO_DEBUG("POSTMESSAGE from YOUTUBE", e);
        // }
        autoPauseVideo(e);
    });

    ////////////////////////////////////////////////////////////////////////////////////
    // Main
    ////////////////////////////////////////////////////////////////////////////////////
    // 콘텐츠 width 계산
    var contentWidth = 800;
    var videoWidth, videoHeight, videoWidthStr, videoHeightStr;
    var videoCSSElem = undefined;
    var contentWidthInit = false;
    var reCalculateIframeWidth = function(width){
        if(contentWidthInit && contentWidth === width){
            return;
        }
        contentWidthInit = true;

        if(videoCSSElem !== undefined){
            $(videoCSSElem).remove();
        }
        contentWidth = width;
        videoWidth = Number(GM_SETTINGS.videoWidth)/100.0 * contentWidth;
        videoHeight = Number(videoWidth)/16.0*9.0;// + 30
        videoWidthStr = String(videoWidth) + "px";
        videoHeightStr = String(videoHeight) + "px";

        videoCSSElem = GM_addStyle(`
        .NCTCL-iframe{
           width:${videoWidthStr};
           height:${videoHeightStr} ;
        }
        .NCTCL-container .se-link{
            width:${videoWidthStr}
        }
        `);
        NOMO_DEBUG("reCalculateIframeWidth", width);
    }
    reCalculateIframeWidth(contentWidth);

    // Add CSS
    GM_addStyle(`
    .twitchClipFound .se-oglink-thumbnail.hoverPlayButton::before{
        content: '▶️';
        font-size: 15vw;
        width: 16vw;
        height: 16vw;
        position: absolute;
        z-index: 10;
        color: #fff;
        text-align: center;
        font-family: monospace;
        border-radius: 0.5vw;
        top: calc(50% - 16vw / 2);
        left: calc(50% - 16vw / 2);
        opacity: 1.0;
        padding: 0 0 0 0.8vw;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scaleX(0.9);
        -webkit-transition: background-color 150ms linear;
        -ms-transition: background-color 150ms linear;
        transition: background-color 150ms linear;
    }
    .twitchClipFound .se-oglink-thumbnail.hoverPlayButton:hover::before{
        background-color:rgba(255,255,255,0.2);
        box-shadow: 0px 0px 1vw rgb(0 0 0 / 40%);
        opacity:1.0;
    }
    html body .se-section-oglink.twitchClipFound .se-oglink-thumbnail:after{
        border:0;
    }

    .NCTCL-iframe-container {
        line-height:0 !important;
    }
    .NCTCL-container .NCTCL-description {
        margin-top:0.25px;
    }
    .NCTCL-container .se-link{
        display: flex; align-items:center; padding: 0 16px; border: 1px solid rgba(0,0,0,.15); box-sizing: border-box; margin-top:0px;text-decoration: none;
        overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size:14px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 4%);
        height: 48px;
        font-family:se-nanumsquare,"나눔고딕",nanumgothic,Apple SD Gothic Neo,"맑은 고딕",Malgun Gothic,"돋움",dotum,sans-serif;
        background-color:#fff;
    }
    .NCTCL-container .se-link:hover{
        text-decoration: none;
    }
    .NCTCL-container .se-link svg{
        margin-right:10px;
        flex-shrink: 0;
        vertical-align: middle;
    }
    .NCTCL-container .NCTCL-titleText {
        height:16px;
        vertical-align: middle;
        font-size: 16px;
        font-weight: 700;
        flex-shrink: 0;
        max-width: calc(100% - 19px);
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .NCTCL-container .NCTCL-clipurlText {
        color:#333;
        height:16px;
        color:black;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 10px;
        
        text-overflow: ellipsis;
        overflow: hidden;
        position:relative;
        top:0.5px;
    }
    .NCTCL-container a.se-link .NCTCL-titleText {
        color:#000 !important;
    }
    .NCTCL-container a.se-link .NCTCL-clipurlText{
        color:#999 !important;
    }
    .NCTCL-container a.se-link:hover .NCTCL-titleText, .NCTCL-container a.se-link:hover .NCTCL-clipurlText {
        color:#4a90e2 !important;
    }
    .noUnderLine{text-decoration:none;}
    .UnderLine{text-decoration: underline;}
    .se-media-meta-info-description::before, .se-media-meta-info-title::before{
        content: 'NAVER';
        font-weight: 900;
        color: #2DB400;
        font-size: 12px;
        font-family: math;
        height: 16px;
        width: 16px;
        margin-right: 10px;
        background: #eee;
        padding: 0 3px;
        user-select: none;
    }

    
    .twitchClipFound .se-oglink-title::before
    /*,.twitchClipFound .NCTCL-titleText::before*/
    {
        display: inline-block;
        content: 'Twitch';
        font-weight: 900;
        color: #a778ff;
        font-size: 12px;
        font-family: math;
        height: 20px;
        width: 45px;
        margin-right: 10px;
        background: #eee;
        position: relative;
        user-select: none;
        padding: 0 4px;
        box-sizing:border-box;
    }
    `);

    // Twitch clip 링크 설명 삽입
    var insertTwitchCilpDescription = function($elem, clipId){
        try{
            var $parentContainer = $elem.closest("div.se-section-oglink");
            var $article_container = $elem.closest("div.article_container");
            $parentContainer.find(".se-oglink-info").hide();
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }
            var clipurl = `https://clips.twitch.tv/${clipId}`;
            var $title = $parentContainer.find(".se-oglink-title");
            var title = "", titleText = "", clipurlText = clipurl;
            if($title.length !== 0){
                title = escapeHtml($title.text());
                titleText = `<span class="NCTCL-titleText">${title}</span>`;
                clipurlText = `<span class="NCTCL-clipurlText">(<span class="UnderLine">${clipurl}</span>)</span>`;
            }
            $parentContainer.append(`
                <div class="NCTCL-container">
                    <div class="NCTCL-iframe-container" data-clip-id="${clipId}"></div>
                    <div class="NCTCL-description" data-clip-id="${clipId}">
                        <a title="클릭 시 다음의 Twitch Clip 페이지로 이동합니다. ${clipurl}" href="${clipurl}" class="se-link" target="_blank">
                            <svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" viewBox="0 0 256 256" xml:space="preserve">
                                <g transform="translate(128 128) scale(0.72 0.72)" style="">
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
                                        <path d="M 2.015 15.448 v 63.134 h 21.493 V 90 h 12.09 l 11.418 -11.418 h 17.463 l 23.507 -23.507 V 0 H 8.06 L 2.015 15.448 z M 15.448 8.06 h 64.478 v 42.985 L 66.493 64.478 H 45 L 33.582 75.896 V 64.478 H 15.448 V 8.06 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        <rect x="58.43" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                                        <rect x="36.94" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                                    </g>
                                </g>
                            </svg>
                            ${titleText}
                            ${clipurlText}
                        </a>
                    </div>
                </div>
            `);
        }
        catch(e){
            NOMO_DEBUG("Error from insertTwitchCilpDescription", e);
        }
    }
    // Twitch clip 링크를 iframe 으로 변환
    var iframeNo = 0;
    var changeToTwitchCilpIframe = function($elem, clipId, autoPlay, muted, lazy){
        try{
            var $parentContainer = $elem.closest("div.se-component-content");
            var $article_container = $elem.closest("div.article_container");
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }
            $parentContainer.find(".se-oglink-thumbnail").hide();
            var tempary = document.location.href.split("/");
            var parentHref = tempary[2];
            
            $(`.NCTCL-iframe-container[data-clip-id='${clipId}']`)
            .append(`<iframe ${lazy ? "loading='lazy'" : ""} class="NCTCL-iframe" data-clip-id="${clipId}" src="https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no"></iframe>`);
            iframeNo += 1;
        }
        catch(e){
            NOMO_DEBUG("Error from changeToTwitchCilpIframe", e);
        }
    }

    var removeOriginalLinks = function(url){
        if(!GM_SETTINGS.use) return;
        if(!GM_SETTINGS.removeOriginalLinks) return;
        try{
            var $as = $("a.se-link");
            $as.each(function(i, v){
                var $a = $(v);
                var href = $a.attr("href");
                if(href !== url || $a.hasClass("fired")){
                    return true;
                }

                var $p = $a.closest("p");
                if($p.text() === url){
                    $p.remove();
                }
                else{
                    $a.remove();
                }
            });
        }
        catch(e){
            NOMO_DEBUG("Error from removeOriginalLinks", e);
        }
    }

    // Twitch clip 링크 찾기
    //var p0 = 0;
    var regex = /^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9-_]+)/;
    var regex2 = /^https?:\/\/www.twitch.tv\/[a-zA-Z0-9-_]+\/clip\/([a-zA-Z0-9-_]+)/;
    $(document).arrive("div.se-module-oglink", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(!GM_SETTINGS.use) return;

            //if(p0 === 0){p0 = Number(new Date());}
            //NOMO_DEBUG("PERFORMANCE CHECK", Number(new Date()) - p0);

            var $elem = $(elem);
            if($elem.hasClass("fired")) return;
            $elem.addClass("fired");
            $elem.parent("div.se-section-oglink").addClass("fired");

            setTimeout(function(){
                var $a = $elem.find("a.se-oglink-thumbnail").first();
                if($a.length === 0) return; // thumbnail 이 없는 것은 제외한다.

                var href = $a.attr("href");
                var match = href.match(regex);
                if(match == null){
                    match = href.match(regex2);
                }

                var clipId;
                if(match !== null && match.length > 1){
                    clipId = match[1];
                    removeOriginalLinks(href);
                    insertTwitchCilpDescription($elem, clipId);
                    //NOMO_DEBUG("TWITCH CILP FOUND, CLIP ID = ", clipId);
                }
                else{
                    return;
                }

                // 자동 변환 시
                if(GM_SETTINGS.method === "autoLoad"){
                    var isAutoPlay = false;
                    var isMuted = false;
                    if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isMuted = true;
                    var NCTCL_Length = iframeNo;//$(".NCTCL-iframe").length;
                    if(GM_SETTINGS.autoPlayFirstClip && NCTCL_Length == 0){
                        isAutoPlay = true;
                        if(GM_SETTINGS.autoPlayFirstClipMuted) isMuted = true;
                        changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted, false);
                    }
                    else if(NCTCL_Length < GM_SETTINGS.autoLoadLimit){
                        if(NCTCL_Length == 0){
                            changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted, false);
                        }
                        else{
                            changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted, true);
                        }
                    }
                    else{
                        if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                        $a.on("click", function(e){
                            e.preventDefault();

                            var isClickRequiredMuted = false;
                            if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isClickRequiredMuted = true;
                            changeToTwitchCilpIframe($(e.target), clipId, GM_SETTINGS.clickRequiredAutoPlay, isClickRequiredMuted, false);
                        });
                    }
                }
                // 클릭 변환 시
                else{   // if(GM_SETTINGS.method === "clickRequired")
                    if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                    $a.on("click", function(e){
                        e.preventDefault();

                        var isClickRequiredMuted = false;
                        if(GM_SETTINGS.set_volume_when_stream_starts && GM_SETTINGS.target_start_volume == 0) isClickRequiredMuted = true;
                        changeToTwitchCilpIframe($(e.target), clipId, GM_SETTINGS.clickRequiredAutoPlay, isClickRequiredMuted, false);
                    });
                }
                $elem.addClass("twitchClipFound");
                $elem.closest("div.se-section-oglink").addClass("twitchClipFound");
                $elem.closest("div.se-component-content").addClass("twitchClipFound");
                //NOMO_DEBUG("PERFORMANCE CHECK", Number(new Date()) - p0);
            },1);
        }
        catch(e){
            NOMO_DEBUG("Error from arrive", e);
        }
    });

    // //Youtube video
    // var YTIframeAPITag = document.createElement('script');
    // YTIframeAPITag.src = "https://www.youtube.com/iframe_api";
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(YTIframeAPITag, firstScriptTag);

    // var convertedYTIdlist = [];
    // var YTPlayers = {};
    // $(document).arrive("div.se-module-oembed iframe", { onlyOnce: true, existing: true }, function (elem) {
    //     try{
    //         var $elem = $(elem);
    //         if($elem.parent(".fired").length !== 0) return;
    //         $elem.closest("div.se-module-oembed").addClass("fired");
    //         var src = $elem.attr("src");

    //         if(/^https:\/\/www\.youtube\.com\/embed/.test(src)){
    //             var YTID = src.match(/\/embed\/([a-zA-Z0-9-_]+)/)
    //             var YTStart = src.match(/start=(\d+)/);
    //             var YTEnd = src.match(/end=(\d+)/);

    //             NOMO_DEBUG("Parse Youtube", YTID, YTStart, YTEnd);

    //             if(YTID === null || YTID.length < 2) return;
    //             YTID = YTID[1];
    //             if($.inArray(YTID, convertedYTIdlist) !== -1) return;
    //             convertedYTIdlist.push(YTID);

    //             NOMO_DEBUG($elem, $elem.attr("src"));
    
    //             var YTElemID = `NCTCL_yt_${YTID}`;
    //             $elem.after(`<div id="${YTElemID}" data-yt-id="${YTID}" class="fired"></div>`);
    //             $elem.remove();

    //             var $article_container = $("div.article_container");
    //             if($article_container.length !== 0) {
    //                 reCalculateIframeWidth($article_container.width());
    //             }

    //             var YTOptions = {
    //                 "height": videoHeight,
    //                 "width": videoWidth,
    //                 "videoId": YTID,
    //                 "playerVars": {
    //                   'autoplay': 0,
    //                   'autohide': 0,
    //                   'showinfo': 0
    //                 },
    //                 "suggestedQuality":"hd1080", // highres hd1080
    //                 "events": {
    //                     'onReady': onPlayerReady,
    //                     'onStateChange': onPlayerStateChange
    //                 }
    //             };
    //             if(YTStart !== null && YTStart.length > 1) YTOptions["playerVars"]["start"] = YTStart[1];
    //             if(YTEnd !== null && YTEnd.length > 1) YTOptions["playerVars"]["end"] = YTEnd[1];
    //             YTPlayers[YTElemID] = new YT.Player(YTElemID, YTOptions);

    //             function onPlayerReady(event) {
    //                 //event.target.playVideo();
    //                 //event.target.loadVideoById({'videoId':YTID, 'startSeconds':30});
    //                 //event.target.pauseVideo();
    //             }
    
    //             var done = false;
    //             function onPlayerStateChange(event) {
    //                 var eventYTID = event.target.m.dataset["ytId"];
    //                 var playerState = event.data == YT.PlayerState.ENDED ? '종료됨' :
    //                 event.data == YT.PlayerState.PLAYING ? '재생 중' :
    //                 event.data == YT.PlayerState.PAUSED ? '일시중지 됨' :
    //                 event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' :
    //                 event.data == YT.PlayerState.CUED ? '재생준비 완료됨' :
    //                 event.data == -1 ? '시작되지 않음' : '예외';
    //                 NOMO_DEBUG("YOUTUBE PLAYER STATE CHANGED", eventYTID, event, playerState);
    //                 if (event.data == YT.PlayerState.PLAYING && !done) {
    //                 setTimeout(stopVideo, 6000);
    //                 done = true;
    //                 }
    //             }
    //             function stopVideo() {
    //                 YTPlayers[YTElemID].stopVideo();
    //             }
    //         }
    //     }
    //     catch(e){
    //         NOMO_DEBUG("Error from arrive (for youtube)", e);
    //     }
    // });

    // fixFullScreenScrollChange
    var parentHtml = parent.document.querySelector("html");
    var lastScrollY = parentHtml.scrollTop;
    var checkIsFullScreen = function(){ return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen };
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

    $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(!GM_SETTINGS.use) return;
            if(isTwitch) return;
            if($(elem).hasClass("_FIRSTPLAYED")) return;

            $(elem).on("play", function (e) {
                NOMO_DEBUG("Naver video played", e);
                var $elem = $(e.target);

                // autoPauseOtherClipsForNaverVideo
                if(GM_SETTINGS.autoPauseOtherClips && GM_SETTINGS.autoPauseOtherClipsForNaverVideo){
                    autoPauseVideo({
                        "origin":"https://clips.twitch.tv",
                        "data":{"type":"NCTCL", "event":"play", "clipId":$elem.attr("id")},
                    });
                }

                if($elem.hasClass("_FIRSTPLAYED")) return;
                $elem.addClass("_FIRSTPLAYED");
            });

            $(elem).on("pause", function (e) {
                NOMO_DEBUG("Naver video paused", e);
            });
        }
        catch(e){
            NOMO_DEBUG("Error from video arrive", e);
        }
    });

    if(GM_SETTINGS.naverVideoAutoMaxQuality){
        $(document).arrive(".u_rmc_definition_ly", { existing: true }, function (elem) {
            setTimeout(function(){
                try{
                    NOMO_DEBUG("TRY TO SET BEST QUALITY");
                    var $elem = $(elem);
                    var $u_rmcplayer = $elem.closest(".u_rmcplayer");
                    if($u_rmcplayer.length === 0) {
                        NOMO_DEBUG("no $u_rmcplayer");
                        return;
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
                catch(e){
                    NOMO_DEBUG("Error from naverVideoAutoMaxQuality arrive", e);
                }
            }, 1);
        });
    }

    // theaterMode
    var isTheaterMode = await GM.getValue("theaterMode", false);
    if (typeof GM.addValueChangeListener === "function"){
        GM.addValueChangeListener("theaterMode", async function (val_name, old_value, new_value, remote) {
            if (remote) {
                NOMO_DEBUG("다른 창에서 설정 변경됨. val_name, old_value, new_value, location:", val_name, old_value, new_value, document.location.href);
                applyTheaterMode();
            }
        });
    }
    var $theaterModeBtn = $(`<span title="[NCTCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다." id="theaterModeBtn">영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
    .on("click", async () => {
        NOMO_DEBUG("isTheaterMode", isTheaterMode, " -> ", !isTheaterMode);
        isTheaterMode = !isTheaterMode;
        await GM.setValue("theaterMode", isTheaterMode);
        if (typeof GM.addValueChangeListener === "function"){
            applyTheaterMode();
        }
        else{
            location.reload();
        }
    });
    var theaterModeCSSElem = undefined;
    var nonTheaterModeCSSElem = undefined;
    async function applyTheaterMode(){
        try{
            isTheaterMode = await GM.getValue("theaterMode", false);
            if(theaterModeCSSElem !== undefined) $(theaterModeCSSElem).remove();
            if(nonTheaterModeCSSElem !== undefined) $(nonTheaterModeCSSElem).remove();

            if(isTheaterMode){
                $("html").addClass("theaterMode");
                reCalculateIframeWidth(Number(GM_SETTINGS.useTheaterModeContentWidth));
                var cw = (Number(GM_SETTINGS.useTheaterModeContentWidth) + 60.0) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;
                var cwPure = Number(GM_SETTINGS.useTheaterModeContentWidth) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;
        
                theaterModeCSSElem = GM_addStyle(`
                    #front-cafe, #front-img {overflow:hidden; object-fit:cover !important;}
                    #cafe-body, #content-area, #front-cafe, #front-img, .footer {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 220px + 60px) !important}
                    #cafe_main, .Article, .Article .article_wrap, #content-area #main-area {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}
                    .se-component-content.twitchClipFound
                    {
                        max-width:${cwPure}px !important;
                        max-height:calc(${cwPure}px / 16.0 * 9.0 + 48px) !important;
                        width:${cwPure}px !important;
                    }

                    .se-section-video
                    ,.se-component.se-video
                    ,.se-component.se-video .se-component-content
                    {
                        max-width:${cwPure}px !important;
                        /*max-height:calc(${cwPure}px / 16.0 * 9.0 + 130px) !important;*/
                        width:${cwPure}px !important;
                    }

                    .CafeViewer .se-viewer .se-caption, .CafeViewer .se-viewer .se-component-content, .CafeViewer .se-viewer .se-component-content.se-component-content-fit{
                        max-width:${cwPure}px !important;
                        width:${cwPure}px !important;
                    }


                    .CafeViewer .se-viewer .se-section-oglink.twitchClipFound {
                        max-width:${cwPure}px !important;
                        max-height:calc(${cwPure}px / 16.0 * 9.0 + 48px) !important;
                    }
                    .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail,
                    .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail-resource{
                        max-width:${cwPure}px !important;
                        max-height:calc(${cwPure}px / 16.0 * 9.0) !important;
                    }
        
                    #front-cafe {text-align:center}
                    .ArticleFormBanner.bottom{margin-left:auto;margin-right:auto}
                    #cafe-intro .gate-list.border-sub {
                        width:unset !important;
                        float:unset !important;
                        margin:0 auto;
                    }
                `);
            }
            else{
                var $article_container = $("div.article_container");
                if($article_container.length !== 0) {
                    reCalculateIframeWidth($article_container.width());
                }

                $("html").removeClass("theaterMode");
                nonTheaterModeCSSElem = GM_addStyle(`
                .CafeViewer .se-viewer .se-section-oglink.twitchClipFound .se-oglink-thumbnail-resource{
                    object-fit:cover;
                }
                .CafeViewer .se-viewer .se-section-oglink.twitchClipFound {
                    max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                    max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0 + 48px) !important;
                }
                .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail,
                .se-viewer .se-section-oglink.se-l-large_image.twitchClipFound .se-oglink-thumbnail-resource{
                    max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
                    max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0) !important;
                }
                `);
            }

            var $article_container = $("div.article_container");
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }

            $theaterModeBtn
            .attr("title", `[NCTCL] 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.`)
            .html(`영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c">`);
        }
        catch(e){
            NOMO_DEBUG("Error from applyTheaterMode", e);
        }
    }
    applyTheaterMode();

    // improvedRefresh
    function improvedRefresh(){
        try{
            // iframe
            if(window.self !== window.top){
                if(unsafeWindow.top.refreshChecked){
                    NOMO_DEBUG("이미 refresh 여부가 체크되었다.");
                    return;
                }

                var savedLastCafeMainUrl = {url:undefined, date:-1};
                try{
                    let savedLSLSCMU = localStorage.getItem('lastCafeMainUrl');
                    if(savedLSLSCMU === null){
                        NOMO_DEBUG("savedLSLSCMU = null");
                        return;
                    }
                    savedLastCafeMainUrl = JSON.parse(savedLSLSCMU);
                }
                catch(e){
                    NOMO_DEBUG("Error from improvedRefresh JSON.parse", e);
                    return;
                }
    
                NOMO_DEBUG("savedLastCafeMainUrl", savedLastCafeMainUrl);
                if(document.location.href === savedLastCafeMainUrl.url){
                    NOMO_DEBUG("저장된 url 과 현재 url 이 같다", savedLastCafeMainUrl.url);
                    return;
                }

                var except = ["https://cafe.naver.com/MyCafeListGNBView.nhn"];
                for(var i=0;i<except.length;i++){
                    if(document.location.href.indexOf(except[i]) !== -1){
                        NOMO_DEBUG("예외 목록에 포함된 URL", except[i], document.location.href);
                        return;
                    }
                }
        
                const parentWindowRefreshed = String(window.top.performance.getEntriesByType("navigation")[0].type) === "reload";
                let refreshDelay = Number(new Date()) - savedLastCafeMainUrl.date;
        
                NOMO_DEBUG("PARENT REFRESHED? = ", parentWindowRefreshed, "CURRENT URL = ", document.location.href, ", REFRESHDELAY = ", refreshDelay);
                unsafeWindow.parent.refreshChecked = true;
    
                if(parentWindowRefreshed && refreshDelay < 2000.0){
                    NOMO_DEBUG("LOAD SAVED IFRAME URL. CURRRENT URL = ", document.location.href, ", SAVED URL = ", savedLastCafeMainUrl.url);
                    document.location.href = savedLastCafeMainUrl.url;
                }
            }
            
            // top
            if(window.self === window.top){
                window.onbeforeunload = function() {
                    let $cafeMain = $("#cafe_main");
                    if($cafeMain.length !== 0){
                        var lastCafeMainUrl = $cafeMain[0].contentWindow.location.href;
                        localStorage.setItem('lastCafeMainUrl', JSON.stringify({
                            "url":lastCafeMainUrl,
                            "date":Number(new Date())
                        }));
                    }
                };
            }
        }
        catch(e){
            NOMO_DEBUG("Error from improvedRefresh", e);
        }
    }
    if(GM_SETTINGS.improvedRefresh){
        improvedRefresh();
    }

    ////////////////////////////////////////////////////
    // darkmode
    var isDarkMode = await GM.getValue("darkMode", false);
    if (typeof GM.addValueChangeListener === "function"){
        GM.addValueChangeListener("darkMode", async function (val_name, old_value, new_value, remote) {
            if (remote) {
                NOMO_DEBUG("다른 창에서 설정 변경됨. val_name, old_value, new_value, location:", val_name, old_value, new_value, document.location.href);
                applyDarkMode();
            }
        });
    }
    var $darkModeBtn = $(`<span title="[NCTCL] 클릭 시 다크 모드를 ${isDarkMode ? "비활성화" : "활성화"} 합니다." id="darkModeBtn">어두운 모드 ${isDarkMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
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
    var themeCSSElem = undefined;
    async function applyDarkMode(){
        try{
            isDarkMode = await GM.getValue("darkMode", false);
            NOMO_DEBUG("어두운 모드", isDarkMode);
            $darkModeBtn.attr("title", `[NCTCL] 클릭 시 다크 모드를 ${isDarkMode ? "비활성화" : "활성화"} 합니다.`);
            if(themeCSSElem !== undefined) $(themeCSSElem).remove();
            if(isDarkMode){
                themeCSSElem = GM_addStyle(/*css*/`
                
                :root{
                    --NCTCL-font-color:#FFF;
                    --NCTCL-background-color:#202020;
                    --NCTCL-border-color:#383838;
            
                    
                    --NCTCL-font-color-lighter:#AAA;
                    --NCTCL-background-color-lighter:#303030;
                    --NCTCL-border-color-lighter:#383838;
                    
                    --NCTCL-font-color-lightest:#AAA;
                    --NCTCL-background-color-lightest:#404040;
                    --NCTCL-border-color-lightest:#484848;
                }
            
                *::-webkit-scrollbar { background: #505050 !important; }
                *::-webkit-scrollbar-thumb { background: #353535 !important; }
            
                #powerAd-div, #cafe_sdk {display:none}
            
                h1,h2,h3,h4,h5,h6
                ,.skin-1080 .ia-info-data .gm-tcol-c .id .ellipsis
                ,.skin-1080 #ia-info-data-emblem .txt
                ,.skin-1080 .com .box-w .group-list .tcol-c
                ,.skin-1080 .com .pocket_nav
                ,.skin-1080 .com .pocket_nav .filter-50
                ,.skin-1080 .com .box-w .group-mlist .tcol-c
                ,.skin-1080 #cafe-secede
                ,.skin-1080 .ia-info-data
                ,.skin-1080 .ia-info-data2
                ,.skin-1080 .ia-info-data3
                ,.skin-1080 .ia-info-data3 li
                ,.skin-1080 .SpecialMenu .menu_list .link_special
                ,.skin-1080 .article-album .album-box .tit .ellipsis
                ,.skin-1080 .board-notice.type_event .article, .skin-1080 .board-notice.type_up .article
                ,.skin-1080 .article-board .pers_nick_area .p-nick a
                ,.skin-1080 .article-board .td_date
                ,.skin-1080 .article-board .td_view
                ,.skin-1080 .article-album-sub .tit .ellipsis
                ,.skin-1080 .RelatedArticles .member_area
                ,.skin-1080 .ArticlePaginate .btn.number
                ,.skin-1080 .PopularArticles .PopularCafeList .popular_list .post_box .title
                ,.skin-1080 .RelatedArticles .date_area
                ,.skin-1080 .article-board .td_likes
                ,.skin-1080 .article-board .article
                ,.skin-1080 .select_component .date_enter .tit
                ,.skin-1080 .article-movie-sub .con
                ,.skin-1080 .article-movie-sub .tit_area .tit strong
                ,.skin-1080 #main-area .m-tcol-c
                ,.skin-1080 #special-menu .special-menu .link_special
                ,.skin-1080 #neighbor-cafe .comment
                ,.skin-1080 #neighbor-cafe .bca
                ,.skin-1080 #widget_company_info
                ,.skin-1080 #widget_company_info .tit_company
                ,.skin-1080 #widget_company_info .list_company .tit
                ,.skin-1080 #widget_company_info .list_company li
                ,.skin-1080 .article-album .album-box li .price
                ,.skin-1080 .SaleInfo .CommercialDetail .list_detail .btn_text
                ,.skin-1080 .ModalLayer
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_thead
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_td
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_list
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .safety_deal_text
                ,.skin-1080 .SaleInfo
                ,.skin-1080 .SaleInfo .CommercialDetail .list_title
                ,.skin-1080 .SaleInfo .ProductCategory
                ,.skin-1080 .NCTCL-container .se-link
                ,.skin-1080 .CafeViewer .se-viewer .se-section-oglink.se-section.se-l-large_image .se-oglink-info
                ,.skin-1080 .CafeViewer .se-viewer .se-module-oglink .se-oglink-title
                ,.skin-1080 .CafeViewer .se-viewer .se-video .se-media-meta
                ,.skin-1080 .se-viewer .se-video .se-media-meta-info, .se-viewer .se-video .se-media-meta-info-title
                ,.skin-1080 .CafeViewer .se-viewer .se-video .se-media-meta-info-wrap:not(.se-is-activated) .se-media-meta-info-description
                ,.NCTCL-container a.se-link .NCTCL-titleText
                ,.skin-1080 .ArticleTagList .item
                ,.skin-1080 .ArticleTagList .item a
                ,.skin-1080 .pop_container
                ,.skin-1080 .CommentWriter .comment_inbox_text
                ,.skin-1080 .gnb_my_lyr
                ,.skin-1080 .gnb_my_li .gnb_my_content
                ,.skin-1080 #gnb a,.skin-1080 #gnb a:visited,.skin-1080 #gnb a:active,.skin-1080 #gnb a:focus
                ,.skin-1080 .gnb_my_li .gnb_my_content .gnb_pay_check a,.skin-1080  .gnb_my_li .gnb_my_content .gnb_pay_check span,.skin-1080  .gnb_my_li .gnb_my_content .gnb_pay_check strong
                ,.skin-1080 .gnb_bdr
                ,.skin-1080 .gnb_txt
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list .info_top .box
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list .info_title
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list .cc_mynews_info
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list .info_txt
                ,.skin-1080 .cafe_list .sort li.on a
                ,.skin-1080 .cafe_list .sort li a
                ,.skin-1080 .cafe_list .lst_mycafe li .cafe_name h5 a
                ,.skin-1080 .LowLevelAccessGuide .tit_level
                ,.skin-1080 .LowLevelAccessGuide .txt_level
                ,.skin-1080 .LowLevelAccessGuide .list_explanation .explanation
                ,.skin-1080 .LowLevelAccessGuide .list_explanation li
                ,.skin-1080 .LowLevelAccessGuide .list_level .desc
                {
                    color:var(--NCTCL-font-color) !important;
                }
            
                .skin-1080 .ia-info-data .gm-tcol-c
                ,.skin-1080 .ia-info-data3 em
                ,.skin-1080 .ia-info-data2 .mem-cnt-info .link_invite
                ,.skin-1080 #member-action-data
                ,.skin-1080 .info-action-tab .gm-tcol-t
                ,.skin-1080 #member-action-data .prfl_info
                ,.skin-1080 #member-action-data .grade
                ,.skin-1080 #member-action-data .grade .txt
                ,.skin-1080 #linked-member #lm-list .tcol-c
                ,.skin-1080 .m-tcol-c
                ,.skin-1080 #naver-gnb #gnb-menu .naver-h,.skin-1080 #naver-gnb #gnb-menu .m-cafe,.skin-1080 #naver-gnb #gnb-menu .join-cafe,.skin-1080 #naver-gnb #gnb-menu .chatting-cafe,.skin-1080 #naver-gnb #gnb-menu #gnb,.skin-1080 #naver-gnb #gnb-menu .gnb_name
                ,.skin-1080 .Gnb .gnb_menu .gnb_link
                ,.Gnb .GnbNaver #gnb a.gnb_my .gnb_name
                ,.WritingHeader .tool_area .temp_save_area .btn_temp_save
                ,.WritingHeader .tool_area .temp_save_area .btn_temp_count
                ,.skin-1080 .board-notice.type_event .cmt, .skin-1080 .board-notice.type_up .cmt
                ,.skin-1080 .article-board .board-list .head
                ,.skin-1080 .WriterInfo .profile_info .nick_level
                ,.skin-1080 .CommentBox .comment_option .comment_tab .comment_tab_item .comment_tab_button[aria-selected=true]
                ,.skin-1080 .RelatedArticlesTabContainer__tab button[aria-pressed=true]
                ,.skin-1080 .RelatedArticlesTabContainer__tab button
                ,.skin-1080 .footer
                ,.skin-1080 .footer .cafe_name
                ,#theaterModeBtn
                ,#darkModeBtn
                ,#button_town_cafe
                ,.skin-1080 .prev-next a
                ,.skin-1080 .select_component .select_list li a
                ,.skin-1080 .select_component2 .select_list li a
                ,.skin-1080 .article-movie-sub .txt
                ,.skin-1080 .article-movie-sub .user_info .m-tcol-c
                ,.skin-1080 .check_box label
                ,.skin-1080 .input_component input::placeholder
                ,.skin-1080 .alarm_switch .alarm_txt
                ,.skin-1080 .SaleInfo .BottomNotice
                ,.skin-1080 .SaleInfo .BottomNotice .text_title
                ,.skin-1080 .SaleInfo .BottomNotice .text_info
                ,.skin-1080 .CafeViewer .se-viewer .se-module-oglink .se-oglink-summary
                ,.skin-1080 .CafeViewer .se-viewer .se-video .se-media-meta-info-tag
                ,.skin-1080 .list-style .total
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list .info_bottom
                ,.skin-1080 .cafe_list .lst_mycafe li .cafe_name .second
                ,.skin-1080 .cafe_list .lst_mycafe li .cafe_name .second
                ,.skin-1080 .list_sub_tab .link
                ,.skin-1080 .LowLevelAccessGuide .txt_level .level
                {
                    color:var(--NCTCL-font-color-lighter) !important;
                }
            
                /* space */
                .Gnb .gnb_menu .gnb_item:after
                ,#naver-gnb #gnb-menu .tcol-c
                ,.footer .cafe_link:before
                ,.RelatedArticlesTabContainer__tab button[aria-pressed=true]:after
                ,.skin-1080 .prev-next .pgR:before
                {
                    background-color:var(--NCTCL-border-color) !important;
                }
            
                .skin-1080 .CommentBox
                ,.skin-1080 .ArticleContentBox
                ,.skin-1080 .ArticleContentBox .article_header
                ,.skin-1080 .CommentBox .comment_list .CommentItem
                ,.skin-1080 .RelatedArticles .list_item
                ,.skin-1080 .RelatedArticles .list_item:first-child
                ,.skin-1080 .RelatedArticlesTabContainer__tab button[aria-pressed=true]
                ,.skin-1080 .RelatedArticlesTabContainer__tab .tab_menu
                ,.skin-1080 .PopularArticles .PopularCafeList .popular_list .list_item
                ,.skin-1080 .select_component2 .select_list
                ,.skin-1080 .select_component .select_list
                ,.skin-1080 .article-movie-sub li
                ,.skin-1080 .area_info_box
                ,.skin-1080#main-area .list-tit
                ,.skin-1080 .list-style .check_box ~ .sort_form
                ,.skin-1080 .list-style .sort_form
                ,.skin-1080 .com .box-w .group-mlist
                ,.skin-1080 .info-action-tab .tit-bookmark
                ,.skin-1080 .list_sub_tab
                ,.skin-1080 .SaleInfo .CommercialDetail .section
                ,.skin-1080 .PurchaseButton.PurchaseButton--bottom
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_table
                ,.skin-1080 .gnb_my_lyr
                ,.skin-1080 .cafe_list .lst_mycafe
                ,.skin-1080 .cafe_list_control
                ,.skin-1080 .article-board tbody td
                ,.skin-1080 .search_result .learn_more.is_selected + .search_input
                {
                    border-color:var(--NCTCL-border-color);
                }

                
                .skin-1080 .list_sub_tab .on .link
                {
                    border-color:var(--NCTCL-border-color-lightest);
                }
            
                /* normal */
                html
                , iframe
                ,.skin-1080
                ,.skin-1080 .layout_content
                ,.skin-1080 #linked-member #lm-list
                ,.skin-1080 .gate-list.border-sub
                ,.skin-1080 .article-board thead th
                ,.skin-1080 .article-board tbody td
                ,.skin-1080 .search_result .search_input
                ,.skin-1080 .prev-next
                ,.skin-1080 .prev-next a
                ,.skin-1080 .list-search
                {
                    color:var(--NCTCL-font-color);
                    background-color:var(--NCTCL-background-color);
                    border-color:var(--NCTCL-border-color);
                }
                
                .skin-1080 .search_result .search_input{
                    border:1px solid var(--NCTCL-border-color);
                }
                
            
                /* lighter */
                .skin-1080 #cafe-info-action
                ,.skin-1080 .info-action-tab .tit-bookmark .btn-bookmark-off
                ,.skin-1080 #cafe-menu
                ,.skin-1080 #cafe-menu div.cafe-menu-space
                ,.skin-1080 .box-g-m
                ,.skin-1080 #cafe-menu .cafe-menu-tit
                ,.skin-1080 #cafe-menu .cafe-menu-tit .gm-tcol-t
                ,.skin-1080 #cafe-menu .cafe-menu-list
                ,.skin-1080 #cafe-menu .cafe-menu-list li
                ,.skin-1080 #cafe-menu .cafe-menu-list li a
                ,.skin-1080 #cafe-menu .cafe-menu-list h1
                ,.skin-1080 #cafe-menu .cafe-menu-list h2
                ,.skin-1080 #cafe-menu .cafe-menu-list h3
                ,.skin-1080 #cafe-menu .cafe-menu-list h4
                ,.skin-1080 #cafe-menu .cafe-menu-list h5
                ,.skin-1080 #cafe-menu .cafe-menu-list h6
                ,.skin-1080 .com .box-w
                ,.skin-1080 .box_notice
                ,.skin-1080 #special-menu
                ,.skin-1080 .SpecialMenu
                ,.skin-1080 .SpecialMenu .menu_list
                ,.skin-1080 .cafe-search .inp
                ,.skin-1080 .area_info_box
                ,.skin-1080 #ia-info-data-emblem
                ,.skin-1080 .ia-info-data2
                ,.skin-1080 .info-action-tab
                ,.skin-1080 .CommentWriter
                ,.skin-1080 .ArticlePaginate .btn.number[aria-pressed=true]
                ,.skin-1080 .RelatedArticles .list_item.selected
                ,.skin-1080 .select_component
                ,.skin-1080 .select_component .select_box
                ,.skin-1080 .select_component .select_list li
                ,.skin-1080 .select_component2
                ,.skin-1080 .select_component2 .select_box
                ,.skin-1080 .select_component2 .select_list li
                ,.skin-1080 .input_component
                ,.skin-1080 .input_component input
                ,.skin-1080 .select_component .date_enter
                ,.skin-1080 .select_component .date_enter input
                ,.skin-1080 .btn_type1.post_write
                ,.skin-1080 #widget-count
                ,.alarm_switch .layer_alarm
                ,.skin-1080 #widget-currency
                ,.skin-1080 #widget-currency .bg-body tr:nth-child(even) th, .skin-1080 #widget-currency .bg-body tr:nth-child(even) td
                ,.skin-1080 #widget-currency .bg-head
                ,.skin-1080 .com .box-ww.white_box
                ,.skin-1080 .com .box-ww
                ,.skin-1080 .PurchaseButton .purchase_chat .btn_purchase
                ,.skin-1080 .PurchaseButton .purchase_chat .btn_commerce_status.type_chat
                ,.skin-1080 .PurchaseButton .purchase_chat .btn_commerce_status.type_pay
                ,.skin-1080 .FormNoticeContent
                ,.skin-1080 .SaleInfo .CommercialDetail .list_detail .btn_commerce
                ,.skin-1080 .ModalLayer .layer_wrap
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_thead
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_td
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .deal_list
                ,.skin-1080 .ModalLayer .layer_commerce_safety_guide .safety_deal_text
                ,.skin-1080 .NCTCL-container .se-link
                ,.skin-1080 .CafeViewer .se-viewer .se-section-oglink.se-section.se-l-large_image .se-oglink-info
                ,.skin-1080 .CafeViewer .se-viewer .se-video .se-media-meta
                ,.skin-1080 .se-viewer .se-module-oglink
                ,.skin-1080 .ArticleTagList .item
                ,.skin-1080 .CommentBox .comment_list .CommentItem--mine
                ,.skin-1080 .CommentBox .comment_list .CommentItem.CommentItem--mine::before
                ,.skin-1080 .gnb_my_li .gnb_my_content
                ,.skin-1080 .gnb_my_lyr_iframe
                ,.skin-1080 .select_component .select_list
                ,.skin-1080 .cc_layer_mynews .cc_mynews_header
                ,.skin-1080 .cc_layer_mynews .cc_mynews_list li
                ,.skin-1080 .cc_layer_mynews
                ,.skin-1080 #naver-gnb #join-cafe-iframe
                ,.skin-1080 .cafe_list .lst_mycafe li
                ,.skin-1080 .cafe_list .lst_mycafe li
                ,.skin-1080 .cafe_list .sort_area
                ,.skin-1080 .cafe_list_control
                ,.skin-1080 .LowLevelAccessGuide .guide_box
                ,.skin-1080 .select_component2 .select_list
                {
                    color:var(--NCTCL-font-color);
                    background-color:var(--NCTCL-background-color-lighter);
                    border-color:var(--NCTCL-border-color);
                }
            
                .skin-1080 #nomo_settings
                ,.skin-1080 #nomo_settings li
                ,.skin-1080 #nomo_settings #GM_setting li[GM_setting_key="set_volume_when_stream_starts"]
                ,.skin-1080 #GM_setting_footer
                ,.skin-1080 #neighbor-cafe .comm-btn-top a
                ,.skin-1080 .ModalLayer .layer_seller_contact .contact_box
                ,.skin-1080 #gnb .gnb_my_li .gnb_my_community a,.skin-1080  .gnb_notice_li .gnb_notice_all,.skin-1080  a.gnb_service_all, .gnb_svc_more .svc_btns
                ,.skin-1080 #naver-gnb #gnb-menu .gnb_txt
                ,.skin-1080 .LowLevelAccessGuide .cafe_level_info
                {
                    color:var(--NCTCL-font-color);
                    background-color:var(--NCTCL-background-color-lightest) !important;
                    border-color:var(--NCTCL-border-color) !important;
                }
                .skin-1080 #nomo_settings #GM_setting input
                ,.skin-1080 #nomo_settings #GM_setting .btn-default
                ,.skin-1080 #nomo_settings #GM_setting .btn-primary
                ,.skin-1080 #nomo_settings #GM_setting .form-control
                {
                    color:var(--NCTCL-font-color);
                    background-color:var(--NCTCL-background-color-lighter);
                    border-color:var(--NCTCL-border-color);
                }
                .skin-1080 #nomo_settings a
                ,.skin-1080 #nomo_settings a:hover
                ,.skin-1080 #nomo_settings a:focus{
                    color:var(--NCTCL-font-color-lighter) !important;
                }
                #GM_setting .GM_setting_under_dev .GM_setting_title{
                    color:#c9adff;
                }
                .skin-1080 #GM_setting .GM_setting_item_disable
                ,.skin-1080 #GM_setting .GM_setting_item_disable .GM_setting_title
                ,.skin-1080 #GM_setting .GM_setting_item_disable .GM_setting_desc
                {
                    color:#747474 !important;
                }
            
                /* lightest */
                .skin-1080 .cafe-write-btn a
                ,.skin-1080 .ia-info-btn .link_chat
                ,.skin-1080 .box_notice .link_more
                ,.WritingHeader .tool_area .temp_save_area .btn_temp_save
                ,.WritingHeader .tool_area .temp_save_area .btn_temp_count
                ,.WriterInfo .profile_info .link_talk
                ,.BaseButton.size_default:first-child
                ,.BaseButton.size_default
                ,.skin-1080 .board-notice.type_event .board-tag-txt, .skin-1080 .board-notice.type_up .board-tag-txt
                ,.skin-1080 .prev-next a.on
                ,.skin-1080 .select_component2 .select_list li a:hover
                ,.skin-1080 .select_component .select_list li a:hover
                ,.skin-1080 .select_component .date_enter .btn_set
                ,.skin-1080 #widget_company_info .link_company
                ,.skin-1080 .cafe-search .btn
                ,.skin-1080 #cafe-menu #favoriteMenuGroup
                ,.skin-1080 #cafe-menu #favoriteMenuGroup li
                ,.skin-1080 #cafe-menu #favoriteMenuGroup li a
                ,.skin-1080 #cafe-menu .cafe-menu-tit.frst
                ,.skin-1080 #cafe-menu .cafe-menu-tit.frst h3
                ,.skin-1080 #cafe-menu .cafe-menu-tit.frst a
                ,.skin-1080 .input_search_area .btn-search-green
                {
                    color:var(--NCTCL-font-color);
                    background-color:var(--NCTCL-background-color-lightest);
                    border-color:var(--NCTCL-border-color-lightest);
                }
            
                /* 공지 */
                .skin-1080 .board-notice.type_menu .board-tag-txt
                ,.skin-1080 .board-notice.type_required .board-tag-txt
                ,.skin-1080 .board-notice.type_main .board-tag-txt
                {
                    background: #303030;
                    border-color: #404040;
                    color: #fff;
                }
            
                /* 글쓰기 */
                .skin-1080 .setting_area, .skin-1080 .setting_area *{
                    color:var(--NCTCL-font-color-lighter);
                    background-color:var(--NCTCL-background-color-lighter);
                    border-color:var(--NCTCL-border-color-lighter);
                }
            
                /*emoji*/
                .CommentBox .comment_list .CommentItemSticker .comment_sticker_link .image
                ,.se-viewer .se-sticker-image{
                    background-color:var(--NCTCL-background-color-lightest);
                }
                
                .ArticleTool .button_comment .svg-icon
                ,.prev-next .pgR:after
                ,.footer .naver_cafe
                ,.left_area .BaseButton.size_default:not(.BaseButton--skinGreen) svg.svg-icon
                ,.right_area .BaseButton.size_default:not(.BaseButton--skinGreen) svg.svg-icon
                ,.se-viewer .se-video .se-media-meta-toggle-button
                {
                    filter:invert(1)
                }
            
                .toggle_switch .switch_slider
                {
                    filter:invert(1) brightness(2.5) contrast(0.78);
                }
            
                #linked-member .member-reload
                ,#linked-member .member-up
                {
                    filter:invert(1) brightness(1.2) contrast(0.7);
                }
            
                #naver-gnb #gnb-menu .gnb_service_li .gnb_icon
                ,.CommentBox .comment_option .comment_tab .comment_refresh_button
                ,.SubscribeButton .ToggleSwitch.ToggleSwitch--skinGray .switch_slider
                {
                    filter:invert(1) contrast(0.7) brightness(0.5);
                }
            
                .check_box input + label:before
                {
                    filter:invert(1) contrast(0.3) brightness(0.8);
                }
    
                .skin-1080 .article-board [class*="list-i"]
                ,.skin-1080 #cafe-menu .cafe-menu-list .ico_new
                ,.skin-1080 #cafe-menu .cafe-menu-tit .ico_new
                ,.ico_new
                ,.skin-1080 .board-notice.type_required .cmt, .skin-1080 .board-notice.type_main .cmt
                ,.skin-1080 .article-board .board-list .cmt
                ,.skin-1080 #naver-gnb #gnb-menu .chatting-cafe .count
                {
                    filter:grayscale(0.4);
                }
    
                .BaseButton--skinGreen
                ,.skin-1080 #cafe-menu .cafe-menu-tit .ico-bookmark
                {
                    filter:grayscale(1.0);
                }
                
                .toggle_switch .switch_input:checked + .switch_slider{
                    background-color:#AAA;
                }
                .skin-1080 #cafe-menu .cafe-menu-list{
                    margin-top:0px;
                    padding-top:6px;
                }
    
                .naver-splugin-c svg,
                .button_sticker,
                .button_file,
                .btn_type1.post_write:before{
                    filter:brightness(10);
                }
    
                .NCTCL-container svg {
                    display:none;
                }
    
                .se-media-meta-info-description::before, .se-media-meta-info-title::before{
                    background-color:var(--NCTCL-background-color) !important;
                }
                .skin-1080 .twitchClipFound .se-oglink-url{
                    color:#a778ff !important;
                }
                .skin-1080 .twitchClipFound .se-oglink-title::before
                ,.skin-1080 .NCTCL-titleText::before
                {
                    display: inline-block;
                    content: 'Twitch';
                    font-weight: 900;
                    color: #a778ff;
                    font-size: 12px;
                    font-family: math;
                    height: 20px;
                    width: 45px;
                    margin-right: 10px;
                    background: unset;
                    background-color: var(--NCTCL-background-color);
                    position: relative;
                    user-select: none;
                    padding: 0 4px;
                    box-sizing:border-box;
                }
                .skin-1080 .twitchClipFound .se-oglink-title::before{
                    top:-1px;
                }
            
                `.replace(/(\.skin\-1080)/g, "html[data-theme='dark'] body"));
            
                $("html").attr("data-theme","dark");
    
            }
        }
        catch(e){
            NOMO_DEBUG("Error from applyTheme", e);
        }
    }
    applyDarkMode();

    //FasterNoticeHide
    try{
        if(DEBUG){
            let savedNOTICE_OPEN = localStorage.getItem('NOTICE_OPEN');
            if(savedNOTICE_OPEN === null){
                savedNOTICE_OPEN = "ON";
            }
            NOMO_DEBUG("NOTICE_OPEN", savedNOTICE_OPEN)
            if(savedNOTICE_OPEN === "OFF"){
                GM_addStyle(`._noticeArticle {display:none;}`);
            }
            $(document).on("change", "#notice_hidden", function(e){
                NOMO_DEBUG("e.target.checked", e.target.checked);
                if(e.target.checked){
        
                }
                else{
                    $("._noticeArticle").show();
                }
            });
        }
    }
    catch(e){
        NOMO_DEBUG("Error from FasterNoticeHide", e);
    }

    ////////////////////////////////////////////////////
    // document ready
    $(document).ready(function(){
        // naverBoardDefaultArticleCount
        try{
            if(GM_SETTINGS.naverBoardDefaultArticleCount !== "0" && Number(GM_SETTINGS.naverBoardDefaultArticleCount) > 0){
                unsafeWindow.oriSearchFrmAfter = unsafeWindow.searchFrmAfter;
                unsafeWindow.searchFrmAfter = function(frm){
                    var oriSearchFrmAfterStr = oriSearchFrmAfter.toString();
                    var clubid = oriSearchFrmAfterStr.match(/clubid=(\d+)/);
                    if(clubid !== null && clubid.length >= 2){
                        NOMO_DEBUG("clubid", clubid);
                        $("#cafe_main").attr("src",`/ArticleSearchList.nhn?search.clubid=${clubid[1]}&search.searchBy=0&search.query=${URLEncoder.encode(frm.query.value,"MS949")}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                    }
                    else{
                        oriSearchFrmAfter(frm);
                    }
                }

                unsafeWindow.oriDrawFavoriteCafeMenuList = unsafeWindow.drawFavoriteCafeMenuList;
                unsafeWindow.drawFavoriteCafeMenuList = function(favoriteCafeMenuList){
                    unsafeWindow.oriDrawFavoriteCafeMenuList(favoriteCafeMenuList);
                    let $as = $("#cafe-menu #favoriteMenuGroup").find("a");
                    NOMO_DEBUG("$as", $as);
                    $as.each(function(i,v){
                        setTimeout(function(){
                            let $a = $(v);
                            let oriHref = $a.attr("href");
                            if(oriHref.indexOf("userDisplay") === -1){
                                $a.attr("href", `${oriHref}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                            }
                        }, 1);
                    });
                }

                let $as = $("#cafe-menu").find(".cafe-menu-list a[target='cafe_main']");
                $as.each(function(i,v){
                    setTimeout(function(){
                        let $a = $(v);
                        let oriHref = $a.attr("href");
                        if(oriHref.indexOf("userDisplay") === -1){
                            $a.attr("href", `${oriHref}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                        }
                    }, 1);
                });
            }
        }
        catch(e){
            NOMO_DEBUG("Error from naverBoardDefaultArticleCount", e);
        }

        // theaterMode & theme
        try{
            var $gnbmenu = $("#gnb-menu");
            if(GM_SETTINGS.useTheaterMode){
                if($gnbmenu.length !== 0){
                    $gnbmenu.prepend($theaterModeBtn);
                }

                var $frontImage = $("#front-cafe a img");
                if($frontImage.length !== 0){
                    var src = $frontImage.attr("src");
                    GM_addStyle(`
                    html.theaterMode #front-cafe::before{
                        content:'-';
                        width:100%;
                        height:100%;
                        position:absolute;
                        background-size: cover;
                        top:0;
                        left:0;
                        background-image:url(${src});
                        filter:blur(10px);
                        z-index:1;
                    }

                    html.theaterMode #front-cafe img{
                        position:relative;
                        top:0;
                        left:0;
                        z-index:2;
                    }
                    `);
                }
            }

            if(GM_SETTINGS.showDarkModeBtn){
                if($gnbmenu.length !== 0){
                    $gnbmenu.prepend($darkModeBtn);
                }
            }
        }
        catch(e){
            NOMO_DEBUG("Error from theaterMode", e);
        }

        //alwaysShowFavoriteBoard
        try{
            if(GM_SETTINGS.alwaysShowFavoriteBoard){
                let $favoriteMenuGroupBtn = $("#favoriteMenuGroupBtn");
                if($favoriteMenuGroupBtn.length !== 0 && $favoriteMenuGroupBtn.hasClass("down-btn")){
                    toggleFavoriteMenuGroup();
                }
            }
        }
        catch(e){
            NOMO_DEBUG("Error from alwaysShowFavoriteBoard", e);
        }

    });
    // document ready end
    ///////////////////////////////

})();
