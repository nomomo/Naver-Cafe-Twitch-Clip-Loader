import { VideoBase } from "js/video/video_common.js";

const TTVLogo = `<svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 2.015 15.448 v 63.134 h 21.493 V 90 h 12.09 l 11.418 -11.418 h 17.463 l 23.507 -23.507 V 0 H 8.06 L 2.015 15.448 z M 15.448 8.06 h 64.478 v 42.985 L 66.493 64.478 H 45 L 33.582 75.896 V 64.478 H 15.448 V 8.06 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><rect x="58.43" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="36.94" y="23.51" rx="0" ry="0" width="8.06" height="23.48" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(97,59,162); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/></g></g></svg>`;

export class VideoTwitch extends VideoBase {
    constructor(options) {
        options.logoSVG = TTVLogo;
        super(options);
        this.option = options.option;
        this.start = options.start;
        if(this.type === GLOBAL.TWITCH_CLIP){
            this.iframeUrl = `https://clips.twitch.tv/embed?clip=${this.id}&parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoplay=${this.autoPlay}&muted=${this.muted}`;
        }
        else if(this.type === GLOBAL.TWITCH_VOD){
            this.iframeUrl = `https://player.twitch.tv/?video=${this.id}&parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoplay=${this.autoPlay}&muted=${this.muted}${this.option}`;
        }
        NOMO_DEBUG("new VideoTwitch", options);
    }
}