const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbxRtTkqlBT2KBxlh7O1FCRMzVZNmIoClBPW2uaouH6plpzXAHc9RRLS0HuE5yNV8qpHKQ/exec";

navigator.geolocation.getCurrentPosition(

(position)=>{

document
.getElementById("lokasi")
.value =

position.coords.latitude +
"," +
position.coords.longitude;

}

);

document
.getElementById("photo")
.addEventListener(

"change",

function(event){

const file =
event.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

const preview =
document.getElementById(
"preview"
);

preview.src =
e.target.result;

preview.style.display =
"block";

};

reader.readAsDataURL(
file
);

}

);

document
.getElementById(
"inspectionForm"
)

.addEventListener(

"submit",

function(event){

event.preventDefault();

uploadData();

}

);

function uploadData(){

const petugas =
document.getElementById(
"petugas"
).value;

const lokasi =
document.getElementById(
"lokasi"
).value;

const equipment =
document.getElementById(
"equipment"
).value;

const kategori =
document.getElementById(
"kategori"
).value;

const nilai =
Number(
document.getElementById(
"nilai"
).value
);

const keterangan =
document.getElementById(
"keterangan"
).value;

let status = "";

if(nilai >= 90){

status = "OK";

}
else if(nilai >= 75){

status = "WARNING";

}
else{

status = "CRITICAL";

}

const photo =
document.getElementById(
"photo"
).files[0];

const reader =
new FileReader();

reader.onload =
function(){

fetch(

WEB_APP_URL,

{

method:"POST",

body:JSON.stringify({

petugas,
lokasi,
equipment,
kategori,
nilai,
status,
keterangan,
image:
reader.result

})

}

)

.then(
response =>
response.json()
)

.then(data => {

if(data.success){

document
.getElementById(
"status"
)
.innerHTML =
"Upload Berhasil";

document
.getElementById(
"inspectionForm"
)
.reset();

document
.getElementById(
"preview"
)
.style.display =
"none";

}
else{

document
.getElementById(
"status"
)
.innerHTML =
data.error;

}

})

.catch(error=>{

document
.getElementById(
"status"
)
.innerHTML =
error;

});

};

reader.readAsDataURL(
photo
);

}