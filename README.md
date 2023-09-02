# Naver-Cafe-Clip-Loader

- 본 UserScript 는 네이버 카페 글에서 자체 지원되지 않는 외부 동영상 링크를 재생 가능한 비디오로 변환해줍니다.
- Twitch Clip & VOD, Youtube Clip, Streamable, Afreecatv VOD, Twip VOD & Clip, Kakao TV, Dailymotion, gfycat, Tiktok 링크를 Cafe 에서 바로 볼 수 있도록 비디오로 변환합니다.
- 네이버 카페에서 전체화면 후 해제 시 스크롤이 이상한 위치로 이동하는 문제를 해결해줍니다.
- Naver 비디오를 최대 품질로 자동 재생합니다.
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

아래 리스트에서 본인이 사용 중인 브라우저에 맞는 링크에 접속한 후, 유저스크립트 관리 확장기능인 Tampermonkey 를 설치하세요.

- Chrome - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Firefox - [Tampermonkey](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
- Opera - [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- Safari - [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
- Edge - [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### STEP 2. UserScript

- 유저스크립트 관리 확장기능 설치 후 아래의 링크를 클릭하세요. 이후 뜨는 창에서 "설치" 버튼을 눌러 스크립트를 설치합니다.
  - Install from [https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js)

이것으로 설치는 끝입니다. 즐겁게 사용하세요~

> 주의: 본 스크립트를 설치 및 사용하며 브라우저 과부하로 인한 응답 없음/뻗음으로 인한 데이터 손실이나 기타 발생하는 다른 문제에 대하여 개발자는 책임지지 않음(보고된 문제는 없음)  
> 본 스크립트는 Tampermonkey 외의 스크립트 매니저에서는 정상 동작하지 않을 수 있습니다.

## Settings

- Naver Cafe 에 접속한 상태에서, Toolbar 의 Tampermonkey 아이콘 - Naver-Cafe-Clip-Loader - 상세 설정 열기를 클릭하여 설정을 변경할 수 있습니다.

![Open Settings Menu](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_02.png)

![Settings](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_preview_03.png)

> 상세 설정을 새 창으로 열 때 AdBlock 사용, 팝업 차단 등에 의하여 문제가 발생하는 경우 현재 창으로 여세요.

## FAQ

- Q: 스크립트를 새 버전으로 업데이트 하려면 어떻게 하나요?<br />A: 주기적으로 자동 업데이트 되지만, Tampermonkey 대시보드에서 "최근 업데이트 일시"를 클릭하여 수동 업데이트가 가능합니다.<br />설치 링크를 다시 클릭하여 업데이트 할 수도 있습니다. [Install](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/raw/main/Naver-Cafe-Clip-Loader.user.js)<br /><br />
- Q: 스크립트를 업데이트 하기 싫은데 매일 업데이트 창이 떠요.<br />A: 다음과 같이 자동 업데이트를 해제하세요.<br />[Tampermonkey 대시보드] - [설치된 유저 스크립트] - [Naver-Cafe-Twitch-Clip_Loader] - [설정] - [업데이트 확인 체크 해제] - [저장 버튼 클릭]<br />![DisableAutoUpdate](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_disable_autoupdate.png)<br /><br />
- Q: 갑자기 Youtube 또는 Naver video 재생이 안 됩니다.<br />A: 설정에서 "Youtube 관련 기능 사용" 또는 "Naver 관련 기능 사용" 을 끄시고, 증상을 개발자에게 제보해주세요!<br /><br />
- Q: Twitch Clip 을 카페에서 바로 보려면 어떻게 하나요?<br />A: 해외 사용자의 경우, 설정에서 "Twitch Clip 및 VOD 링크를 비디오로 변환" 기능을 활성화 하세요.

## Bug report

- 버그 리포트 & 건의사항은 [Issues](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/issues)에 올려주시거나, 카페 글에 댓글로 남겨주시거나, 아래의 메일로 보내주세요.
- nomotg@gmail.com

## Change log

- 모든 Minor Change & 세부 변경 사항은 [CHANGELOG.md](https://github.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/blob/main/CHANGELOG.md)를 확인하세요.

### 1.3.0 - Aug. 26, 2023

- 새로운 기능
  - "동영상 재생 시 자동 스크롤" 기능 추가 (기본값 켜짐)
    - 비디오가 재생될 때 비디오가 현재 보이는 영역에 위치해있지 않다면 적절한 위치로 스크롤 해줍니다.
    - 만약 스크롤이 자동으로 이동하는 것을 원하지 않거나, 비디오가 재생될 때 스크롤 위치가 이상하게 변경되는 경우 본 기능을 끄세요.
  - "스크롤 직후 동영상 재생 동작 개선" 기능 추가 (기본값 켜짐)
    - Chrome 브라우저에서 마우스 스크롤을 한 직후 Youtube 동영상을 클릭했을 때 재생/일시정지가 되지 않거나, 여러번 화면을 클릭해야지만 동영상이 재생되는 불편함을 해결해줍니다.
    - 만약 Youtube 비디오를 클릭해도 재생/일시정지 되지 않는 버그가 발생하는 경우 본 기능을 끄거나, 하단 바의 재생 버튼을 눌러 재생하세요.
  - "Twip 비디오를 항상 최고 품질로 시작" 기능 추가
- 기능 개선
  - 이제 Twip 비디오에도 Volume 
- 버그 수정
  - "페이지 로딩과 동시에 첫 번째 동영상을 자동 재생" 기능이 Naver Prism Player 에 대해 동작하지 않는 문제를 수정했어요.

### 1.2.7 - July 25, 2023

- 특정 환경에서 Naver video 의 비디오 품질 표시가 두 번 표시되는 문제가 있어요. 개발자 환경에서 문제를 재현하지는 못했지만 이를 예방하기 위한 코드를 삽입했어요. - 2트

### 1.2.6 - July 21, 2023

- 기능 개선
  - 네이버 비디오의 "Loop 버튼 추가" 기능이 이제 Naver Prism Player 에 대해서도 지원됩니다. 기본값으로 꺼져있으므로 루프 기능 사용을 원하시면 설정에서 켜세요.
- 그 외
  - 특정 환경에서 Naver video 의 비디오 품질 표시가 두 번 표시되는 문제가 있어요. 개발자 환경에서 문제를 재현하지는 못했지만 이를 예방하기 위한 코드를 삽입했어요.

### 1.2.5 - July 6, 2023

- 버그 수정
  - 본문에 삽입된 Youtube 동영상 주소에 playlist 와 관련된 파라미터가 있을 때, 실제로 해당 playlist 가 존재하지 않는 경우 "이 동영상을 볼 수 없습니다." 라고 표시되는 문제가 있었어요. 이제 일반 Youtube 동영상에 대해 playlist 관련 파라미터를 무시하도록 수정했어요. https://youtube.com/playlist?list=PLxxxxxxxx 와 같은 형태의 주소는 이전처럼 플레이리스트 형태로 보여줘요.

### 1.2.4 - July 1, 2023

- "동영상 시청 종료 후 뜨는 추천 영상 메뉴등을 숨김" 기능을 업데이트 했어요.
- 버그 수정 및 안정성 개선

### 1.2.2~3 - June 29, 2023

- Youtube Shorts 비디오의 가로 사이즈가 작으면(특히 1080p 해상도의 경우) 볼륨 조절이 불가능한 문제 때문에 비디오 가로 사이즈를 본문에 맞게 키워 좌우 레터박스가 표시되도록 변경했어요.
- "Shorts 비디오 크기 자동 조절"시 비디오가 이전보다 더 크게, 비디오가 화면 가득 표시되도록 변경했어요. (1080p 해상도 사용자를 위함)<br />![v1.2.3](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/230629_shortsAutoResizeType.png)
- 고급 사용자를 위해 "Shorts 비디오 크기 자동 조절 타입" 기능을 추가했어요. 기본값은 "화면 가득" 입니다. 변경하려면 "숨겨진 고급 기능 설정"을 활성화하세요.
  - 화면 가득: 현재 브라우저의 화면 높이에 맞게 세로 비디오의 사이즈를 변경합니다. 스크롤을 살짝하면 비디오를 화면 가득 볼 수 있습니다. (1080p 해상도 권장)
  - 적당히: 스크롤 없이 글 제목과 세로 비디오를 한 눈에 볼 수 있도록 비디오 사이즈를 적당히 변경합니다. (4K 해상도 권장)

### 1.2.1 - June 25, 2023

- 새로운 기능
  - "Youtube Shorts 일시정지 시 화면이 어두워지는 효과를 제거" 기능 추가
    - Youtube Shorts 를 일시정지 하면 화면이 어두워지는 것이 맘에 들지 않아서 추가했어요.
    - 기본으로 켜져있으므로 맘에 들지 않으면 설정에서 "숨겨진 고급 기능 설정"을 활성화하고 본 옵션을 끄세요.
    - 본 기능은 "Shorts 비디오 크기 자동 조절" 옵션을 켜야 효과가 있습니다.
- 버그 수정
  - "Youtube Clip 섬네일을 스토리보드로 대체" 기능이 동작하지 않는 문제 수정
    - Youtube Clip 섬네일 대신 클립이 생성된 시점의 타임라인에 마우스를 올렸을 때 뜨는 이미지를 보여주는 기능이 동작하지 않아서 고쳤어요.
  - 영화관 모드에서 이미지 캡션이 이상하게 정렬되는 문제 수정
- 그 외
  - "Shorts 비디오 크기 자동 조절" 기능을 정식 기능으로 변경하고, 기본으로 켜지도록 바꿨어요. (맘에 들지 않거나 알 수 없는 문제가 발생하면 설정에서 끄세요.)
  - 카페 관리 화면에서 영화관 모드가 비활성화 되도록 변경했어요.

### 1.2.0 - May 22, 2023

- 새로운 기능
  - "🧪 Shorts 비디오 크기 자동 조절" 기능 추가
    - 세로 비디오(예: Shorts)의 크기를 보기 좋은 사이즈로 맞춰주는 기능을 추가했어요.<br />![shortsResize](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/230521_shortsResize.png)
    - 세로 비디오의 크기를 현재 브라우저의 화면 높이에 맞게 키워줍니다.
    - 네이버 비디오 및 Youtube 에 적용됩니다.
    - 현재 실험실 기능이며 상세 설정에서 직접 활성화 해야합니다.
  - "업데이트 알림 표시" 기능 추가
    - 스크립트가 업데이트 되면 작은 팝업으로 업데이트가 되었음을 10초간 표시합니다.
    - 업데이트 알림은 다음 버전 업데이트 때 부터 표시됩니다.
    - 상세 설정에서 업데이트 알림을 비활성화 할 수 있습니다.
- 디스플레이 해상도 및 배율에 따라 Youtube 비디오 좌측에 까만 줄이 표시될 수 있는 문제를 일부 개선했어요.
- "동영상 시청 종료 후 뜨는 추천 영상 메뉴등을 숨김" 기능이 켜진 경우 21:9 비율 비디오 등에서 상하단 레터박스가 이상하게 표시되는 문제를 고쳤어요.

### 1.1.4 - May 09, 2023

- 특정 조건에서 상단 메뉴의 영화관 모드, 어두운 모드 버튼이 여러번 표시되는 버그를 고쳤어요.

### 1.1.3 - Mar. 18, 2023

- Naver Prism Player 사용 시 #shorts 와 같이 세로로 길게 표시되는 비디오의 경우 화질 변경 메시지를 숨깁니다.

### 1.1.2 - Mar. 10, 2023

- 특정 조건에서 Naver 하단 설명란이 잘못 삽입되는 문제 수정

### 1.1.1 - Mar. 02, 2023

- 제목이 긴 Naver 비디오에서 비디오 하단 설명란의 특수문자가 깨지는 문제 수정

### 1.1.0 - Mar. 01, 2023

- 2023년 2월, Naver Cafe 에 사용되는 기본 Video Player 가 Naver TV에 사용되는 플레이어와 동일한 Prism Player 로 변경되었어요. 스크립트는 Naver Cafe 의 변경과 상관 없이 이전 플레이어를 사용하고 있었는데요, 이제 이러한 변화에 맞게 스크립트도 Naver Video 에 대한 기본 Player 로 Prism Player 를 사용합니다. 이전 플레이어에 적용되던 자동 최대 화질 설정, 클릭 씹힘 개선, 시작 볼륨 설정, 볼륨 플레이어를 항상 표시, 배경화면을 클릭하여 재생, 에러 발생 시 Reload 등 대부분의 기능을 새 Player 에 대해서도 지원합니다. 혹시 심각한 문제가 발생하는 경우 설정에서 Naver Video Player 타입을 "Legacy" 로 설정하여 기존 플레이어를 사용하거나, "Naver 관련 기능 사용" 옵션을 꺼주세요.
- Naver Video Player 타입을 설정할 수 있는 기능을 추가했어요.
  - Prism Player: Naver TV 에 사용되는 플레이어와 동일한 최신 플레이어 입니다. 체감 상 조금 더 빠릅니다. 기본 플레이어 입니다.
  - Legacy: 2023년 2월 이전에 적용되던 Naver Media Player 입니다. Lazyload가 적용되어 동영상이 아주 많은 글에서 좋은 퍼포먼스를 보일 수 있습니다. 기존 플레이어가 더 익숙하신 분들은 이 플레이어를 쓰세요.
- 그 외
  - "동영상 설명의 플랫폼 로고를 표시하지 않음" 기능을 추가했어요. (숨겨진 고급 기능 설정에 체크해야 보여요.)
  - Afreeca video 파싱 중 에러가 발생한 경우 무한 로딩이 발생하는 문제 수정. 이제 가능한 경우 "존재하지 않는 VOD입니다."와 같은 메시지를 표시합니다.

### 1.0.8 - Feb. 15, 2023

- Twip VOD & Clip 변환 기능 추가

### 1.0.7 - Feb. 10, 2023

- Clippy 서비스 종료로 인한 기능 삭제

### 1.0.6 - Jan. 24, 2023

- "Youtube Clip 의 Loop 기능 강제 비활성화" 기능이 추가되었습니다. 이제 Youtuce Clip 이 재생 완료된 후 자동으로 Replay 하지 않습니다.
- "Youtube Clip 섬네일을 스토리보드 이미지로 대체" 옵션이 켜진 경우 Embed 된 Youtube 페이지 내에서도 섬네일을 스토리보드 이미지로 대체합니다. (동일한 Youtube 동영상으로부터 파생된 Clip 들에 대해 항상 같은 섬네일을 보여주는 대신 타임라인에 마우스를 올렸을 때 뜨는 스토리보드 이미지를 보여줍니다.)

### 1.0.5 - Jan. 04, 2023

- 이제 Youtube Playlist 의 경우 자동 재생하지 않으며 상단 메뉴를 숨기지 않습니다. 가능한 경우 플레이어 로드 후 동영상 목록을 자동으로 펼칩니다.
- 특정 조건에서 스크롤을 위아래로 반복하면 비디오 화면이 작아지던 버그 수정

### 1.0.4 - Jan. 01, 2023

- Youtube Playlist 링크를 비디오로 변환하는 기능 추가. 예시) https://youtube.com/playlist?list=PLxxxxxxxx
- 버그 수정 및 안정성 개선

### 1.0.3 - Dec. 31, 2022

- 재생 완료 후 전체화면 자동 해제 옵션 추가 (기본으로 켜져있으므로 마음에 들지 않으면 설정에서 끄세요)
- Clippy 동영상 제목을 파싱하여 가져와 표시하도록 개선

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