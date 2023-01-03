import { NOMO_DEBUG } from "js/lib/lib.js";
import { VideoBase } from "js/video/video_common.js";

const KakaotvLogo = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" style="background-color:#fae100" width="18px" height="18px" viewBox="0 0 180.0 180.0" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)" fill="#1e1e1e" stroke="none"><path d="M761 1454 c-299 -64 -496 -336 -452 -625 17 -110 60 -190 148 -276 l73 -72 0 -130 c0 -71 3 -132 8 -135 4 -2 56 32 117 77 l109 82 125 1 c102 0 139 5 196 23 139 45 252 130 327 245 106 163 106 388 0 552 -136 209 -398 313 -651 258z m-43 -331 l3 -63 54 0 55 0 0 -59 0 -60 -52 -3 -53 -3 -3 -77 -3 -78 56 0 55 0 0 -65 0 -65 -57 0 c-77 0 -124 14 -154 46 -21 23 -25 37 -29 132 l-5 107 -37 3 -38 3 0 59 0 59 38 3 37 3 3 63 3 63 62 -3 62 -3 3 -62z m306 -70 c36 -129 69 -223 76 -223 4 0 26 53 47 118 l38 117 54 3 c79 5 83 1 66 -50 -8 -24 -37 -116 -65 -205 l-51 -163 -89 0 -89 0 -36 118 c-20 64 -49 156 -65 204 -15 48 -25 90 -22 93 3 3 34 5 68 5 51 0 64 -3 68 -17z"/></g></svg>`;

export class VideoKakao extends VideoBase {
    constructor(options) {
        options.logoSVG = KakaotvLogo;
        options.type = GLOBAL.KAKAO_VID;
        options.typeName = "KAKAO_VID";
        super(options);

        this.parseDataRequired = true;
        this.iframeUrl = `https://play-tv.kakao.com/embed/player/cliplink/${this.id}?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoPlay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoKakao", options);
    }

    // proxy or GM_xhr 을 사용하지 않으면 CORS 에러가 발생한다.
    // parse thumbnail image
    async parseData(){
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let xhr = await GM.xmlHttpRequest({
            "method": "GET",
            "url": `https://tv.kakao.com/oembed?url=https://tv.kakao.com/v/${this.id}`,
            "headers": {},
            "responseType": "json"
        });
        NOMO_DEBUG("kakaotv GM.xmlHttpRequest", xhr);

        if(xhr.status === 200){
            let json = await xhr.response;
            NOMO_DEBUG("kakaotv json", json);

            let src = json.html.match(/src=['"]([a-zA-Z0-9-_%&?=./:]+)['"]/);
            if(src === null) {
                this.isDataLoading = false;
                this.isDataLoaded = true;
                this.isDataSucceed = false;
                return;
            }

            let iframeUrl = src[1];
            if(iframeUrl.split("/").pop().indexOf("?") === -1){
                iframeUrl += "?";
            }
            else{
                iframeUrl += "&";
            }

            iframeUrl += `parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoplay=${this.autoPlay}&muted=${this.muted}`;

            this.iframeUrl = iframeUrl;
            this.postParseData();
        }
        else{
            NOMO_WARN("kakaotv parsing fail", xhr);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }
}




// parse data
// https://tv.kakao.com/oembed?url=https://tv.kakao.com/v/434352996

// return
// {"type":"video","title":"43회. 일본여행 가서 먹방찍고 온 초아 | 일본여행 VLOG ","author_name":"초아","author_url":"https://tv.kakao.com/channel/3924945/info","provider_name":"kakaoTV","provider_url":"https://tv.kakao.com","thumbnail_url":"https://img1.kakaocdn.net/thumb/C640x360/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fkakaotv%2FASSET%2Fwarhol_asset%2Fvod_thumbnail%2F4726375cf2adbf9dbfedf2e096ba8b093074e608","thumbnail_width":640,"thumbnail_height":360,"html":"<iframe title=\"43회. 일본여행 가서 먹방찍고 온 초아 | 일본여행 VLOG \" width=\"640\" height=\"360\" src=\"https://play-tv.kakao.com/embed/player/cliplink/434352996?service=und_player\" allowfullscreen frameborder=\"0\" scrolling=\"no\" allow=\"autoplay\" ></iframe>","width":640,"height":360}