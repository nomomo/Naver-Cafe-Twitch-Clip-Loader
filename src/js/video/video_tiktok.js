import { NOMO_DEBUG } from "js/lib.js";
import { VideoBase } from "js/video/video_common.js";

const TiktokLogo = `<svg viewBox="0 0 291.72499821636245 291.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px"><path d="M219.51 291.1H71.58C32.05 291.1 0 259.05 0 219.51V71.58C0 32.05 32.05 0 71.58 0h147.93c39.53 0 71.58 32.05 71.58 71.58v147.93c.01 39.54-32.04 71.59-71.58 71.59z"/><g fill="#25f4ee"><path d="M120.96 123.89v-8.8a64.83 64.83 0 0 0-9.23-.79c-29.93-.06-56.42 19.33-65.41 47.87s1.62 59.62 26.18 76.71c-25.77-27.58-24.3-70.83 3.28-96.6a68.425 68.425 0 0 1 45.18-18.39z"/><path d="M122.62 223.53c16.73-.02 30.48-13.2 31.22-29.92V44.44h27.25a50.7 50.7 0 0 1-.79-9.44h-37.27v149.02c-.62 16.8-14.41 30.11-31.22 30.14-5.02-.04-9.97-1.28-14.42-3.6a31.276 31.276 0 0 0 25.23 12.97zM231.98 95.05v-8.29c-10.03 0-19.84-2.96-28.19-8.51a51.63 51.63 0 0 0 28.19 16.8z"/></g><path d="M203.8 78.26a51.301 51.301 0 0 1-12.76-33.89h-9.95a51.564 51.564 0 0 0 22.71 33.89zM111.73 151.58c-17.28.09-31.22 14.17-31.13 31.45a31.293 31.293 0 0 0 16.71 27.53c-10.11-13.96-6.99-33.48 6.97-43.6a31.191 31.191 0 0 1 18.34-5.93c3.13.04 6.24.53 9.23 1.45v-37.93c-3.05-.46-6.14-.7-9.23-.72h-1.66v28.84c-3.01-.82-6.12-1.18-9.23-1.09z" fill="#fe2c55"/><path d="M231.98 95.05v28.84a88.442 88.442 0 0 1-51.69-16.8v75.77c-.08 37.81-30.75 68.42-68.56 68.42a67.816 67.816 0 0 1-39.22-12.4c25.73 27.67 69.02 29.25 96.7 3.52a68.397 68.397 0 0 0 21.83-50.09v-75.56a88.646 88.646 0 0 0 51.76 16.58V96.21c-3.64-.02-7.26-.4-10.82-1.16z" fill="#fe2c55"/><path d="M180.29 182.87V107.1a88.505 88.505 0 0 0 51.76 16.58V94.84a51.73 51.73 0 0 1-28.26-16.58 51.634 51.634 0 0 1-22.71-33.89h-27.25v149.24c-.71 17.27-15.27 30.69-32.54 29.99a31.278 31.278 0 0 1-24.06-12.9c-15.29-8.05-21.16-26.97-13.11-42.26a31.274 31.274 0 0 1 27.53-16.71c3.13.03 6.24.51 9.23 1.44V123.9c-37.74.64-67.82 32.19-67.18 69.93a68.353 68.353 0 0 0 18.73 45.86 67.834 67.834 0 0 0 39.29 11.61c37.82-.01 68.49-30.62 68.57-68.43z" fill="#fff"/></svg>`;

export class VideoTiktok extends VideoBase {
    constructor(options) {
        options.logoSVG = TiktokLogo;
        options.type = GLOBAL.TIKTOK;
        options.typeName = "TIKTOK";
        super(options);

        this.parseDataRequired = true;
        this.iframeUrl = `https://www.tiktok.com/embed/v2/${this.id}?parent=cafe.naver.com&extension=NCCL&seq=${this.seq}&autoPlay=${this.autoPlay}&muted=${this.muted}`;
        NOMO_DEBUG("new VideoTiktok", options);
    }

    // parse thumbnail image
    async parseData(){try {
        if(this.isDataLoading || this.isDataLoaded) return;
        this.isDataLoading = true;

        let urlFetch = await fetch(`https://www.tiktok.com/oembed?url=${this.url}`, {
            "method": "GET",
        });
        NOMO_DEBUG("Tiktok fetch", urlFetch);

        if(urlFetch.status === 200){
            let json = await urlFetch.json();
            NOMO_DEBUG("Tiktok json", json);
            
            //
            this.updateThumbnail(json.thumbnail_url);
            
            // resize
            if(json.thumbnail_width && json.thumbnail_height){
                let ratio = json.thumbnail_width / json.thumbnail_height;
                let width = this.$iframeContainer.width();
                let new_height = width / ratio + 44;
                let viewportHeight = Math.max((window.parent.innerHeight * 0.8), 800);
                new_height = parseInt(Math.min(viewportHeight, new_height));
                NOMO_DEBUG("new_height", new_height);
                
                let new_ratio = width / new_height;
                if(Math.abs(new_ratio - 16.0/9.0) > 0.2){
                    if(new_ratio < 1.0) new_ratio = 1.0;
                    if(new_ratio > 4.0) new_ratio = 4.0;
                    this.$iframeContainer.attr("style",`aspect-ratio:${new_ratio}`);
                }
            }
            this.postParseData();
        }
        else{
            NOMO_WARN("Tiktok parsing fail", urlFetch);
            this.isDataLoading = false;
            this.isDataLoaded = true;
            this.isDataSucceed = false;
            this.postParseData();
        }
    }
    catch(e){
        NOMO_WARN("error from Tiktok parsing", e);
        this.isDataLoading = false;
        this.isDataLoaded = true;
        this.isDataSucceed = false;
        this.postParseData();
    }}
}


// https://www.tiktok.com/oembed?url=

// https://www.tiktok.com/oembed?url=https://www.tiktok.com/@weeekly/video/7179905517563727105
// {"version":"1.0","type":"video","title":"🐥재희가 귀여워서 미안해😘🙏 #Weeekly #위클리 #이재희 #LeeJaehee #귀여워서미안해","author_url":"https://www.tiktok.com/@weeekly","author_name":"Weeekly (위클리)","width":"100%","height":"100%","html":"<blockquote class=\"tiktok-embed\" cite=\"https://www.tiktok.com/@weeekly/video/7179905517563727105\" data-video-id=\"7179905517563727105\" data-embed-from=\"oembed\" style=\"max-width: 605px;min-width: 325px;\" > <section> <a target=\"_blank\" title=\"@weeekly\" href=\"https://www.tiktok.com/@weeekly?refer=embed\">@weeekly</a> <p>🐥재희가 귀여워서 미안해😘🙏 <a title=\"weeekly\" target=\"_blank\" href=\"https://www.tiktok.com/tag/weeekly?refer=embed\">#Weeekly</a> <a title=\"위클리\" target=\"_blank\" href=\"https://www.tiktok.com/tag/%EC%9C%84%ED%81%B4%EB%A6%AC?refer=embed\">#위클리</a> <a title=\"이재희\" target=\"_blank\" href=\"https://www.tiktok.com/tag/%EC%9D%B4%EC%9E%AC%ED%9D%AC?refer=embed\">#이재희</a> <a title=\"leejaehee\" target=\"_blank\" href=\"https://www.tiktok.com/tag/leejaehee?refer=embed\">#LeeJaehee</a> <a title=\"귀여워서미안해\" target=\"_blank\" href=\"https://www.tiktok.com/tag/%EA%B7%80%EC%97%AC%EC%9B%8C%EC%84%9C%EB%AF%B8%EC%95%88%ED%95%B4?refer=embed\">#귀여워서미안해</a></p> <a target=\"_blank\" title=\"♬ 可愛くてごめん (feat. かぴ) - HoneyWorks\" href=\"https://www.tiktok.com/music/可愛くてごめん-feat-かぴ-7127871335373015041?refer=embed\">♬ 可愛くてごめん (feat. かぴ) - HoneyWorks</a> </section> </blockquote> <script async src=\"https://www.tiktok.com/embed.js\"></script>","thumbnail_width":576,"thumbnail_height":1120,"thumbnail_url":"https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/oYADAJc0wfCWUBhBExhzCgtGIIxGwM8cAokDaK?x-expires=1671836400&x-signature=cy7Zb%2FjGawyKD6vsdKsX453ktmE%3D","provider_url":"https://www.tiktok.com","provider_name":"TikTok","author_unique_id":"weeekly","embed_product_id":"7179905517563727105","embed_type":"video"}
// <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@b2ang/video/7172428949845200129" data-video-id="7172428949845200129" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@b2ang" href="https://www.tiktok.com/@b2ang?refer=embed">@b2ang</a> 팩트폭행 다이어트 <a title="빵빵이" target="_blank" href="https://www.tiktok.com/tag/%EB%B9%B5%EB%B9%B5%EC%9D%B4?refer=embed">#빵빵이</a> <a title="틱톡툰" target="_blank" href="https://www.tiktok.com/tag/%ED%8B%B1%ED%86%A1%ED%88%B0?refer=embed">#틱톡툰</a> <a title="파트너크리에이터" target="_blank" href="https://www.tiktok.com/tag/%ED%8C%8C%ED%8A%B8%EB%84%88%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0?refer=embed">#파트너크리에이터</a> <a target="_blank" title="♬ 오리지널 사운드  - 빵빵이의 일상" href="https://www.tiktok.com/music/오리지널-사운드-빵빵이의-일상-7172429839658584834?refer=embed">♬ 오리지널 사운드  - 빵빵이의 일상</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>

// https://www.tiktok.com/embed/v2/6808679698583850246