const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbwjcuTgPWo6f_gp92cLhKg2ETLECkegEx4WsRKPSGoYk6_i-DwYq6ETT1CKzjMKkfZhcQ/exec";

const form =
document.getElementById(
"inspectionForm"
);

const photoInput =
document.getElementById(
"photo"
);

const preview =
document.getElementById(
"preview"
);

const statusBox =
document.getElementById(
"status"
);

const submitBtn =
document.getElementById(
"submitBtn"
);

/* ==========================
   PREVIEW IMAGE
========================== */

photoInput.addEventListener(
"change",
function(event){

const file =
event.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

preview.src =
e.target.result;

preview.style.display =
"block";

};

reader.readAsDataURL(file);

}
);

/* ==========================
   SUBMIT FORM
========================== */

form.addEventListener(
"submit",
function(e){

e.preventDefault();

uploadInspection();

}
);

/* ==========================
   UPLOAD INSPECTION
========================== */

function uploadInspection(){

const file =
photoInput.files[0];

if(!file){

alert(
"Please select photo evidence"
);

return;

}

submitBtn.disabled =
true;

submitBtn.innerHTML =
"Uploading...";

statusBox.innerHTML = "";

addTimestampToImage(
file
);

}

/* ==========================
   ADD TIMESTAMP TO IMAGE
========================== */

function addTimestampToImage(file){

const reader =
new FileReader();

reader.onload =
function(event){

const img =
new Image();

img.onload =
function(){

const canvas =
document.createElement(
"canvas"
);

const ctx =
canvas.getContext(
"2d"
);

canvas.width =
img.width;

canvas.height =
img.height;

ctx.drawImage(
img,
0,
0
);

/* ==========================
   FORM DATA
========================== */

const station =
document.getElementById(
"station"
).value;

const panelName =
document.getElementById(
"panelName"
).value;

const intertripType =
document.getElementById(
"intertripType"
).value;

/* ==========================
   DATE TIME
========================== */

const now =
new Date();

const timestamp =
now.getFullYear() +
"-" +
String(
now.getMonth()+1
).padStart(2,"0") +
"-" +
String(
now.getDate()
).padStart(2,"0") +
" " +
String(
now.getHours()
).padStart(2,"0") +
":" +
String(
now.getMinutes()
).padStart(2,"0") +
":" +
String(
now.getSeconds()
).padStart(2,"0");

/* ==========================
   RESPONSIVE SIZE
========================== */

const scale =
img.width / 1920;

const fontTitle =
Math.max(
28,
40 * scale
);

const fontInfo =
Math.max(
24,
32 * scale
);

const boxWidth =
Math.min(
img.width * 0.70,
900 * scale
);

const boxHeight =
Math.max(
180,
220 * scale
);

const margin =
30 * scale;

const boxX =
margin;

const boxY =
canvas.height -
boxHeight -
margin;

/* ==========================
   SHADOW
========================== */

ctx.shadowColor =
"rgba(0,0,0,0.5)";

ctx.shadowBlur =
20;

ctx.shadowOffsetX =
0;

ctx.shadowOffsetY =
4;

/* ==========================
   BACKGROUND PANEL
========================== */

ctx.fillStyle =
"rgba(0,0,0,0.75)";

ctx.fillRect(
boxX,
boxY,
boxWidth,
boxHeight
);

/* ==========================
   BORDER
========================== */

ctx.shadowBlur = 0;

ctx.strokeStyle =
"#FFFFFF";

ctx.lineWidth =
4;

ctx.strokeRect(
boxX,
boxY,
boxWidth,
boxHeight
);

/* ==========================
   TIMESTAMP
========================== */

ctx.fillStyle =
"#FFD700";

ctx.font =
`bold ${fontTitle}px Arial`;

ctx.fillText(
timestamp,
boxX + 20,
boxY + 45
);

/* ==========================
   DETAILS
========================== */

ctx.fillStyle =
"#FFFFFF";

ctx.font =
`${fontInfo}px Arial`;

ctx.fillText(
"Station : " + station,
boxX + 20,
boxY + 95
);

ctx.fillText(
"Panel : " + panelName,
boxX + 20,
boxY + 140
);

ctx.fillText(
"Intertrip Type : " + intertripType,
boxX + 20,
boxY + 185
);

/* ==========================
   EXPORT IMAGE
========================== */

const imageWithTimestamp =
canvas.toDataURL(
"image/jpeg",
0.95
);

sendToSpreadsheet(
imageWithTimestamp
);

};

img.src =
event.target.result;

};

reader.readAsDataURL(
file
);

}

/* ==========================
   SEND TO SPREADSHEET
========================== */

function sendToSpreadsheet(
imageData
){

const payload = {

petugas:
document.getElementById(
"petugas"
).value,

station:
document.getElementById(
"station"
).value,

panelName:
document.getElementById(
"panelName"
).value,

intertripType:
document.getElementById(
"intertripType"
).value,

bypass:
document.getElementById(
"bypass"
).value,

statusCondition:
document.getElementById(
"statusCondition"
).value,

finding:
document.getElementById(
"keterangan"
).value,

image:
imageData

};

fetch(
WEB_APP_URL,
{
method:"POST",
body:JSON.stringify(
payload
)
}
)

.then(
response =>
response.json()
)

.then(data=>{

if(data.success){

statusBox.className =
"success";

statusBox.innerHTML =
"✓ Inspection Successfully Submitted";

form.reset();

preview.style.display =
"none";

}
else{

statusBox.className =
"error";

statusBox.innerHTML =
data.error;

}

})

.catch(error=>{

statusBox.className =
"error";

statusBox.innerHTML =
error;

})

.finally(()=>{

submitBtn.disabled =
false;

submitBtn.innerHTML =
"Submit Inspection";

});

}