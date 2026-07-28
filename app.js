/*========================================
 POWER EXTRACT V2
========================================*/

/*========================================
DOM
========================================*/

const urlInput = document.getElementById("url");
const analyzeBtn = document.getElementById("analyze");

const htmlBox = document.getElementById("htmlBox");

const imagesBox = document.getElementById("images");
const cssBox = document.getElementById("css");
const jsBox = document.getElementById("javascript");
const videosBox = document.getElementById("videos");
const fontsBox = document.getElementById("fonts");
const linksBox = document.getElementById("links");
const metaBox = document.getElementById("meta");

const imageCount = document.getElementById("imageCount");
const cssCount = document.getElementById("cssCount");
const jsCount = document.getElementById("jsCount");
const linkCount = document.getElementById("linkCount");

const downloadHtml = document.getElementById("downloadHtml");


/*========================================
STATE
========================================*/

let websiteUrl = "";
let htmlSource = "";


/*========================================
EVENT
========================================*/

analyzeBtn.addEventListener("click", analyzeWebsite);

urlInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        analyzeWebsite();

    }

});


downloadHtml.addEventListener("click", exportHTML);


/*========================================
ANALYZE URL
========================================*/

async function analyzeWebsite() {

    websiteUrl = urlInput.value.trim();

    if (!websiteUrl) {

        alert("กรุณาใส่ URL");

        return;

    }

    if (!websiteUrl.startsWith("http")) {

        websiteUrl =

        "https://" + websiteUrl;

    }

    clearResult();

    showLoading();

    await fetchHTML();

}


/*========================================
FETCH HTML
========================================*/

async function fetchHTML() {

    try {

        const response = await fetch(

            "/.netlify/functions/extract?url=" +

            encodeURIComponent(websiteUrl)

        );

        if (!response.ok) {

            throw new Error(

                "โหลดเว็บไซต์ไม่สำเร็จ"

            );

        }

        htmlSource = await response.text();

        htmlBox.value = htmlSource;

        hideLoading();

        /* เรียก Part 2 */

        analyzeHTML(

            htmlSource,

            websiteUrl

        );

    }

    catch (error) {

        hideLoading();

        showError(

            "Error\n\n" +

            error.message

        );

    }

}


/*========================================
CLEAR
========================================*/

function clearResult() {

    htmlBox.value = "";

    clearLists();

    imageCount.textContent = 0;

    cssCount.textContent = 0;

    jsCount.textContent = 0;

    linkCount.textContent = 0;

}


/*========================================
LOADING
========================================*/

function showLoading() {

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML =

    "<div class=\"loading\">" +

    "<span></span>" +

    "<span></span>" +

    "<span></span>" +

    "</div>";

}


function hideLoading() {

    analyzeBtn.disabled = false;

    analyzeBtn.innerHTML = "Analyze";

}


/*========================================
 PART 2
 DOM PARSER
========================================*/

function analyzeHTML(html, website) {

    const parser = new DOMParser();

    const doc = parser.parseFromString(

        html,

        "text/html"

    );

    /*==============================
      HTML TITLE
    ==============================*/

    document.title =

        doc.title || "PowerExtract";

    /*==============================
      IMAGES
    ==============================*/

    const images =

        [...doc.querySelectorAll("img")]

        .map(img => img.getAttribute("src"))

        .filter(Boolean)

        .map(src =>

            new URL(src, website).href

        );

    /*==============================
      CSS
    ==============================*/

    const css =

        [...doc.querySelectorAll(

            'link[rel="stylesheet"]'

        )]

        .map(link => link.getAttribute("href"))

        .filter(Boolean)

        .map(href =>

            new URL(href, website).href

        );

    /*==============================
      JAVASCRIPT
    ==============================*/

    const javascript =

        [...doc.querySelectorAll(

            "script[src]"

        )]

        .map(script =>

            script.getAttribute("src")

        )

        .filter(Boolean)

        .map(src =>

            new URL(src, website).href

        );

    /*==============================
      VIDEOS
    ==============================*/

    const videos = [];

    doc.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("src")) {

            videos.push(

                new URL(

                    video.getAttribute("src"),

                    website

                ).href

            );

        }

    });

    doc.querySelectorAll("video source")

    .forEach(source => {

        if (source.getAttribute("src")) {

            videos.push(

                new URL(

                    source.getAttribute("src"),

                    website

                ).href

            );

        }

    });

    /*==============================
      FONTS
    ==============================*/

    const fonts = [];

    doc.querySelectorAll(

        'link[rel="preload"]'

    )

    .forEach(link => {

        const href =

        link.getAttribute("href");

        const as =

        link.getAttribute("as");

        if (

            href &&

            as === "font"

        ) {

            fonts.push(

                new URL(

                    href,

                    website

                ).href

            );

        }

    });

    /*==============================
      META
    ==============================*/

    const meta =

        [...doc.querySelectorAll("meta")]

        .map(item => {

            return {

                name:

                    item.getAttribute("name") ||

                    item.getAttribute("property") ||

                    "",

                content:

                    item.getAttribute("content") ||

                    ""

            };

        });

    /*==============================
      LINKS
    ==============================*/

    const links =

        [...doc.querySelectorAll("a")]

        .map(a =>

            a.getAttribute("href")

        )

        .filter(Boolean)

        .map(href =>

            new URL(href, website).href

        );

    /*==============================
      SEND TO PART 3
    ==============================*/

    renderImages(images);

    renderCSS(css);

    renderJS(javascript);

    renderVideos(videos);

    renderFonts(fonts);

    renderLinks(links);

    renderMeta(meta);

}


/*========================================
 PART 3
 RENDER
========================================*/

function renderImages(images){

    renderList(imagesBox, images);

}

function renderCSS(css){

    renderList(cssBox, css);

}

function renderJS(js){

    renderList(jsBox, js);

}

function renderVideos(videos){

    renderList(videosBox, videos);

}

function renderFonts(fonts){

    renderList(fontsBox, fonts);

}

function renderLinks(links){

    renderList(linksBox, links);

}

function renderMeta(meta){

    metaBox.innerHTML = "";

    if(meta.length===0){

        metaBox.innerHTML="<p>No Meta</p>";

        return;

    }

    meta.forEach(item=>{

        const div=document.createElement("div");

        div.className="meta-item";

        div.innerHTML=`

<b>${item.name}</b>

<br>

${item.content}

`;

        metaBox.appendChild(div);

    });

}


/*========================================
LIST
========================================*/

function renderList(container,data){

    container.innerHTML="";

    if(data.length===0){

        container.innerHTML="<p>No Data</p>";

        return;

    }

    data.forEach(url=>{

        const item=document.createElement("div");

        item.className="item";

        item.innerHTML=`

<a href="${url}" target="_blank">

${url}

</a>

<button onclick="downloadURL('${url}')">

Download

</button>

`;

        container.appendChild(item);

    });

}


/*========================================
DOWNLOAD URL
========================================*/

async function downloadURL(url){

    try{

        const res=await fetch(url);

        const blob=await res.blob();

        const a=document.createElement("a");

        a.href=URL.createObjectURL(blob);

        a.download=url.split("/").pop()||"file";

        a.click();

        URL.revokeObjectURL(a.href);

    }

    catch(e){

        alert(

"ไม่สามารถดาวน์โหลดไฟล์นี้ได้\n\nเว็บไซต์อาจป้องกัน CORS"

);

    }

}


/*========================================
DOWNLOAD HTML
========================================*/

function downloadFile(name,data,type){

    const blob=new Blob(

        [data],

        {

            type:type

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=name;

    a.click();

    URL.revokeObjectURL(url);

}


/*========================================
EXPORT HTML
========================================*/

function exportHTML(){

    if(!htmlSource){

        alert("ไม่มี HTML");

        return;

    }

    downloadFile(

        "index.html",

        htmlSource,

        "text/html"

    );

}


/*========================================
EXPORT JSON
========================================*/

function exportJSON(name,data){

    const json=

    JSON.stringify(

        data,

        null,

        2

    );

    downloadFile(

        name,

        json,

        "application/json"

    );

}


/*========================================
 SUMMARY
========================================*/

function updateSummary(result){

    imageCount.textContent=result.images.length;

    cssCount.textContent=result.css.length;

    jsCount.textContent=result.javascript.length;

    linkCount.textContent=result.links.length;

}


/*========================================
 PART 4
 CURSOR
========================================*/

const cursor = document.createElement("div");

cursor.className = "cursor";

document.body.appendChild(cursor);

document.addEventListener("mousemove",(e)=>{

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

});

document.querySelectorAll(

"button,a,input"

).forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        cursor.style.width="48px";

        cursor.style.height="48px";

        cursor.style.opacity=".8";

    });

    item.addEventListener("mouseleave",()=>{

        cursor.style.width="28px";

        cursor.style.height="28px";

        cursor.style.opacity="1";

    });

});


/*========================================
 PAGE ANIMATION
========================================*/

window.addEventListener("load",()=>{

    document.querySelectorAll(

".glass"

).forEach((card,index)=>{

        card.animate(

        [

        {

        opacity:0,

        transform:"translateY(30px)"

        },

        {

        opacity:1,

        transform:"translateY(0)"

        }

        ],

        {

        duration:700,

        delay:index*120,

        fill:"forwards"

        }

        );

    });

});


/*========================================
 HOVER EFFECT
========================================*/

document.querySelectorAll(

"button"

).forEach(btn=>{

    btn.addEventListener("mouseenter",()=>{

        btn.style.transform="translateY(-3px)";

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translateY(0)";

    });

});


/*========================================
 HELPERS
========================================*/

function absoluteURL(path){

    try{

        return new URL(

            path,

            websiteUrl

        ).href;

    }

    catch{

        return path;

    }

}

function unique(array){

    return [...new Set(array)];

}

function fileName(url){

    try{

        return url

        .split("/")

        .pop()

        .split("?")[0];

    }

    catch{

        return url;

    }

}

function clearLists(){

    [

    imagesBox,

    cssBox,

    jsBox,

    videosBox,

    fontsBox,

    linksBox,

    metaBox

    ].forEach(box=>{

        box.innerHTML="";

    });

}


/*========================================
 ERROR
========================================*/

function showError(message){

    htmlBox.value="";

    clearLists();

    alert(message);

}

window.addEventListener(

"error",

(event)=>{

    console.error(

        event.error

    );

});

window.addEventListener(

"unhandledrejection",

(event)=>{

    console.error(

        event.reason

    );

});


/*========================================
 START
========================================*/

window.addEventListener("load",()=>{

    imageCount.textContent=0;

    cssCount.textContent=0;

    jsCount.textContent=0;

    linkCount.textContent=0;

});
