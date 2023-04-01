import {DEBUG, NOMO_DEBUG, GM_setting} from "js/lib/lib";

////////////////////////////////////////////////////////////////////////////////////
// Settings
////////////////////////////////////////////////////////////////////////////////////
const _settings = {
    
    // video common
    convertMethod : {
        category:"videoCommon",
        category_name: "Video 공통",
        depth: 1,
        type: "radio",
        value: "autoLoad",
        title:"Video 링크 변환 시점 선택",
        desc:" - 페이지 로딩 시: 링크를 비디오로 자동 변환<br /> - 섬네일 클릭 시: 섬네일을 클릭할 때 비디오로 변환", radio: {autoLoad: {title: "페이지 로딩 시", value:"autoLoad"}, clickRequired: {title: "섬네일 클릭 시", value:"clickRequired"}},
    },
    autoPlayFirstClip: {
        category: "type",
        category_name: "페이지 로딩 시",
        depth: 2,
        under_dev:true,
        radio_enable_value: "autoLoad",
        type: "checkbox",
        value: false,
        title: "페이지 로딩과 동시에 첫 번째 동영상을 자동 재생",
        desc: "일부 동영상 플랫폼의 경우 지원하지 않을 수 있습니다."
    },
    autoPlayFirstClipMuted: {
        category: "type",
        depth: 2,
        under_dev:true,
        radio_enable_value: "autoLoad",
        type: "checkbox",
        value: true,
        title: "첫 번째 클립 자동 재생 시 음소거로 시작",
        desc: "일부 동영상 플랫폼의 경우 시작 시 음소거 기능을 지원하지 않아 소리가 켜진채로 자동 재생될 수 있으므로 주의하세요."
    },
    clickRequiredAutoPlay: {
        category: "type",
        category_name: "섬네일 클릭 시",
        depth: 2,
        under_dev:true,
        radio_enable_value: "clickRequired",
        type: "checkbox",
        value: true,
        title: "클립 로드 시 섬네일 클릭과 동시에 자동 재생",
        desc: ""
    },

    set_volume_when_stream_starts: {
        category:"videoCommon",
        depth: 1,
        type: "checkbox",
        value: false,
        title: {en:"Set the volume when stream starts", ko:"동영상 로드 시 특정 사운드 볼륨(Volume)으로 설정"},
        desc: "TIP: Chrome 계열 브라우저는 자동 재생되는 클립을 종종 음소거합니다. 음소거 문제를 피하려면 본 옵션을 사용해보세요(안 될 수도 있음)."
    },
    target_start_volume : {
        category:"advanced", depth:2,
        type: "text", value: 1.0, valid:"number", min_value:0.0, max_value:1.0,
        title:{en:"Volume", ko:"Volume"},
        desc:{en:"(Max Volume: 1.0, Mute: 0.0, Range: 0.0 ~ 1.0)", ko:"(Max Volume: 1.0, 음소거: 0.0, 범위: 0.0 ~ 1.0)"}
    },
    alwaysShowVolumeController : {
        category:"videoCommon",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"볼륨 컨트롤바를 항상 표시",
        desc:"Youtube, Twitch, Naver Video 에서 볼륨 컨트롤바를 항상 표시합니다."
    },
    videoWidth : {
        category:"videoCommon",
        depth:1,
        under_dev:true,
        type: "text",
        value: 100,
        valid:"number",
        min_value:1,
        max_value:100,
        title:"비디오 가로 사이즈(%)", desc:"본문 사이즈 대비 비디오 가로 사이즈를 결정합니다.<br />(Default: 100, Range: 1~100)" },
    autoPauseOtherClips: {
        category:"videoCommon",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: true,
        title:"비디오 재생 시 다른 재생 중인 비디오 일시정지",
        desc:"Youtube, Twitch Clip, Naver Video 를 재생 시, 다른 재생 중인 모든 비디오를 일시정지 합니다. 다음 동영상을 재생하기 위하여 이전 동영상을 정지할 필요가 없습니다. (엄청 편하다!)"
    },
    autoPlayNextClip: {
        category:"videoCommon",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: false,
        title:"다음 영상을 자동으로 이어서 재생",
        desc:"본문에 여러 개의 동영상이 존재할 때 동영상이 종료되면 다음 영상을 자동으로 재생합니다(편하다!). 일부 동영상 플랫폼의 경우 본 기능이 지원되지 않을 수 있습니다."
    },
    removeOriginalLinks: {
        category:"videoCommon",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: true,
        title:"글 본문에서 비디오의 원본 링크 삭제",
        desc:"삽입된 비디오와 동일한 링크가 글 본문에 존재하는 경우 삭제하여 보기 좋게 만듭니다. 원본 동영상 링크를 삭제하지 않으려면 본 기능을 끄세요."
    },
    hideTopOverlay: {
        category:"videoCommon",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"동영상 상단 메뉴를 숨김",
        desc:"동영상 위에 마우스를 올렸을 때 나타나는 상단 메뉴를 숨깁니다. 화면을 더욱 깔끔하게 표시할 수 있습니다.<br />Youtube Playlist 의 경우 본 옵션은 무시됩니다."
    },
    hidePauseOverlay: {
        category:"videoCommon",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: true,
        title:"동영상 일시정지 시 뜨는 메뉴를 숨김",
        desc:""
    },
    hideEndOverlay: {
        category:"videoCommon",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: true,
        title:"동영상 시청 종료 후 뜨는 추천 영상 메뉴등을 숨김",
        desc:""
    },
    hideDescription: {
        category: "videoCommon",
        depth: 1,
        under_dev:true,
        type: "checkbox",
        value: false,
        title: "동영상 타이틀 및 설명을 표시하지 않음",
        desc: "동영상 하단의 설명 부분 전체를 표시하지 않습니다."
    },
    hideDescriptionLogo: {
        category: "videoCommon",
        depth: 1,
        under_dev:true,
        type: "checkbox",
        value: false,
        title: "동영상 설명의 플랫폼 로고를 표시하지 않음",
        desc: "동영상 하단 설명에서 플랫폼 로고만을 숨깁니다."
    },
    exitFullscreenAfterEnd: {
        category: "videoCommon",
        depth: 1,
        type: "checkbox",
        value: true,
        title: "재생 완료 후 전체화면 자동 해제",
        desc: "동영상 재생이 완료되면 전체화면을 자동으로 해제합니다. 자동 전체화면 해제는 동영상 별 1회에 한해 적용됩니다."
    },

    // Naver Video
    useNaver: {
        category:"naver",
        category_name: "Naver Video",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Naver 관련 기능 사용",
        desc:"Naver video 와 관련한 스크립트 기능을 적용합니다. Naver 동영상 재생에 문제가 발생하는 경우 본 기능을 꺼주세요."
    },
    naverVideoPlayerType: {
        category:"naver",
        depth: 2,
        type: "combobox",
        value: "0",
        title:"Naver Video Player 타입",
        desc: "- Prism Player: 최신 플레이어 입니다. 체감 상 조금 더 빠릅니다.<br />- Legacy: 2023년 2월 이전에 적용되던 Naver Media Player 입니다. Lazyload가 적용되어 동영상이 아주 많은 글에서 좋은 퍼포먼스를 보일 수 있습니다. 이전 플레이어가 익숙하신 분들은 이 플레이어를 선택하세요.",
        options:{
            "0":{title:"Prism Player"},
            "1":{title:"Legacy"}
        }
    },
    // naverPrismVideoDisableVertical: {
    //     under_dev:true,
    //     category:"naver",
    //     depth: 3,
    //     type: "checkbox",
    //     value: false,
    //     title:"[Prism Player] #shorts를 일반 비디오처럼 표시",
    //     desc:"Prism Player 사용 시 #shorts 와 같이 세로로 길게 표시되는 비디오를 가로로 넓게 보여줍니다."
    // },
    naverVideoAutoMaxQuality: {
        category:"naver",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"네이버 비디오를 항상 최대 품질로 시작",
        desc:""
    },
    NaverVideoAddLoopBtn: {
        category:"naver",
        under_dev: true,
        depth: 2,
        type: "checkbox",
        value: false,
        title:"(Legacy) Loop 버튼 추가",
        desc:"플레이어에 Loop 버튼을 추가합니다. 재생시간이 긴 동영상을 오랜 시간 반복 재생 시 네트워크 에러가 발생할 수 있습니다. Player type 이 Legacy 인 경우에만 적용됩니다."
    },
    NaverVideoEnhancedClick: {
        category:"naver",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"네이버 비디오 화면 클릭 동작 개선",
        desc:"네이버 비디오 화면 위에서 클릭 후 살짝 마우스를 움직일 때 클릭이 씹히는 것을 개선합니다. 더블클릭으로 전체화면 모드를 활성화 합니다."
    },

    // Youtube
    useYoutube : {
        category:"youtube",
        category_name:"Youtube",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Youtube 관련 기능 사용",
        desc:"Youtube video 와 관련한 스크립트 기능을 적용합니다. Youtube 동영상 재생에 문제가 발생하는 경우 본 기능을 꺼주세요.",
    },
    youtubeSetQuality : {
        category:"youtube",
        depth: 2,
        type: "combobox",
        value: "hd1080",
        title:"Youtube 비디오 품질 자동 설정",
        desc:"선택한 비디오 품질을 자동으로 선택합니다. 선택한 품질이 존재하지 않을 경우, 그 다음으로 가장 좋은 품질이 설정됩니다.",
        options:{
            "default":{title:"사용 안 함"},
            "highres":{title:"highres (8K)"},
            "hd2880":{title:"hd2880 (5K)"},
            "hd2160":{title:"hd2160 (4K)"},
            "hd1440":{title:"hd1440 (1440p)"},
            "hd1080":{title:"hd1080 (1080p)"},
            "hd720":{title:"hd720 (720p)"},
            "large":{title:"large (480p)"},
            "medium":{title:"medium (360p)"},
            "small":{title:"small (240p)"},
            "tiny":{title:"tiny (144p)"},
        }
    },
    youtubeClipConvert : {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Youtube Clip 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://youtube.com/clip/xxxxx_xxxxxx-xxxxxx_xxxxx</span>",
    },
    youtubeClipDisableLoop: {
        category:"youtube",
        depth: 3,
        type: "checkbox",
        value: true,
        title:"Youtube Clip 을 반복 재생하지 않음",
        desc:"Youtube Clip의 Loop 기능을 강제로 비활성화 하여 클립 재생이 완료되면 비디오를 정지하도록 만듭니다.",
    },
    youtubeClipStoryBoardImage : {
        category:"youtube",
        depth: 3,
        type: "checkbox",
        value: true,
        title:"Youtube Clip 섬네일을 스토리보드로 대체",
        desc:"원본 비디오의 섬네일 대신 Clip 이 생성된 시간의 스토리보드를 섬네일로 표시합니다. (스토리보드: 재생바 타임라인에 마우스 올리면 뜨는 미리보기 이미지)",
    },
    useYoutubePlaylist : {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Youtube Playlist 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxx</span>",
    },
    // youtubeAlzartakSize : {
    //     category:"youtube",
    //     depth: 2,
    //     type: "checkbox",
    //     value: true,
    //     title:"알잘딱 사이즈 적용",
    //     desc:"(가능한 경우) 16:9 비율이 아닌 Youtube 영상을 너무 크지도 작지도 않고 화면에 적당히 꽉차게 사이즈를 조정합니다.",
    // },

    // Afreecatv
    useAftv : {
        category:"aftv",
        category_name:"Afreecatv",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Afreecatv VOD 링크를 비디오로 변환 ",
        desc:"<span style='color:#999'>예시) https://vod.afreecatv.com/player/11111111</span><br />하위 기능은 스크립트 설정에 따라 적용되지 않을 수도 있습니다.",
    },
    aftvAutoMaxQuality: {
        category:"aftv",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Afreecatv 비디오를 항상 최대 품질로 시작",
        desc:""
    },
    aftvShowChat: {
        category:"aftv",
        under_dev: true,
        depth: 2,
        type: "checkbox",
        value: false,
        title:"가능한 경우 채팅을 표시",
        desc:""
    },
    aftvBeautifier: {
        category:"aftv",
        under_dev: true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Afreecatv 플레이어를 더욱 보기 좋게 만듦",
        desc:""
    },

    
    // Twitch
    useTwitch : {
        category:"others",
        category_name:"그 외",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"Twitch Clip 및 VOD 링크를 비디오로 변환",
        desc:"한국 거주 시청자는 사용할 수 없습니다."
    },
    play_and_pause_by_click : {
        category:"others",
        debug:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Twitch Clip 페이지 스타일로 표시",
        desc:"클립 화면을 클릭하여 재생 및 일시정지 되도록 만듭니다. (편하다!)<br />일시정지 시 상단 오버레이와 재생 버튼을 숨깁니다. 재생 중 화면을 더블 클릭하여 전체화면을 할 수 있습니다."
    },
    twitch_clip_time_update_after_end : {
        category:"others",
        debug:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"클립 재생이 끝난 후 동영상 탐색 동작 개선",
        desc:"클립 재생이 끝나고 동영상을 탐색한 경우, 클립 재시작 시 마지막 탐색한 시간부터 시작하도록 동작을 개선합니다."
    },

    useStreamable : {
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Streamable 링크를 비디오로 변환 ",
        desc:"<span style='color:#999'>예시) https://streamable.com/xxxxxxxx</span>",
    },

    useTwip :{
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Twip Clip & VOD 링크를 비디오로 변환 ",
        desc:"<span style='color:#999'>예시) https://vod.twip.kr/vod/xxxxxxxxx<br />https://vod.twip.kr/clip/xxxxxxxxx</span>",
    },

    useKakao :{
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Kakao TV 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://tv.kakao.com/v/1111111</span>",
    },

    useDailymotion :{
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Dailymotion 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://www.dailymotion.com/video/xxxxxxx</span>",
    },
    
    useGfycat :{
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"gfycat 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://gfycat.com/xxxxxxxxxxxxxxxx</span>",
    },

    
    useTiktok :{
        category:"others",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Tiktok 링크를 비디오로 변환",
        desc:"<span style='color:#999'>예시) https://www.tiktok.com/@xxxxxxx/video/111111111</span>",
    },

    // // Vimeo
    // useVimeo : {
    //     category:"vimeo",
    //     category_name:"Vimeo",
    //     depth: 1,
    //     type: "checkbox",
    //     value: true,
    //     title:"Vimeo 관련 기능 사용",
    //     desc:"",
    // },


    fixFullScreenScrollChange: {
        category:"etc",
        category_name: "편의 기능",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"⭐ 네이버 카페 전체화면 스크롤 동작 개선",
        desc:"비디오를 전체화면 후 해제 시 스크롤 위치가 변경되는 문제를 개선합니다."
    },
    improvedRefresh:{
        category:"etc",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"⭐ 네이버 카페 새로고침 개선",
        desc:"새로고침 시 첫 화면 대신 마지막으로 탐색한 페이지를 불러옵니다."
    },
    naverBoardDefaultArticleCount: {
        category:"etc",
        depth: 1,
        type: "combobox",
        value: "0",
        title:"⭐ 게시판 글 기본 표시 개수 설정",
        desc:"",
        options:{
            "0":{title:"기본값 사용"},
            "5":{title:"5"},
            "10":{title:"10"},
            "15":{title:"15"},
            "20":{title:"20"},
            "30":{title:"30"},
            "40":{title:"40"},
            "50":{title:"50"}
        }
    },
    alwaysShowFavoriteBoard:{
        under_dev:true,
        category:"etc",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"⭐ 즐겨찾는 게시판을 항상 펼침",
        desc:""
    },
    showDarkModeBtn : {
        category:"etc",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: false,
        title:"[실험실] 어두운 모드 버튼을 표시",
        desc:"카페 최상단 메뉴에 '어두운 모드' 버튼을 표시합니다."
    },
    visitedArticleStyle : {
        category:"etc",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: false,
        title:"[실험실] 글 목록에서 읽은 글의 제목을 흐릿하게 표시",
        desc:""
    },

    useTheaterMode : {
        category:"theaterMode",
        category_name: "영화관 모드",
        under_dev:true,
        depth: 1,
        type: "checkbox",
        value: true,
        title:"영화관 모드 버튼을 표시",
        desc:"카페 최상단 메뉴에 '영화관 모드' 버튼을 표시합니다. 영화관 모드에서는 카페 글을 더 넓게 표시하고, 네이버, 유투브, 트위치 동영상을 더 크게 표시합니다."
    },
    theaterModeAlignCenter : {
        category:"theaterMode",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"본문 가운데 정렬",
        desc:"본문이 화면의 정 가운데 위치하도록 레이아웃을 수정합니다."
    },
    useTheaterModeContentWidth : {
        category:"theaterMode",
        depth: 2,
        under_dev:true,
        type: "text",
        value: 1100,
        valid:"number",
        min_value:400,
        max_value:10000,
        title:"본문(컨텐츠) 가로 사이즈(px)",
        desc:"영화관 모드 시 카페 컨텐츠의 가로 사이즈를 결정합니다.<br />(Default: 1100, Range: 400~10000, 권장: 700~1400)",
    },
    under_dev : { category:"advanced", category_name:"고급", depth:1, type: "checkbox", value: false, title:"숨겨진 고급 기능 설정", desc:"숨겨진 고급 기능과 실험실 기능을 직접 설정할 수 있습니다." },
};
GM_addStyle(`
body #GM_setting {min-width:800px;}
body #GM_setting .GM_setting_depth1 .GM_setting_list_head{width:370px;}
body #GM_setting .GM_setting_depth2 .GM_setting_list_head{width:340px;}
body #GM_setting .GM_setting_depth3 .GM_setting_list_head{width:310px;}

#GM_setting li[GM_setting_key="set_volume_when_stream_starts"]
{
    border-top: 1px solid #ccc !important;
    margin-top: 10px !important;
    padding-top: 10px !important;
}
#GM_setting .GM_setting_desc {
    letter-spacing: -0.3px;
}

#theaterModeBtn, #darkModeBtn {
    display: inline-block;
    float: left;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
}

html body .se-viewer .se-module-oglink.twitchClipFound:before{
    display:none;
}
`);
window.GM_setting = GM_setting;

export default async function GM_SETTINGS_INIT(){
    await GM_setting.init("GM_SETTINGS", {"DEBUG":DEBUG, "SETTINGS":_settings, "CONSOLE_MSG":NOMO_DEBUG, "MULTILANG":false});
}