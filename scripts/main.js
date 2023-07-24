/**
 * Set Domains for suggest
 * email completation for 
 * customers
 */
$("#email").emailautocomplete({
  suggClassName: "email-autocomplete",
  domains: [
    "yahoo.com",
    "hotmail.com",
    "gmail.com",
    "me.com",
    "aol.com",
    "mac.com",
    "live.com",
    "comcast.net",
    "googlemail.com",
    "msn.com",
    "hotmail.co.uk",
    "yahoo.co.uk",
    "facebook.com",
    "verizon.net",
    "sbcglobal.net",
    "att.net",
    "gmx.com",
    "outlook.com",
    "icloud.com",
    "panabel.com"
]
});


/**
 * Geolocalization
 */
// let LATITUDE = 0.00;
// let LONGITUDE = 0.00
// let geodata = navigator.geolocation;

// function successGeoData(position) {
//   const myLatitude = position.coords.latitude;
//   const myLongitude = position.coords.longitude;
//   let geodataMsg = "Geo data obtained";
//   updateGeoData(myLatitude, myLongitude);
// }

// function errorGeoData(error) {
//   let geodataMsg = "Unable to obtain Geo Data";
// }

// function updateGeoData(lat, lon) {
//   LATITUDE = lat;
//   LONGITUDE = lon;
// }
// console.log(geodata.getCurrentPosition(successGeoData, errorGeoData));



/**
 * Obtain IP Address
 */

let myIP = fetch('https://api.ipify.org?format=json')
   .then((response) => response.json())
   .then((data) => myIP = data.ip)
   .catch((error) => console.error);
console.log("My public IP is: ", myIP.then((data) => {return data }));

/**
 * unhide and hide Guerlain
 * options
 * @returns nothing
 */
function unhideGuerlain() {
  let guerlainsection = document.querySelector("#guerlainSpecific");
  let guerlainCheckboxes = document.getElementsByName("guerlain-specific");
  if (guerlainsection.style.display === "block") {
    guerlainsection.style.display = "none";
    for (i = 0; i < guerlainCheckboxes.length; i++) {
      guerlainCheckboxes[i].checked = false;
    }
  } else {
    guerlainsection.style.display = "block";
  }
}

/**
 * Format date for Birthday
 * @param mydate datetime object
 * @returns String MM/DD
 */
function bdayFormat(mydate) {
  let month = String(mydate.getMonth()+1).padStart(2, '0');
  let day = String(mydate.getDate()).padStart(2, '0');
  return `${month}/${day}`
}


/**
 * Format date to ISO 8601
 * @param mydate type datetime
 * @returns string YYYY-MM-DD HH:mm:ss
 */
function isoDate(mydate) {
  let year = mydate.getFullYear();
  let month = String(mydate.getMonth()+1).padStart(2, '0');
  let day = String(mydate.getDate()).padStart(2, '0');
  let hours = String(mydate.getHours()).padStart(2, '0');
  let minutes = String(mydate.getMinutes()).padStart(2, '0');
  let seconds = String(mydate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}



/**
 * Obtain data from form
 * and convert to JSON to 
*/
const myForm = document.querySelector("form");
myForm.addEventListener("submit", (event) =>{
  /**
   * Setting for Mailchimp API
   */
  const DC = "us21";
  const COUNTRY_LIST = "4b890a1b03";
  const MAILCHIMP_URL = `https://${DC}.api.mailchimp.com/3.0/lists/${COUNTRY_LIST}/members/?skip_merge_validation=false`;
  const AUTH = `Basic ${btoa("anystring:3e47f8d1fd382c6f867bb47e52a0ced2-us21")}`;
  let raw = "";
  
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json; charset=utf-8");
  myHeaders.append("Authorization", AUTH);
  myHeaders.append("Access-Control-Allow-Origin", "*");
  myHeaders.append("Access-Control-Allow-Credentials", true);
  myHeaders.append("Access-Control-Allow-Methods", "POST");
  
  let requestOptions = {
    mode: "cors",
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  console.log(myHeaders);


  /**
   * Prevent form auto refresh
  */
 event.preventDefault();
 
 /**
  * Obtain data from
  * form
 */
const formData = new URLSearchParams();
for (const pair of new FormData(myForm)) {
  formData.append(pair[0], pair[1]);
}

formData.set("interests", "");
const myCheckboxes = document.getElementsByName("interests");
let boughtBrands = {};
myCheckboxes.forEach(brand => {
  if (brand.checked === true) {
    boughtBrands[brand.value] = true;
  }
});


/**
   * transform data
   * prepare to send it
*/
const data = Object.fromEntries(formData);
data.BDAY = bdayFormat(new Date(data.BDAY));
data.interests = boughtBrands;


/**
 * create function to return
 * JSON for the fetch async
*/
raw = JSON.stringify({
  "email_address": data.email_address,
  "email_type": "html",
  "status": "subscribed",
  "merge_fields": {
    "NOMBRE": data.NOMBRE,
    "APELLIDO": data.APELLIDO,
    "TEL": data.TEL,
    "BDAY": data.BDAY,
    "GENERO": data.GENERO,
    "TIENDA": data.TIENDA,
    "CONSEJERA": data.CONSEJERA,
    "LUGAR": data.LUGAR
  },
  "interests": data.interests,
  "language": "es",
  "vip": false,
  "location": {
    "latitude": "",
    "longitude": ""
  },
  "marketing_permissions": [],
  "ip_signup": "",
  "timestamp_signup": isoDate(new Date()),
  "ip_opt": "",
  "timestamp_opt": "",
  "tags": []
});

console.log(raw);

/**
 * Send Form data
 * to Mailchimp API
 */
fetch(`${MAILCHIMP_URL}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .then(error => console.log("error", error))

}); /* end EventListener */
