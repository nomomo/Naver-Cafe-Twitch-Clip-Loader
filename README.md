# Naver-Cafe-Twitch-Clip-Loader

- 본 UserScript는 네이버 카페 글에서 Twitch 클립 링크를 재생 가능한 비디오로 변환해줍니다. (엄청 편하다!)
- 설정에서 링크를 비디오로 변환할 시점을 선택할 수 있습니다. (페이지 로딩 시 자동 변환 or 링크 클릭 시 변환)
- 설명 동영상: ![https://www.youtube.com/watch?v=USr6AtvKslc](https://www.youtube.com/watch?v=USr6AtvKslc)

## Preview

- 단순 링크의 경우 변환하지 않으며, 아래 그림과 같이 Twitch Clip 의 섬네일이 있는 링크만 변환합니다.

![Preview](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_01.png)

- Toolbar 의 Tampermonkey 아이콘 - Naver-Cafe-Twitch-Clip-Loader - 상세 설정 열기를 클릭하여 설정을 변경할 수 있습니다.

![Open Settings Menu](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_02.png)

![Settings](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_03.png)

## Install

### STEP 1. ScriptManager

자신의 브라우저에 맞는 유저스크립트 관리 확장기능 설치 (동작 테스트는 Chrome, Firefox 에서만 했습니다.)

- Firefox - [Tampermonkey](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
- Chrome - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Opera - [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- Safari - [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
- Edge - [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

> 본 스크립트는 Tampermonkey 외의 스크립트 매니저에서는 정상 동작하지 않을 수 있습니다.

### STEP 2. UserScript

- 유저스크립크 관리 확장기능 설치 후, 아래의 링크를 클릭하여 스크립트를 설치합니다.

- [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js) from [https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js)

> 주의: 본 스크립트를 설치 및 사용하며 브라우저 과부하로 인한 응답 없음/뻗음으로 인한 데이터 손실이나 기타 발생하는 다른 문제에 대하여 개발자는 책임지지 않음(보고된 문제는 없음)  
> Naver Cafe 접속에 문제가 생기거나 클립 재생이 안 되는 문제 등이 발생하는 경우, Tampermonkey 의 관리 메뉴에서 이 스크립트를 끄거나 삭제해주세요.

## Bug report

- 버그 리포트 & 건의사항은 아래의 링크로 보내주세요.
- nomotg@gmail.com

## Change log

### 0.0.5 (Apr. 10, 2022)

- 설정 화면에서 "링크 클릭 시" 옵션을 변경할 수 없는 버그 수정

### 0.0.4 (Apr. 10, 2022)

- 기능 추가
  - 클립 재생 시 다른 클립 일시정지: Twitch Clip 재생 시, 자동으로 다른 모든 클립을 일시정지 합니다. 다음 클립을 재생하기 위하여 이전 클립을 정지할 필요가 없습니다. (엄청 편하다!)
  - 다음 클립을 자동으로 이어서 재생: 본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생합니다.
- 후원 링크를 추가했어요.

### 0.0.3 (Apr. 10, 2022)

- 기능 추가
  - 전체화면 스크롤 동작 개선: 네이버 카페에서 비디오를 전체화면 한 후 해제했을 때, 스크롤이 다른 위치로 변경되지 않도록 하는 기능을 추가했습니다. Twitch Clip 과 네이버 비디오 모두에 적용됩니다.
  - 원본 링크 삭제: 클립 링크를 비디오로 변환 시, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다.
- 클립 타이틀과 링크를 더 깔끔하게 표시합니다.

### 0.0.2 (Mar. 02, 2022)

- 페이지 로딩 시점에 변환할 개수 제한 설정 추가 (클립 많은 글에서 심하게 느려지는 현상 방지)
- https://www.twitch.tv/[스트리머 ID]/clip/[클립 ID] 형태의 링크 감지하도록 함

### 0.0.1 (Jan. 09, 2022)

- 최초 커밋

## Happy??

<a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>　<a href="https://toon.at/donate/636947867320352181" target="_blank"><img src="https://raw.githubusercontent.com/nomomo/Addostream/master/assets/toonation_b11.gif" height="41" alt="Donate with Toonation" /></a>