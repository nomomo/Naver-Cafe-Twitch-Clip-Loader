// ==UserScript==
// @name        Naver-Cafe-Twitch-Clip-Loader
// @namespace   Naver-Cafe-Twitch-Clip-Loader
// @version     0.2.1
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
            desc:"클립 링크를 비디오로 변환하는 시점을 선택", radio: {autoLoad: {title: "페이지 로딩 시", value:"autoLoad"}, clickRequired: {title: "링크 클릭 시", value:"clickRequired"}}
        },
        autoLoadLimit : {
            category: "type",
            category_name: "페이지 로딩 시",
            depth:3,
            radio_enable_value: "autoLoad",
            type: "text",
            value: 5,
            valid:"number",
            min_value:1,
            max_value:100,
            title:"페이지 로딩 시점에 변환할 개수 제한", desc:"페이지 로딩 시점에 비디오로 변환할 링크의 최대 개수를 설정하여 브라우저가 멈추는 것을 방지합니다. 최대 개수를 초과한 클립부터는 링크를 클릭하여 비디오로 변환할 수 있습니다.<br />(Default: 5, Range: 1~1000)" },
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
            category_name: "링크 클릭 시",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: true,
            title: "클립 로드 시 자동 재생",
            desc: "클릭과 동시에 클립을 자동 재생합니다. 이 옵션을 사용하면 클립이 음소거 상태로 재생되는 경우가 있습니다."
        },
        clickRequiredMuted: {
            category: "type",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: false,
            title: "클립 로드 시 음소거 (Legacy)",
            desc: "클립 재생 시 음소거 상태로 시작합니다. 본 옵션은 추후 삭제될 예정입니다. '클립 로드 시 특정 사운드 볼륨(Volume)으로 설정' 옵션을 사용하려면 본 옵션을 체크 해제 하세요."
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
            title:"화면 클릭으로 클립 재생 및 일시정지",
            desc:"클립 화면을 클릭하여 재생 및 일시정지 되도록 만듭니다. (편하다!)"
        },
        useTheaterMode : {
            category:"theaterMode",
            category_name: "영화관 모드",
            under_dev:true,
            depth: 1,
            type: "checkbox",
            value: true,
            title:"영화관 모드 버튼을 표시",
            desc:"카페 화면 최상단의 '영화관 모드' 버튼을 클릭하여 영화관 모드를 활성화할 수 있습니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.",
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
            desc:"영화관 모드 시 카페 컨텐츠의 가로 사이즈를 결정합니다.<br />FHD 해상도 기준 권장 사이즈 : 800(네이버 카페 기본) ~ 1500<br />(Default: 1300, Range: 400~10000)",
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
            desc:"비디오를 전체화면 한 후 해제했을 때 스크롤이 다른 위치로 변경되는 문제를 개선합니다. 만약 전체화면 후 스크롤과 관련된 다른 문제가 발생한다면 이 기능을 끄십시오."
        },
        naverBoardDefaultArticleCount: {
            category:"etc",
            depth: 1,
            type: "combobox",
            value: "-1",
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
        improvedRefresh:{
            under_dev:true,
            category:"etc",
            depth: 1,
            type: "checkbox",
            value: false,
            title:"[실험실] 네이버 카페 새로고침 개선",
            desc:"네이버 카페에서 새로고침 시, 메인 화면 대신 이전에 탐색한 페이지를 불러옵니다. 만약 네이버 카페에서 새로고침 시 문제가 발생한다면 이 기능을 끄십시오."
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

    #theaterModeBtn {
        display: inline-block;
        float: left;
        margin-top: 10px;
        font-size: 12px;
        cursor: pointer;
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
                $(document).on('click', "[data-a-target='player-overlay-click-handler']", (e) => {
                    NOMO_DEBUG('clicked - playing', e);
                    document.querySelector("button[data-a-target='player-play-pause-button']").click();
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
                NOMO_DEBUG('twitch clip play()', e);
                if(GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip) window.parent.postMessage({"type":"NCTCL", "event":"play", "clipId":clipId}, "https://cafe.naver.com");
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

            var $iframes = $(document).find("div.NCTCL-iframe-container iframe");
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
                    if(!$nvideo.hasClass("_FISRTPLAYED") || $nvideo[0].paused) return;

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
        autoPauseVideo(e);
    });

    ////////////////////////////////////////////////////////////////////////////////////
    // Main
    ////////////////////////////////////////////////////////////////////////////////////
    // 영화관 모드
    let isTheaterMode = await GM.getValue("theaterMode", false);
    let $theaterModeBtn = $(`<span title="[NCTCL] 현재 영화관 모드가 ${isTheaterMode ? "켜져" : "꺼져"} 있습니다. 클릭 시 영화관 모드를 ${isTheaterMode ? "비활성화" : "활성화"} 합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다." id="theaterModeBtn">영화관 모드 ${isTheaterMode ? "켜짐" : "꺼짐"}<img src="https://cafe.pstatic.net/cafe4/ico-blank.gif" width="1" height="10" alt="" class="tcol-c"></span>`)
    .on("click", async () => {
        isTheaterMode = await GM.setValue("theaterMode", !isTheaterMode);
        location.reload();
    });
    let contentWidth = 800;

    // 콘텐츠 width 계산
    var videoWidth, videoHeight, videoWidthStr, videoHeightStr;
    var reCalculateIframeWidth = function(width){
        contentWidth = width;
        videoWidth = Number(GM_SETTINGS.videoWidth)/100.0 * contentWidth;
        videoHeight = Number(videoWidth)/16.0*9.0;// + 30
        videoWidthStr = String(videoWidth) + "px";
        videoHeightStr = String(videoHeight) + "px";
        NOMO_DEBUG("reCalculateIframeWidth", width);
    }
    reCalculateIframeWidth(contentWidth);

    // Add CSS
    GM_addStyle(`
    .se-oglink-thumbnail.hoverPlayButton::before{
        content:'';position:absolute; width: 100%; height: 100%; background-repeat: no-repeat;background-position: center center;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAYAAAA/xl1SAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBEQjEyRDJFQzRCMTFFNkFEQjVENzAwNDkwOUQ4MDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBEQjEyRDNFQzRCMTFFNkFEQjVENzAwNDkwOUQ4MDYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMERCMTJEMEVDNEIxMUU2QURCNUQ3MDA0OTA5RDgwNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMERCMTJEMUVDNEIxMUU2QURCNUQ3MDA0OTA5RDgwNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgmImiEAAAs1SURBVHja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);
        opacity:0.5;
    }
    .se-oglink-thumbnail.hoverPlayButton:hover::before{
        opacity:1.0;
    }
    .NCTCL-iframe-container .se-link{
        display: inline-block; padding: 16px; border: 1px solid rgba(0,0,0,.15); box-sizing: border-box; margin-top: -1px;text-decoration: none;
        overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size:14px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 4%);
        height: 48px;
    }
    .NCTCL-iframe-container .se-link:hover{
        text-decoration: none;
    }
    .NCTCL-iframe-container .NCTCL-titleText {
    }
    .NCTCL-iframe-container .NCTCL-clipurlText {
        text-decoration: underline;
    }

    .se-media-meta-info-title::before{
        content: 'NAVER';
        font-weight: 900;
        color: #2DB400;
        font-size: 12px;
        font-family: math;
        height: 16px;
        width: 16px;
        margin-right: 5px;
        background: #eee;
        padding: 0 3px;
        user-select: none;
    }
    `);

    // Twitch clip 링크를 iframe 으로 변환
    var changeToTwitchCilpIframe = function($elem, clipId, autoPlay, muted){
        try{
            var $parentContainer = $elem.closest("div.se-component-content");
            var $article_container = $elem.closest("div.article_container");
            if($article_container.length !== 0) {
                reCalculateIframeWidth($article_container.width());
            }
            else{
                NOMO_DEBUG("$article_container.length is zero");
            }
            $parentContainer.hide();
            var tempary = document.location.href.split("/");
            var parentHref = tempary[2];
            var clipurl = `https://clips.twitch.tv/${clipId}`;
            var $title = $parentContainer.find(".se-oglink-title");
            var title = "", titleText = "", clipurlText = clipurl;
            if($title.length !== 0){
                title = escapeHtml($title.text());
                titleText = `<span class="NCTCL-titleText">${title}</span>`;
                clipurlText = `(<span class="NCTCL-clipurlText">${clipurl}</span>)`;
            }
            $parentContainer.after(`
            <div class="NCTCL-iframe-container">
                <iframe class="NCTCL-iframe" data-clip-id="${clipId}" src="https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}" frameborder="0" allowfullscreen="true" allow="autoplay" scrolling="no" height="${videoHeightStr}" width="${videoWidthStr}"></iframe>
                <br />
                <a title="클릭 시 다음의 Twitch Clip 페이지로 이동합니다. ${clipurl}" href="${clipurl}" class="se-link" target="_blank" style="width:${videoWidthStr};">
                    <svg style="vertical-align: bottom;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" viewBox="0 0 256 256" xml:space="preserve">
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
            `);
        }
        catch(e){
            console.error("Error from changeToTwitchCilpIframe", e);
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
            console.error("Error from removeOriginalLinks", e);
        }
    }

    // Twitch clip 링크 찾기
    $(document).arrive("div.se-module-oglink", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(!GM_SETTINGS.use) return;
            var $elem = $(elem);
            if($elem.hasClass("fired")) return;
            $elem.addClass("fired");
            $elem.parent("div.se-section-oglink").addClass("fired");

            var $as = $elem.find("a");
            var regex = /^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9-_]+)/;
            var regex2 = /^https?:\/\/www.twitch.tv\/[a-zA-Z0-9-_]+\/clip\/([a-zA-Z0-9-_]+)/;

            // 자동 변환 시
            if(GM_SETTINGS.method === "autoLoad"){
                var $a = $as.first();
                var href = $a.attr("href");
                var match = href.match(regex);
                if(match == null){
                    match = href.match(regex2);
                }

                if(match !== null && match.length > 1){
                    var clipId = match[1];
                    var isAutoPlay = false;
                    var isMuted = false;
                    var NCTCL_Length = $(".NCTCL-iframe").length;
                    removeOriginalLinks(href);
                    if(GM_SETTINGS.autoPlayFirstClip && NCTCL_Length == 0){
                        isAutoPlay = true;
                        if(GM_SETTINGS.autoPlayFirstClipMuted) isMuted = true;
                        changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted);
                    }
                    else if(NCTCL_Length < GM_SETTINGS.autoLoadLimit){
                        changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted);
                    }
                    else{
                        if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                        $a.on("click", function(e){
                            e.preventDefault();
                            changeToTwitchCilpIframe($(e.target), clipId, GM_SETTINGS.clickRequiredAutoPlay, GM_SETTINGS.clickRequiredMuted);
                        });
                    }
                }
            }
            // 클릭 변환 시
            else{   // if(GM_SETTINGS.method === "clickRequired")
                $as.each(function(i, v){
                    var $a = $(v);
                    var href = $a.attr("href");
                    var match = href.match(regex);
                    if(match == null){
                        match = href.match(regex2);
                    }

                    if(match !== null && match.length > 1){
                        removeOriginalLinks(href);
                        var clipId = match[1];
                        if($a.hasClass("se-oglink-thumbnail")) $a.addClass("hoverPlayButton");
                        $a.on("click", function(e){
                            e.preventDefault();
                            changeToTwitchCilpIframe($(e.target), clipId, GM_SETTINGS.clickRequiredAutoPlay, GM_SETTINGS.clickRequiredMuted);
                        });
                    }
                });
            }
        }
        catch(e){
            console.error("Error from arrive", e);
        }
    });

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
        console.error("Error from fixFullScreenScrollChange", e);
    }

    $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(!GM_SETTINGS.use) return;
            if(isTwitch) return;
            if($(elem).hasClass("_FISRTPLAYED")) return;

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

                if($elem.hasClass("_FISRTPLAYED")) return;
                $elem.addClass("_FISRTPLAYED");
            });

            $(elem).on("pause", function (e) {
                NOMO_DEBUG("Naver video paused", e);
            });
        }
        catch(e){
            console.error("Error from video arrive", e);
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
                    console.error("Error from naverVideoAutoMaxQuality arrive", e);
                }
            }, 1);
        });
    }

    // theaterMode
    if(GM_SETTINGS.useTheaterMode && isTheaterMode){
        var cw = (Number(GM_SETTINGS.useTheaterModeContentWidth) + 60.0) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;
        var cwPure = Number(GM_SETTINGS.useTheaterModeContentWidth) * Number(Number(GM_SETTINGS.videoWidth)) / 100.0;

        GM_addStyle(`
            #front-cafe, #front-img {overflow:hidden; object-fit:cover !important;}
            #cafe-body, #content-area, #front-cafe, #front-img {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 220px + 60px) !important}
            #cafe_main, .Article, .Article .article_wrap, #content-area #main-area {width:calc(${GM_SETTINGS.useTheaterModeContentWidth}px + 60px) !important}
            .CafeViewer .se-viewer .se-caption, .CafeViewer .se-viewer .se-component-content, .CafeViewer .se-viewer .se-component-content.se-component-content-fit, .se-section-video {
                max-width:${cw}px !important;
                max-height:calc(${cw}px / 16.0 * 9.0) !important
                width:${cw}px !important;
            }
            .CafeViewer .se-viewer .se-section-oglink.fired {
                max-width:${cwPure}px !important;
                max-height:calc(${cwPure}px / 16.0 * 9.0 + 49px) !important;
            }
            .se-viewer .se-section-oglink.se-l-large_image.fired .se-oglink-thumbnail,
            .se-viewer .se-section-oglink.se-l-large_image.fired .se-oglink-thumbnail-resource{
                max-width:${cwPure}px !important;
                max-height:calc(${cwPure}px / 16.0 * 9.0 - 49px) !important;
            }

            #front-cafe {text-align:center}
            .ArticleFormBanner.bottom{margin:0 auto}
        `);
    }

    if(!isTheaterMode){
        GM_addStyle(`
        .CafeViewer .se-viewer .se-section-oglink.fired .se-oglink-thumbnail-resource{
            object-fit:cover;
        }
        .CafeViewer .se-viewer .se-section-oglink.fired {
            max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
            max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0 + 49px) !important;
        }
        .se-viewer .se-section-oglink.se-l-large_image.fired .se-oglink-thumbnail,
        .se-viewer .se-section-oglink.se-l-large_image.fired .se-oglink-thumbnail-resource{
            max-width:${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px !important;
            max-height:calc(${contentWidth * Number(Number(GM_SETTINGS.videoWidth)) / 100.0}px / 16.0 * 9.0 - 49px) !important;
        }
        `);
    }

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
                    console.error("Error from improvedRefresh JSON.parse", e);
                    return;
                }
    
                NOMO_DEBUG("savedLastCafeMainUrl", savedLastCafeMainUrl);
                if(document.location.href === savedLastCafeMainUrl.url){
                    NOMO_DEBUG("저장된 url 과 현재 url 이 같다", savedLastCafeMainUrl.url);
                    return;
                }
        
                const parentWindowRefreshed = String(window.top.performance.getEntriesByType("navigation")[0].type) === "reload";
                let refreshDelay = Number(new Date()) - savedLastCafeMainUrl.date;
        
                NOMO_DEBUG("PARENT REFRESHED? = ", parentWindowRefreshed, "CURRENT URL = ", document.location.href, ", REFRESHDELAY = ", refreshDelay);
                unsafeWindow.parent.refreshChecked = true;
    
                if(parentWindowRefreshed && refreshDelay < 5000.0){
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
            console.error("Error from improvedRefresh", e);
        }
    }
    if(GM_SETTINGS.improvedRefresh){
        improvedRefresh();
    }

    ////////////////////////////////////////////////////
    // document ready
    $(document).ready(function(){
        // naverBoardDefaultArticleCount
        try{
            if(GM_SETTINGS.naverBoardDefaultArticleCount !== "0"){
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

                let $as = $("#cafe-menu").find(".cafe-menu-list a[target='cafe_main']");
                $as.each(function(i,v){
                    setTimeout(function(){
                        let $a = $(v);
                        let oriHref = $a.attr("href");
                        $a.attr("href", `${oriHref}&userDisplay=${GM_SETTINGS.naverBoardDefaultArticleCount}`);
                    }, 1);
                });
            }
        }
        catch(e){
            console.error("Error from naverBoardDefaultArticleCount", e);
        }

        // theaterMode
        try{
            if(GM_SETTINGS.useTheaterMode){
                var $gnbmenu = $("#gnb-menu");
                if($gnbmenu.length !== 0){
                    $gnbmenu.prepend($theaterModeBtn);
                }

                if(isTheaterMode){
                    var $frontImage = $("#front-cafe a img");
                    if($frontImage.length !== 0){
                        var src = $frontImage.attr("src");
                        GM_addStyle(`
                        #front-cafe::before{
                            content:'-';
                            width:100%;
                            height:100%;
                            z-index:-1;
                            position:absolute;
                            background-size: cover;
                            top:0;
                            left:0;
                            background-image:url(${src});
                            filter:blur(10px)
                        }
                        `);
                    }
                }
            }
        }
        catch(e){
            console.error("Error from theaterMode", e);
        }
    });

})();
