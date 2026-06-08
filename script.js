const WEB_APP_URL =
"https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

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


/* Preview Photo */

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


/* Submit Form */

form.addEventListener(
"submit",
function(e){

e.preventDefault();

uploadInspection();

}
);


function uploadInspection(){

submitBtn.disabled = true;

submitBtn.innerHTML =
"Uploading...";

statusBox.innerHTML = "";

const file =
photoInput.files[0];

const reader =
new FileReader();

reader.onload =
function(){

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
reader.result

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

};

reader.readAsDataURL(file);

}