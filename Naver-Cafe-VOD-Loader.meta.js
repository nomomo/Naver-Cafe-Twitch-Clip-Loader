// ==UserScript==
// @name        Naver-Cafe-VOD-Loader
// @version     0.9.0
// @author      Nomo
// @description Naver Cafe 에서 외부 VOD를 편하게 볼 수 있도록 해주는 유저스크립트 확장
// @supportURL  https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues
// @match       https://cafe.naver.com/*
// @match       https://clips.twitch.tv/*parent=cafe.naver.com*
// @match       https://player.twitch.tv/*parent=cafe.naver.com*
// @match       https://serviceapi.nmv.naver.com/*
// @match       https://www.youtube.com/embed/*origin=https%3A%2F%2Fcafe.naver.com*
// @match       https://streamable.com/e/*parent=cafe.naver.com*
// @match       https://vod.afreecatv.com/player/*parent=cafe.naver.com*
// @namespace   Naver-Cafe-Twitch-Clip-Loader
// @icon        https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/logo.png
// @homepageURL https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/
// @downloadURL https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-VOD-Loader.user.js
// @updateURL   https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-VOD-Loader.user.js
// @run-at      document-start
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
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
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM.addValueChangeListener
// @grant       GM_addValueChangeListener
// @grant       GM.removeValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       unsafeWindow
// @connect     youtube.com
// ==/UserScript==
