////////////////////////////////////////////////////////////////////////////////////
// libs
////////////////////////////////////////////////////////////////////////////////////
export var DEBUG = false;
export async function DEBUG_INIT(){
    DEBUG = await GM.getValue("DEBUG", false);
    unsafeWindow.NCTCL_DEBUG_TOGGLE = function(){DEBUG=!DEBUG;GM.setValue("DEBUG", DEBUG);return `DEBUG = ${DEBUG}`;};
}

export function isDEBUG(){
    return DEBUG;
}

export function NOMO_DEBUG( /**/ ) {
    if (DEBUG) {
        var args = arguments, args_length = args.length, args_copy = args;
        for (var i = args_length; i > 0; i--) args[i] = args_copy[i - 1];
        args[0] = "[NCTCL]  ";
        args.length = args_length + 1;
        console.log.apply(console, args);
    }
}
export function NOMO_WARN( /**/ ) {
    if (DEBUG) {
        var args = arguments, args_length = args.length, args_copy = args;
        for (var i = args_length; i > 0; i--) args[i] = args_copy[i - 1];
        args[0] = "[NCTCL]  ";
        args.length = args_length + 1;
        console.warn.apply(console, args);
    }
}
export function NOMO_ERROR( /**/ ) {
    if (DEBUG) {
        var args = arguments, args_length = args.length, args_copy = args;
        for (var i = args_length; i > 0; i--) args[i] = args_copy[i - 1];
        args[0] = "[NCTCL]  ";
        args.length = args_length + 1;
        console.error.apply(console, args);
    }
}
window.NOMO_DEBUG = NOMO_DEBUG;
window.NOMO_WARN = NOMO_WARN;
window.NOMO_ERROR = NOMO_ERROR;

/* arrive.js
* v2.4.1
* https://github.com/uzairfarooq/arrive
* MIT licensed
* Copyright (c) 2014-2017 Uzair Farooq
*/
// eslint-disable-next-line
export const Arrive = function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback);}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave");}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n);},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n;};},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback);},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r);},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r;},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t;}};}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null;};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i;},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null);}},e.prototype.beforeAdding=function(e){this._beforeAdding=e;},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e;},e;}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n);});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o;}),i.beforeRemoving(function(e){e.observer.disconnect();}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n);},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1;});},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1;}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1;},i.removeEvent(t);},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1;});},this;},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t;}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t);});}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1;}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a);}c.call(this,e,t,r);},f;},u=function(){function e(){var e={childList:!0,subtree:!0};return e;}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t);});}function r(e,t){return l.matchesSelector(e,t.selector);}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r);},d;},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h;}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);

/* GM_setting.js
* Version: May. 19, 2022
* MIT licensed
* https://github.com/nomomo/
* nomotg@gmail.com
* Copyright (c) 2017-2022 NOMO
*/
// eslint-disable-next-line
export var GM_setting = (function ($, global, document) { //
    var version = "22.7.31";

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // local vars
    var latestCreatedLayout = undefined;

    var name_ = "";             // GM data 키. global[name_] 에 setting 값 저장 됨
    var changed_key = [];       // 설정 창에서 설정 읽은 후, 이전 설정과 비교하여 변경된 키 저장 (저장 전 .change 호출 용)
    
    var userSettingsInitCopy = {};
    var userSettings = {};
    var userSettingsValues = {};
    
    var $g_elem;
    var GUI = {
        "$container":undefined,
        "$GM_setting_head":undefined,
        "$GM_homepage_link":undefined,
        "$GM_multilang":undefined,
        "$ul":undefined,
        "$inputs":undefined,
        "$lis":{}
    };

    var $inputs = {};
    var DEBUG = false;
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    var CONSOLE_MSG = function(/**/){
        if(!DEBUG) return;
        var args = arguments, args_length = args.length, args_copy = args;
        for (var i=args_length;i>0;i--) args[i] = args_copy[i-1];
        args[0] = "+[GM_SETTINGS]  ";
        args.length = args_length + 1;
        console.log.apply(console, args);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // multi language
    var userLang = (navigator.language || navigator.userLanguage).toLowerCase().substring(0, 2); // ko, en, cn, tw, zh
    var userSelectedLang = userLang;
    var defaultLang = "ko";
    var useMultiLang = false;
    const multilang = {
        "en":{
            "title_settings":"Settings",
            "title_reset":"Reset",
            "donate":"Donate",
            "buymeacoffee":"Buy me a coffee",
            "buymeacoffeeDesc":"Support my projects by buying me a coffee! ☕",
            "toonation":"Toonation",
            "button_reset_settings":"Reset Settings",
            "confirm_reset_settings":"Are you sure you want to reset the settings?",
            "complete_reset_settings":"Settings reset complete!",
            "button_reset_settings_all":"Script reset (refresh is required)",
            "confirm_reset_settings_all":"Do you really want to reset script?",
            "complete_reset_settings_all":"Script initialization complete!",
            "auto_saved":"Autosaved: ",
            "err_val_req":"A value must be entered.",
            "err_num_req":"Only numbers can be entered.",
            "err_num_over":"The input value must be a number greater than or equal to : ",
            "err_num_not_more_than":"The input value must be a number less than or equal to: ",
            "err_valid_array_string":"Only English letters, numbers, commas (,) and underscores (_) can be entered.",
            "err_value_empty":"Something for which no value exists, such as an empty value.",
            "err_value_dup":"Duplicate value exists: ",
            "err_value_blank":"There is an item of a space in the string: ",
            "setting_changed_from_other_window":"설정이 다른 창에서 변경되어 다시 불러옵니다."
        },
        "ko":{
            "title_settings":"Settings",
            "title_reset":"Reset",
            "donate":"후원하기",
            "buymeacoffee":"Buy me a coffee 로 커피 한 잔 사주기",
            "buymeacoffeeDesc":"커피 한 잔☕ 으로 프로젝트를 지원해주세요~",
            "toonation":"Toonation 으로 후원하기",
            "button_reset_settings":"Reset Settings",
            "confirm_reset_settings":"진짜 설정을 초기화 할까요?",
            "complete_reset_settings":"설정 초기화 완료!",
            "button_reset_settings_all":"전체 초기화(새로고침 필요)",
            "confirm_reset_settings_all":"진짜 스크립트를 모두 초기화 할까요?",
            "complete_reset_settings_all":"스크립트 초기화 완료!",
            "auto_saved":"자동 저장 됨: ",
            "err_val_req":"반드시 값이 입력되어야 합니다.",
            "err_num_req":"숫자만 입력 가능합니다.",
            "err_num_over":"입력 값은 다음 값 이상의 숫자이어야 합니다. : ",
            "err_num_not_more_than":"입력 값은 다음 값 이하의 숫자이어야 합니다. : ",
            "err_valid_array_string":"영문, 숫자, 콤마(,), 언더바(_) 만 입력 가능합니다.",
            "err_value_empty":"공백 값 등 값이 존재하지 않는 항목이 존재합니다.",
            "err_value_dup":"중복된 값이 존재합니다: ",
            "err_value_blank":"문자열 내 공백이 존재하는 항목이 있습니다: ",
            "setting_changed_from_other_window":"설정이 다른 창에서 변경되어 다시 불러옵니다: "
        }
    };
    var getTextFromObjectbyLang = function(obj){
        var resText = "";
        if(typeof obj === "object"){
            var objkeys = Object.keys(obj);
            if(objkeys.length === 0){
                return resText;
            }
            if(obj[userSelectedLang] !== undefined){
                resText = obj[userSelectedLang];
            }
            else if(obj[defaultLang] !== undefined){
                resText = obj[userSelectedLang];
            }
            else{
                resText = obj[objkeys[0]];
            }
        }
        else{
            resText = obj;
        }
        return resText;
    };
    var getSystemTextbyLang = function(msg){
        if(multilang[userSelectedLang] !== undefined){
            return multilang[userSelectedLang][msg];
        }
        else if(multilang[defaultLang] !== undefined){
            return multilang[defaultLang][msg];
        }
        else{
            return "";
        }
    };
    var changeLang = function(){
        if(latestCreatedLayout == undefined){
            CONSOLE_MSG("NO CREATED LAYOUT");
            return;
        }
        var $latestCreatedLayout = $(latestCreatedLayout);
        $latestCreatedLayout.empty();
        createlayout_(latestCreatedLayout);
    };


    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // private functions
    /////////////////////////////////////////////////////////////////////////////////////////////////
    var init_ = async function (usInput) {
        CONSOLE_MSG("init_", userSettings);
        if(usInput){
            if(usInput.DEBUG){
                DEBUG = true;
                CONSOLE_MSG("GM_setting - DEBUG", DEBUG);
            }
            if(usInput.CONSOLE_MSG){
                CONSOLE_MSG = usInput.CONSOLE_MSG;
            }
            if(usInput.SETTINGS){
                userSettings = usInput.SETTINGS;
            }
            if(usInput.MULTILANG){
                useMultiLang = true;
                if(usInput.LANG_DEFAULT){
                    defaultLang = usInput.LANG_DEFAULT;
                }
            }
        }
        else{
            // error
        }
        for (var key in userSettings) {
            userSettingsInitCopy[key] = userSettings[key].value;
        }
        userSettingsInitCopy["Lang"] = "";

        await load_();
        if (!hasSameKey_(userSettingsInitCopy, userSettingsValues)) {
            // 추가
            for (key in userSettingsInitCopy) {
                if (userSettingsValues[key] === undefined) {
                    userSettingsValues[key] = userSettingsInitCopy[key];
                }
            }
            // 삭제
            for (key in userSettingsValues) {
                if (userSettingsInitCopy[key] === undefined) {
                    delete userSettingsValues[key];
                }
            }
            await save_();
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var save_ = async function () {
        CONSOLE_MSG("save_");
        if (name_ !== "") {
            await GM.setValue(name_, userSettingsValues);
        }
        global[name_] = userSettingsValues;

        // changed_key: 배열,       인덱스번호, 값(키)
        $.each(changed_key, function (eindex, evalue) {
            if (userSettings[evalue] !== undefined && userSettings[evalue].change !== undefined) {
                userSettings[evalue].change(userSettingsValues[evalue]);
            }
        });
        changed_key = [];
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var load_ = async function () {
        CONSOLE_MSG("load_");
        if (name_ !== "") {
            userSettingsValues = await GM.getValue(name_, userSettingsValues);
        }
        userSettingsValues["Lang"] = await loadLang_();
        global[name_] = userSettingsValues;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var loadLang_ = async function() {
        userSelectedLang = await GM.getValue("GM_SETTING_LANG", userLang);
        CONSOLE_MSG("loadLang_", userSelectedLang);
        return userSelectedLang;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var saveLang_ = async function(lang) {
        if(lang == undefined){
            await GM.setValue("GM_SETTING_LANG", userSelectedLang);
            CONSOLE_MSG("saveLang_", userSelectedLang);
        }
        else{
            await GM.setValue("GM_SETTING_LANG", lang);
            CONSOLE_MSG("saveLang_", lang);
        }
    };

    var reCreateTable_ = function($tbody, key, val) {
        $tbody.empty();
        $tbody.empty();
        for(var i=0;i<val.length;i++){
            var $tr = $(`<tr></tr>`);
            for(var j=0;j<val[i].length;j++){
                if(j==0){
                    $tr.append(`<td>${i+1}</td>`);
                }
                $tr.append(`<td>${val[i][j]}</td>`);
            }
            $tr.append(`<td class="table_btn_container"><span title="Modify" alt="Modify" class="glyphicon glyphicon-pencil cp table_modify" GM_setting_key="${key}"></span><span title="Save" alt="Save" style="display:none;" class="glyphicon glyphicon-floppy-disk cp table_save" GM_setting_key="${key}"></span></td>`);
            $tr.append(`<td class="table_btn_container"><span title="Delete" alt="Delete" class="glyphicon glyphicon-trash cp table_delete" GM_setting_key="${key}"></span><span title="Cancel" alt="Cancel" style="display:none;" class="glyphicon glyphicon-remove cp table_cancel" GM_setting_key="${key}"></span></td>`);
            $tbody.append($tr);
        }
        var $tr_new = $(`<tr></tr>`);
        for(var k=0;k<userSettings[key].head.length;k++){   // index
            if(k==0){
                $tr_new.append(`<td></td>`);
            }
            $tr_new.append(`<td></td>`);
        }
        $tr_new.append(`<td class="table_btn_container"><span title="New" alt="New" class="glyphicon glyphicon-plus cp table_new" GM_setting_key="${key}"></span><span title="Save" alt="Save" style="display:none;" class="glyphicon glyphicon-floppy-disk cp table_new_save" GM_setting_key="${key}"></span></td>`);
        $tr_new.append(`<td class="table_btn_container"><span title="Cancel" alt="Cancel" style="display:none;" class="glyphicon glyphicon-remove cp table_new_cancel" GM_setting_key="${key}"></span></td>`);
        $tbody.append($tr_new);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var event_ = async function () {
        if (typeof GM.addValueChangeListener === "function") {
            CONSOLE_MSG("설정에 대한 addValueChangeListener 바인드");
            GM.addValueChangeListener(name_, async function (val_name, old_value, new_value, remote) {
                if (remote) {
                    CONSOLE_MSG("다른 창에서 설정 변경됨. val_name, old_value, new_value:", val_name, old_value, new_value);
                    await load_();
                    // old_value: obj,       ekey:키, evalue:값(old 설정값)
                    $.each(old_value, function (ekey, _evalue) {
                        if (userSettings[ekey] !== undefined && userSettings[ekey].change !== undefined && old_value[ekey] !== new_value[ekey]) {
                            userSettings[ekey].change(userSettingsValues[ekey]);
                        }
                    });
                    changed_key = [];
                    // 설정 변경 시 바뀌는 이벤트들

                    if(latestCreatedLayout !== undefined){
                        createlayout_(latestCreatedLayout);
                        message_(getSystemTextbyLang("setting_changed_from_other_window") + (new Date()).toLocaleTimeString(), $g_elem);
                    }
                }
            });
        }

        $(document).on("input", "input[gm_setting_key='under_dev']", function () {
            CONSOLE_MSG("실험실 기능 온오프 이벤트");
            var $this = $(this);
            if ($this.is(":checked")) {
                $(".GM_setting_under_dev").css("opacity", 0).slideDown("fast").animate({
                    opacity: 1
                }, {
                    queue: false,
                    duration: "fast"
                });
            } else {
                $(".GM_setting_under_dev").css("opacity", 1).slideUp("fast").animate({
                    opacity: 0.0
                }, {
                    queue: false,
                    duration: "fast"
                });
            }
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var addStyle_ = function () {
        GM.addStyle( /*css*/ `
#GM_setting .btn {font-size:12px;}
.GM_setting_autosaved.btn {
    max-width:100%;
    font-size:12px;
    white-space:pre-wrap;
    user-select:text;
}
#GM_setting .btn-xxs {
    cursor: pointer;
    padding: 4px 4px;
}
#GM_setting label.btn-xxs {
    box-sizing: content-box;
    width:11px;
    height:11px;
}
#GM_setting a{
    color: #428bca;
    text-decoration: none;
}
#GM_setting a:hover, #GM_setting a:focus {
    color: #2a6496;
    text-decoration: underline;
}
#GM_setting {clear:both;margin-left:auto; margin-right:auto; padding:0;max-width:1400px; min-width:750px; box-sizing:content-box;}
#GM_setting, #GM_setting table {font-size:13px;}

#GM_setting .GM_setting_logo{font-family:auto;height:25px;display:inline-block;white-space:nowrap}
#GM_setting .GM_setting_menu_right{display:flex;height:25px;float:right;}
#GM_setting .GM_homepage_link{font-size:12px;font-weight:normal;align-self:flex-end;}
#GM_setting .GM_multilang{margin-left:15px;}

#GM_setting_head{margin-left:auto; margin-right:auto; padding:20px 0px 10px 10px;font-size:18px;font-weight:800;max-width:1400px; min-width:750px; box-sizing:content-box;}
#GM_setting ul {padding:0;}
#GM_setting li {display:flex;list-style:none;margin:0px;padding:10px;border-top:1px solid #eee;}

#GM_setting .GM_setting_depth1.GM_setting_category:first-child {margin-top:0px}
#GM_setting .GM_setting_depth1.GM_setting_category {border-top: 2px solid #999;margin-top:30px;padding-top:10px;}
#GM_setting li[GM_setting_key='version_check'] {margin-top:0px !important}

#GM_setting .GM_setting_category_name{display:block;box-sizing:border-box;padding:0 0 0 0px;font-weight:700;vertical-align:top;flex:0 0 100px;}
#GM_setting .GM_setting_category_blank{display:block;box-sizing:border-box;padding:0 0 0 0px;vertical-align:top;flex:0 0 100px;}

#GM_setting .GM_setting_list_head{display:block;box-sizing:border-box;vertical-align:top;flex:1 0 370px;}
#GM_setting .GM_setting_depth1 .GM_setting_list_head {padding-left:0px;}
#GM_setting .GM_setting_depth2 .GM_setting_list_head {padding-left:30px;}
#GM_setting .GM_setting_depth3 .GM_setting_list_head {padding-left:60px;}
#GM_setting .GM_setting_depth4 .GM_setting_list_head {padding-left:90px;}
#GM_setting .GM_setting_depth5 .GM_setting_list_head {padding-left:120px;}

#GM_setting .GM_setting_title{display:block;font-weight:700;}
#GM_setting .GM_setting_desc{display:block;font-size:11px;}

#GM_setting .GM_setting_input_container {display:block;box-sizing:border-box;padding:0 0 0 30px;vertical-align:top;flex:1 1 100%;}
#GM_setting .GM_setting_input_container span{vertical-align:top;}
#GM_setting .GM_setting_input_container span.btn{margin:0 0 0 10px;}
#GM_setting input{display:inline}
#GM_setting input[type="text"]{ width: 100px; height: 30px; padding: 5px 5px; font-size:12px; }
#GM_setting textarea{ width: 250px; height: 30px; padding: 5px 5px; font-size:12px; }
#GM_setting input[type="checkbox"] { display:none; width: 20px;height:20px; padding: 0; margin:0; }
#GM_setting input[type="radio"] {width: 20px;height:20px; padding: 0; margin:0; }

#GM_setting .radio-inline{ padding-left:0; padding-right:10px; }
#GM_setting .radio-inline input{ margin:0 5px 0 0; }

#GM_setting table {margin:0; width:100%;}
#GM_setting th, #GM_setting td {height: 24px;}
#GM_setting table th, #GM_setting table td{padding:2px 5px;}
#GM_setting table th {border: 1px solid; border-color: inherit;}
#GM_setting .table_btn_container {white-space: nowrap; vertical-align:middle; width:24px; font-size:14px; padding:0; text-align:center;}
#GM_setting .table_btn_container span {padding:0}
#GM_setting table input[type="text"] {padding:1px 2px; height:auto; width:100%; margin-left:auto; margin-right:auto;}

#GM_setting .GM_setting_item_disable, #GM_setting .GM_setting_item_disable .GM_setting_title, #GM_setting .GM_setting_item_disable .GM_setting_desc{color:#ccc !important}
#GM_setting .invalid input, #GM_setting .invalid textarea{border-color:#dc3545;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#dc3545;}
#GM_setting .invalid input:focus, #GM_setting .invalid textarea:focus{border-color:#dc3545;box-shadow:0 0 0 0.2rem rgba(220,53,69,.25);outline:0;color:#dc3545;}
#GM_setting .invalid {color:#dc3545}
#GM_setting .invalid_text {font-size:12px;padding:5px 0 0 5px;}

#GM_setting .GM_setting_under_dev .GM_setting_title{color:#6441a5;font-style:italic}
#GM_setting .GM_setting_debug .GM_setting_title{color:#6441a5;font-style:italic}

#GM_setting .btn-xxs {cursor:pointer;padding:4px 4px;} /*padding: 1px 2px;font-size: 9px;line-height: 1.0;border-radius: 3px;margin:0 2px 2px 0;*/
#GM_setting .btn-xxs .glyphicon{}
#GM_setting .btn-xxs span.glyphicon {font-size:11px; opacity: 0.1;}
#GM_setting .btn-xxs.active span.glyphicon {opacity: 0.9;}
#GM_setting .btn-xxs.disable {opacity: 0.3;cursor:not-allowed;}

#GM_setting_footer { padding: 30px 0 30px 0; margin: 30px 0 0 0; border-top: 1px solid #ccc; text-align: center; font-size:13px; letter-spacing:0.2px; user-select:none;}
#GM_setting_footer .footer_divider { margin: 0 5px; display: inline-block; width: 1px; height: 13px; background-color: #ebebeb; }

#GM_setting .cp {cursor:pointer}

#GM_setting .form-group {margin-bottom:0px;}
#GM_setting .form-control {width:auto;}
`);
    };





    /////////////////////////////////////////////////////////////////////////////////////////////////
    var fillLayout_ = function (key){
        var category = userSettings[key].category;
        var depth = userSettings[key].depth;
        var type = userSettings[key].type;
        var category_name = getTextFromObjectbyLang(userSettings[key].category_name);
        var under_dev = userSettings[key].under_dev;
        var radio_enable_value = userSettings[key].radio_enable_value;
        var title = getTextFromObjectbyLang(userSettings[key].title);
        var desc = getTextFromObjectbyLang(userSettings[key].desc);

        var $inputContainer = $("<div class='GM_setting_input_container form-group'></div>");
        var isTextarea = $.inArray(type, ["tag","textarea","object"]) !== -1;
        var $input;

        switch (type){
        case "radio":
            var radioObj = userSettings[key].radio;
            $input = $("<div GM_setting_type='radio'></div>");
            for (var radiokey in radioObj) {
                var $label = $("<label class='radio-inline'>" + getTextFromObjectbyLang(radioObj[radiokey].title) + "</label>");
                var $temp_input = $("<input name='GM_setting_" + key + "' class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' onfocus='this.blur()' />").attr({
                    "GM_setting_key": key,
                    "value": radioObj[radiokey].value,
                    "type": (type === "set" ? type === "text" : (type === "tag" ? "textarea" : type))
                });
                $temp_input.prependTo($label);
                $input.append($label);
            }
            break;
        
        case "combobox":
            var comboboxObj = userSettings[key].options;
            $input = $(`<select name="GM_setting_${key}" class='form-control input-sm select-inline'></select>`).attr({
                "GM_setting_type": type,
                "GM_setting_key": key,
                "GM_setting_category": (category === undefined ? "default" : category),
                "GM_setting_radio_enable_value": (radio_enable_value === undefined ? "none" : radio_enable_value)
            });
            for (var comboboxKey in comboboxObj) {
                var $temp_option = $(`<option spellcheck='false' value="${comboboxKey}" onfocus='this.blur()'>${getTextFromObjectbyLang(comboboxObj[comboboxKey].title)}</option>`);
                $input.append($temp_option);
            }
            break;

        case "table":
            $input = $(`<table name="GM_setting_${key}" class="table table-bordered table-striped table-hover"><thead><tr></tr></thead><tbody></tbody></table>`).attr({
                "GM_setting_key": key
            });
            var $theadtr = $input.find("thead tr");
            $theadtr.append(`<th>#</th>`);
            for(var i=0;i<userSettings[key].head.length;i++){
                $theadtr.append(`<th>${userSettings[key].head[i]}</th>`);
            }
            $theadtr.append(`<th class="table_btn_container"> </th>`);
            $theadtr.append(`<th class="table_btn_container"> </th>`);
            break;
        
        default:
            $input = $(`<${(isTextarea ? "textarea " : "input ")} class='form-control' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' ${(type === "checkbox" ? "onfocus='this.blur()'" : "")}${(isTextarea ? "></textarea>" : " />")}`)
                .attr({
                    "type": (type === "set" ? type === "text" : (type === "tag" ? "textarea" : type)),
                    "GM_setting_key": key
                });
            break;
        }

        var $category;
        if (category_name !== undefined) {
            $category = $(`<div class='GM_setting_category_name'>${category_name}</div>`);
        } else {
            $category = $("<div class='GM_setting_category_blank'></div>");
        }

        var $head = $("<div class='GM_setting_list_head'></div>");
        var $title = $(`<span class='GM_setting_title'>${title}</span>`);
        var $desc = $(`<span class='GM_setting_desc'>${desc}</span>`);
        $head.append($title).append($desc);

        if (type === "checkbox") {
            var $label_container = $(`<label class="btn btn-default btn-xxs"><span class="glyphicon glyphicon-ok"></span></label>`);
            $label_container.prepend($input).appendTo($inputContainer);

            $input.on("change", function () {
                if ($(this).is(":checked")) {
                    $(this).closest("label").addClass("active");
                } else {
                    $(this).closest("label").removeClass("active");
                }

                if ($(this).is(":disabled")) {
                    $(this).closest("label").addClass("disable").prop("disabled", true);
                } else {
                    $(this).closest("label").removeClass("disable").prop("disabled", false);
                }
            });
        } else {
            $inputContainer.append($input);
        }

        //$li.append($category).append($head).append($inputContainer);
        GUI.$lis[key].empty().append($category).append($head).append($inputContainer);
        $inputs[key] = $input;

        if (userSettings[key].append !== undefined) {
            $inputContainer.append(userSettings[key].append);
        }
    };
    var createlayout_ = function (elem) {
        //CONSOLE_MSG("createlayout_");
        $inputs = {};

        // set $g_elem
        $g_elem = $(elem);
        $g_elem.empty();
        // if ($g_elem.find("#GM_setting_container").length !== 0) {
        //     $g_elem.empty();
        // }

        GUI.$container = $("<div id='GM_setting'></div>");
        GUI.$ul = $("<ul></ul>");
        GUI.$GM_setting_head = $("<div id='GM_setting_head'></div>");
        $g_elem.append(GUI.$container);
        GUI.$container.append(GUI.$GM_setting_head).append(GUI.$ul);

        //////////////////////////////////
        // $setting_head
        //////////////////////////////////
        // $GM_homepage_link
        GUI.$GM_homepage_link = $(`<div class='GM_homepage_link' style='display:none;'><a href='${(GM.info.script.homepage)}' target='_blank'>${(GM.info.script.name)} v${(GM.info.script.version)} (${(GM.info.script.homepage)})</a></div>`);
        if(GM.info !== undefined && GM.info !== null && GM.info.script !== undefined && GM.info.script !== null && GM.info.script.homepage !== undefined && GM.info.script.homepage !== null && GM.info.script.homepage !== ""){
            GUI.$GM_homepage_link.show();
        }

        // $GM_multilang
        GUI.$GM_multilang_select = $(`<select id='GM_multilang_select' class="form-control input-sm"><option value="ko">한국어</option><option value="en">English</option></select>`);
        GUI.$GM_multilang = $(`<div class='GM_multilang' style='display:none'></div>`).append(GUI.$GM_multilang_select);
        if(useMultiLang){
            GUI.$GM_multilang.show();
            GUI.$GM_multilang_select.val(userSelectedLang);
            GUI.$GM_multilang_select.on('change', async (e) => {
                var prevUserSelectedLang = userSelectedLang;
                var optionSelected = $("option:selected", this);
                userSelectedLang = this.value;
                CONSOLE_MSG(`LANG VALUE CHANGED FROM ${prevUserSelectedLang} TO ${userSelectedLang}`);
                await saveLang_();
                changeLang();
            });
        }

        // append to $GM_setting_head
        GUI.$GM_setting_head
            .append(`<div class='GM_setting_logo'>Settings</div>`)
            .append($(`<div class='GM_setting_menu_right'></div>`)
                .append(GUI.$GM_homepage_link)
                .append(GUI.$GM_multilang)
            );
        
        //////////////////////////////////////
        for (var key in userSettings) {
            var category = userSettings[key].category;
            var depth = userSettings[key].depth;
            var type = userSettings[key].type;
            var category_name = getTextFromObjectbyLang(userSettings[key].category_name);
            var under_dev = userSettings[key].under_dev;
            var debug = userSettings[key].debug;
            var radio_enable_value = userSettings[key].radio_enable_value;

            /////////////////////////////////////////
            // set $li
            GUI.$lis[key] = $(`<li></li>`);
            GUI.$ul.append(GUI.$lis[key]);

            GUI.$lis[key].attr({
                "GM_setting_type": type,
                "GM_setting_key":key,
                "GM_setting_depth":depth,
                "GM_setting_category": (category === undefined ? "default" : category),
                "GM_setting_radio_enable_value": (radio_enable_value === undefined ? "none" : radio_enable_value)
            });
            GUI.$lis[key].addClass(`GM_setting_depth${depth}`);
            if(radio_enable_value !== undefined) GUI.$lis[key].attr("GM_setting_radio_enable_value",userSettings[key].radio_enable_value);
            if(under_dev) GUI.$lis[key].addClass("GM_setting_under_dev");
            if(debug) GUI.$lis[key].addClass("GM_setting_debug");
            if(category_name !== undefined) GUI.$lis[key].addClass("GM_setting_category");
            if(under_dev && !userSettingsValues.under_dev) GUI.$lis[key].css({"display":"none","opacity":"0"});
            if(debug && !DEBUG) GUI.$lis[key].css({"display":"none","opacity":"0"});

            fillLayout_(key);
        }

        write_();
        usageCheck_();

        // 설정 on-off 이벤트
        $g_elem.find("input[type='checkbox']").on("click", function () {
            usageCheck_();
        });

        $g_elem.find("input[type='radio']").on("click", function () {
            usageCheck_();
        });
        
        // Table 관련 이벤트
        GUI.$container.on("click", ".table_modify", function(e){
            CONSOLE_MSG("clicked table_modify btn");
            var $e = $(e.target);
            var $tbody = $e.closest("tbody");
            var $tr = $e.closest("tr");
            $tbody.find(".table_modify").hide();
            $tbody.find(".table_delete").hide();
            $tbody.find(".table_new").hide();
            $tbody.find(".table_save").hide();
            $tbody.find(".table_cancel").hide();
            $tr.find(".table_save").show();
            $tr.find(".table_cancel").show();
            var $tds = $tr.find("td");
            for(var i=0;i<$tds.length - 2;i++){
                if(i==0) continue;
                var $td = $($tds[i]);
                var text = $td.text();
                $td.html(`<input type="text" value="${text}" orivalue="${text}"></input>`);
            }
        });

        GUI.$container.on("click", ".table_save", async function(e){
            CONSOLE_MSG("clicked table_save btn");
            var $e = $(e.target);
            var $tr = $e.closest("tr");
            var $tdinputs = $tr.find("input");
            var index = Number($tr.find("td").first().text()) - 1;
            var key = $e.attr("GM_setting_key");
            console.log($tdinputs);
            for(var i=0;i<$tdinputs.length;i++){
                userSettingsValues[key][index][i] = $($tdinputs[i]).val();
            }
            await save_();
            message_(getSystemTextbyLang("auto_saved") + (new Date()).toLocaleTimeString(), $g_elem);
            
            // createlayout_($g_elem);
            var $tbody = $e.closest("tbody");
            var val = userSettingsValues[key];
            reCreateTable_($tbody, key, val);
        });

        GUI.$container.on("click", ".table_cancel", function(e){
            CONSOLE_MSG("clicked table_cancel btn");
            var $e = $(e.target);
            //createlayout_($g_elem);

            var key = $e.attr("GM_setting_key");
            var $tbody = $e.closest("tbody");
            var val = userSettingsValues[key];
            reCreateTable_($tbody, key, val);
        });

        GUI.$container.on("click", ".table_delete", async function(e){
            CONSOLE_MSG("clicked table_delete btn");
            var $e = $(e.target);
            var confirm_res = confirm("Delete?");
            if(!confirm_res) return;
            var $tr = $e.closest("tr");
            var index = Number($tr.find("td").first().text()) - 1;
            $tr.remove();

            var key = $e.attr("GM_setting_key");
            userSettingsValues[key].splice(index, 1);
            await save_();

            //createlayout_($g_elem);
            var $tbody = $e.closest("tbody");
            var val = userSettingsValues[key];
            reCreateTable_($tbody, key, val);
            message_(getSystemTextbyLang("auto_saved") + (new Date()).toLocaleTimeString(), $g_elem);
        });

        GUI.$container.on("click", ".table_new", function(e){
            CONSOLE_MSG("clicked table_new btn");
            var $e = $(e.target);
            var $tbody = $e.closest("tbody");
            $tbody.find(".table_modify").hide();
            $tbody.find(".table_delete").hide();
            $tbody.find(".table_new").hide();
            $tbody.find(".table_new_save").show();
            $tbody.find(".table_new_cancel").show();

            var $tr = $e.closest("tr");
            var $tds = $tr.find("td");
            for(var i=0;i<$tds.length - 2;i++){
                if(i==0) continue;
                var $td = $($tds[i]);
                $td.html(`<input type="text" value=""></input>`);
            }
        });
        
        GUI.$container.on("click", ".table_new_save", async function(e){
            CONSOLE_MSG("clicked table_new_save btn");
            var $e = $(e.target);
            var $tr = $e.closest("tr");
            var $tdinputs = $tr.find("input");
            var temp = [];
            for(var i=0;i<$tdinputs.length;i++){
                temp.push($($tdinputs[i]).val());
            }
            var key = $e.attr("GM_setting_key");
            userSettingsValues[key].push(temp);
            await save_();
            message_(getSystemTextbyLang("auto_saved") + (new Date()).toLocaleTimeString(), $g_elem);

            //createlayout_($g_elem);
            var $tbody = $e.closest("tbody");
            var val = userSettingsValues[key];
            reCreateTable_($tbody, key, val);

        });

        
        GUI.$container.on("click", ".table_new_cancel", function(e){
            CONSOLE_MSG("clicked table_new_cancel btn");
            //createlayout_($g_elem);
            var key = $(e.target).attr("GM_setting_key");
            var $tbody = $(e.target).closest("tbody");
            var val = userSettingsValues[key];
            reCreateTable_($tbody, key, val);
        });

        // 자동 저장 이벤트
        GUI.$container.find("select").on("change", function(){
            CONSOLE_MSG("GM_setting - select change");
            validateAndSave_($(this), $g_elem, $inputs);
        });
        GUI.$container.find("input, textarea").on("input", function () { // "input[type='text']"  input propertychange
            CONSOLE_MSG("GM_setting - text change");
            validateAndSave_($(this), $g_elem, $inputs);
        });

        // 리셋 버튼 추가
        GUI.$ul.append( /*html*/ `<li class="GM_setting_category GM_setting_depth1">
            <div class="GM_setting_category_name">${getSystemTextbyLang("title_reset")}</div>
            <div class="GM_setting_list_head">
                <span class="GM_setting_title">
                    <span class="GM_setting_reset btn btn-primary" style="margin-left:0;">${getSystemTextbyLang("button_reset_settings")}</span>
                    <!--<span class="GM_setting_reset_all btn btn-primary">${"button_reset_settings_all"}</span>-->
                </span>
                <span class="GM_setting_desc"></span>
            </div>
            <div class="GM_setting_input_container form-group">
            </div>
        </li>`);
        GUI.$ul.find(".GM_setting_reset").on("click", async function () {
            var conf = confirm(getSystemTextbyLang("confirm_reset_settings"));
            if (conf) {
                await GM_setting.reset();
                GM_setting.createlayout($g_elem);
                message_(getSystemTextbyLang("complete_reset_settings") + (new Date()).toLocaleTimeString(), $g_elem);
            }
        });
        GUI.$ul.find(".GM_setting_reset_all").on("click", async function () {
            var conf = confirm(getSystemTextbyLang("confirm_reset_settings_all"));
            if (conf) {
                var listValues = await GM.listValues();
                for (var key = 0; key < listValues.length; key++) {
                    var key_str = listValues[key];
                    await GM.deleteValue(key_str);
                }
                await GM_setting.reset();
                GM_setting.createlayout($g_elem);
                message_(getSystemTextbyLang("complete_reset_settings_all") + (new Date()).toLocaleTimeString(), $g_elem);
            }
        });

        // 후원 버튼 추가
        GUI.$ul.append( /*html*/ `<li class="GM_setting_category GM_setting_depth1">
        <div class="GM_setting_category_name">${getSystemTextbyLang("donate")}</div>
        <div class="GM_setting_list_head">
            <span class="GM_setting_title">
                ${getSystemTextbyLang("buymeacoffee")}
            </span>
            <span class="GM_setting_desc">
                ${getSystemTextbyLang("buymeacoffeeDesc")}
            </span>
        </div>
        <div class="GM_setting_input_container form-group">
        <a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>
        </div>
        </li>
    `);
        // footer 추가
        GUI.$ul.after(/*html*/`
        <div id="GM_setting_footer">
            <a href="${(GM.info.script.homepage)}" target="_blank">${(GM.info.script.name)}</a> v${(GM.info.script.version)}
            <div class="footer_divider"></div> <span class="GM_Setting_Debug_Toggle">GM Setting v${version}</span>
            <div class="footer_divider"></div> ©2017-${(new Date()).getFullYear()} <a href="https://nomo.asia/" target="_blank">NOMO</a></div>
        `);
        

        // Debug Toggle Event
        var GM_Setting_Debug_Toggle_Count = 0;
        var GM_Setting_Debug_Toggle_SetTimeout = undefined;
        GUI.$container.on("click", "span.GM_Setting_Debug_Toggle", async function(){
            clearTimeout(GM_Setting_Debug_Toggle_SetTimeout);
            GM_Setting_Debug_Toggle_Count += 1;

            if(GM_Setting_Debug_Toggle_Count > 4){
                GM_Setting_Debug_Toggle_Count = 0;
                DEBUG = !DEBUG;
                await GM.setValue("DEBUG", DEBUG);
                message_(`DEBUG MODE : "${DEBUG ? "ON" : "OFF"}"`, $g_elem);

                
                if (DEBUG) {
                    GUI.$ul.find(".GM_setting_debug").css("opacity", 0).slideDown("fast").animate({
                        opacity: 1
                    }, {
                        queue: false,
                        duration: "fast"
                    });
                } else {
                    GUI.$ul.find(".GM_setting_debug").css("opacity", 1).slideUp("fast").animate({
                        opacity: 0.0
                    }, {
                        queue: false,
                        duration: "fast"
                    });
                }

                return;
            }

            GM_Setting_Debug_Toggle_SetTimeout = setTimeout(function(){
                GM_Setting_Debug_Toggle_Count = 0;
            },1000);
        });
    };
    var timeoutId_ = undefined;
    var message_ = function (msg, $elem) {
        if ($elem === undefined) {
            return;
        }
        var prefix = "GM_setting_autosaved";
        $elem.find("." + prefix).animate({ bottom: "+=40px" }, { duration: 300, queue: false }); // cleqrQueue().dequeue().finish().stop("true","true")
        // @keyframes glow {to {text-shadow: 0 0 10px white;box-shadow: 0 0 10px #5cb85c;}}
        $("<div style='animation: glow .5s 10 alternate; position:fixed; left:10px; bottom:20px; z-index:10000000;' class='" + prefix + " btn btn-success'>" + msg + "</div>")
            .appendTo($elem)
            .fadeIn("fast")
            .animate({
                opacity: 1
            }, 6000, function () {
                $(this).fadeOut("fast").delay(600).remove();
            })
            .animate({ left: "+=30px" }, { duration: 300, queue: false });
    };
    var readSub_ = async function (key){
        if(userSettings[key].autosavepass && userSettingsValues[key] !== undefined || userSettingsValues[key].type === "table"){
            return;
        }
        var val = getInputValue_(key);

        if (userSettings[key].type === "tag") {
            val = val.split(","); // val = val.replace(/\s/g,"").split(",");
            if (val.length === 1 && val[0] === "") {
                val = [];
            }
            $.each(val, function (index, value) {
                val[index] = value.replace(/^\s*|\s*$/g, "");
            });
        }

        // 이전 설정과 변경된 값 키 체크
        if (userSettingsValues[key] !== val && changed_key.indexOf(key) === -1) {
            changed_key.push(key);
        }
        userSettingsValues[key] = val;
    };
    var read_ = async function (key_specific) {
        CONSOLE_MSG("read_");
        if(key_specific === undefined){
            for (var key in $inputs) {
                await readSub_(key);
            }
        }
        else{
            await readSub_(key_specific);
        }
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////////////////////////////
    var writeSub_ = function(key){
        writeInputValue_(key, $inputs[key], userSettingsValues[key]);
    };
    var write_ = function (key_specific) {
        CONSOLE_MSG("write_");
        if(key_specific === undefined){
            for (let key in $inputs) {
                writeSub_(key);
            }
        }
        else{
            writeSub_(key_specific);
        }
    };
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    var getInputValue_ = function (key) {
        var val;
        var $input = $inputs[key];
        var type = userSettings[key].type;
        switch (type) {
        case "checkbox":
            val = $input.prop("checked");
            break;
        case "set": // 현재 text 와 동일
            val = $input.val();
            break;
        case "text":
            val = $input.val();
            break;
        case "tag": // 현재 textarea 와 동일
            val = $input.val();
            break;
        case "object": // 현재 textarea 와 동일
            val = JSON.parse($input.val());
            break;
        case "textarea":
            val = $input.val();
            break;
        case "radio":
            val = $input.find("input:checked").val();
            break;
        case "combobox":
            val = $input.find('option:selected').val();
            break;
        case "table":
            var $tbody = $input.find("tbody");
            val = [];
            var $trs = $tbody.find("tr");
            for(var i=0; i<$trs.length - 1;i++){    // 마지막 라인은 new 에 대한 것이므로 읽지 않음
                val.push([]);
                var $tr = $($trs[i]);
                var $tds = $tr.find("td");
                for(var j=0; j<$tds.length - 2;j++){
                    if(j===0) continue; // index
                    var text = $($tds[j]).text();
                    val[i][j-1] = text;
                }
            }
            break;
        default:
            //CONSOLE_MSG($input);
            val = undefined;
            break;
        }
        return val;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var writeInputValue_ = function (key, $input, val) {
        var type = userSettings[key].type;
        switch (type) {
        case "checkbox":
            $input.prop("checked", val).trigger("change");
            break;
        case "set": // 현재 text 와 동일
            $input.val(val);
            break;
        case "text":
            $input.val(val);
            break;
        case "tag": // 현재 textarea 와 동일
            $input.val(val);
            $input.height("auto");
            $input.height(String(Number($input.prop("scrollHeight")) + 0) + "px");
            break;
        case "object": // 현재 textarea 와 동일
            $input.val(JSON.stringify(val));
            $input.height("auto");
            $input.height(String(Number($input.prop("scrollHeight")) + 0) + "px");
            break;
        case "textarea":
            $input.val(val);
            $input.height("auto");
            $input.height(String(Number($input.prop("scrollHeight")) + 0) + "px");
            break;
        case "radio":
            $input.find("input[value=" + val + "]").prop("checked", true);
            break;
        case "combobox":
            $input.find("option[value=" + val + "]").prop("selected", true);
            break;
        case "table":
            var $tbody = $input.find("tbody");
            $tbody.empty();
            for(var i=0;i<val.length;i++){
                var $tr = $(`<tr></tr>`);
                for(var j=0;j<val[i].length;j++){
                    if(j==0){
                        $tr.append(`<td>${i+1}</td>`);
                    }
                    $tr.append(`<td>${val[i][j]}</td>`);
                }
                $tr.append(`<td class="table_btn_container"><span title="Modify" alt="Modify" class="glyphicon glyphicon-pencil cp table_modify" GM_setting_key="${key}"></span><span title="Save" alt="Save" style="display:none;" class="glyphicon glyphicon-floppy-disk cp table_save" GM_setting_key="${key}"></span></td>`);
                $tr.append(`<td class="table_btn_container"><span title="Delete" alt="Delete" class="glyphicon glyphicon-trash cp table_delete" GM_setting_key="${key}"></span><span title="Cancel" alt="Cancel" style="display:none;" class="glyphicon glyphicon-remove cp table_cancel" GM_setting_key="${key}"></span></td>`);
                $tbody.append($tr);
            }
            var $tr_new = $(`<tr></tr>`);
            for(var k=0;k<userSettings[key].head.length;k++){   // index
                if(k==0){
                    $tr_new.append(`<td></td>`);
                }
                $tr_new.append(`<td></td>`);
            }
            $tr_new.append(`<td class="table_btn_container"><span title="New" alt="New" class="glyphicon glyphicon-plus cp table_new" GM_setting_key="${key}"></span><span title="Save" alt="Save" style="display:none;" class="glyphicon glyphicon-floppy-disk cp table_new_save" GM_setting_key="${key}"></span></td>`);
            $tr_new.append(`<td class="table_btn_container"><span title="Cancel" alt="Cancel" style="display:none;" class="glyphicon glyphicon-remove cp table_new_cancel" GM_setting_key="${key}"></span></td>`);
            $tbody.append($tr_new);
            break;
        default:
            break;
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var usageCheck_ = async function () {
        // 일단 다 켠다.
        var $lis = GUI.$lis;
        for (let curr_key in $lis) {
            let $curr = $($lis[curr_key]);
            $curr.removeClass("GM_setting_item_disable");
            $curr.find("input, textarea, select").prop("disabled", false);
            $curr.find("input[type='checkbox']").trigger("change");
        }

        var enable = [true, true];
        var $prev = undefined, prevTopRadioVal, prevTopRadioDepth = 1000;
        for (let curr_key in $lis) {
            let $curr = $($lis[curr_key]);
            var curr_depth = userSettings[curr_key].depth;
            var curr_radio_enable_value = userSettings[curr_key].radio_enable_value;
            var curr_type = userSettings[curr_key].type;

            if ($prev === undefined){
                //
            }
            else {
                var prev_depth = $prev.attr("GM_setting_depth");
                if(prevTopRadioDepth >= curr_depth){
                    prevTopRadioVal = undefined;
                    prevTopRadioDepth = 1000;
                }

                if (prev_depth == curr_depth && prev_depth > 0){
                    if(prevTopRadioVal !== undefined){
                        if(prevTopRadioVal == curr_radio_enable_value){
                            enable[prev_depth-1] = true;
                        }
                        else{
                            enable[prev_depth-1] = false;
                        }
                    }
                }
                else if (prev_depth < curr_depth) {
                    prevTopRadioVal = undefined;
                    var $prev_checkbox = $prev.find("input[type='checkbox']");
                    var $prev_radio = $prev.find("input[type='radio']");
                    var $prev_combobox = $prev.find("select");
                    // 이전 요소가 체크박스이고, 켜져있으면 현재 요소도 켠다.
                    if ($prev_checkbox.length !== 0 && $prev_checkbox.is(":checked")) {
                        enable[prev_depth] = true;
                    }
                    // 이전 요소가 라디오
                    else if($prev_radio.length !== 0){
                        prevTopRadioVal = $prev.find("input[type='radio']:checked").val();
                        prevTopRadioDepth = prev_depth;
                        //curr_radio_enable_value ||
                        if($prev.find("input[type='radio']:checked").val() == curr_radio_enable_value){
                            enable[prev_depth] = true;
                        }
                        else{
                            enable[prev_depth] = false;
                        }
                    }
                    // 이전 요소가 combobox 이면 일단 전부 켠다.
                    else if($prev_combobox.length !== 0){
                        enable[prev_depth] = true;
                    }
                    else {
                        enable[prev_depth] = false;
                    }

                    // 이전 요소가 체크박스가 아니면 그냥 켠다.
                    // if($prev_checkbox.length !== 0){
                    //     enable[prev_depth] = true;
                    // }
                }
            }

            $prev = $curr;

            for (var e = 0; e < curr_depth; e++) {
                if (userSettings[curr_key].disable || !enable[e]) {
                    $curr.addClass("GM_setting_item_disable");
                    $curr.find("input, textarea, select").prop("disabled", true);
                    $curr.find("input[type='checkbox']").trigger("change");
                    break;
                }
            }
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // validation
    var validation_ = function (key, val) {
        var val_array;
        var duplicate;
        var sorted_array;
        var regex_array_string = /^[A-Za-z0-9 _,]*$/;
        //var regex_number = /^[0-9]*$/;
        var valid = true;
        var message = "";

        // 숫자의 경우
        if (userSettings[key].valid === "number") {
            valid = $.isNumeric(val);
            if (val === "") {
                // "반드시 값이 입력되어야 합니다."
                message += getSystemTextbyLang("err_val_req");
            } else if (!valid) {
                // "숫자만 입력 가능합니다."
                message += getSystemTextbyLang("err_num_req");
            } else {
                if (userSettings[key].min_value !== undefined && userSettings[key].min_value > val) {
                    valid = false;
                    // "입력 값은 다음 값 이상의 숫자이어야 합니다. : "
                    message += getSystemTextbyLang("err_num_over") + userSettings[key].min_value;
                } else if (userSettings[key].max_value !== undefined && userSettings[key].max_value < val) {
                    valid = false;
                    // "입력 값은 다음 값 이하의 숫자이어야 합니다. : "
                    message += getSystemTextbyLang("err_num_not_more_than") + userSettings[key].max_value;
                }
            }
        }
        // array_string - ID 태그
        else if (val !== "" && userSettings[key].valid === "array_string") {
            val_array = $.map(val.split(","), $.trim);
            var match = val.match(regex_array_string);
            //CONSOLE_MSG(match);
            if (match === null || match.length === 0) {
                valid = false;
                // "영문, 숫자, 콤마(,), 언더바(_) 만 입력 가능합니다."
                message += getSystemTextbyLang("err_valid_array_string");
            } else if ($.inArray("", val_array) !== -1) {
                valid = false;
                // "공백 값 등 값이 존재하지 않는 항목이 존재합니다."
                message += getSystemTextbyLang("err_value_empty");
                CONSOLE_MSG(val_array, $.inArray("", val_array));
            } else if ((new Set(val_array)).size !== val_array.length) {
                valid = false;
                duplicate = [];
                sorted_array = val_array.sort();
                for (var i = 0; i < val_array.length - 1; i++) {
                    if (sorted_array[i + 1] == sorted_array[i] && $.inArray(sorted_array[i], duplicate) === -1) {
                        duplicate.push(sorted_array[i]);
                    }
                }
                // "중복된 값이 존재합니다: "
                message += getSystemTextbyLang("err_value_dup") + duplicate.join(",");
            } else {
                for (var j = 0; j < val_array.length; j++) {
                    //CONSOLE_MSG(val_array, val_array[j].indexOf(" "));
                    if (val_array[j].indexOf(" ") !== -1) {
                        valid = false;
                        // "문자열 내 공백이 존재하는 항목이 있습니다: "
                        message += getSystemTextbyLang("err_value_blank") + val_array[j];
                        break;
                    }
                }
            }
        }
        // array_word - 금지단어
        else if (val !== "" && userSettings[key].valid === "array_word") {
            val_array = $.map(val.split(","), $.trim);
            if ($.inArray("", val_array) !== -1) {
                valid = false;
                // "공백 값 등 값이 존재하지 않는 항목이 존재합니다."
                message += getSystemTextbyLang("err_value_empty");
                CONSOLE_MSG(val_array, $.inArray("", val_array));
            } else if ((new Set(val_array)).size !== val_array.length) {
                valid = false;
                duplicate = [];
                sorted_array = val_array.sort();
                for (var k = 0; k < val_array.length - 1; k++) {
                    if (sorted_array[k + 1] == sorted_array[k] && $.inArray(sorted_array[k], duplicate) === -1) {
                        duplicate.push(sorted_array[k]);
                    }
                }
                // "중복된 값이 존재합니다: "
                message += getSystemTextbyLang("err_value_dup") + duplicate.join(",");
            }
        }

        var return_obj = {
            valid: valid,
            message: message
        };
        return return_obj;
    };

    //////////////////////
    // validate and save
    var validateAndSave_ = async function($this, $elem, $inputs){
        var this_key = $this.attr("GM_setting_key");
        var val = getInputValue_(this_key);
        var validation = validation_(this_key, val);
        $this.closest("div").find(".invalid_text").remove();
        if (validation.valid) {
            $this.closest("div").removeClass("invalid");
        } else {
            CONSOLE_MSG("validation", validation);
            $this.closest("div").addClass("invalid");
            $this.after("<div class='invalid_text'>" + validation.message + "</div>");
        }

        clearTimeout(timeoutId_);
        timeoutId_ = setTimeout(async function () {
            // 저장 시도
            // 정상적으로 값이 체크 된 경우
            var g_validation = true;
            $.each($inputs, function (ekey, evalue) {
                var temp = validation_(ekey, getInputValue_(ekey));
                if (!temp.valid) {
                    g_validation = false;
                    return false;
                }
            });
            if (g_validation) {
                await read_();
                save_();
                message_(getSystemTextbyLang("auto_saved") + (new Date()).toLocaleTimeString(), $elem);
            }
        }, 1000);
    };

    ///////////////////////
    // check if there are same keys in object
    var hasSameKey_ = function (a, b) {
        var aKeys = Object.keys(a).sort();
        var bKeys = Object.keys(b).sort();
        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    };


    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // public interface
    /////////////////////////////////////////////////////////////////////////////////////////////////
    return {
        init: async function (name, user_settings) {
            name_ = name;
            await init_(user_settings);
            await event_();
            addStyle_();
        },
        load: async function () {
            CONSOLE_MSG("GM_setting - load");
            await load_();
            //return settings;
        },
        save: async function () {
            CONSOLE_MSG("GM_setting - save");
            await save_();
        },
        save_overwrite: async function () {
            // old_value: obj,       ekey:키, evalue:값(old 설정값)
            var old_value = userSettingsValues;
            var new_value = global[name_];
            CONSOLE_MSG("_settings", userSettings);
            $.each(old_value, function (ekey, _evalue) {
                if (userSettings[ekey] !== undefined && userSettings[ekey].change !== undefined && old_value[ekey] !== new_value[ekey]) {
                    userSettings[ekey].change(new_value[ekey]);
                }
            });
            userSettingsValues = global[name_];
            CONSOLE_MSG("GM_setting - save_overwrite");
            await save_();
        },
        // update: async function (key, value) {
        //     settings[key] = global[name_][key]
        // },
        reset: async function () {
            await GM.setValue(name_, userSettingsInitCopy);
            await load_();
        },
        createlayout: function (elem) {
            latestCreatedLayout = elem;
            createlayout_(elem);
        },
        getType: function (key) {
            if (userSettings[key] !== undefined) {
                return userSettings[key].type;
            } else {
                return undefined;
            }
        },
        message: function (msg, $elem) {
            message_(msg, $elem);
        }
    };
})(jQuery, window, document);

// escapeHTML
const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
export var escapeHtml = function(string) { return String(string).replace(/[&<>"'`=/]/g, function (s) { return entityMap[s]; }); };

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}