# Naver-Cafe-Clip-Loader

- 본 UserScript 는 네이버 카페 글에서 자체 지원되지 않는 외부 동영상 링크를 재생 가능한 비디오로 변환해줍니다. (엄청 편하다!)
- Twitch 클립 & VOD(해외 사용자의 경우), Youtube Clip, Streamable, Afreecatv VOD, Clippy, Kakao TV, Dailymotion, gfycat, Tiktok 링크를 Cafe 에서 바로 볼 수 있도록 비디오로 변환합니다.
- 네이버 카페에서 전체화면 후 해제 시 스크롤이 이상한 위치로 이동하는 문제를 해결해줍니다.
- 영화관 모드 (클립 등 비디오 감상에 적합하도록 본문을 더 넓게 표시)
- 카페에서 새로고침 시 메인 페이지 대신 마지막 탐색한 페이지로 이동 (상세 설정에서 활성화 필요)
- Cafe 에 삽입된 Video 에 Lazyload 를 적용하여 빠른 게시글 로딩
- 비디오 감상을 위한 동영상 플랫폼별 플레이어 레이아웃 개선 등

## Preview

- 아래 그림과 같이 Youtube Clip 의 섬네일이 있는 링크를 재생 가능한 비디오로 변환해줍니다.

![Preview](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_01.png)

## Install

Naver-Cafe-Clip-Loader 의 설치 방법을 설명합니다.

### STEP 1. ScriptManager

아래 링크에서 사용 중인 브라우저에 맞는 유저스크립트 관리 확장기능을 설치하세요.

- Chrome - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Firefox - [Tampermonkey](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
- Opera - [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- Safari - [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
- Edge - [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### STEP 2. UserScript

- 유저스크립트 관리 확장기능 설치 후, 아래의 링크를 클릭하여 스크립트를 설치합니다.
  - Install from [https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js)

이것으로 설치는 끝입니다. 즐겁게 사용하세요~

> 주의: 본 스크립트를 설치 및 사용하며 브라우저 과부하로 인한 응답 없음/뻗음으로 인한 데이터 손실이나 기타 발생하는 다른 문제에 대하여 개발자는 책임지지 않음(보고된 문제는 없음)  
> Naver Cafe 접속에 문제가 생기거나 클립 재생이 안 되는 문제 등이 발생하는 경우, Tampermonkey 의 관리 메뉴에서 이 스크립트를 끄거나 삭제해주세요.  
> 본 스크립트는 Tampermonkey 외의 스크립트 매니저에서는 정상 동작하지 않을 수 있습니다.  
> 동작 테스트는 Chrome, Firefox 에서만 했습니다.  

## Settings

- Naver Cafe 에 접속한 상태에서, Toolbar 의 Tampermonkey 아이콘 - Naver-Cafe-Clip-Loader - 상세 설정 열기를 클릭하여 설정을 변경할 수 있습니다.

![Open Settings Menu](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_02.png)

![Settings](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_03.png)

> 상세 설정을 새 창으로 열 때 AdBlock 사용, 팝업 차단 등에 의하여 문제가 발생하는 경우 현재 창으로 여세요.

## FAQ

- Q: 스크립트를 새 버전으로 업데이트 하려면 어떻게 하나요?<br />A: 주기적으로 자동 업데이트 되지만, Tampermonkey 대시보드에서 "최근 업데이트 일시"를 클릭하여 수동 업데이트가 가능합니다.<br />설치 링크를 다시 클릭하여 업데이트 할 수도 있습니다. [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js)<br /><br />
- Q: 스크립트를 업데이트 하기 싫은데 매일 업데이트 창이 떠요.<br />A: 다음과 같이 자동 업데이트를 해제하세요.<br />[Tampermonkey 대시보드] - [설치된 유저 스크립트] - [Naver-Cafe-Twitch-Clip_Loader] - [설정] - [업데이트 확인 체크 해제] - [저장 버튼 클릭]<br />![DisableAutoUpdate](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_disable_autoupdate.png)

## Bug report

- 버그 리포트 & 건의사항은 [Issues](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues)에 올려주시거나, 카페 글에 댓글로 남겨주시거나, 아래의 메일로 보내주세요.
- nomotg@gmail.com

## Change log

- Minor Change & 세부 변경 사항은 [CHANGELOG.md](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/blob/main/CHANGELOG.md)를 확인하세요.

### 1.0.2 - Dec. 28, 2022

- Youtube 동영상의 시작 시간 옵션(t=xxxx)이 무시되는 버그 수정

### 1.0.1 - Dec. 25, 2022

- Youtube 동영상이 종료된 후 하단 Control 조작 시 비디오가 Replay 되는 버그 수정
- Youtube Clip 의 스토리보드 이미지를 섬네일 대신 표시할 때 일부만 확대하여 표시합니다.

### 1.0.0 - Dec. 24, 2022

- **스크립트 실행 대상 웹사이트 추가로 인하여 수동 업데이트 화면이 나타날 수 있습니다. "업그레이드" 버튼을 눌러주세요. 업그레이드를 원치 않는 경우 FAQ 를 참고하여 자동 업데이트를 해제하세요.**
- 스크립트 이름이 Naver-Cafe-Clip-Loader 로 변경되었습니다.
- 내부 구조 개선으로 스크립트 동작이 빨라졌습니다.
- Naver 동영상이 많이 삽입된 글을 열람 시 브라우저가 멈추는 것을 개선합니다. (Cafe 에 삽입된 모든 Naver 동영상에 대해 게으른 로딩 방식을 적용)
- "섬네일 클릭 시" 옵션이 Naver 동영상에 대해서도 적용되도록 변경했습니다.
- Afreecatv VOD, Clippy, Kakao TV, Dailymotion, gfycat, Tiktok 에 대한 지원이 추가되었습니다.
- 이제 삽입된 모든 동영상의 비율이 16:9로 고정됩니다. (Tiktok, gfycat 등 일부 플랫폼 제외)
- Naver video 관련
  - Naver video 위에서 클릭한 상태로 마우스를 살짝 움직인 후 떼면 클릭이 씹히는 Naver Player 의 문제를 개선했습니다.
  - 이제 Naver video 화면을 더블클릭하여 전체화면을 할 수 있습니다.
- 기본 설정 변경
  - 클립 링크 변환 시점을 "페이지 로딩 시"가 기본이 되도록 변경했습니다.
  - Twitch 링크 변환 기능이 기본으로 꺼지도록 변경했습니다. 해외 사용자의 경우 상세 설정에서 다시 활성화해야 합니다.
- 그 외 여러 설정이 통합 및 개편 되었습니다. 상세 설정창에서 확인해보세요.

### 0.8.0b - Dec. 12, 2022

- 이제 상세 설정의 볼륨 컨트롤바를 항상 표시 옵션이 Youtube 영상에 대해서도 동작합니다.
- 볼륨 컨트롤바를 항상 표시하는 설정의 기본값을 off 로 변경했습니다.

### 0.8.0 - Dec. 08, 2022

- Streamable 링크의 섬네일을 비디오로 변환하는 기능을 지원합니다.
- Youtube 동영상이 많이 삽입된 글을 열람 시 브라우저가 멈추는 것을 개선합니다. (Cafe 에 삽입된 모든 Youtube 동영상에 대해 게으른 로딩 방식을 적용)
- 이제 Twitch 및 Naver Video 에서 볼륨 컨트롤러를 자동으로 숨기지 않습니다. (설정에서 원래대로 돌릴 수 있습니다.)

### 0.7.0 - Oct. 14, 2022

- 카페 글에 삽입된 Instagram 게시물이 제대로 표시되지 않는 문제 수정

### 0.6.7 - Sep. 24, 2022

- 이제 영화관 모드를 활성화하면 본문을 정가운데 위치하도록 정렬합니다.
  - 이전처럼 사용하려면 [상세 설정 페이지] - [숨겨진 고급 기능 설정]을 활성화하고 [본문 가운데 정렬] 옵션을 끄세요.

### 0.6.6 - Sep. 23, 2022

- 이제 "네이버 비디오를 항상 최대 품질로 시작" 옵션이 켜진 경우, 네이버 비디오 재생이 끝난 후 재시작 시 비디오 품질을 다시 최대로 설정합니다.
- [실험실] 글 목록에서 이미 읽은 글을 흐릿하게 표시하는 기능 추가

### 0.6.0 - Aug. 06, 2022

- 이번 버전에서는 Youtube, Twitch VOD, Naver Video  관련 기능이 추가되었으며, 이에 따라 확장기능이 동작해야 하는 웹사이트(domain)가 추가되어 자동 업데이트 될 때 업그레이드 확인 화면이 나타날 수 있습니다.
- Youtube 관련 기능 추가 (기본값으로 켜져있으므로, 사용을 원치 않으시는 분은 상세 설정에서 꺼주세요.)
  - Youtube Clip 링크의 섬네일을 클릭하여 비디오로 변환할 수 있는 기능이 추가되었습니다.
  - Youtube 비디오 시작 시 품질을 원하는 품질로 자동 설정할 수 있습니다.
  - Youtube 비디오를 16:9 비율로 고정합니다. (Short 비디오가 화면을 넘어가는 것 방지)
  - 일시정지 시 동영상 더보기를 숨깁니다.
- Twitch 관련 기능 추가
  - 이제 Twitch 클립 재생이 끝난 후 계속 시청 및 연관된 클립과 관련된 오버레이를 숨깁니다. (고급 설정에서 비활성화 가능)
  - Twitch VOD 섬네일에 대한 비디오 변환 기능을 지원합니다.
- Naver Video 관련 기능 추가
  - 네이버 비디오에 오류가 발생한 경우 플레이어를 다시 로드하기 위한 버튼을 표시합니다.
  - 네이버 비디오의 크기를 본문에 맞추고, 16:9 비율로 고정합니다.

### 0.5.1 - Jun. 09, 2022

- 이제 재생 중에도 화면을 빠르게 더블클릭 하면 전체화면이 됩니다.

### 0.5.0 - Jun. 08, 2022

- 기능 개선
  - 이제 "페이지 로딩 시" 옵션을 사용했을 때, 두 번째 섬네일 부터는 화면에 보이는 경우에만 비디오로 변환하여 브라우저가 덜 버벅이도록 합니다.
    - 스크롤을 빠르게 내릴 경우, 한 번에 많은 동영상을 로딩하느라 브라우저가 멈출 수 있으니 주의하세요.
- 기능 삭제
  - "클립 로드 시 음소거 (Legacy)" 옵션이 삭제되었습니다. "클립 로드 시 특정 사운드 볼륨(Volume)으로 설정" 기능을 대신 사용하세요.

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

<a href="https://www.buymeacoffee.com/nomomo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="60"></a>