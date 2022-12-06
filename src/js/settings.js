import {DEBUG, NOMO_DEBUG, GM_setting} from "js/lib";

////////////////////////////////////////////////////////////////////////////////////
// Settings
////////////////////////////////////////////////////////////////////////////////////
const _settings = {
    // Twitch
    use : {
        category:"general",
        category_name: "Twitch",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Twitch 클립 링크를 비디오로 변환",
        desc:""
    },
    method : {
        category:"type",
        category_name:"동작 방식",
        depth: 2,
        type: "radio",
        value: "clickRequired",
        title:"클립 링크 변환 시점 선택",
        desc:" - 페이지 로딩 시: 섬네일을 비디오로 자동 변환<br /> - 섬네일 클릭 시: 섬네일을 클릭할 때 비디오로 변환", radio: {autoLoad: {title: "페이지 로딩 시", value:"autoLoad"}, clickRequired: {title: "섬네일 클릭 시", value:"clickRequired"}},
    },
    autoLoadLimit : {
        category: "type",
        category_name: "페이지 로딩 시",
        depth:3,
        radio_enable_value: "autoLoad",
        type: "text",
        value: 3,
        valid:"number",
        min_value:1,
        max_value:200,
        title:"최대 자동 변환할 클립 개수 제한", desc:"이 값을 크게 설정하고 스크롤을 빠르게 내릴 경우 한 번에 많은 비디오를 로딩하느라 브라우저가 멈출 수 있으니 주의하세요. 최대 개수를 초과한 클립부터는 섬네일을 클릭하여 비디오로 변환할 수 있습니다. (Default: 3, Range: 1~200)",
    },
    autoPlayFirstClip: {
        category: "type",
        depth: 3,
        under_dev:true,
        radio_enable_value: "autoLoad",
        type: "checkbox",
        value: false,
        title: "페이지 로딩과 동시에 첫 번째 클립을 자동 재생",
        desc: ""
    },
    autoPlayFirstClipMuted: {
        category: "type",
        depth: 3,
        under_dev:true,
        radio_enable_value: "autoLoad",
        type: "checkbox",
        value: true,
        title: "첫 번째 클립 자동 재생 시 음소거로 시작",
        desc: ""
    },
    clickRequiredAutoPlay: {
        category: "type",
        category_name: "섬네일 클릭 시",
        depth: 3,
        radio_enable_value: "clickRequired",
        type: "checkbox",
        value: true,
        title: "클립 로드 시 섬네일 클릭과 동시에 자동 재생",
        desc: ""
    },

    // Twitch 고급
    set_volume_when_stream_starts: {
        category: "advanced", 
        category_name: "Twitch 고급",
        depth: 2,
        under_dev:true,
        type: "checkbox",
        value: false,
        title: {en:"Set the volume when stream starts", ko:"클립 로드 시 특정 사운드 볼륨(Volume)으로 설정"},
        desc: "TIP: Chrome 계열 브라우저는 자동 재생되는 클립을 종종 음소거합니다. 음소거 문제를 피하려면 본 옵션을 사용해보세요(안 될 수도 있음)."
    },
    target_start_volume : {
        category:"advanced", depth:3,
        under_dev:true, type: "text", value: 1.0, valid:"number", min_value:0.0, max_value:1.0,
        title:{en:"Volume", ko:"Volume"},
        desc:{en:"(Max Volume: 1.0, Mute: 0.0, Range: 0.0 ~ 1.0)", ko:"(Max Volume: 1.0, 음소거: 0.0, 범위: 0.0 ~ 1.0)"}
    },
    removeOriginalLinks: {
        category:"advanced",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"클립 원본 링크 삭제",
        desc:"클립 섬네일을 감지했을 때, 본문에 동일한 링크가 존재하는 경우 삭제하여 보기 좋게 만듭니다."
    },
    autoPlayNextClip: {
        category:"advanced",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: false,
        title:"다음 클립을 자동으로 이어서 재생",
        desc:"본문에 여러 Twitch Clip 이 존재하는 경우, 클립이 종료되면 다음 클립을 자동으로 재생합니다. (편하다!)"
    },
    play_and_pause_by_click : {
        category:"advanced",
        debug:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Twitch Clip 페이지 스타일로 표시",
        desc:"클립 화면을 클릭하여 재생 및 일시정지 되도록 만듭니다. (편하다!)<br />일시정지 시 상단 오버레이와 재생 버튼을 숨깁니다. 재생 중 화면을 더블 클릭하여 전체화면을 할 수 있습니다."
    },
    twitch_clip_hide_related_video_after_end : {
        category:"advanced",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"클립 재생이 끝난 후 계속 시청 및 연관된 클립 오버레이을 숨김",
        desc:""
    },
    twitch_clip_always_show_volume_controller : {
        category:"advanced",
        under_dev:true,
        depth: 2,
        type: "checkbox",
        value: false,
        title:"볼륨 컨트롤러를 항상 표시",
        desc:""
    },
    twitch_clip_time_update_after_end : {
        category:"advanced",
        debug:true,
        depth: 2,
        type: "checkbox",
        value: true,
        title:"클립 재생이 끝난 후 동영상 탐색 동작 개선",
        desc:"클립 재생이 끝나고 동영상을 탐색한 경우, 클립 재시작 시 마지막 탐색한 시간부터 시작하도록 동작을 개선합니다."
    },

    // Youtube
    useYoutube : {
        category:"youtube",
        category_name:"Youtube",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"Youtube 관련 기능 사용",
        desc:"",
    },
    youtubeLazyLoad : {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        under_dev:true,
        title:"Youtube 영상에 대하여 게으른 로딩 방식 적용",
        desc:"Youtube 영상이 많은 게시물에서 순간적으로 브라우저가 멈추는 것을 일부 개선합니다.",
    },
    youtubeClipConvert : {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Youtube 클립 링크 섬네일 클릭 시 비디오로 변환",
        desc:"",
    },
    youtubeClipStoryBoardImage : {
        category:"youtube",
        depth: 3,
        type: "checkbox",
        value: true,
        under_dev:true,
        title:"Youtube 클립 섬네일을 스토리보드 이미지로 대체",
        desc:"",
    },
    youtubeForceWidthHeight: {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"Youtube 비디오 크기를 본문에 맞춤 & 비율을 16:9로 고정",
        desc:"Youtube 비디오가 세로로 너무 길어지는 것을 방지합니다. 예) Shorts"
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
    youtubeHidePauseOverlay: {
        category:"youtube",
        depth: 2,
        type: "checkbox",
        value: true,
        title:"일시정지 시 동영상 더보기를 숨김",
        desc:""
    },

    // Naver Video
    naverVideoAutoMaxQuality: {
        category:"naver",
        category_name: "Naver Video",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"네이버 비디오를 항상 최대 품질로 시작",
        desc:""
    },
    naverVideoForceWidthHeight : {
        category:"naver",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"네이버 비디오 크기를 본문에 맞춤 & 비율을 16:9로 고정",
        desc:""
    },
    showNaverVideoRefreshBtn: {
        category:"naver",
        depth: 1,
        debug: true,
        type: "checkbox",
        value: true,
        title:"네이버 비디오 Reload 버튼을 표시",
        desc:""
    },
    showNaverVideoRefreshBtnOnPlayer: {
        category:"naver",
        depth: 2,
        debug: true,
        type: "checkbox",
        value: false,
        title:"네이버 비디오 플레이어에 항상 Reload 버튼을 표시",
        desc:""
    },
    NaverVideoEnhancedClickDebug: {
        category:"naver",
        depth: 1,
        debug: true,
        type: "checkbox",
        value: false,
        title:"네이버 비디오 화면 클릭 동작 개선",
        desc:""
    },
    videoWidth : {
        category:"videoCommon",
        category_name: "공통",
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
    fixFullScreenScrollChange: {
        category:"etc",
        category_name: "편의 기능",
        depth: 1,
        type: "checkbox",
        value: true,
        title:"네이버 카페 전체화면 스크롤 동작 개선",
        desc:"비디오를 전체화면 후 해제 시 스크롤 위치가 변경되는 문제를 개선합니다."
    },
    improvedRefresh:{
        category:"etc",
        depth: 1,
        type: "checkbox",
        value: false,
        title:"네이버 카페 새로고침 개선",
        desc:"새로고침 시 첫 화면 대신 마지막으로 탐색한 페이지를 불러옵니다."
    },
    naverBoardDefaultArticleCount: {
        category:"etc",
        depth: 1,
        type: "combobox",
        value: "0",
        title:"게시판 글 기본 표시 개수 설정",
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
        title:"즐겨찾는 게시판을 항상 펼침",
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