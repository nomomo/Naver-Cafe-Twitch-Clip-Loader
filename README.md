# Naver-Cafe-Twitch-Clip-Loader

- 본 UserScript 는 네이버 카페 글에서 Twitch 클립 링크를 재생 가능한 비디오로 변환해줍니다. (엄청 편하다!)
- 네이버 카페에서 전체화면 후 해제 시 스크롤이 이상한 위치로 이동하는 문제를 해결해줍니다.
- 설정에서 링크를 비디오로 변환할 시점을 선택할 수 있습니다. (페이지 로딩 시 자동 변환 or 링크 클릭 시 변환)
- 설명 동영상: [https://www.youtube.com/watch?v=USr6AtvKslc](https://www.youtube.com/watch?v=USr6AtvKslc)

## Preview

- 단순 링크의 경우 변환하지 않으며, 아래 그림과 같이 Twitch Clip 의 섬네일이 있는 링크만 변환합니다.

![Preview](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_01.png)

## Install

Naver-Cafe-Twitch-Clip-Loader 의 설치 방법을 설명합니다.

### STEP 1. ScriptManager

아래 링크에서 사용 중인 브라우저에 맞는 유저스크립트 관리 확장기능을 설치하세요.

- Firefox - [Tampermonkey](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
- Chrome - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Opera - [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- Safari - [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
- Edge - [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### STEP 2. UserScript

- 유저스크립트 관리 확장기능 설치 후, 아래의 링크를 클릭하여 스크립트를 설치합니다.
  - [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js) from [https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js)

이것으로 설치는 끝입니다. 즐겁게 사용하세요~

> 주의: 본 스크립트를 설치 및 사용하며 브라우저 과부하로 인한 응답 없음/뻗음으로 인한 데이터 손실이나 기타 발생하는 다른 문제에 대하여 개발자는 책임지지 않음(보고된 문제는 없음)  
> Naver Cafe 접속에 문제가 생기거나 클립 재생이 안 되는 문제 등이 발생하는 경우, Tampermonkey 의 관리 메뉴에서 이 스크립트를 끄거나 삭제해주세요.  
> 본 스크립트는 Tampermonkey 외의 스크립트 매니저에서는 정상 동작하지 않을 수 있습니다.  
> 동작 테스트는 Chrome, Firefox 에서만 했습니다.  

## Settings

- Naver Cafe 에 접속한 상태에서, Toolbar 의 Tampermonkey 아이콘 - Naver-Cafe-Twitch-Clip-Loader - 상세 설정 열기를 클릭하여 설정을 변경할 수 있습니다.

![Open Settings Menu](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_02.png)

![Settings](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_03.png)

> 상세 설정을 새 창으로 열 때 AdBlock 사용, 팝업 차단 등에 의하여 문제가 발생하는 경우 현재 창으로 여세요.

## FAQ

- Q: 스크립트를 새 버전으로 업데이트 하려면 어떻게 하나요?<br />A: 주기적으로 자동 업데이트 되지만, Tampermonkey 대시보드에서 "최근 업데이트 일시"를 클릭하여 수동 업데이트가 가능합니다.<br />설치 링크를 다시 클릭하여 업데이트 할 수도 있습니다. [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Twitch-Clip-Loader.user.js)

## Bug report

- 버그 리포트 & 건의사항은 [Issues](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues)에 올려주시거나, 카페 글에 댓글로 남겨주시거나, 아래의 메일로 보내주세요.
- nomotg@gmail.com

## Change log

- 세부 변경 사항은 [CHANGELOG.md](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/blob/main/CHANGELOG.md)를 확인하세요.

### 0.4.0 ~ 0.4.3 - Jun. 06, 2022

- 이제 Twitch Clip 페이지에서처럼 일시정지 시 상단 오버레이와 재생 버튼 등을 숨깁니다. (기본 설정의 경우)
- 실험실 기능 추가
  - 즐겨찾는 게시판을 항상 펼침
  - 어두운 모드

### 0.3.0 - Jun. 05, 2022

- 네이버 카페에서 새로고침 시, 메인 화면 대신 이전에 탐색한 페이지를 불러오도록 하는 실험실 기능을 추가했어요.

### 0.2.0 - Jun. 04, 2022

- "영화관 모드" 옵션 추가
  - 카페 화면 최상단의 '영화관 모드' 버튼을 클릭하여 영화관 모드를 활성화할 수 있습니다.
  - 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.
  - 상세 설정 창에서 "숨겨진 고급 기능 설정"에 체크한 후, 영화관 모드에서의 컨텐츠 사이즈를 직접 설정할 수 있습니다.

### 0.1.1 - Jun. 04, 2022

- "화면 클릭으로 클립 재생 및 일시정지" 기능 추가 (기본값: 켜짐)
  - 클립 페이지에 직접 접속했을 때 처럼, 클립 화면을 클릭하면 재생 및 일시정지가 됩니다.
  - 기본값으로 켜져 있으며 설정 창에서는 숨겨져 있습니다. 클립 화면을 클릭했을 때 알 수 없는 문제가 발생하면 상세 설정창에서 "숨겨진 고급 기능 설정"에 체크한 후 본 기능을 끄세요.

### 0.1.0 - Jun. 04, 2022

- "클립 로드 시 특정 사운드 볼륨(Volume)으로 설정" 기능 추가
  - 클립 자동 재생 시 Chrome 계열 브라우저가 클립을 강제로 음소거 하는 것을 피하려면 본 기능을 사용해보세요.

### 0.0.9 - Mar. 31, 2022

- 상세 설정 창을 새 창을 띄우지 않고 바로 열 수 있도록 "상세 설정 열기 (현재 창)" 버튼을 추가했습니다. (AdBlock 사용자를 위함)

### 0.0.8 - Mar. 20, 2022

- 게시판에서 기본 글 표시 개수를 설정할 수 있는 기능 추가
- 자주 수정되지 않는 고급 기능을 숨기고 원할 때 볼 수 있도록 하여, 설정 화면을 깔끔하게 만들었어요.

### 0.0.6 - Mar. 18, 2022

- 네이버 비디오를 항상 최대 화질로 시작: 네이버 비디오를 로드할 때 선택 가능한 최대 화질을 자동으로 선택해주는 기능을 추가했어요. (편하다!)
- 비디오 재생 시 다른 재생 중인 비디오 일시정지: 이제 Twitch Clip 뿐만이 아니라 Naver Video 를 재생 시에도 다른 재생 중인 모든 Naver Video 와 Twitch Clip 을 일시정지 해주는 기능을 추가했어요. 다음 동영상을 재생하기 위하여 이전 동영상을 정지할 필요가 없습니다. (엄청 엄청 편하다!)
  - 네이버 비디오 관련 재생 문제가 발생 시 "네이버 비디오에도 적용" 옵션을 끄세요.

### 0.0.4 - Apr. 10, 2022

- 클립 재생 시 다른 클립 일시정지: Twitch Clip 재생 시, 자동으로 다른 모든 클립을 일시정지 하는 기능을 추가했어요. 다음 클립을 재생하기 위하여 이전 클립을 정지할 필요가 없습니다. (엄청 편하다!)
- 다음 클립을 자동으로 이어서 재생: 본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생해주는 기능을 추가했어요.

### 0.0.3 - Apr. 10, 2022

- 전체화면 스크롤 동작 개선: 네이버 카페에서 비디오를 전체화면 한 후 해제했을 때, 스크롤이 다른 위치로 변경되지 않도록 하는 기능을 추가했어요. Twitch Clip 과 네이버 비디오 모두에 적용됩니다.
- 원본 링크 삭제: 클립 링크를 비디오로 변환 시, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다.

### 0.0.2 - Mar. 02, 2022

- 페이지 로딩 시점에 변환할 개수 제한 설정 추가 (클립 많은 글에서 심하게 느려지는 현상 방지)
- https://www.twitch.tv/[스트리머 ID]/clip/[클립 ID] 형태의 링크 감지하도록 함

### 0.0.1 - Jan. 09, 2022

- 최초 커밋

## Happy??

<a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="60"></a>　<a href="https://toon.at/donate/636947867320352181" target="_blank"><img src="https://raw.githubusercontent.com/nomomo/Addostream/master/assets/toonation_b11.png" height="60" alt="Donate with Toonation" /></a>
