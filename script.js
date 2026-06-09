const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbwjcuTgPWo6f_gp92cLhKg2ETLECkegEx4WsRKPSGoYk6_i-DwYq6ETT1CKzjMKkfZhcQ/exec";

const form =
document.getElementById("inspectionForm");

const photoInput =
document.getElementById("photo");

const preview =
document.getElementById("preview");

const statusBox =
document.getElementById("status");

const submitBtn =
document.getElementById("submitBtn");

/* =====================================
   PREVIEW IMAGE
===================================== */

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

/* =====================================
   FORM SUBMIT
===================================== */

form.addEventListener(
"submit",
function(e){

e.preventDefault();

uploadInspection();

}
);

/* =====================================
   UPLOAD
===================================== */

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

addTimestampToImage(file);

}

/* =====================================
   TIMESTAMP CAMERA STYLE
===================================== */

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
document.createElement("canvas");

const ctx =
canvas.getContext("2d");

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

const months = [
"Jan","Feb","Mar",
"Apr","May","Jun",
"Jul","Aug","Sep",
"Oct","Nov","Dec"
];

const days = [
"Sun","Mon","Tue",
"Wed","Thu","Fri",
"Sat"
];

const timeText =
String(
now.getHours()
).padStart(2,"0")
+
":" +
String(
now.getMinutes()
).padStart(2,"0");

const dateText =
String(
now.getDate()
).padStart(2,"0")
+
" " +
months[
now.getMonth()
]
+
" " +
now.getFullYear();

const dayText =
days[
now.getDay()
];

/* ==========================
   RESPONSIVE SCALE
========================== */

const scale =
img.width / 1920;

const bigFont =
Math.max(
70,
120 * scale
);

const mediumFont =
Math.max(
22,
38 * scale
);

const smallFont =
Math.max(
18,
32 * scale
);

/* ==========================
   POSITION
========================== */

const x =
40 * scale;

const y =
canvas.height -
(180 * scale);

/* ==========================
   SHADOW
========================== */

ctx.shadowColor =
"rgba(0,0,0,0.9)";

ctx.shadowBlur =
10;

ctx.shadowOffsetX =
2;

ctx.shadowOffsetY =
2;

/* ==========================
   TIME
========================== */

ctx.fillStyle =
"#FFFFFF";

ctx.font =
`bold ${bigFont}px Arial`;

ctx.fillText(
timeText,
x,
y
);

/* ==========================
   YELLOW LINE
========================== */

const lineX =
x + (250 * scale);

ctx.beginPath();

ctx.strokeStyle =
"#FFD700";

ctx.lineWidth =
4;

ctx.moveTo(
lineX,
y - (90 * scale)
);

ctx.lineTo(
lineX,
y + (10 * scale)
);

ctx.stroke();

/* ==========================
   DATE
========================== */

ctx.fillStyle =
"#FFFFFF";

ctx.font =
`${mediumFont}px Arial`;

ctx.fillText(
dateText,
lineX + (20 * scale),
y - (50 * scale)
);

/* ==========================
   DAY
========================== */

ctx.fillText(
dayText,
lineX + (20 * scale),
y - (10 * scale)
);

/* ==========================
   LOCATION
========================== */

ctx.font =
`bold ${smallFont}px Arial`;

ctx.fillText(
station,
x,
y + (55 * scale)
);

/* ==========================
   PANEL NAME
========================== */

ctx.font =
`${smallFont}px Arial`;

ctx.fillText(
panelName,
x,
y + (95 * scale)
);

/* ==========================
   INTERTRIP TYPE
========================== */

ctx.fillText(
intertripType,
x,
y + (135 * scale)
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

reader.readAsDataURL(file);

}

/* =====================================
   SEND TO SPREADSHEET
===================================== */

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