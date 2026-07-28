/* ============================
   POWER EXTRACT
============================ */

const urlInput = document.getElementById("url");
const frame = document.getElementById("frame");
const sourceCode = document.getElementById("sourceCode");

const total = document.getElementById("total");
const success = document.getElementById("success");
const failed = document.getElementById("failed");

const extractBtn = document.getElementById("extract");
const previewBtn = document.getElementById("preview");
const copyBtn = document.getElementById("copy");
const clearBtn = document.getElementById("clear");

/* ============================
   COUNTER
============================ */

let totalCount = 0;
let successCount = 0;
let failedCount = 0;

function updateCounter() {

    total.textContent = totalCount;
    success.textContent = successCount;
    failed.textContent = failedCount;

}

/* ============================
   PREVIEW
============================ */

previewBtn.onclick = () => {

    let url = urlInput.value.trim();

    if (!url) {
        alert("กรุณาใส่ URL");
        return;
    }

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    frame.src = url;

};

/* ============================
   EXTRACT
============================ */

extractBtn.onclick = async () => {

    let url = urlInput.value.trim();

    if (!url) {

        alert("กรุณาใส่ URL");

        return;

    }

    if (!url.startsWith("http")) {

        url = "https://" + url;

    }

    totalCount++;

    updateCounter();

    try {

        const res = await fetch(
  "/.netlify/functions/extract?url=" +
  encodeURIComponent(url)
);

const html = await res.text();

sourceCode.value = html;

        successCount++;

    }

    catch (e) {

        sourceCode.value =
`ไม่สามารถอ่าน Source ได้

สาเหตุที่เป็นไปได้

- เว็บบล็อก CORS
- เว็บไม่อนุญาต Cross Origin
- ต้องใช้ Server Proxy`;

        failedCount++;

    }

    updateCounter();

};

/* ============================
   COPY
============================ */

copyBtn.onclick = () => {

    navigator.clipboard.writeText(sourceCode.value);

    copyBtn.innerText = "Copied";

    setTimeout(() => {

        copyBtn.innerText = "Copy";

    },1200);

};

/* ============================
   CLEAR
============================ */

clearBtn.onclick = () => {

    urlInput.value = "";

    sourceCode.value = "";

    frame.src = "about:blank";

};

/* ============================
   CUSTOM CURSOR
============================ */

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove",(e)=>{

    cursor.style.left = e.clientX+"px";

    cursor.style.top = e.clientY+"px";

});

/* ============================
   BUTTON HOVER
============================ */

document.querySelectorAll("button").forEach(button=>{

button.addEventListener("mouseenter",()=>{

cursor.style.transform="translate(-50%,-50%) scale(2)";

});

button.addEventListener("mouseleave",()=>{

cursor.style.transform="translate(-50%,-50%) scale(1)";

});

});

/* ============================
   HERO ANIMATION
============================ */

window.addEventListener("load",()=>{

document.querySelectorAll(".glass").forEach((card,index)=>{

card.animate(

[

{

opacity:0,

transform:"translateY(40px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],

{

duration:700,

delay:index*150,

fill:"forwards"

}

);

});

});

/* ============================
   AUTO DEMO
============================ */

window.onload=()=>{

updateCounter();

urlInput.value="https://productink.netlify.app/";

};