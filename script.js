const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbx3ucDxr5zkfeNHvtYmkesI9a1MedqCHma9VnWYxw9krPr89sUdcMszD5Gxp_OkeOMJbg/exec";

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

/* Preview Image */

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

/* Submit */

form.addEventListener(
"submit",
function(e){

e.preventDefault();

uploadInspection();

}
);

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

const text1 =
timestamp;

const text2 =
station;

const text3 =
panelName;

const text4 =
intertripType;

ctx.fillStyle =
"hsla(61, 84%, 48%, 0.65)";

ctx.fillRect(
200,
canvas.height - 1000,
1000,
500
);

ctx.fillStyle =
"#ffffff";

ctx.font =
"24px Arial";

ctx.fillText(
text1,
400,
canvas.height - 110
);

ctx.fillText(
text2,
400,
canvas.height - 80
);

ctx.fillText(
text3,
400,
canvas.height - 50
);

ctx.fillText(
text4,
400,
canvas.height - 20
);

const imageWithTimestamp =
canvas.toDataURL(
"image/jpeg",
0.9
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

function sendToSpreadsheet(imageData){

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
