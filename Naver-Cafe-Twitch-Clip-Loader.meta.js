// ==UserScript==
// @name        Naver-Cafe-Clip-Loader
// @version     1.1.4
// @author      Nomo
// @description Naver Cafe 에서 Youtube Clip, Streamable, Afreecatv VOD, Clippy, Twitch(해외) 등의 외부 VOD 시청을 도와주는 유저스크립트 확장
// @supportURL  https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues
// @match       https://cafe.naver.com/*
// @match       https://clips.twitch.tv/*parent=cafe.naver.com*
// @match       https://player.twitch.tv/*parent=cafe.naver.com*
// @match       https://serviceapi.nmv.naver.com/*
// @match       https://www.youtube.com/embed/*origin=https%3A%2F%2Fcafe.naver.com*
// @match       https://*/*parent=cafe.naver.com&extension=NCCL*
// @namespace   Naver-Cafe-Clip-Loader
// @updatelog   2022/12/24 v1.0.0 - Script 이름 변경, 지원 VOD 플랫폼 추가, 최적화 등. 업데이트를 원하시면 '업그레이드' 버튼을 눌러주세요.
// @memo        나타날 수 있습니다.
// @icon        https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/logo.png
// @homepageURL https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/
// @downloadURL https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js
// @updateURL   https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js
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
// @connect     tv.kakao.com
// @connect     tv.naver.com
// @connect     vlive.tv
// ==/UserScript==
