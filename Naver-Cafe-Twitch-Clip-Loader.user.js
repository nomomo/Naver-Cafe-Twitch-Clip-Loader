// ==UserScript==
// @name        Naver-Cafe-Twitch-Clip-Loader
// @namespace   Naver-Cafe-Twitch-Clip-Loader
// @version     0.0.5
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

    console.log("[NCTCL]   Naver-Cafe-Twitch-Clip-Loader", document.location.href);
    var DEBUG = await GM.getValue("DEBUG", false);

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
        * Version: Apr. 10, 2022
        * MIT licensed
        * https://github.com/nomomo/
        * nomotg@gmail.com
        * Copyright (c) 2017-2022 NOMO
        */
        // eslint-disable-next-line
        var GM_setting=function(t,e,n){var i,a=void 0,s="",o=[],r={},l={},_={},d={},p=!1,c=function(){if(p){for(var t=arguments,e=t.length,n=t,i=e;i>0;i--)t[i]=n[i-1];t[0]="+[GM_SETTINGS]  ",t.length=e+1,console.log.apply(console,t)}},g=(navigator.language||navigator.userLanguage).toLowerCase().substring(0,2),u=g,v="ko",f=!1;const G={en:{title_settings:"Settings",title_reset:"Reset",donate:"Donate",buymeacoffee:"Buy me a coffee",buymeacoffeeDesc:"Support my projects by buying me a coffee! ☕",toonation:"Toonation",button_reset_settings:"Reset Settings",confirm_reset_settings:"Are you sure you want to reset the settings?",complete_reset_settings:"Settings reset complete!",button_reset_settings_all:"Script reset (refresh is required)",confirm_reset_settings_all:"Do you really want to reset script?",complete_reset_settings_all:"Script initialization complete!",auto_saved:"Autosaved: ",err_val_req:"A value must be entered.",err_num_req:"Only numbers can be entered.",err_num_over:"The input value must be a number greater than or equal to : ",err_num_not_more_than:"The input value must be a number less than or equal to: ",err_valid_array_string:"Only English letters, numbers, commas (,) and underscores (_) can be entered.",err_value_empty:"Something for which no value exists, such as an empty value.",err_value_dup:"Duplicate value exists: ",err_value_blank:"There is an item of a space in the string: "},ko:{title_settings:"Settings",title_reset:"Reset",donate:"후원하기",buymeacoffee:"Buy me a coffee 로 커피 한 잔 사주기",buymeacoffeeDesc:"커피 한 잔☕ 으로 프로젝트를 지원해주세요~",toonation:"Toonation 으로 후원하기",button_reset_settings:"Reset Settings",confirm_reset_settings:"진짜 설정을 초기화 할까요?",complete_reset_settings:"설정 초기화 완료!",button_reset_settings_all:"전체 초기화(새로고침 필요)",confirm_reset_settings_all:"진짜 스크립트를 모두 초기화 할까요?",complete_reset_settings_all:"스크립트 초기화 완료!",auto_saved:"자동 저장 됨: ",err_val_req:"반드시 값이 입력되어야 합니다.",err_num_req:"숫자만 입력 가능합니다.",err_num_over:"입력 값은 다음 값 이상의 숫자이어야 합니다. : ",err_num_not_more_than:"입력 값은 다음 값 이하의 숫자이어야 합니다. : ",err_valid_array_string:"영문, 숫자, 콤마(,), 언더바(_) 만 입력 가능합니다.",err_value_empty:"공백 값 등 값이 존재하지 않는 항목이 존재합니다.",err_value_dup:"중복된 값이 존재합니다: ",err_value_blank:"문자열 내 공백이 존재하는 항목이 있습니다: "}};var h=function(t){var e="";if("object"==typeof t){var n=Object.keys(t);if(0===n.length)return e;e=void 0!==t[u]?t[u]:void 0!==t[v]?t[u]:t[n[0]]}else e=t;return e},M=function(t){return void 0!==G[u]?G[u][t]:void 0!==G[v]?G[v][t]:""},m=async function(){""!==s&&await GM.setValue(s,_),e[s]=_,t.each(o,function(t,e){void 0!==l[e]&&void 0!==l[e].change&&l[e].change(_[e])}),o=[]},x=async function(){c("load_"),""!==s&&(_=await GM.getValue(s,_)),_.Lang=await y(),e[s]=_},y=async function(){return u=await GM.getValue("GM_SETTING_LANG",g),c("loadLang_",u),u},b=function(e){d={};var n=t(e);i=n,0!==n.find("#GM_setting_container").length&&n.empty();var s=t("<div id='GM_setting_container'></div>"),o=t(`\n<div id='GM_setting_head'>\n<div style='height:25px;display:inline-block;white-space:nowrap'>Settings</div>\n<div style='display:flex;height:25px;float:right;'>\n<div id='GM_homepage_link' style='align-self: flex-end;'>\n<a href='${GM.info.script.homepage}' target='_blank' style='font-size:12px;font-weight:normal;align-self:flex-end;'>${GM.info.script.name} v${GM.info.script.version} (${GM.info.script.homepage})</a>\n</div>\n<div id='GM_multilang' style='margin-left:15px;'>\n<select id='GM_multilang_select' class="form-control input-sm">\n    <option value="ko">한국어</option>\n    <option value="en">English</option>\n</select>\n</div>\n</div>\n</div>`);void 0!==GM.info&&null!==GM.info&&void 0!==GM.info.script&&null!==GM.info.script&&void 0!==GM.info.script.homepage&&null!==GM.info.script.homepage&&""!==GM.info.script.homepage?o.find("#GM_homepage_link").show():o.find("#GM_homepage_link").hide();var r=o.find("#GM_multilang");if(f){r.show();var _=r.find("#GM_multilang_select");_.val(u),_.on("change",async function(e){var n=u;t("option:selected",this),this.value;u=this.value,c(`LANG VALUE CHANGED FROM ${n} TO ${u}`),await async function(t){null==t?(await GM.setValue("GM_SETTING_LANG",u),c("saveLang_",u)):(await GM.setValue("GM_SETTING_LANG",t),c("saveLang_",t))}(),null!=a?(t(a).empty(),b(a)):c("NO CREATED LAYOUT")})}else r.hide();var p,g=t("<ul id='GM_setting'></ul>"),v=void 0;for(var G in n.append(s),s.append(o).append(g),l){var x,y,$=l[G].category,z=l[G].depth,D=l[G].type,N=h(l[G].title),O=h(l[G].desc),E=h(l[G].category_name),C=l[G].radio_enable_value,q=t("<div class='GM_setting_input_container form-group'></div>"),V="tag"===D||"textarea"===D;if("radio"===D){var U=l[G].radio;for(var j in x=t("<div GM_setting_type='radio'></div>"),U){var I=t("<label class='radio-inline'>"+h(U[j].title)+"</label>");t("<input name='GM_setting_"+G+"' class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' onfocus='this.blur()' />").attr({value:U[j].value,type:"set"===D?"text"===D:"tag"===D?"textarea":D,GM_setting_type:D,GM_setting_key:G,GM_setting_category:void 0===$?"default":$,GM_setting_radio_enable_value:void 0===C?"none":C}).prependTo(I),x.append(I)}}else x=t(`<${V?"textarea ":"input "} class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' ${"checkbox"===D?"onfocus='this.blur()'":""}${V?"></textarea>":" />"}`).attr({type:"set"===D?"text"===D:"tag"===D?"textarea":D,GM_setting_type:D,GM_setting_key:G,GM_setting_category:void 0===$?"default":$,GM_setting_radio_enable_value:void 0===C?"none":C});y=t(void 0!==E?`<div class='GM_setting_category_name'>${E}</div>`:"<div class='GM_setting_category_blank'></div>");var B=t("<div class='GM_setting_list_head'></div>"),R=t(`<span class='GM_setting_title'>${N}</span>`),F=t(`<span class='GM_setting_desc'>${O}</span>`),H=t(`<li ${void 0!==l[G].radio_enable_value?" GM_setting_radio_enable_value='"+l[G].radio_enable_value+"'":""} GM_setting_key='${G}' GM_setting_depth='${z}' class='${l[G].under_dev?"GM_setting_under_dev ":""} ${void 0!==E&&(void 0===v||void 0!==v&&$!==v.category)?"GM_setting_category ":""} GM_setting_depth${z}'></li>`);if(g.append(H),B.append(R).append(F),"checkbox"===D)t('<label class="btn btn-default btn-xxs"><span class="glyphicon glyphicon-ok"></span></label>').prepend(x).appendTo(q),x.on("change",function(){t(this).is(":checked")?t(this).closest("label").addClass("active"):t(this).closest("label").removeClass("active"),t(this).is(":disabled")?t(this).closest("label").addClass("disable").prop("disabled",!0):t(this).closest("label").removeClass("disable").prop("disabled",!1)});else q.append(x);H.append(y).append(B).append(q),d[G]=x,void 0!==l[G].append&&q.append(l[G].append),v=l[G]}n.find("input[type='checkbox']").on("click",function(){L(n)}),n.find("input[type='radio']").on("click",function(){L(n)}),n.find("input, textarea").on("input",function(){c("GM_setting - text change");var e=t(this),i=S(e),a=e.attr("GM_setting_key"),s=A(a,i);e.closest("div").find(".invalid_text").remove(),s.valid?e.closest("div").removeClass("invalid"):(c("validation",s),e.closest("div").addClass("invalid"),e.after("<div class='invalid_text'>"+s.message+"</div>")),clearTimeout(p),p=setTimeout(function(){var e=!0;t.each(d,function(t,n){if(!A(t,S(n)).valid)return e=!1,!1}),e&&(k(),m(),w(M("auto_saved")+(new Date).toLocaleTimeString(),n))},1e3)}),T(),L(n),g.append(`<li class="GM_setting_category GM_setting_depth1">\n    <div class="GM_setting_category_name">${M("title_reset")}</div>\n    <div class="GM_setting_list_head">\n        <span class="GM_setting_title">\n            <span class="GM_setting_reset btn btn-primary" style="margin-left:0;">${M("button_reset_settings")}</span>\n            \x3c!--<span class="GM_setting_reset_all btn btn-primary">button_reset_settings_all</span>--\x3e\n        </span>\n        <span class="GM_setting_desc"></span>\n    </div>\n    <div class="GM_setting_input_container form-group">\n    </div>\n</li>`),g.find(".GM_setting_reset").on("click",async function(){confirm(M("confirm_reset_settings"))&&(await GM_setting.reset(),GM_setting.createlayout(i),w(M("complete_reset_settings")+(new Date).toLocaleTimeString(),i))}),g.find(".GM_setting_reset_all").on("click",async function(){if(confirm(M("confirm_reset_settings_all"))){for(var t=await GM.listValues(),e=0;e<t.length;e++){var n=t[e];await GM.deleteValue(n)}await GM_setting.reset(),GM_setting.createlayout(i),w(M("complete_reset_settings_all")+(new Date).toLocaleTimeString(),i)}}),g.append(`<li class="GM_setting_category GM_setting_depth1">\n<div class="GM_setting_category_name">${M("donate")}</div>\n<div class="GM_setting_list_head">\n    <span class="GM_setting_title">\n        ${M("buymeacoffee")}\n    </span>\n    <span class="GM_setting_desc">\n        ${M("buymeacoffeeDesc")}\n    </span>\n</div>\n<div class="GM_setting_input_container form-group">\n<a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>\n</div>\n</li>\n<li class="GM_setting_depth1">\n<div class="GM_setting_category_blank"></div>\n    <div class="GM_setting_list_head">\n        <span class="GM_setting_title">\n            ${M("toonation")}\n        </span>\n        <span class="GM_setting_desc"></span>\n    </div>\n    <div class="GM_setting_input_container form-group">\n    <a href="https://toon.at/donate/636947867320352181" target="_blank"><img src="https://raw.githubusercontent.com/nomomo/Addostream/master/assets/toonation_b11.gif" height="41" alt="Donate with Toonation" /></a>\n    </div>\n</li>\n`),g.after(`\n<div id="GM_setting_footer">\n    <a href="${GM.info.script.homepage}" target="_blank">${GM.info.script.name}</a> v${GM.info.script.version}\n    <div class="footer_divider"></div> GM Setting v22.4.10\n    <div class="footer_divider"></div> ©2017-${(new Date).getFullYear()} <a href="https://nomo.asia/" target="_blank">NOMO</a></div>\n`)},w=function(e,n){if(void 0!==n){var i="GM_setting_autosaved";n.find("."+i).animate({bottom:"+=40px"},{duration:300,queue:!1}),t("<div style='animation: glow .5s 10 alternate; position:fixed; left:10px; bottom:20px; z-index:10000000;' class='"+i+" btn btn-success'>"+e+"</div>").appendTo(n).fadeIn("fast").animate({opacity:1},6e3,function(){t(this).fadeOut("fast").delay(600).remove()}).animate({left:"+=30px"},{duration:300,queue:!1})}},k=async function(){for(var e in c("read_"),d){var n=d[e],i=S(n);"tag"===l[e].type&&(1===(i=i.split(",")).length&&""===i[0]&&(i=[]),t.each(i,function(t,e){i[t]=e.replace(/^\s*|\s*$/g,"")})),_[e]!==i&&-1===o.indexOf(e)&&o.push(e),_[e]=i}},T=async function(){for(var t in c("write_"),d){var e=d[t];$(e,_[t])}},S=function(t){var e;switch(t.attr("GM_setting_type")){case"checkbox":e=t.prop("checked");break;case"set":case"text":case"tag":case"textarea":e=t.val();break;case"radio":e=t.find("input:checked").val();break;default:e=void 0}return e},$=function(t,e){switch(t.attr("GM_setting_type")){case"checkbox":t.prop("checked",e).trigger("change");break;case"set":case"text":t.val(e);break;case"tag":case"textarea":t.val(e),t.height("auto"),t.height(t.prop("scrollHeight")+"px");break;case"radio":t.find("input[value="+e+"]").prop("checked",!0)}},L=async function(e){var n=e.find("li");n.removeClass("GM_setting_item_disable"),n.find("input, textarea").prop("disabled",!1),n.find("input[type='checkbox']").trigger("change");for(var i,a,s=[!0,!0],o=-1,r=0;r<n.length;r++){var _=t(n[r]),d=_.attr("GM_setting_depth"),p=_.attr("GM_setting_key"),c=_.attr("GM_setting_radio_enable_value");if(0==r);else{var g=(i=t(n[r-1])).attr("GM_setting_depth");if(g==d&&g>0)void 0!==a&&(NOMO_DEBUG("prevTopRadioVal",a,o,d),o>=d?(a=void 0,o=-1):o<d&&(s[g-1]=a==c));else if(g<d){a=void 0;var u=i.find("input[type='checkbox']"),v=i.find("input[type='radio']");0!==u.length&&u.is(":checked")?s[g]=!0:0!==v.length?(a=i.find("input[type='radio']:checked").val(),o=g,i.find("input[type='radio']:checked").val()==c?s[g]=!0:s[g]=!1):s[g]=!1}}for(var f=0;f<d;f++)if(l[p].disable||!s[f]){_.addClass("GM_setting_item_disable"),_.find("input, textarea").prop("disabled",!0),_.find("input[type='checkbox']").trigger("change");break}}},A=function(e,n){var i,a,s,o=!0,r="";if("number"===l[e].valid)o=t.isNumeric(n),""===n?r+=M("err_val_req"):o?void 0!==l[e].min_value&&l[e].min_value>n?(o=!1,r+=M("err_num_over")+l[e].min_value):void 0!==l[e].max_value&&l[e].max_value<n&&(o=!1,r+=M("err_num_not_more_than")+l[e].max_value):r+=M("err_num_req");else if(""!==n&&"array_string"===l[e].valid){i=t.map(n.split(","),t.trim);var _=n.match(/^[A-Za-z0-9 _,]*$/);if(null===_||0===_.length)o=!1,r+=M("err_valid_array_string");else if(-1!==t.inArray("",i))o=!1,r+=M("err_value_empty"),c(i,t.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var d=0;d<i.length-1;d++)s[d+1]==s[d]&&-1===t.inArray(s[d],a)&&a.push(s[d]);r+=M("err_value_dup")+a.join(",")}else for(var p=0;p<i.length;p++)if(-1!==i[p].indexOf(" ")){o=!1,r+=M("err_value_blank")+i[p];break}}else if(""!==n&&"array_word"===l[e].valid)if(i=t.map(n.split(","),t.trim),-1!==t.inArray("",i))o=!1,r+=M("err_value_empty"),c(i,t.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var g=0;g<i.length-1;g++)s[g+1]==s[g]&&-1===t.inArray(s[g],a)&&a.push(s[g]);r+=M("err_value_dup")+a.join(",")}return{valid:o,message:r}},z=function(t,e){var n=Object.keys(t).sort(),i=Object.keys(e).sort();return JSON.stringify(n)===JSON.stringify(i)};return{init:async function(e,i){s=e,await async function(t){for(var e in c("init_",l),t&&(t.DEBUG&&c("GM_setting - DEBUG",p=!0),t.CONSOLE_MSG&&(c=t.CONSOLE_MSG),t.SETTINGS&&(l=t.SETTINGS),t.MULTILANG&&(f=!0,t.LANG_DEFAULT&&(v=t.LANG_DEFAULT))),l)r[e]=l[e].value;if(r.Lang="",await x(),!z(r,_)){for(e in r)void 0===_[e]&&(_[e]=r[e]);for(e in _)void 0===r[e]&&delete _[e];await m()}}(i),await async function(){"function"==typeof GM.addValueChangeListener&&(c("설정에 대한 addValueChangeListener 바인드"),GM.addValueChangeListener(s,async function(e,n,i,a){a&&(c("다른 창에서 설정 변경됨. val_name, old_value, new_value:",e,n,i),await x(),t.each(n,function(t,e){void 0!==l[t]&&void 0!==l[t].change&&n[t]!==i[t]&&l[t].change(_[t])}),o=[])})),t(n).on("input","input[gm_setting_key='under_dev']",function(){c("실험실 기능 온오프 이벤트"),t(this).is(":checked")?t(".GM_setting_under_dev").css("opacity",0).slideDown("fast").animate({opacity:1},{queue:!1,duration:"fast"}):t(".GM_setting_under_dev").css("opacity",1).slideUp("fast").animate({opacity:0},{queue:!1,duration:"fast"})})}(),GM.addStyle('\n#GM_setting .btn {font-size:12px;}\n.GM_setting_autosaved.btn {\nmax-width:100%;\nfont-size:12px;\nwhite-space:pre-wrap;\nuser-select:text;\n}\n#GM_setting .btn-xxs {\ncursor: pointer;\npadding: 4px 4px;\n}\n#GM_setting label.btn-xxs {\nbox-sizing: content-box;\nwidth:11px;\nheight:11px;\n}\n#GM_setting a{\ncolor: #428bca;\ntext-decoration: none;\n}\n#GM_setting a:hover, #GM_setting a:focus {\ncolor: #2a6496;\ntext-decoration: underline;\n}\n#GM_setting {clear:both;margin-left:auto; margin-right:auto; padding:0;font-size:13px;max-width:1400px; min-width:750px; box-sizing:content-box;}\n#GM_setting_head{margin-left:auto; margin-right:auto; padding:20px 0px 10px 10px;font-size:18px;font-weight:800;max-width:1400px; min-width:750px; box-sizing:content-box;}\n#GM_setting li {list-style:none;margin:0px;padding:8px;border-top:1px solid #eee;}\n\n#GM_setting .GM_setting_depth1.GM_setting_category:first-child {margin-top:0px;}\n#GM_setting .GM_setting_depth1.GM_setting_category {border-top: 2px solid #999;margin-top:40px;padding-top:10px;}\n#GM_setting .GM_setting_depth2.GM_setting_category {border-top: 1px solid #ccc;margin-top:30px;padding-top:10px;}\n#GM_setting li[GM_setting_key=\'version_check\'] {margin-top:0px !important}\n\n#GM_setting .GM_setting_category_name{display:table-cell;width:110px;padding:0 0 0 0px;font-weight:700;vertical-align:top;}\n#GM_setting .GM_setting_category_blank{display:table-cell;width:110px;padding:0 0 0 0px;vertical-align:top;}\n\n#GM_setting .GM_setting_list_head{display:table-cell;box-sizing:content-box;vertical-align:top;}\n#GM_setting .GM_setting_depth1 .GM_setting_list_head {padding-left:0px;width:300px;}\n#GM_setting .GM_setting_depth2 .GM_setting_list_head {padding-left:30px;width:270px;}\n#GM_setting .GM_setting_depth3 .GM_setting_list_head {padding-left:60px;width:240px;}\n#GM_setting .GM_setting_depth4 .GM_setting_list_head {padding-left:90px;width:210px;}\n#GM_setting .GM_setting_depth5 .GM_setting_list_head {padding-left:120px;width:180px;}\n\n#GM_setting .GM_setting_title{display:block;font-weight:700;}\n#GM_setting .GM_setting_desc{display:block;font-size:11px;}\n\n#GM_setting .GM_setting_input_container {display:table-cell;padding:0 0 0 30px;vertical-align:top;}\n#GM_setting .GM_setting_input_container span{vertical-align:top;}\n#GM_setting .GM_setting_input_container span.btn{margin:0 0 0 10px;}\n#GM_setting input{display:inline}\n#GM_setting input[type="text"]{ width: 100px; height: 30px; padding: 5px 5px; font-size:12px; }\n#GM_setting textarea{ width: 250px; height: 30px; padding: 5px 5px; font-size:12px; }\n#GM_setting input[type="checkbox"] { display:none; width: 20px;height:20px; padding: 0; margin:0; }\n#GM_setting input[type="radio"] {width: 20px;height:20px; padding: 0; margin:0; }\n\n#GM_setting .radio-inline{ padding-left:0; padding-right:10px; }\n#GM_setting .radio-inline input{ margin:0 5px 0 0; }\n\n#GM_setting .GM_setting_item_disable, #GM_setting .GM_setting_item_disable .GM_setting_title, #GM_setting .GM_setting_item_disable .GM_setting_desc{color:#ccc !important}\n#GM_setting .invalid input, #GM_setting .invalid textarea{border-color:#dc3545;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#dc3545;}\n#GM_setting .invalid input:focus, #GM_setting .invalid textarea:focus{border-color:#dc3545;box-shadow:0 0 0 0.2rem rgba(220,53,69,.25);outline:0;color:#dc3545;}\n#GM_setting .invalid {color:#dc3545}\n#GM_setting .invalid_text {font-size:12px;padding:5px 0 0 5px;}\n\n#GM_setting .GM_setting_under_dev .GM_setting_title{color:#6441a5;font-style:italic}\n\n#GM_setting .btn-xxs {cursor:pointer;padding:4px 4px;} /*padding: 1px 2px;font-size: 9px;line-height: 1.0;border-radius: 3px;margin:0 2px 2px 0;*/\n#GM_setting .btn-xxs .glyphicon{}\n#GM_setting .btn-xxs span.glyphicon {font-size:11px; opacity: 0.1;}\n#GM_setting .btn-xxs.active span.glyphicon {opacity: 0.9;}\n#GM_setting .btn-xxs.disable {opacity: 0.3;cursor:not-allowed;}\n\n#GM_setting_footer { padding: 30px 0 30px 0; margin: 30px 0 0 0; border-top: 1px solid #ccc; text-align: center; font-size:13px; letter-spacing:0.2px; }\n#GM_setting_footer .footer_divider { margin: 0 5px; display: inline-block; width: 1px; height: 13px; background-color: #ebebeb; }\n')},load:async function(){c("GM_setting - load"),await x()},save:async function(){c("GM_setting - save"),await m()},save_overwrite:async function(){var n=_,i=e[s];ADD_DEBUG("_settings",l),t.each(n,function(t,e){void 0!==l[t]&&void 0!==l[t].change&&n[t]!==i[t]&&l[t].change(i[t])}),_=e[s],c("GM_setting - save_overwrite"),await m()},reset:async function(){await GM.setValue(s,r),await x()},createlayout:function(t){a=t,b(t)},getType:function(t){return void 0!==l[t]?l[t].type:void 0},message:function(t,e){w(t,e)}}}(jQuery,window,document);

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
        videoWidth : {
            category:"general",
            depth:2,
            type: "text",
            value: 100,
            valid:"number",
            min_value:1,
            max_value:100,
            title:"비디오 가로 사이즈(%)", desc:"클립 가로 사이즈를 결정합니다.<br />(Default: 100, Range: 1~100)" },
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
            title:"페이지 로딩 시점에 변환할 개수 제한", desc:"페이지 로딩 시점에 비디오로 변환할 링크의 최대 개수를 설정합니다. 최대 개수를 초과한 클립부터는 링크를 클릭하는 경우에만 비디오로 변환됩니다. 이 개수를 크게 설정하면 클립이 많은 글에서 브라우저가 한참동안 멈출 수 있습니다.<br />(Default: 5, Range: 1~1000)" },
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
            title: "클립 로드 시 클립 자동 재생",
            desc: "클릭과 동시에 클립을 자동 재생합니다."
        },
        clickRequiredMuted: {
            category: "type",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: false,
            title: "클립 로드 시 클립 음소거",
            desc: "클립 재생 시 음소거 상태로 시작합니다."
        },
        autoPauseOtherClips: {
            category:"etc",
            category_name: "고급",
            depth: 2,
            type: "checkbox",
            value: true,
            title:"클립 재생 시 다른 클립 일시정지",
            desc:"Twitch Clip 재생 시, 자동으로 다른 모든 클립을 일시정지 합니다. 다음 클립을 재생하기 위하여 이전 클립을 정지할 필요가 없습니다. (엄청 편하다!)"
        },
        autoPlayNextClip: {
            category:"etc",
            depth: 2,
            type: "checkbox",
            value: true,
            title:"다음 클립을 자동으로 이어서 재생",
            desc:"본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생합니다. (편하다!)"
        },
        removeOriginalLinks: {
            category:"etc",
            depth: 2,
            type: "checkbox",
            value: true,
            title:"원본 링크 삭제",
            desc:"클립 링크를 비디오로 변환 시, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다."
        },
        fixFullScreenScrollChange: {
            category:"etc",
            depth: 2,
            type: "checkbox",
            value: true,
            title:"전체화면 스크롤 동작 개선",
            desc:"네이버 카페에 삽입된 비디오를 전체화면 한 후 해제했을 때, 스크롤이 다른 위치로 변경되는 문제를 개선시킵니다. 만약 전체화면 후 스크롤과 관련된 다른 문제가 발생한다면 이 기능을 끄십시오."
        }
    };
    window.GM_setting = GM_setting;
    //await GM_setting.init("GM_SETTINGS", _settings);
    await GM_setting.init("GM_SETTINGS", {"DEBUG":DEBUG, "SETTINGS":_settings, "CONSOLE_MSG":NOMO_DEBUG, "MULTILANG":false});
    if(typeof GM.registerMenuCommand === "function"){
        GM.registerMenuCommand("상세 설정 열기", function(){
            var ww = $(window).width(),
                wh = $(window).height();
            var wn = (ww > 850 ? 850 : ww/5*4);
            var left  = (ww/2)-(wn/2),
                top = (wh/2)-(wh/5*4/2);
            window.open("https://cafe.naver.com/NaverCafeTwitchClipLoaderSettings/","winname",
                "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width="+wn+",height="+wh/5*4+",top="+top+",left="+left);
        });
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
    else if(/(^https:\/\/clips\.twitch\.tv\/)/.test(document.location.href) && GM_SETTINGS.use && (GM_SETTINGS.autoPauseOtherClips || GM_SETTINGS.autoPlayNextClip)){
        var video = undefined;
        var match = document.location.href.match(/^https?:\/\/clips\.twitch\.tv\/embed\?clip=([a-zA-Z0-9-_]+)/);
        var clipId = "";
        if(match !== null && match.length > 1){
            clipId = match[1];
            NOMO_DEBUG("clipId = ", clipId);
        }

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

        $(document).arrive("video", { onlyOnce: true, existing: true }, function (elem) {
            //if(elem === undefined || !elem.src) return;

            video = elem;
            NOMO_DEBUG("video", video);
            video.addEventListener('play', (e) => {
                NOMO_DEBUG('play()', e);
                window.parent.postMessage({"type":"NCTCL", "event":"play", "clipId":clipId}, "https://cafe.naver.com");
            });
            video.addEventListener('pause', (e) => {
                NOMO_DEBUG('pause()', e);
                window.parent.postMessage({"type":"NCTCL", "event":"pause", "clipId":clipId}, "https://cafe.naver.com");
            })
            video.addEventListener('ended', (e) => {
                NOMO_DEBUG('ended', e);
                window.parent.postMessage({"type":"NCTCL", "event":"ended", "clipId":clipId}, "https://cafe.naver.com");
            });
        });
        return;
    }

    window.addEventListener("message", function(e){
        if(!GM_SETTINGS.autoPauseOtherClips && !GM_SETTINGS.autoPlayNextClip) return;
        if(e.origin === "https://clips.twitch.tv" && e.data.type === "NCTCL"){
            NOMO_DEBUG("message from clips.twitch.tv", e.data);
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
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////
    // Main
    ////////////////////////////////////////////////////////////////////////////////////
    // 콘텐츠 width 계산
    var contentWidth = 800;
    var videoWidth, videoHeight, videoWidthStr, videoHeightStr;
    var reCalculateIframeWidth = function(width){
        videoWidth = Number(GM_SETTINGS.videoWidth)/100.0 * contentWidth;
        videoHeight = Number(videoWidth)/16*9;// + 30
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
    }
    .NCTCL-iframe-container .se-link:hover{
        text-decoration: none;
    }
    .NCTCL-iframe-container .NCTCL-titleText {
    }
    .NCTCL-iframe-container .NCTCL-clipurlText {
        text-decoration: underline;
    }
    `);

    // Twitch clip 링크를 iframe 으로 변환
    var changeToTwitchCilpIframe = function($elem, clipId, autoPlay, muted){
        try{
            var $parentContainer = $elem.closest("div.se-component-content");
            var $article_container = $elem.closest("div.article_container");
            if($article_container.length !== 0) reCalculateIframeWidth($article_container.width());
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
                <iframe class="NCTCL-iframe" data-clip-id="${clipId}" src="https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}" frameborder="0" allowfullscreen="true" scrolling="no" height="${videoHeightStr}" width="${videoWidthStr}"></iframe>
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

})();
