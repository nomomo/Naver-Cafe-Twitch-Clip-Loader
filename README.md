# Naver-Cafe-Twitch-Clip-Loader

- 네이버 카페 글에서 Twitch 클립 링크를 편하게 볼 수 있도록 해주는 UserScript
- 네이버 카페는 Youtube 링크를 카페 글 내에서 바로 볼 수 있도록 비디오로 자동 변환하는 기능을 지원하지만, Twitch Cilp 의 경우에는 해당 기능을 지원하지 않습니다. 때문에 Twitch Clip 의 경우 매번 새 창을 띄워 Twitch Clip 페이지에서 클립을 재생해야 하는 귀찮음이 있습니다. 본 UserScript 는 네이버 카페 글에서 Twitch 클립 링크를 감지하는 경우, 재생 가능한 비디오로 변환하는 브라우저 확장 유저스크립트 입니다.

## Preview

- 네이버 카페 글에서 트위치 클립 링크를 감지하는 경우, 재생 가능한 비디오로 변환합니다.
- 단순 링크의 경우 변환하지 않으며, 아래 그림과 같이 Twitch Clip 의 섬네일이 있는 링크만 변환합니다.
- 설정에서 링크를 비디오로 변환할 시점을 선택할 수 있습니다. (페이지 로딩 시 자동 변환 or 링크 클릭 시 변환)

![Preview](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_01.png)

- Toolbar 의 Tampermonkey 아이콘 - Naver-Cafe-Twitch-Clip-Loader - Change Notification Setting 을 클릭하여 설정을 변경할 수 있습니다.

![Settings](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_02.png)

## Install

### STEP 1. ScriptManager

자신의 브라우저에 맞는 유저스크립트 관리 확장기능 설치 (동작 테스트는 Chrome, Firefox 에서만 했습니다.)

- Firefox - [Tampermonkey](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
- Chrome - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Opera - [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- Safari - [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
- Edge - [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

> 본 스크립트는 Tampermonkey 외의 스크립트에서는 정상 동작하지 않을 수 있습니다.

### STEP 2. UserScript

- 유저스크립크 관리 확장기능 설치 후, 아래의 링크를 클릭하여 스크립트를 설치합니다.

- [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/Naver-Cafe-Twitch-Clip-Loader.user) from [https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/Naver-Cafe-Twitch-Clip-Loader.user.js](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/Naver-Cafe-Twitch-Clip-Loader.user.js)

> 주의: 본 스크립트를 설치 및 사용하며 브라우저 과부하로 인한 응답 없음/뻗음 등 으로 인한 데이터 손실 등 문제 발생 시 개발자는 책임지지 않음(보고된 문제는 없음)  
> Naver Cafe 접속에 문제가 생기거나 클립 재생이 안 되는 문제 등이 발생하는 경우, Tampermonkey 의 관리 메뉴에서 이 스크립트를 끄거나 삭제해주세요.

## Bug report

- 버그 리포트 & 건의사항은 아래의 링크로 보내주세요.
- nomotg@gmail.com

## Change log

### 0.0.1 (Jan. 09, 2022)

- 최초 커밋
