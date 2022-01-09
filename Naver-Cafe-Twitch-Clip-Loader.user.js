// ==UserScript==
// @name        Naver-Cafe-Twitch-Clip-Loader
// @namespace   Naver-Cafe-Twitch-Clip-Loader
// @version     0.0.1
// @description Userscript that makes it easy to watch Twitch clips on Naver Cafe
// @author      Nomo
// @include     https://cafe.naver.com/*
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
        * Version: Jan. 9, 2022
        * MIT licensed
        * https://github.com/nomomo/
        * nomotg@gmail.com
        * Copyright (c) 2017-2021 NOMO
        */
        var GM_setting=function(t,e,n){var i;NOMO_DEBUG("GM_setting 시작");var a="",s=[],o={},d={},l={},r={},p=async function(){for(var t in NOMO_DEBUG("init_",d),d)o[t]=d[t].value;if(await c(),!y(o,l)){for(t in o)void 0===l[t]&&(l[t]=o[t]);for(t in l)void 0===o[t]&&delete l[t];await _()}},_=async function(){""!==a&&await GM.setValue(a,l),e[a]=l,t.each(s,function(t,e){void 0!==d[e].change&&d[e].change(l[e])}),s=[]},c=async function(){NOMO_DEBUG("load_"),""!==a&&(l=await GM.getValue(a,l)),e[a]=l},g=async function(){"function"==typeof GM.addValueChangeListener&&(NOMO_DEBUG("설정에 대한 addValueChangeListener 바인드"),GM.addValueChangeListener(a,async function(e,n,i,a){a&&(NOMO_DEBUG("다른 창에서 설정 변경됨. val_name, old_value, new_value:",e,n,i),await c(),t.each(n,function(t,e){void 0!==d[t].change&&n[t]!==i[t]&&d[t].change(l[t])}),s=[])})),t(n).on("input","input[gm_setting_key='under_dev']",function(){NOMO_DEBUG("실험실 기능 온오프 이벤트"),t(this).is(":checked")?t(".GM_setting_under_dev").css("opacity",0).slideDown("fast").animate({opacity:1},{queue:!1,duration:"fast"}):t(".GM_setting_under_dev").css("opacity",1).slideUp("fast").animate({opacity:0},{queue:!1,duration:"fast"})})},u=function(e,n){if(void 0!==n){var i="GM_setting_autosaved";n.find("."+i).animate({bottom:"+=40px"},{duration:300,queue:!1}),t("<div style='animation: glow .5s 10 alternate; position:fixed; left:10px; bottom:20px; z-index:10000000;' class='"+i+" btn btn-success'>"+e+"</div>").appendTo(n).fadeIn("fast").animate({opacity:1},6e3,function(){t(this).fadeOut("fast").delay(600).remove()}).animate({left:"+=30px"},{duration:300,queue:!1})}},f=async function(){for(var e in NOMO_DEBUG("read_"),r){var n=r[e],i=G(n);"tag"===d[e].type&&(1===(i=i.split(",")).length&&""===i[0]&&(i=[]),t.each(i,function(t,e){i[t]=e.replace(/^\s*|\s*$/g,"")})),l[e]!==i&&-1===s.indexOf(e)&&s.push(e),l[e]=i}},v=async function(){for(var t in NOMO_DEBUG("write_"),r){var e=r[t];M(e,l[t])}},G=function(t){var e;switch(t.attr("GM_setting_type")){case"checkbox":e=t.prop("checked");break;case"set":case"text":case"tag":case"textarea":e=t.val();break;case"radio":e=t.find("input:checked").val();break;default:e=void 0}return e},M=function(t,e){switch(t.attr("GM_setting_type")){case"checkbox":t.prop("checked",e).trigger("change");break;case"set":case"text":t.val(e);break;case"tag":case"textarea":t.val(e),t.height("auto"),t.height(t.prop("scrollHeight")+"px");break;case"radio":t.find("input[value="+e+"]").prop("checked",!0)}},h=async function(e){var n=e.find("li");n.removeClass("GM_setting_item_disable"),n.find("input, textarea").prop("disabled",!1),n.find("input[type='checkbox']").trigger("change");for(var i,a,s=[!0,!0],o=0;o<n.length;o++){var l=t(n[o]),r=l.attr("GM_setting_depth"),p=l.attr("GM_setting_key"),_=l.attr("GM_setting_radio_enable_value");if(0==o);else{var c=(i=t(n[o-1])).attr("GM_setting_depth");if(c==r&&c>0)void 0!==a&&(s[c-1]=a==_);else if(c<r){a=void 0;var g=i.find("input[type='checkbox']"),u=i.find("input[type='radio']");0!==g.length&&g.is(":checked")?s[c]=!0:0!==u.length?(a=i.find("input[type='radio']:checked").val(),i.find("input[type='radio']:checked").val()==_?s[c]=!0:s[c]=!1):s[c]=!1}}for(var f=0;f<r;f++)if(d[p].disable||!s[f]){l.addClass("GM_setting_item_disable"),l.find("input, textarea").prop("disabled",!0),l.find("input[type='checkbox']").trigger("change");break}}},x=function(e,n){var i,a,s,o=!0,l="";if("number"===d[e].valid)o=t.isNumeric(n),""===n?l+="반드시 값이 입력되어야 합니다.":o?void 0!==d[e].min_value&&d[e].min_value>n?(o=!1,l+="입력 값은 "+d[e].min_value+"이상의 숫자이어야 합니다."):void 0!==d[e].max_value&&d[e].max_value<n&&(o=!1,l+="입력 값은 "+d[e].max_value+"이하의 숫자이어야 합니다."):l+="숫자만 입력 가능합니다.";else if(""!==n&&"array_string"===d[e].valid){i=t.map(n.split(","),t.trim);var r=n.match(/^[A-Za-z0-9 _,]*$/);if(null===r||0===r.length)o=!1,l+="영문, 숫자, 콤마(,), 언더바(_) 만 입력 가능합니다.";else if(-1!==t.inArray("",i))o=!1,l+="공백 값 등 값이 존재하지 않는 항목이 존재합니다.",NOMO_DEBUG(i,t.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var p=0;p<i.length-1;p++)s[p+1]==s[p]&&-1===t.inArray(s[p],a)&&a.push(s[p]);l+="중복된 값이 존재합니다: "+a.join(",")}else for(var _=0;_<i.length;_++)if(-1!==i[_].indexOf(" ")){o=!1,l+="문자열 내 공백이 존재하는 항목이 있습니다: "+i[_];break}}else if(""!==n&&"array_word"===d[e].valid)if(i=t.map(n.split(","),t.trim),-1!==t.inArray("",i))o=!1,l+="공백 값 등 값이 존재하지 않는 항목이 존재합니다.",NOMO_DEBUG(i,t.inArray("",i));else if(new Set(i).size!==i.length){o=!1,a=[],s=i.sort();for(var c=0;c<i.length-1;c++)s[c+1]==s[c]&&-1===t.inArray(s[c],a)&&a.push(s[c]);l+="중복된 값이 존재합니다: "+a.join(",")}return{valid:o,message:l}},y=function(t,e){var n=Object.keys(t).sort(),i=Object.keys(e).sort();return JSON.stringify(n)===JSON.stringify(i)};return{init:async function(t,e){a=t,d=JSON.parse(JSON.stringify(e)),NOMO_DEBUG("GM_setting - init",d),await p(),await g(),GM.addStyle('\n    #GM_setting .btn {font-size:12px;}\n    .GM_setting_autosaved.btn {\n        max-width:100%;\n        font-size:12px;\n        white-space:pre-wrap;\n        user-select:text;\n    }\n    #GM_setting .btn-xxs {\n        cursor: pointer;\n        padding: 4px 4px;\n    }\n    #GM_setting label.btn-xxs {\n        box-sizing: content-box;\n        width:11px;\n        height:11px;\n    }\n    #GM_setting a{\n        color: #428bca;\n        text-decoration: none;\n    }\n    #GM_setting a:hover, #GM_setting a:focus {\n        color: #2a6496;\n        text-decoration: underline;\n    }\n    #GM_setting {clear:both;margin-left:auto; margin-right:auto; padding:0;font-size:13px;max-width:1400px; min-width:750px; box-sizing:content-box;}\n    #GM_setting_head{margin-left:auto; margin-right:auto; padding:20px 0px 10px 10px;font-size:18px;font-weight:800;max-width:1400px; min-width:750px; box-sizing:content-box;}\n    #GM_setting li {list-style:none;margin:0px;padding:8px;border-top:1px solid #eee;}\n    \n    #GM_setting .GM_setting_depth1.GM_setting_category {border-top: 2px solid #999;margin-top:20px;padding-top:10px;}\n    #GM_setting li[GM_setting_key=\'version_check\'] {margin-top:0px !important}\n    \n    #GM_setting .GM_setting_category_name{display:table-cell;width:110px;padding:0 0 0 0px;font-weight:700;vertical-align:top;}\n    #GM_setting .GM_setting_category_blank{display:table-cell;width:110px;padding:0 0 0 0px;vertical-align:top;}\n    \n    #GM_setting .GM_setting_list_head{display:table-cell;box-sizing:content-box;vertical-align:top;}\n    #GM_setting .GM_setting_depth1 .GM_setting_list_head {padding-left:0px;width:300px;}\n    #GM_setting .GM_setting_depth2 .GM_setting_list_head {padding-left:30px;width:270px;}\n    #GM_setting .GM_setting_depth3 .GM_setting_list_head {padding-left:60px;width:240px;}\n    #GM_setting .GM_setting_depth4 .GM_setting_list_head {padding-left:90px;width:210px;}\n    #GM_setting .GM_setting_depth5 .GM_setting_list_head {padding-left:120px;width:180px;}\n    \n    #GM_setting .GM_setting_title{display:block;font-weight:700;}\n    #GM_setting .GM_setting_desc{display:block;font-size:11px;}\n    \n    #GM_setting .GM_setting_input_container {display:table-cell;padding:0 0 0 30px;vertical-align:top;}\n    #GM_setting .GM_setting_input_container span{vertical-align:top;}\n    #GM_setting .GM_setting_input_container span.btn{margin:0 0 0 10px;}\n    #GM_setting input{display:inline}\n    #GM_setting input[type="text"]{ width: 100px; height: 30px; padding: 5px 5px; font-size:12px; }\n    #GM_setting textarea{ width: 250px; height: 30px; padding: 5px 5px; font-size:12px; }\n    #GM_setting input[type="checkbox"] { display:none; width: 20px;height:20px; padding: 0; margin:0; }\n    #GM_setting input[type="radio"] {width: 20px;height:20px; padding: 0; margin:0; }\n    \n    #GM_setting .radio-inline{ padding-left:0; padding-right:10px; }\n    #GM_setting .radio-inline input{ margin:0 5px 0 0; }\n    \n    #GM_setting .GM_setting_item_disable, #GM_setting .GM_setting_item_disable .GM_setting_title, #GM_setting .GM_setting_item_disable .GM_setting_desc{color:#ccc !important}\n    #GM_setting .invalid input, #GM_setting .invalid textarea{border-color:#dc3545;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#dc3545;}\n    #GM_setting .invalid input:focus, #GM_setting .invalid textarea:focus{border-color:#dc3545;box-shadow:0 0 0 0.2rem rgba(220,53,69,.25);outline:0;color:#dc3545;}\n    #GM_setting .invalid {color:#dc3545}\n    #GM_setting .invalid_text {font-size:12px;padding:5px 0 0 5px;}\n    \n    #GM_setting .GM_setting_under_dev .GM_setting_title{color:#6441a5;font-style:italic}\n    \n    #GM_setting .btn-xxs {cursor:pointer;padding:4px 4px;} /*padding: 1px 2px;font-size: 9px;line-height: 1.0;border-radius: 3px;margin:0 2px 2px 0;*/\n    #GM_setting .btn-xxs .glyphicon{}\n    #GM_setting .btn-xxs span.glyphicon {font-size:11px; opacity: 0.1;}\n    #GM_setting .btn-xxs.active span.glyphicon {opacity: 0.9;}\n    #GM_setting .btn-xxs.disable {opacity: 0.3;cursor:not-allowed;}\n    ')},load:async function(){NOMO_DEBUG("GM_setting - load"),await c()},save:async function(){NOMO_DEBUG("GM_setting - save"),await _()},save_overwrite:async function(){var n=l,i=e[a];t.each(n,function(t,e){void 0!==d[t].change&&n[t]!==i[t]&&d[t].change(i[t])}),l=e[a],NOMO_DEBUG("GM_setting - save_overwrite"),await _()},reset:async function(){await GM.setValue(a,o),await c()},createlayout:function(e){!function(e){r={};var n=t(e);i=n,0!==n.find("#GM_setting_container").length&&n.empty();var a,s=t("<div id='GM_setting_container'></div>"),o=t(`\n    <div id='GM_setting_head'>\n    <div style='height:25px;display:inline-block;white-space:nowrap'>Settings</div>\n    <div style='display:flex;height:25px;float:right;'>\n        <a href='${GM.info.script.homepage}' target='_blank' style='font-size:12px;font-weight:normal;align-self:flex-end;'>${GM.info.script.name} v${GM.info.script.version} (${GM.info.script.homepage})</a>\n    </div>\n    </div>`),l=t("<ul id='GM_setting'></ul>"),p=void 0;for(var c in n.append(s),s.append(o).append(l),d){var g,M,y=d[c].category,b=d[c].depth,m=d[c].type,w=d[c].title,k=d[c].desc,O=d[c].category_name,D=d[c].radio_enable_value,z=t("<div class='GM_setting_input_container form-group'></div>"),N="tag"===m||"textarea"===m;if("radio"===m){var U=d[c].radio;for(var B in g=t("<div GM_setting_type='radio'></div>"),U){var E=t("<label class='radio-inline'>"+U[B].title+"</label>");t("<input name='GM_setting_"+c+"' class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' onfocus='this.blur()' />").attr({value:U[B].value,type:"set"===m?"text"===m:"tag"===m?"textarea":m,GM_setting_type:m,GM_setting_key:c,GM_setting_category:void 0===y?"default":y,GM_setting_radio_enable_value:void 0===D?"none":D}).prependTo(E),g.append(E)}}else g=t("<"+(N?"textarea ":"input ")+"class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' "+("checkbox"===m?"onfocus='this.blur()'":"")+(N?"></textarea>":" />")).attr({type:"set"===m?"text"===m:"tag"===m?"textarea":m,GM_setting_type:m,GM_setting_key:c,GM_setting_category:void 0===y?"default":y,GM_setting_radio_enable_value:void 0===D?"none":D});M=t(void 0!==O?"<div class='GM_setting_category_name'>"+O+"</div>":"<div class='GM_setting_category_blank'></div>");var S=t("<div class='GM_setting_list_head'></div>"),C=t("<span class='GM_setting_title'>"+w+"</span>"),T=t("<span class='GM_setting_desc'>"+k+"</span>"),A=t("<li"+(void 0!==d[c].radio_enable_value?" GM_setting_radio_enable_value='"+d[c].radio_enable_value+"'":"")+" GM_setting_key='"+c+"' GM_setting_depth='"+b+"' class='"+(d[c].under_dev?"GM_setting_under_dev ":"")+(void 0!==O&&void 0!==p&&y!==p.category?"GM_setting_category ":"")+"GM_setting_depth"+b+"'></li>");l.append(A),S.append(C).append(T),"checkbox"===m?(t('\n                    <label class="btn btn-default btn-xxs"><span class="glyphicon glyphicon-ok"></span></label>\n                    ').prepend(g).appendTo(z),g.on("change",function(){t(this).is(":checked")?t(this).closest("label").addClass("active"):t(this).closest("label").removeClass("active"),t(this).is(":disabled")?t(this).closest("label").addClass("disable").prop("disabled",!0):t(this).closest("label").removeClass("disable").prop("disabled",!1)})):z.append(g),A.append(M).append(S).append(z),r[c]=g,void 0!==d[c].append&&z.append(d[c].append),p=d[c]}n.find("input[type='checkbox']").on("click",function(){h(n)}),n.find("input[type='radio']").on("click",function(){h(n)}),n.find("input, textarea").on("input",function(){NOMO_DEBUG("GM_setting - text change");var e=t(this),i=G(e),s=e.attr("GM_setting_key"),o=x(s,i);e.closest("div").find(".invalid_text").remove(),o.valid?e.closest("div").removeClass("invalid"):(NOMO_DEBUG("validation",o),e.closest("div").addClass("invalid"),e.after("<div class='invalid_text'>"+o.message+"</div>")),clearTimeout(a),a=setTimeout(function(){var e=!0;t.each(r,function(t,n){if(!x(t,G(n)).valid)return e=!1,!1}),e&&(f(),_(),u("Auto Saved! "+(new Date).toLocaleTimeString(),n))},1e3)}),v(),h(n),l.append('<li class="GM_setting_category GM_setting_depth1">\n                <div class="GM_setting_category_name">Reset</div>\n                <div class="GM_setting_list_head">\n                    <span class="GM_setting_title">\n                        <span class="GM_setting_reset btn btn-primary" style="margin-left:0;">Reset Settings</span>\n                        \x3c!--<span class="GM_setting_reset_all btn btn-primary">전체 초기화(새로고침 필요)</span>--\x3e\n                    </span>\n                    <span class="GM_setting_desc"></span>\n                </div>\n                <div class="GM_setting_input_container form-group">\n                </div>\n            </li>'),l.find(".GM_setting_reset").on("click",async function(){confirm("Do you really want to reset the settings?")&&(await GM_setting.reset(),GM_setting.createlayout(i),u("Reset settings complete! "+(new Date).toLocaleTimeString(),i))}),l.find(".GM_setting_reset_all").on("click",async function(){if(confirm("Do you really want to reset the script?")){for(var t=await GM.listValues(),e=0;e<t.length;e++){var n=t[e];await GM.deleteValue(n)}await GM_setting.reset(),GM_setting.createlayout(i),u("Reset script complete! "+(new Date).toLocaleTimeString(),i)}})}(e)},getType:function(t){return void 0!==d[t]?d[t].type:void 0},message:function(t,e){u(t,e)}}}(jQuery,window,document);

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
            category:"general",
            depth: 2,
            type: "radio",
            value: "autoLoad",
            title:"클립 링크 변환 시점 선택",
            desc:"클립 링크를 비디오로 변환하는 시점을 선택", radio: {autoLoad: {title: "페이지 로딩 시", value:"autoLoad"}, clickRequired: {title: "링크 클릭 시", value:"clickRequired"}}
        },
        autoPlayFirstClip: {
            category: "general",
            category_name: "페이지 로딩 시",
            depth: 3,
            radio_enable_value: "autoLoad",
            type: "checkbox",
            value: false,
            title: "첫 번째 클립을 자동 재생",
            desc: "페이지 로딩과 동시에 첫 번째 클립을 자동 재생합니다."
        },
        autoPlayFirstClipMuted: {
            category: "general",
            depth: 3,
            radio_enable_value: "autoLoad",
            type: "checkbox",
            value: true,
            title: "클립 자동 재생 시 클립 음소거",
            desc: "클립 자동 재생 시 음소거 상태로 시작합니다."
        },
        clickRequiredAutoPlay: {
            category: "general",
            category_name: "링크 클릭 시",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: true,
            title: "클립 로드 시 클립 자동 재생",
            desc: "클릭과 동시에 클립을 자동 재생합니다."
        },
        clickRequiredMuted: {
            category: "general",
            depth: 3,
            radio_enable_value: "clickRequired",
            type: "checkbox",
            value: false,
            title: "클립 로드 시 클립 음소거",
            desc: "클립 재생 시 음소거 상태로 시작합니다."
        },
    };
    window.GM_setting = GM_setting;
    await GM_setting.init("GM_SETTINGS", _settings);
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
    if(document.location.href.indexOf("cafe.naver.com/NaverCafeTwitchClipLoaderSettings") !== -1){
        $("body").empty().css("padding","0px 30px 30px 30px");
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
        display: inline-block; padding: 10px 15px; border: 1px solid #eee; box-sizing: border-box; text-align: right; margin-top: -1px;
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
                titleText = `<span style="font-weight:bold">${title}</span>`;
                clipurlText = ` (${clipurl})`;
            }
            $parentContainer.after(`
            <div class="NCTCL-iframe-container">
                <iframe class="NCTCL-iframe" src="https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHref}&autoplay=${autoPlay}&muted=${muted}" frameborder="0" allowfullscreen="true" scrolling="no" height="${videoHeightStr}" width="${videoWidthStr}"></iframe>
                <br />
                <a href="${clipurl}" class="se-link" target="_blank" style="width:${videoWidthStr};">
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

    // Twitch clip 링크 찾기
    $(document).arrive("div.se-module-oglink", { onlyOnce: true, existing: true }, function (elem) {
        try{
            if(!GM_SETTINGS.use) return;
            var $elem = $(elem);
            if($elem.hasClass("fired")) return;
            $elem.addClass("fired");

            var $as = $elem.find("a");
            var regex = /^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9-_]+)/;

            // 자동 변환 시
            if(GM_SETTINGS.method === "autoLoad"){
                var $a = $as.first();
                var href = $a.attr("href");
                var match = href.match(regex);

                if(match !== null && match.length > 1){
                    var clipId = match[1];
                    var isAutoPlay = false;
                    var isMuted = false;
                    if(GM_SETTINGS.autoPlayFirstClip && $(".NCTCL-iframe").length == 0){
                        isAutoPlay = true;
                        if(GM_SETTINGS.autoPlayFirstClipMuted) isMuted = true;
                    }
                    changeToTwitchCilpIframe($elem, clipId, isAutoPlay, isMuted);
                }
            }
            // 클릭 변환 시
            else{   // if(GM_SETTINGS.method === "clickRequired")
                $as.each(function(i, v){
                    var $a = $(v);
                    var href = $a.attr("href");
                    var match = href.match(regex);

                    if(match !== null && match.length > 1){
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

})();