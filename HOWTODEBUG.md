# How to debug

본 문서에서는 DEBUG 모드를 활성화 하는 방법과 문제를 리포트 하는 방법에 대해 설명합니다.

## DEBUG 모드 On/Off

상세 설정 창을 연 후, 최하단의 GM Setting vX.X.X 부분을 빠르게 5회 클릭하면 DEBUG 모드가 On/Off 됩니다.

![DebugToggle](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_debug_01.png)

## 버그 리포트 방법

먼저 사용 중인 브라우저와 Tampermonkey 가 최신 버전인지 확인해주시고, 스크립트를 최신 버전으로 재설치 한 후에도 문제가 계속 발생하는지 확인해주세요.

1. DEBUG 모드를 활성화 한 후, Naver Cafe 에 접속합니다.
2. F12 키를 눌러 개발자모드를 활성화 한 후 콘솔 탭을 엽니다.
3. 문제가 발생한 카페 글 또는 페이지에 접속합니다.
4. 콘솔 탭에 있는 모든 내용을 이미지로 캡쳐한 후, 캡쳐한 이미지, 사용 중인 브라우저 이름, 문제되는 페이지 링크, 증상 설명을 개발자에게 보내주세요. (nomotg@gmail.com)

![CheckDebugInfo](https://raw.githubusercontent.com/nomomo/Naver-Cafe-Twitch-Clip-Loader/master/images/NCTCL_debug_02.png)

## 트러블 슈팅

1. 사용 중인 다른 확장기능과 스크립트가 충돌하여 문제가 발생할 수 있으므로, 다른 확장기능들을 비활성화 후 문제가 재현되는지 확인해보세요.
