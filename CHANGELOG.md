# Changelog

이 프로젝트에 대한 모든 주목할만한 변경 사항은 이 파일에 기록됩니다.

## 0.5.2 - Jul. 05, 2022

- Minor Changes
  - 타이틀 폰트 컬러 수정

## 0.5.1 - Jun. 09, 2022

- Minor Changes
  - 이제 재생 중에도 화면을 빠르게 더블클릭 하면 전체화면이 됩니다. (숨겨진 "Twitch Clip 페이지 스타일로 표시" 기능에 포함됨. 기본값 켜짐.)

## 0.5.0 - Jun. 08, 2022

- 기능 개선
  - 이제 "페이지 로딩 시" 옵션을 사용했을 때, 두 번째 섬네일 부터는 화면에 보이는 경우에만 비디오로 변환하여 브라우저가 덜 버벅이도록 합니다.
    - 스크롤을 빠르게 내릴 경우, 한 번에 많은 동영상을 로딩하느라 브라우저가 멈출 수 있으니 주의하세요.
- 기능 삭제
  - "클립 로드 시 음소거 (Legacy)" 옵션이 삭제되었습니다. "클립 로드 시 특정 사운드 볼륨(Volume)으로 설정" 기능을 대신 사용하세요.
- Minor Changes
  - 최초 재생되지 않은 클립에 대하여 재생 버튼을 더 깔끔하게 표시합니다.

## 0.4.3 - Jun. 06, 2022

- Minor Changes
  - 이제 트위치 클립 링크를 감지하면 레이아웃을 미리 변환합니다.
  - "화면 클릭으로 클립 재생 및 일시정지" 기능의 이름이 "Twitch Clip 페이지 스타일로 표시"로 변경되었습니다.
    - 일시정지 시 상단 오버레이와 재생 버튼 등이 Twitch Clip 페이지에서처럼 표시되지 않게 됩니다.

## 0.4.2 - Jun. 06, 2022

- Minor Changes
  - 영화관 모드 On/Off 에 따라 삽입된 동영상 크기를 동적으로 변경합니다.

## 0.4.0 - Jun. 06, 2022

- 실험실 기능 추가
  - 즐겨찾는 게시판을 항상 펼침
  - 어두운 모드
- Minor Changes
  - 이제 새로고침 없이 영화관 모드를 켜고 끌 수 있습니다.
  - 이제 게시판 글 기본 개수 설정 기능이 즐겨찾는 게시판에도 지원됩니다.
  - Twitch 클립 링크의 타이틀에 Twitch 로고를 표시합니다.

## 0.3.0 - Jun. 05, 2022

- 실험실 기능 추가
  - 네이버 카페 새로고침 개선
    - 네이버 카페에서 새로고침 시, 메인 화면 대신 이전에 탐색한 페이지를 불러오도록 하는 실험실 기능을 추가했어요.
- Minor Changes
  - 이제 클립 재생 종료 화면에서 배경 화면을 클릭 시 클립을 재시작 합니다.
  - 이제 게시판 글 기본 개수 설정 기능이 검색 결과에도 지원됩니다.
- 버그 수정
  - "화면 클릭으로 클립 재생 및 일시정지" 기능이 옵션 조합에 따라 작동하지 않을 수 있던 문제 수정

## 0.2.0 - Jun. 04, 2022

- 기능 추가
  - 영화관 모드 옵션 추가
    - 카페 화면 최상단의 '영화관 모드' 버튼을 클릭하여 영화관 모드를 활성화할 수 있습니다.
    - 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다.
    - 상세 설정 창에서 "숨겨진 고급 기능 설정"에 체크한 후, 영화관 모드에서의 컨텐츠 사이즈를 직접 설정할 수 있습니다.
- Minor Changes
  - 이제 동영상으로 변환하기 전 섬네일의 크기를 동영상 크기에 맞게 미리 조정합니다.
  - NAVER 동영상 타이틀에 NAVER 로고를 표시합니다.

## 0.1.2, 0.1.3 -Jun. 04, 2022

- 음소거 관련 문제를 좀 더 잘 회피하도록 수정

## 0.1.1 - Jun. 04, 2022

- 기능 추가
  - "화면 클릭으로 클립 재생 및 일시정지" 기능 추가 (기본값: 켜짐)
    - 클립 페이지에 직접 접속했을 때 처럼, 클립 화면을 클릭하면 재생 및 일시정지가 됩니다.
    - 기본값으로 켜져 있으며 설정 창에서는 숨겨져 있습니다. 클립 화면을 클릭했을 때 알 수 없는 문제가 발생하면 상세 설정창에서 "숨겨진 고급 기능 설정"에 체크한 후 본 기능을 끄세요.

## 0.1.0 - Jun. 04, 2022

- 기능 추가
  - "클립 로드 시 특정 사운드 볼륨(Volume)으로 설정" 기능 추가
    - 클립 자동 재생 시 Chrome 계열 브라우저가 클립을 강제로 음소거 하는 것을 피하려면 본 기능을 사용해보세요.

## 0.0.9 - Mar. 31, 2022

- 기능 추가
  - 상세 설정 창을 새 창을 띄우지 않고 바로 열 수 있도록 "상세 설정 열기 (현재 창)" 버튼을 추가했습니다. (AdBlock 사용자를 위함)

## 0.0.8 - Mar. 20, 2022

- 기능 추가
  - 게시판에서 기본 글 표시 개수를 설정할 수 있는 기능 추가
- 자주 수정되지 않는 고급 기능을 숨기고 원할 때 볼 수 있도록 하여, 설정 화면을 깔끔하게 만들었어요.

## 0.0.7 - Mar. 19, 2022

- 버그 수정
  - 스크립트 설치 후 스크롤 바가 작아지는 버그 수정

## 0.0.6 - Mar. 18, 2022

- 기능 추가
  - 네이버 비디오를 항상 최대 화질로 시작: 네이버 비디오를 로드할 때 선택 가능한 최대 화질을 자동으로 선택해주는 설정을 추가했어요. (편하다!)
  - 비디오 재생 시 다른 재생 중인 비디오 일시정지: 이제 Twitch Clip 뿐만이 아니라 Naver Video 를 재생 시에도 다른 재생 중인 모든 Naver Video 와 Twitch Clip 을 일시정지 해줍니다. 다음 동영상을 재생하기 위하여 이전 동영상을 정지할 필요가 없습니다. (엄청 엄청 편하다!)
    - 네이버 비디오 관련 재생 문제가 발생 시 "네이버 비디오에도 적용" 옵션을 끄세요.
- "다음 클립을 자동으로 이어서 재생" 옵션이 설치 직후 비활성화 되도록 기본 옵션을 바꾸었어요.

## 0.0.5 - Apr. 10, 2022

- 설정 화면에서 "링크 클릭 시" 옵션을 변경할 수 없는 버그 수정

## 0.0.4 - Apr. 10, 2022

- 기능 추가
  - 클립 재생 시 다른 클립 일시정지: Twitch Clip 재생 시, 자동으로 다른 모든 클립을 일시정지 합니다. 다음 클립을 재생하기 위하여 이전 클립을 정지할 필요가 없습니다. (엄청 편하다!)
  - 다음 클립을 자동으로 이어서 재생: 본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생합니다.
- 후원 링크를 추가했어요.

## 0.0.3 - Apr. 10, 2022

- 기능 추가
  - 전체화면 스크롤 동작 개선: 네이버 카페에서 비디오를 전체화면 한 후 해제했을 때, 스크롤이 다른 위치로 변경되지 않도록 하는 기능을 추가했습니다. Twitch Clip 과 네이버 비디오 모두에 적용됩니다.
  - 원본 링크 삭제: 클립 링크를 비디오로 변환 시, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다.
- 클립 타이틀과 링크를 더 깔끔하게 표시합니다.

## 0.0.2 - Mar. 02, 2022

- 페이지 로딩 시점에 변환할 개수 제한 설정 추가 (클립 많은 글에서 심하게 느려지는 현상 방지)
- https://www.twitch.tv/[스트리머 ID]/clip/[클립 ID] 형태의 링크 감지하도록 함

## 0.0.1 - Jan. 09, 2022

- 최초 커밋