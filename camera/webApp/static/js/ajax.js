var validtions = []
var counter = 1

function uploadChangeImages(passportImg=null,faceImg=null,passport,name,customer_Id) {

  var pssportInput = document.getElementById('changeImagesPassport')
  var CustomerId = document.getElementById('changeImagesCustomerId')
  var nameInput = document.getElementById('changeImagesName')
  var personalImg = document.getElementById('changeImagesPersonal')
  var pssportInputImg = document.getElementById('changeImagesPassportImg')

  pssportInput.value = passport
  CustomerId.value = customer_Id
  nameInput.value = name

  if (passportImg != "None"){
    pssportInputImg.src = passportImg
  }
  else{
    pssportInputImg.src = pssportInputImg.alt
  }

  if (faceImg != "None"){
    personalImg.src = faceImg
  }
  else{
    personalImg.src = personalImg.alt
  }

}

function setImageInImageBoxPassport(inputId,imageId) {
  console.log(inputId)
  file=$('#'+inputId);
  file = file[0]
  var reader = new FileReader();
  if (file.files && file.files[0]) {
    reader.onload = function(e) {
      $('#'+imageId).attr('src', e.target.result);
      console.log("onload")
    }
    reader.readAsDataURL(file.files[0])
    console.log( $('#'+imageId).src)
  }
}

function submitUploadChangeImages() {

  var pssportInput = document.getElementById('changeImagesPassport')
  var customer_Id = document.getElementById('changeImagesCustomerId')

  file1=$('#personalImageInput');
  file2=$('#passportImageInput');

  pImage = document.getElementById('changeImagesPassportImg')
  fImage = document.getElementById('changeImagesPersonal')

  fImage =  fImage.src.includes("personalDummy");;
  pImage =  pImage.src.includes("passportDummy");;

// || fImage.src != '/static/image/personalDummy.jpg'
  if (file1[0].files[0]  ) {
    document.querySelector("#changeImages").classList.toggle("myShow-modal")
    openLoader()

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        console.log(this.responseText);

      }
    });

    xhr.open("POST", "/saveUploadChangeImages/", false);
    xhr.setRequestHeader("fileFullName", (file1[0].files[0]['name']));
    xhr.send(file1[0].files[0]);



  var requestOptions = {
      method: 'POST',
      body:JSON.stringify({

        "pssportInput": pssportInput.value,
        "customerId": customer_Id.value,

        "fileNamePersonal": (file1[0].files[0]['name']).split('.')[0],
        "fileFullNamePersonal": (file1[0].files[0]['name']),
        "typePersonal":file1[0].files[0]['type'],

    }),
      headers: {}
  };
  fetch("/submitUploadChangeImages/", requestOptions)
  .then(response => response.text())
  .then(result => {
      window.location = window.location
  })
  .catch(error => console.log('error', error));

  }
  if (file2[0].files[0]) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        console.log(this.responseText);
      }
    });
    xhr.open("POST", "/saveUploadChangeImages/" ,false);
    xhr.setRequestHeader("fileFullName", (file2[0].files[0]['name']));
    xhr.send(file2[0].files[0]);

    var requestOptions = {
        method: 'POST',
        body:JSON.stringify({

          "pssportInput": pssportInput.value,
          "customerId": customer_Id.value,

          "fileNamePassport": (file2[0].files[0]['name']).split('.')[0],
          "fileFullNamePassport": (file2[0].files[0]['name']),
          "typePassport":file2[0].files[0]['type']

      }),
        headers: {}
    };
    fetch("/submitUploadChangeImages/", requestOptions)
    .then(response => response.text())
    .then(result => {
        window.location = window.location
    })
    .catch(error => console.log('error', error));
  }
  if (fImage && pImage) {
    alert("Please upload file !")
  }

}

function branchChackfunc() {

  var branchChack = document.getElementById('branchChack')
  var branchSelect = document.getElementById('branchSelect')
  if (branchChack.checked === true){
    branchSelect.disabled=false
  }
  else{
    // branchSelect.value=0
    branchSelect.disabled=true
  }
}


String.prototype.toDate = function (format) {
  var normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems = normalizedFormat.split('-');
  var dateItems = normalized.split('-');

  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var hourIndex = formatItems.indexOf("hh");
  var minutesIndex = formatItems.indexOf("ii");
  var secondsIndex = formatItems.indexOf("ss");

  var today = new Date();

  var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
  var month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
  var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

  var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
  var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
  var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year, month, day, hour, minute, second);
};

function costHandeler() {
  var charsLength = (document.getElementById('costBulk').value.split(',').join('')).toString()
  var chunks = [];
  var str = ""
  for (var i = charsLength.length; i >= 0; i -= 3) {
    chunks.push(charsLength.substring(i, i - 3));
  }

  for (var i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] != "") {
      str += chunks[i] + ","
    }
  }
  str = str.substring(0, str.length - 1)
  document.getElementById('costBulk').value = str

  document.getElementById('totalCostValue').value = Number(charsLength) * counter.toString().split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
    return x.split('').reverse().join('')
  }).reverse()

  var charsLength = (document.getElementById('totalCostValue').value.split(',').join('')).toString()
  chunks = [];
  str = ""
  for (var i = charsLength.length; i >= 0; i -= 3) {
    chunks.push(charsLength.substring(i, i - 3));
  }

  for (var i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] != "") {
      str += chunks[i] + ","
    }
  }
  str = str.substring(0, str.length - 1)
  document.getElementById('totalCostValue').value = str
}

function changeInput2(id) {
  sumTotalcust()
}

function sumTotalcust() {
  sum = 0
  newObj = document.querySelector("#boxHolder #new")
  newObjChildren = newObj.children

  for (var i = newObjChildren.length; i >= 0; i--) {
    try {
      data = newObjChildren[i].querySelector("#costBulk").value
      sum += parseInt(data)
    } catch (error) {
    }
  }
  // sum += parseInt(document.querySelector("#old #new0 #costBulk").value)

  document.getElementById('totalCostValue').value = sum
}

// function testerchanging() {
//   costHandeler()

// }

// function checkfirstIssuanceType(){
//   var COVID19IssuanceTypeConstId
//   var radios = ["visaAndTest", "justVisa", "justTest"]
//   for (j = 0; j <= radios.length - 1; j++) {
//     var check = document.querySelector("#new0 #" + radios[j].toString())
//     if (check.checked) {
//       COVID19IssuanceTypeConstId = radios[j]
//     }
//   }
//   return(COVID19IssuanceTypeConstId)
// }


function addDiv(role, covidEmbassy) {
  creditSummaryCheck()


  var old = document.getElementById('new');
  if ((old.children).length >= 10) {
    alert("You can only register 10 people with each request")
    return null
  }
  var newz = old.querySelector('#new0');
  var newe = document.createElement('div');
  newe.id = "new" + counter.toString();



  newe.innerHTML = newz.innerHTML;
  // var p = document.getElementById('new');

  old.appendChild(newe);

  document.querySelector("#new" + counter.toString() + " #removeBtn").setAttribute("onclick", "removeDiv(" + counter.toString() + ")")

  document.querySelector("#new" + counter.toString() + " #openUploadImages").setAttribute("onclick", "openUploadImages(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #profileBox").src = "/static/image/personalDummy.jpg"
  document.querySelector("#new" + counter.toString() + " #profileBox").alt = ""
  document.querySelector("#new" + counter.toString() + " #ScannedImage").src = "/static/image/passportDummy.jpg"
  document.querySelector("#new" + counter.toString() + " #ScannedImage").alt = ""
  document.querySelector("#new" + counter.toString() + " #passportImageScanerInput0").id= "passportImageScanerInput" + counter.toString()

  document.querySelector("#new" + counter.toString() + " #removeBtn").style.display = "block"
  document.querySelector("#new" + counter.toString() + " #passportScaner").setAttribute("onclick", "passportScanBulk(" + counter.toString() + ", " + "'" + covidEmbassy + "'" + ")")
  document.querySelector("#new" + counter.toString() + " #passportScanerImage").setAttribute("onclick", "passportScanBulkImage(" + counter.toString() + ", " + "'" + covidEmbassy + "'" + ")")
  document.querySelector("#new" + counter.toString() + " #passportImageScaner").setAttribute("onclick", "document.getElementById('passportImageScanerInput" + counter.toString()  + "'" + ").click()")
  document.querySelector("#new" + counter.toString() + " #passportImageScanerInput" + counter.toString()).setAttribute("onchange", "croper(event," + counter.toString() + ")")

  document.querySelector("#new" + counter.toString() + " #vaccineImageButton").setAttribute("onclick", "document.getElementById('VaccineImage" + counter.toString()  + "'" + ").click()")
  document.querySelector("#new" + counter.toString() + " #VaccineImage0").id= "VaccineImage" + counter.toString()
  document.querySelector("#new" + counter.toString() + " #VaccineImage" + counter.toString()).setAttribute("onchange", "VaccineImageUpload(" + counter.toString() + ")")
  // ---------------------------------------------------------- start mohsen ----------------------------------------------------------
  document.querySelector("#new" + counter.toString() + " #VaccineImageImg" ).setAttribute("onclick", "document.getElementById('VaccineImage"+ counter.toString() +"').click()")
  document.querySelector("#new" + counter.toString() + " #VaccineImageImg").src = "/static/image/VaccineImage.png"
  document.querySelector("#new" + counter.toString() + " #ScannedImage" ).setAttribute("onclick", "openUploadImages(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #ScannedImage").src = "/static/image/passportDummy.jpg"
  document.querySelector("#new" + counter.toString() + " #profileBox" ).setAttribute("onclick", "openUploadImages(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #profileBox").src = "/static/image/personalDummy.jpg"
  //----------------------------------------------------------  end   mohsen ----------------------------------------------------------

  document.querySelector("#new" + counter.toString() + " #myBtn").setAttribute("onclick", "searchModal(" + counter.toString() + ")")

  document.querySelector("#new" + counter.toString() + " #costBulk").setAttribute("onchange", "changeInput2(" + counter.toString() + ")")

  document.querySelector("#new" + counter.toString() + " #passportNo").setAttribute("onchange", "passportCheck(" + counter.toString() + ", undefined, " + "'" + covidEmbassy + "'" + ")")
  if (document.querySelector("#new" + counter.toString() + " #passportNo").className.includes("unavailable-pass-number")) {
    document.querySelector("#new" + counter.toString() + " #passportNo").classList.toggle("unavailable-pass-number")
  }

  if (document.querySelector("#new" + counter.toString() + " #passportNo").className.includes("available-pass-number")) {
    document.querySelector("#new" + counter.toString() + " #passportNo").classList.toggle("available-pass-number")
  }


  document.querySelector("#new" + counter.toString() + " #Visa_And_MedicalCOVID19Test").setAttribute("onclick", "typeOfVisaChange(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #Visa_And_MedicalCOVID19Test").setAttribute("name", "optradio" + counter.toString())

  document.querySelector("#new" + counter.toString() + " #Only_Visa").setAttribute("onclick", "typeOfVisaChange(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #Only_Visa").setAttribute("name", "optradio" + counter.toString())

  document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").setAttribute("onclick", "typeOfVisaChange(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").setAttribute("name", "optradio" + counter.toString())
  
  document.querySelector("#new" + counter.toString() + " #Only_Insurance").setAttribute("onclick", "typeOfVisaChange(" + counter.toString() + ")")
  document.querySelector("#new" + counter.toString() + " #Only_Insurance").setAttribute("name", "optradio" + counter.toString())

  if (role.indexOf('COVID19 MedicalTest') >= 0) {
    // document.querySelector("#new" + counter.toString() + " #justTest").checked=true
    document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").checked=true

    // document.querySelector("#new" + counter.toString() + " #costBulk").value=getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").value)
    getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").value, counter)

    document.querySelector("#new" + counter.toString() + " #Only_Insurance").setAttribute("disabled", "true")
    document.querySelector("#new" + counter.toString() + " #Only_Visa").setAttribute("disabled", "true")
    document.querySelector("#new" + counter.toString() + " #Visa_And_MedicalCOVID19Test").setAttribute("disabled", "true")
  }
  else if (role.indexOf('COVID19 OnlyVisa') >= 0) {
    // document.querySelector("#new" + counter.toString() + " #justTest").checked=true
    document.querySelector("#new" + counter.toString() + " #Only_Visa").checked=true //.setAttribute("checked")

    // document.querySelector("#new" + counter.toString() + " #costBulk").value=getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").value)
    getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").value, counter)

    document.querySelector("#new" + counter.toString() + " #Only_Insurance").setAttribute("disabled", "true")
    document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").setAttribute("disabled", "true")
    document.querySelector("#new" + counter.toString() + " #Visa_And_MedicalCOVID19Test").setAttribute("disabled", "true")
  }
  // else if (role.indexOf('Insurance') >= 0) {
  //   // document.querySelector("#new" + counter.toString() + " #justTest").checked=true
  //   document.querySelector("#new" + counter.toString() + " #Insurance").checked=true //.setAttribute("checked")

  //   // document.querySelector("#new" + counter.toString() + " #costBulk").value=getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_MedicalCOVID19Test").value)
  //   getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Insurance").value, counter)

  //   document.querySelector("#new" + counter.toString() + " #Insurance").setAttribute("disabled", "true")
  //   // document.querySelector("#new" + counter.toString() + " #Insurance").setAttribute("disabled", "true")
  // }
  else {
    // document.querySelector("#new" + counter.toString() + " #costBulk").value=getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Visa_And_MedicalCOVID19Test").value)
    getCovidDefaultFee(document.querySelector("#new" + counter.toString() + " #Only_Visa").value, counter)

    document.querySelector("#new" + counter.toString() + " #Only_Visa").checked=true //.setAttribute("checked")
  }

  document.querySelector("#new" + counter.toString() + " #typeOfvisaBulk").removeAttribute("disabled")

  document.querySelector('#new' + counter.toString() + ' #firstNameLang').disabled = false

  document.querySelector('#new' + counter.toString() + ' #firstName').disabled = false

  document.querySelector('#new' + counter.toString() + ' #lastName').disabled = false

  document.querySelector('#new' + counter.toString() + ' #gender').disabled = false

  document.querySelector('#new' + counter.toString() + ' #passportNo').disabled = false

  document.querySelector('#new' + counter.toString() + ' #birthYear').disabled = false



  counter++;
  sumTotalcust()
  policyCheckInradio()
}

function addPersonInConsole(role) {

  var i = document.getElementById('containerHolder');
  var d = document.getElementById('container0').innerHTML;
  var innerContainer = document.createElement('div')
  innerContainer.innerHTML = d
  innerContainer.style = "border: 1px solid #1a3375!important;border-radius: 6px;"
  innerContainer.className = "m-3 p-2"
  innerContainer.id = "container" + counter
  i.appendChild(innerContainer);

  document.querySelector("#container" + counter.toString() + " #removeBtn").setAttribute("onclick", "removeConsoleDiv(" + counter.toString() + ")")
  document.querySelector("#container" + counter.toString() + " #removeBtn").style.display = "block"
  consolePageItemChenger()
  counter++;
}

function consolePageItemChenger() {
  newObj = document.querySelector("#containerHolder")
  newObjChildren = newObj.children
  consoleCounter = 0
  for (var i = newObjChildren.length; i >= 0; i--) {
    try {
      newObjChildren[i].querySelector("#itemTitle").innerHTML = "# Person " + (i + 1)
      consoleCounter++
    } catch (error) {
    }
  }
  document.querySelector("#personCount").value = consoleCounter.toString()
}

function removeConsoleDiv(id) {
  document.getElementById("container" + id).remove()
  consolePageItemChenger()
}


function submitVisaRequest() {
  data = {
    "items": {
      "bdmCOVID19EmbassyDataInput": []
    },
    "special": false
  }
  newObj = document.querySelector("#radioButtonHolder")
  newObjChildren = newObj.children
  for (var i = newObjChildren.length; i >= 0; i--) {
    try {
      if (newObjChildren[i].querySelector('#radioButton').checked && newObjChildren[i].querySelector('#radioButton').value == "true") {
        data['special'] = true
      }
    } catch (error) {
    }
  }

  newObj = document.querySelector("#containerHolder")
  newObjChildren = newObj.children
  for (var i = newObjChildren.length; i >= 0; i--) {
    try {
      item = {
        "passportNo": newObjChildren[i].querySelector('#passportNo').value,
        "visaTypeConstId": newObjChildren[i].querySelector('#typeOfvisaBulk').value
      }
      // item = {
      //     "bdmCOVID19EmbassyDataInput": {
      //         "passportNo": newObjChildren[i].querySelector('#passportNo').value,
      //         "vip": data['special'],
      //         "visaTypeConstId": {
      //             "persistenceId_string": newObjChildren[i].querySelector('#typeOfvisaBulk').value
      //         },
      //         "branchCOVIDEmbassySettingId": {
      //             "persistenceId_string": ""
      //         },
      //         "used": false,
      //         "covid19Id": {
      //             "persistenceId_string": ""
      //         },
      //         "persistenceId": 0
      //     }
      // }
      item =
      {
        "passportNo": newObjChildren[i].querySelector('#passportNo').value,
        "vip": data['special'],
        "visaTypeConstId": {
          "persistenceId_string": newObjChildren[i].querySelector('#typeOfvisaBulk').value
        },
        "branchCOVIDEmbassySettingId": {
          "persistenceId_string": "1"
        },
        "used": false,
        "covid19Id": {
          "persistenceId_string": "7033785"
        },
        "persistenceId": 0
      }
      data['items']['bdmCOVID19EmbassyDataInput'].push(item)
      item = {}
    } catch (error) {
    }
  }




  setdata = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      window.location = window.location
    }
  });
  xhr.open("POST", "/visaRequest");
  xhr.send(setdata);
}



var errorFild = false;
var expirFild = false
var embessyFild = false

function dateOfExpireCheck(date) {
  var mydate = new Date(date);
  var newDateObj = new Date();
  var newDate = new Date(newDateObj.setMonth(newDateObj.getMonth() + 6));

  if (mydate >= newDate) {
    return true
  }
  else {
    return false
  }
}

function mobileNoBulkChek() {
  var mobileNoBulk = document.querySelector('#mobileNoBulk')
  if (mobileNoBulk.value.length === 11) {
    mobileNoBulk.style = "border-color: #ced4da;";
  }
  else {
    mobileNoBulk.style = "border-color: #ec8888;";
  }
}

function checkname() {
  if (creditSummaryCheck() === null) {
    alert("Your credit is not enough to issue")
    return null
  }
  errorFild = false;
  expirFild = false
  embessyFild = false
  var data = []
  for (let i = 0; i < counter; i++) {
    var arabicName = document.querySelector('#new' + i.toString() + ' #firstNameLang').value
    var arabicLastname = ""
    // var arabicLastname = document.querySelector('#new' + i.toString() + ' #lastNameLang').value
    document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = "position: unset;"
    var passport = document.querySelector('#new' + i.toString() + ' #passportNo').value
    var englishName = document.querySelector('#new' + i.toString() + ' #firstName').value
    var englishlastName = document.querySelector('#new' + i.toString() + ' #lastName').value

    var DateOfIssue = document.querySelector('#new' + i.toString() + ' #DateOfIssue').value
    var DateOfExpire = document.querySelector('#new' + i.toString() + ' #DateOfExpire').value
    var birthYear = document.querySelector('#new' + i.toString() + ' #birthYear').value

    var mobileNoBulk = document.querySelector('#mobileNoBulk').value
    var ghesaseNumber = document.querySelector('#ghesaseNumber')
    var customerReferenceId = document.querySelector('#customerReferenceId')
    var embessyCode = document.querySelector('#new' + i.toString() + ' #embessyCode').value
    // var embessyCode = document.querySelector('#embessyCode').value
    // var profileBox = document.querySelector("#new" + i.toString() + " #profileBox").alt
    // var ScannedImage = document.querySelector("#new" + i.toString() + " #ScannedImage").alt === ""
    // console.log(embessyCode)
    // console.log(ghesaseNumber.disabled)
    var year  = new Date().getFullYear();
    var month = new Date().getMonth();
    var day   = new Date().getDate();

    var lastYear = new Date(year - 200, month, day);
    var maxYear = new Date(year + 50, month, day);

    var today = new Date(year, month, day + 1);
    DateOfExpireCheck = new Date(DateOfExpire)
    DateOfIssueCheck = new Date(DateOfIssue)
    birthYearCheck = new Date(birthYear)


    if((DateOfExpireCheck.getTime() <= lastYear.getTime() || DateOfExpireCheck.getTime() >= maxYear.getTime())){
      document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = "border: solid red 1px;position: unset;"
      errorFild = true;
    }
    else{
      document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = ""
    }

    if((birthYearCheck.getTime() <= lastYear.getTime() || birthYearCheck.getTime() >= today.getTime())){
      document.querySelector('#new' + i.toString() + ' #birthYear').style = "border: solid red 1px;position: unset;"
      errorFild = true;
    }
    else{
      document.querySelector('#new' + i.toString() + ' #birthYear').style = ""
    }

    if((DateOfIssueCheck.getTime() <= lastYear.getTime() || DateOfIssueCheck.getTime() >= today.getTime())){

      document.querySelector('#new' + i.toString() + ' #DateOfIssue').style = "border: solid red 1px;position: unset;"
      errorFild = true;
    }
    else {
      document.querySelector('#new' + i.toString() + ' #DateOfIssue').style = ""
    }
    if (ghesaseNumber.disabled === true) {
      if (embessyCode === "") {
        embessyFild = true;
      }
    }
    if (customerReferenceId.disabled === true) {
      if (embessyCode === "") {
        embessyFild = true;
      }
    }

    if (arabicName === "") {
      // document.querySelector('#new' + i.toString() + ' #firstNameLang').style = "border: solid red 1px;position: unset;"
      // errorFild = true;
      if (englishName === "" ) {
        document.querySelector('#new' + i.toString() + ' #firstName').style = "border: solid red 1px;position: unset;"
        errorFild = true;
      }
      else{
        document.querySelector('#new' + i.toString() + ' #firstName').style = ""
      }
      if ( englishlastName === "") {
        document.querySelector('#new' + i.toString() + ' #lastName').style = "border: solid red 1px;position: unset;"
        errorFild = true;
      }
      else{
        document.querySelector('#new' + i.toString() + ' #lastName').style = ""
      }
    }
    if (mobileNoBulk.length != 11) {
      document.querySelector('#new' + i.toString() + ' #mobileNoBulk').style = "border: solid red 1px;position: unset;"
      errorFild = true;
    }
    // else{
    //   document.querySelector('#new' + i.toString() + ' #mobileNoBulk').style = ""
    // }
    // if (profileBox === "" || ScannedImage === "") {
    //   errorFild = true;
    // }
    if (passport === "") {
      document.querySelector('#new' + i.toString() + ' #passportNo').style = "border: solid red 1px;position: unset;"
      errorFild = true;
    }
    else{
      document.querySelector('#new' + i.toString() + ' #passportNo').style = ""
    }
    // if (ghesaseNumber === 0) {
    //   errorFild = true;
    // }

    if (DateOfIssue === "") {
      document.querySelector('#new' + i.toString() + ' #DateOfIssue').style = "border: solid red 1px;position: unset;"
      errorFild = true;
      if(DateOfExpire === ""){
        document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = "border: solid red 1px;position: unset;"
        errorFild = true;
      }
      else {
        document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = ""
      }
    }
    else{
      document.querySelector('#new' + i.toString() + ' #DateOfIssue').style = ""
    }

    // "countOfGhesase": document.querySelector('#countOfGhesase').value,
    // "ghesaseNumber": document.querySelector('#ghesaseNumber').value,

    // if (document.querySelector('#ghesaseDate').value === "" ) {
    //   errorFild = true;
    // }
    if (dateOfExpireCheck(DateOfExpire) === false) {
      document.querySelector('#new' + i.toString() + ' #DateOfExpire').style = "border: solid red 1px;position: unset;"
      expirFild = true;
    }
    bulk = {
      "firstNameLang": arabicName != "" ? arabicName : englishName + " " + englishlastName,
      "lastNameLang": arabicLastname != "" ? arabicLastname : englishlastName,
      "passportNo": document.querySelector('#new' + i.toString() + ' #passportNo').value
    }
    data.push(bulk)

  }

  if (errorFild === true) {
    alert("Please fill in all fields !!!!")
  }
  if (expirFild === true) {
    alert("Passport expiration date is less than 6 months")
  }
  if (embessyFild === true) {
    alert("The embassy number is not available for this passport !")
  }
  // if (errorFild) {
  addTr(data)
  // }
}
// mohsen
 function confirmAction() {
        let confirmAction = confirm("Are you sure to execute this action?");
        if (confirmAction) {
          alert("Action successfully executed");
        } else {
          alert("Action canceled");
        }
      }




function addTr(data) {
  document.getElementById('trTable').innerHTML = ""
  for (i = 0; i < data.length; i++) {
    document.getElementById('trTable').innerHTML += '<tr id="trRow" ><td><input id="fullNameTable" style="border:unset;text-align: center;direction: ltr !important" disabled value="' + data[i]["firstNameLang"].toString() + '" /></td><td><input value="' + data[i]["passportNo"].toString() + '" id="passportNoTable" style="border:unset;text-align: center;direction: ltr !important" disabled /></td></tr>'
  }
}


function removeDiv(id) {

  var totalCostMinus = document.getElementById("costBulk").value.split(",").join("")
  var totalCostNumberMinus = Number(totalCostMinus)
  var totalCostValueMinus = document.getElementById("totalCostValue").value.split(",").join("")
  totalCostValueMinus = totalCostValueMinus - totalCostNumberMinus
  document.getElementById("totalCostValue").value = totalCostValueMinus.toString().split('').reverse().join('').match(/.{1,3}/g).map(function (x) {
    return x.split('').reverse().join('')
  }).reverse()
  var i = document.querySelector("#new #new" + id.toString())
  i.remove();
  counter--;
  sumTotalcust()
  policyCheckInradio()
  creditSummaryCheck()

}
function autoloader(e) {
  openLoader()
  setTimeout(function () { closeLoader() }, e);
}

function openLoader() {
  document.getElementById('loader').style.display = 'block'
}

function closeLoader() {
  document.getElementById('loader').style.display = 'none'
}

function setCostInInput() {
  openLoader()
  var newObj = document.querySelector("#boxHolder #new")
  var newObjChildren = newObj.children
  var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test", "Only_Insurance"]
  for (var i = 0; i <= newObjChildren.length - 1; i++) {
    for (j = 0; j <= radios.length - 1; j++) {
      var check = newObjChildren[i].querySelector("#" + radios[j].toString())
      if (check.checked) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.async = true,
          xhr.addEventListener("readystatechange", (function () {
            if (this.responseText == null) {
              window.location = '/login'
            }

            try {

              newObjChildren[i].querySelector("#costBulk").value = this.responseText
            } catch (error) {

            }
            sumTotalcust()
            closeLoader()
          }));
        xhr.open("POST", "/getCovidDefaultFee/" + check.value, false);
        xhr.send();
      }
    }
  }
}

function checkDisable() {

  var checkFree = document.getElementById('check_free');
  var newObj = document.querySelector("#boxHolder #new")
  var newObjChildren = newObj.children
  if (checkFree.checked) {
    for (var i = 0; i <= newObjChildren.length; i++) {
      try {
        newObjChildren[i].querySelector("#costBulk").disabled = true
        newObjChildren[i].querySelector("#costBulk").value = 0
      } catch (error) {
      }
    }
    sumTotalcust()

  }

  if (!checkFree.checked) {
    for (var i = 0; i <= newObjChildren.length - 1; i++) {
      try {
        var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test", "Only_Insurance"]
        for (j = 0; j <= radios.length - 1; j++) {
          var check = newObjChildren[i].querySelector("#" + radios[j].toString())
          if (check.checked) {
            newObjChildren[i].querySelector("#costBulk").disabled = false
          }
        }



      } catch (error) {
      }
    }
    setCostInInput()
    closeLoader()
    // inputCost.disabled = false;
    // inputTypeOfCurrency.disabled = false
  }

  //test start
  // var costHolder = ""
  // var totalHolder = ""
  // function checkDisable() {
  //   var checkFree = document.getElementById('check_free');
  //   var inputCost = document.getElementById('costBulk');
  //   // var inputTypeOfCurrency = document.getElementById('typeOfCurrencyBulk');
  //   if (checkFree.checked) {
  //     costHolder = document.getElementById('costBulk').value
  //     totalHolder = document.getElementById('totalCostValue').value
  //     document.getElementById('costBulk').value = 0
  //     document.getElementById('totalCostValue').value = 0
  //     inputCost.disabled = true;
  //     // inputTypeOfCurrency.disabled = true
  //   }
  //   if (!checkFree.checked) {
  //     document.getElementById('costBulk').value = costHolder
  //     document.getElementById('totalCostValue').value = totalHolder
  //     inputCost.disabled = false;
  //     // inputTypeOfCurrency.disabled = false
  //   }
  // }
  //test end


}
function srarch() {
  openLoader()
  document.getElementById('myModal-content').style.display = "none"
  var searchItem = document.getElementById('searchCustomerByPasport').value
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#searchTable').innerHTML = this.responseText;
      closeLoader()
      document.getElementById('myModal-content').style.display = "block"
    }
  });

  xhr.open("GET", "/searchCustomer/" + searchItem);

  xhr.send();
}
function registerBulk() {
  if (errorFild) {
    alert("Please fill in all fields")
  }
  else if (expirFild) {
    alert("Passport expiration date is less than 6 months")
  }

  else {
    openLoader()
    document.getElementById('myModalRegister').style.display = "none"
    var data = []
    customer = {
      "ghesaseDate": document.querySelector('#ghesaseDate').value,
      "countOfGhesase": document.querySelector('#countOfGhesase').value,
      "ghesaseNumber": document.querySelector('#ghesaseNumber').value,
      "ghesaseDate": document.querySelector('#ghesaseDate').value,
      "customerReferenceId": document.querySelector('#customerReferenceId').value,
      "mobileNoBulk": document.querySelector('#mobileNoBulk').value,
      // "mobileNoBulk": document.querySelector('#mobileNoBulk').value != "" ? document.querySelector('#mobileNoBulk').value : [errorFild = true, document.querySelector('#mobileNoBulk').style = "border: #dd0033 solid 1px;"],
      "typeOfCurrencyBulk": document.querySelector('#typeOfCurrencyBulk').value,
      "totalCostValue": document.querySelector('#costBulk').value,
      "branchCheck": document.getElementById('branchChack').checked,
      "branchSelect": document.getElementById('branchSelect').value,
      "PolicyPlan": document.querySelector('#Policy').checked ? document.querySelector('#PolicyPlan').value : null,
    }
    data.push(customer)

    newObj = document.querySelector("#boxHolder #new")
    newObjChildren = newObj.children
    for (let i = 0; i < counter; i++) {
      var COVID19IssuanceTypeConstId
      var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test", "Only_Insurance"]
      for (j = 0; j <= radios.length -1; j++) {
        var check = document.querySelector("#new" + i.toString() + " #" + radios[j].toString())
        if (check.checked) {
          COVID19IssuanceTypeConstId = document.querySelector("#new" + i.toString() + " #" + radios[j].toString()).value
        }
      }
    // if(COVID19IssuanceTypeConstId == undefined){
    //   COVID19IssuanceTypeConstId  = document.querySelector("#Insurance").value 
    // }

      bulk = {
        // "firstName": document.querySelector('#new' + i.toString() + ' #firstName').value != "" ? document.querySelector('#new' + i.toString() + ' #firstName').value : [errorFild = true, document.querySelector('#new' + i.toString() + ' #firstName').style = "border: #dd0033 solid 1px;"],
        // "lastName": document.querySelector('#new' + i.toString() + ' #lastName').value != "" ? document.querySelector('#new' + i.toString() + ' #lastName').value : [errorFild = true, document.querySelector('#new' + i.toString() + ' #lastName').style = "border: #dd0033 solid 1px;"],

        "FaceImageData": document.querySelector("#new" + i.toString() + " #profileBox").alt,
        "ScannedImageData": document.querySelector("#new" + i.toString() + " #ScannedImage").alt,
        "VaccineImageData": document.querySelector("#new" + i.toString() + " #VaccineImageImg").alt,
        "embessyCode": document.querySelector("#new" + i.toString() + " #embessyCode").value,
        // "customerReferenceId": document.querySelector("#new" + i.toString() + " #customerReferenceId").value,

        // "FaceImageData": "",
        // "ScannedImageData": "",

        "fatherName": document.querySelector('#new' + i.toString() + ' #fatherName').value.replace(",", " "),
        "firstName": document.querySelector('#new' + i.toString() + ' #firstName').value.replace(",", " "),
        "costBulk": document.querySelector('#new' + i.toString() + ' #costBulk').value,
        "lastName": document.querySelector('#new' + i.toString() + ' #lastName').value.replace(",", " "),
        "firstNameLang": document.querySelector('#new' + i.toString() + ' #firstNameLang').value,
        "lastNameLang": "",
        "passportNo": document.querySelector('#new' + i.toString() + ' #passportNo').value,
        "birthYear": document.querySelector('#new' + i.toString() + ' #birthYear').value,
        "gender": document.querySelector('#new' + i.toString() + ' #gender').value,
        "DateOfIssue": document.querySelector('#new' + i.toString() + ' #DateOfIssue').value,
        "DateOfExpire": document.querySelector('#new' + i.toString() + ' #DateOfExpire').value,
        "Country": document.querySelector('#new' + i.toString() + ' #Country').value,
        "Nationality": document.querySelector('#new' + i.toString() + ' #Nationality').value,
        "typeOfvisaBulk": COVID19IssuanceTypeConstId == "12000027" ? null : document.querySelector('#new' + i.toString() + ' #typeOfvisaBulk').value,
        "COVID19IssuanceTypeConstId": COVID19IssuanceTypeConstId,
      }
      data.push(bulk)
    }

    // sum+=parseInt(document.querySelector("#old #new0 #costBulk").value)

    // var COVID19IssuanceTypeConstId0
    // var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test"]
    // for (j = 0; j <= radios.length -1 ; j++) {
    //   var check = document.querySelector("#new" + i.toString() + " #" + radios[j].toString())
    //   if (check.checked) {
    //     COVID19IssuanceTypeConstId0 = document.querySelector("#old #new0 #" + radios[j].toString()).value
    //   }
    // }

    // bulk = {
    //   // "firstName": document.querySelector('#new' + i.toString() + ' #firstName').value != "" ? document.querySelector('#new' + i.toString() + ' #firstName').value : [errorFild = true, document.querySelector('#new' + i.toString() + ' #firstName').style = "border: #dd0033 solid 1px;"],
    //   // "lastName": document.querySelector('#new' + i.toString() + ' #lastName').value != "" ? document.querySelector('#new' + i.toString() + ' #lastName').value : [errorFild = true, document.querySelector('#new' + i.toString() + ' #lastName').style = "border: #dd0033 solid 1px;"],
    //   "firstName": document.querySelector("#old #new0 #firstName").value.replace(",", " "),
    //   "costBulk": document.querySelector("#old #new0 #costBulk").value,
    //   "lastName": document.querySelector("#old #new0 lastName").value.replace(",", " "),
    //   "firstNameLang": document.querySelector("#old #new0 #firstNameLang").value,
    //   "lastNameLang": "",
    //   "passportNo": document.querySelector("#old #new0 #passportNo").value,
    //   "birthYear": document.querySelector("#old #new0 #birthYear").value,
    //   "gender": document.querySelector("#old #new0 #gender").value,
    //   "DateOfIssue": document.querySelector("#old #new0 #DateOfIssue").value,
    //   "DateOfExpire": document.querySelector("#old #new0 #DateOfExpire").value,
    //   "typeOfvisaBulk": COVID19IssuanceTypeConstId == "12000027" ? null : document.querySelector("#old #new0 #typeOfvisaBulk").value,
    //   "COVID19IssuanceTypeConstId": COVID19IssuanceTypeConstId0,
    // }
    // data.push(bulk)
    var setData = JSON.stringify(data);

    if (errorFild === false && expirFild === false) {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          closeLoader()
          // document.getElementById('myModalRegister').style.display="block"
          if (this.responseText == null) {
            // $("#submitGroup").click(function () {
            document.getElementById('alertErrorBulk').style.display = "block"
            setTimeout(function () { document.getElementById('alertErrorBulk').style.display = "none" }, 3000);
            // });
          }
          else {
            // $("#submitGroup").click(function () {
            document.getElementById('alertSuccessBulk').style.display = "block"
            setTimeout(function () { document.getElementById('alertSuccessBulk').style.display = "none" }, 3000);
            // });
            window.location = '/bulk'
          }
        }
      });
      console.log(setData)
      xhr.open("POST", "/registerBulk", true);
      xhr.send(setData);
    }
    else {
      alert("not valid !!!")
      closeLoader()
    }
  }
}
function validations(Id, result) {
  if (result === 'true') {
    // document.getElementById('validationsFalseBtn' + Id.toString()).disabled = true
    document.getElementById('validationsFalseBtn' + Id.toString()).style = "background-color: unset;color:black"
    document.getElementById('validationsTrueBtn' + Id.toString()).style = "background-color: red;"

  }
  else {
    // document.getElementById('validationsTrueBtn' + Id.toString()).disabled = true
    document.getElementById('validationsTrueBtn' + Id.toString()).style = "background-color: unset;color:black"
    document.getElementById('validationsFalseBtn' + Id.toString()).style = "background-color: green;"
  }
  test = {
    "positive": result === 'true' ? true : false,
    "persistenceId_string": Id.toString()
  }
  validtions.push(test)
}

function validationsSubmit() {
  openLoader()
  document.getElementById('myModalId').style.display = "none"

  var setData = JSON.stringify(validtions);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = '/recordResult'
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "/validationsSubmit");
  xhr.send(setData);
}
function validationsSingel(Id, result) {
  openLoader()
  if (result === 'true') {
    document.getElementById('validationsFalseBtn' + Id.toString()).disabled = true
    document.getElementById('validationsFalseBtn' + Id.toString()).style = "background-color: unset;color:black"
    document.getElementById('validationsTrueBtn' + Id.toString()).style = "background-color: red;"

  }
  else {
    document.getElementById('validationsTrueBtn' + Id.toString()).disabled = true
    document.getElementById('validationsTrueBtn' + Id.toString()).style = "background-color: unset;color:black"
    document.getElementById('validationsFalseBtn' + Id.toString()).style = "background-color: green;"
  }
  test = {
    "positive": result === 'true' ? true : false,
    "persistenceId_string": Id.toString()
  }
  var setData = JSON.stringify([test]);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = '/unArchived'
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "/validationsSubmit");
  xhr.send(setData);
}

function passportScan() {
  openLoader()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("http://localhost:6789/command?key=scan", requestOptions)
    .then(response => response.text())
    .then(result => dataCreaterRegister(result))
    .catch(error => errorHandeler());

}
function dataCreaterRegister(result) {
  var berth = JSON.parse(result)['DateOfBirth'].toString()
  berth = berth.substring(6, 18)
  document.getElementById('lastNameEnglish').value = JSON.parse(result)['Surname']
  document.getElementById('firstNameEnglish').value = JSON.parse(result)['FullName']
  document.getElementById('genderRegister').value = (JSON.parse(result)['Gender']).toString() != "Male" ? "5" : "4"
  document.getElementById('passportNumber').value = JSON.parse(result)['PassNoOrNatCode']

  closeLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.getElementById('datePicker').value = this.responseText;
    }
  });

  xhr.open("GET", "/dateConverter/" + berth.toString());

  xhr.send();

}

function errorHandeler() {
  closeLoader()
  document.getElementById('alertErrorScanerBulk').style.display = "block"
  setTimeout(function () { document.getElementById('alertErrorScanerBulk').style.display = "none" }, 3000);
}

function passportScanBulk(tabIndex, covidEmbassy) {

  openLoader()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("http://localhost:6789/command?key=scan", requestOptions)
    .then(response => response.text())
    .then(result => dataCreaterRegisterBulk(result, tabIndex, covidEmbassy))
    .catch(error => errorHandeler());
}


// function submitUploadImages(i) {
//
//   file1=$('#personalImageInput');
//   file2=$('#passportImageInput');
//   if (file1[0].files[0] && file2[0].files[0]){
//     document.querySelector("#changeImages").classList.toggle("myShow-modal")
//     // openLoader()
//
//     uploadOrginalImage(file1[0].files[0], 'profileBox', i)
//     uploadOrginalImage(file2[0].files[0], 'ScannedImage', i)
//
//     var file1R = new FileReader();
//     file1R.onload = function(e) {
//       document.querySelector('#new' + i.toString() + ' #profileBox').setAttribute('src', e.target.result);
//     }
//
//     var file2R = new FileReader();
//     file2R.onload = function(e) {
//       document.querySelector('#new' + i.toString() + ' #ScannedImage').setAttribute('src', e.target.result);
//     }
//
//
//     file1R.readAsDataURL(file1[0].files[0])
//     file2R.readAsDataURL(file2[0].files[0])
//
//   }
//   else{
//   alert("Please upload each file !")
//   }
// }

function submitUploadImages(i) {

  file1=document.getElementById("changeImagesPersonal");
  file2=document.getElementById("changeImagesPassportImg");
  document.querySelector("#changeImages").classList.toggle("myShow-modal")
    // openLoader()

  // uploadbs64fultext(file, name, i)

  fImage =  file1.src.includes("personalDummy");
  pImage =  file2.src.includes("passportDummy");
  if (fImage === false) {
    uploadbs64fultext(file1.src, 'profileBox', i)
    document.querySelector('#new' + i.toString() + ' #profileBox').src = file1.src
  }

  if (pImage === false) {
  uploadbs64fultext(file2.src, 'ScannedImage', i)
  document.querySelector('#new' + i.toString() + ' #ScannedImage').src = file2.src
  }

  closeLoader()

}

function VaccineImageUpload(i) {

  file=$('#VaccineImage'+i);
  if (file[0].files[0]){
    // openLoader()

    uploadOrginalImage(file[0].files[0], 'VaccineImageImg', i)

    var file1R = new FileReader();
    file1R.onload = function(e) {
      document.querySelector('#new' + i.toString() + ' #VaccineImageImg').setAttribute('src', e.target.result);
    }



    file1R.readAsDataURL(file[0].files[0])

  }
  else{
  alert("Please upload each file !")
  }
}


//
// function submitUploadChangeImages() {
//
//   var pssportInput = document.getElementById('changeImagesPassport')
//
//   file1=$('#personalImageInput');
//   file2=$('#passportImageInput');
//   if (file1[0].files[0] && file2[0].files[0]){
//   document.querySelector("#changeImages").classList.toggle("myShow-modal")
//   openLoader()
//
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;
//
//   xhr.addEventListener("readystatechange", function () {
//     if (this.readyState === 4) {
//       if (this.responseText == null) {
//         window.location = '/login'
//       }
//       console.log(this.responseText);
//
//     }
//   });
//
//   xhr.open("POST", "/saveUploadChangeImages/" ,false);
//   xhr.setRequestHeader("fileFullName", (file1[0].files[0]['name']));
//   xhr.send(file1[0].files[0]);
//
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;
//
//   xhr.addEventListener("readystatechange", function () {
//     if (this.readyState === 4) {
//       if (this.responseText == null) {
//         window.location = '/login'
//       }
//       console.log(this.responseText);
//     }
//   });
//
//   xhr.open("POST", "/saveUploadChangeImages/" ,false);
//   xhr.setRequestHeader("fileFullName", (file2[0].files[0]['name']));
//   xhr.send(file2[0].files[0]);
//
//   var requestOptions = {
//       method: 'POST',
//       body:JSON.stringify({
//
//         "pssportInput": pssportInput.value,
//
//         "fileNamePersonal": (file1[0].files[0]['name']).split('.')[0],
//         "fileFullNamePersonal": (file1[0].files[0]['name']),
//         "typePersonal":file1[0].files[0]['type'],
//
//         "fileNamePassport": (file2[0].files[0]['name']).split('.')[0],
//         "fileFullNamePassport": (file2[0].files[0]['name']),
//         "typePassport":file2[0].files[0]['type']
//
//     }),
//       headers: {}
//   };
//   fetch("/submitUploadChangeImages/", requestOptions)
//   .then(response => response.text())
//   .then(result => {
//       window.location = window.location
//   })
//   .catch(error => console.log('error', error));
//   }
//   else{
//   alert("Please upload each file !")
//   }
// }
//


function passportScanBulkImage(tabIndex, covidEmbassy) {

  openLoader()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("http://localhost:6789/command?key=scan", requestOptions)
    .then(response => response.text())
    .then(result => dataCreaterRegisterBulkImages(result, tabIndex, covidEmbassy))
    .catch(error => errorHandeler());
}

function dataCreaterRegisterBulk(result, i, covidEmbassy = null) {
  if (covidEmbassy && covidEmbassy === 'True') {
    embassyCodeCheck(i)
  }

  uploadBase64Image(JSON.parse(result)['FaceImageData'], 'profileBox', i)
  uploadBase64Image(JSON.parse(result)['ScannedImageData'], 'ScannedImage', i)

  var berth = JSON.parse(result)['DateOfBirth'].toString()
  berth = berth.substring(6, 18)

  document.querySelector('#new' + i.toString() + ' #firstName').value = JSON.parse(result)['FullName'].replace(",", " ")
  document.querySelector('#new' + i.toString() + ' #lastName').value = JSON.parse(result)['Surname'].replace(",", " ")
  document.querySelector('#new' + i.toString() + ' #fatherName').value = JSON.parse(result)['FatherName'].replace(",", " ")
  document.querySelector('#new' + i.toString() + ' #gender').value = (JSON.parse(result)['Gender']).toString() != "Male" ? "5" : "4"
  document.querySelector('#new' + i.toString() + ' #passportNo').value = JSON.parse(result)['PassNoOrNatCode']
  document.querySelector('#new' + i.toString() + ' #profileBox').src = "data:image/png;base64, " + JSON.parse(result)['FaceImageData']
  // document.querySelector('#new' + i.toString() + ' #profileBox').alt = uploadBase64Image(JSON.parse(result)['FaceImageData'])['uri']
  document.querySelector('#new' + i.toString() + ' #ScannedImage').src = "data:image/png;base64, " + JSON.parse(result)['ScannedImageData']
  // document.querySelector('#new' + i.toString() + ' #ScannedImage').alt = uploadBase64Image(JSON.parse(result)['ScannedImageData'])['uri']
  console.log(document.querySelector('#new' + i.toString() + ' #ScannedImage').file)


  // var searchItem = document.getElementById('searchCustomerByPasport').value
  closeLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#new' + i.toString() + ' #birthYear').value = this.responseText;
    }
  });

  xhr.open("GET", "/dateConverter/" + berth.toString());
  xhr.send();

  if (JSON.parse(result)['DateOfExpiry'] != null) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#new' + i.toString() + ' #DateOfExpire').value = this.responseText;
      }
    });
    xhr.open("POST", "/dateConverterPassport");
    xhr.send(JSON.parse(result)['DateOfExpiry']);
  }

  if (JSON.parse(result)['DateOfIssue'] != null) {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#new' + i.toString() + ' #DateOfIssue').value = this.responseText;
      }
    });
    xhr.open("POST", "/dateConverterPassport");
    xhr.send(JSON.parse(result)['DateOfIssue']);
  }

}

function dataCreaterRegisterBulkImages(result, i, covidEmbassy = null) {

  uploadBase64Image(JSON.parse(result)['FaceImageData'], 'profileBox', i)
  uploadBase64Image(JSON.parse(result)['ScannedImageData'], 'ScannedImage', i)

  document.querySelector('#new' + i.toString() + ' #profileBox').src = "data:image/png;base64, " + JSON.parse(result)['FaceImageData']
  document.querySelector('#new' + i.toString() + ' #ScannedImage').src = "data:image/png;base64, " + JSON.parse(result)['ScannedImageData']


  closeLoader()

}

function uploadBase64Image(e, name, i) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#new' + i.toString() + ' #' + name).alt = (this.responseText).toString()
    }
  });
  xhr.open("POST", "/uploadBase64Image/" + name, false);
  xhr.send(e);
}

function uploadbs64fultext(e, name, i) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#new' + i.toString() + ' #' + name).alt = (this.responseText).toString()
    }
  });
  xhr.open("POST", "/uploadbs64fultext/" + name, false);
  xhr.send(e);
}

function uploadOrginalImage(e, name, i) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      console.log(this.responseText)
      document.querySelector('#new' + i.toString() + ' #' + name).alt = (this.responseText).toString()
    }
  });
  xhr.open("POST", "/uploadOrginalImage/" + name, false);
  xhr.send(e);
}

function searchInBulk(e) {

  openLoader()
  document.getElementById('myModal-content').style.display = "none"
  var searchItem = document.getElementById('searchCustomerByPasport').value
  if (searchItem != "") {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#searchTable').innerHTML = this.responseText;
        document.getElementById('searchCustomerByPasport').value = ""
        closeLoader()
        document.getElementById('myModal-content').style.display = "block"
      }
    });

    xhr.open("GET", "/searchCustomerBulk/" + searchItem + "/" + e.toString());
    xhr.send();
  }
}

function setDataInBulk(i, customer, covidEmbassy = null) {
  document.getElementById('myModal').className = 'myModal'
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      var customer = JSON.parse(this.responseText)
      document.querySelector('#new' + i.toString() + ' #firstNameLang').value = customer['FirstNameLNG']
      document.querySelector('#new' + i.toString() + ' #firstNameLang').disabled = true

      document.querySelector('#new' + i.toString() + ' #firstName').value = customer['FirstName']
      document.querySelector('#new' + i.toString() + ' #firstName').disabled = true

      document.querySelector('#new' + i.toString() + ' #lastName').value = customer['LastName']
      document.querySelector('#new' + i.toString() + ' #lastName').disabled = true

      document.querySelector('#new' + i.toString() + ' #gender').value = customer['GenderConstId']['persistenceId'].toString()
      document.querySelector('#new' + i.toString() + ' #gender').disabled = true

      document.querySelector('#new' + i.toString() + ' #passportNo').value = customer['PassportNo']
      // document.querySelector('#new' + i.toString() + ' #passportNo').disabled=true
      //TODO: do an embassycode check and passportcheck here
      // embassyCodeCheck(i)

      if (covidEmbassy && covidEmbassy === 'True') {
        embassyCodeCheck(i)
      }
      var DateOfExpire = new Date(customer['DateOfExpiry'])
      var dd = String(DateOfExpire.getDate()).padStart(2, '0');
      var mm = String(DateOfExpire.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = DateOfExpire.getFullYear();

      DateOfExpire = yyyy + '-' + mm + '-' + dd;
      document.querySelector('#new' + i.toString() + ' #DateOfExpire').value = DateOfExpire

      var DateOfIssue = new Date(customer['DateOfIssue'])
      var dd = String(DateOfIssue.getDate()).padStart(2, '0');
      var mm = String(DateOfIssue.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = DateOfIssue.getFullYear();

      DateOfIssue = yyyy + '-' + mm + '-' + dd;
      document.querySelector('#new' + i.toString() + ' #DateOfIssue').value = DateOfIssue
      document.querySelector('#new' + i.toString() + ' #birthYear').value = customer['DateOfBirth']
      document.querySelector('#new' + i.toString() + ' #birthYear').disabled = true

      document.querySelector("#message").innerHTML = ""
      document.querySelector("#submitGroup").disabled = false

    }
  });

  xhr.open("GET", "/searchCustomerBulkPass/" + customer);
  xhr.send();
}

function printPage(labCode) {

  // var searchItem = document.getElementById('searchCustomerByPasport').value
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#printPage').innerHTML = this.responseText;
      setTimeout(function () { closeLoader(), window.print() }, 3000);
      // window.print()
      // document.getElementById('searchCustomerByPasport').value = ""
    }
  });

  xhr.open("GET", "/printPage/" + labCode);
  xhr.send();

}

function labelPrint(bulkCode) {

  // var searchItem = document.getElementById('searchCustomerByPasport').value
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#printPage').innerHTML = this.responseText;
      setTimeout(function () { closeLoader(), window.print() }, 3000);
      // window.print()
      // document.getElementById('searchCustomerByPasport').value = ""
    }
  });

  xhr.open("GET", "/labelPrint/" + bulkCode);
  xhr.send();

}

// function printPageww(labCode) {

//   // var searchItem = document.getElementById('searchCustomerByPasport').value
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;

//   xhr.addEventListener("readystatechange", function () {
//     openLoader()
//     if (this.readyState === 4) {
//       if (this.responseText == null) {
//         window.location = '/login'
//       }
//       document.querySelector('#printPage').innerHTML = this.responseText;
//       setTimeout(function () { closeLoader(), window.print() }, 3000);
//       // window.print()
//       // document.getElementById('searchCustomerByPasport').value = ""
//     }
//   });

//   xhr.open("GET", "/printPageww/" + labCode);
//   xhr.send();

// }


function printPagePolicy(labCode) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector('#printPage').innerHTML = this.responseText;
      setTimeout(function () { closeLoader(), window.print() }, 1000);
    }
  });

  xhr.open("GET", "/printPagePolicy/" + labCode, false);
  xhr.send();

}


function setPrintedPages(labcode, index) {
  if (index > 0) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("GET", "/printPage/" + labcode[index], false);
    xhr.send();
    return (setPrintedPages(labcode, index - 1))
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("GET", "/printPage/" + labcode[index], false);
    xhr.send()
    setTimeout(function () {
      window.print(),
        closeLoader()
    }, 2000);
    return (null)
  }


  // if (index > 0) {
  //   setTimeout(function () {
  //     var requestOptions = {
  //       method: 'GET',
  //       redirect: 'follow'
  //     };

  //     fetch("/printPage/" + labcode[index], requestOptions)
  //       .then(response => response.text())
  //       .then(result => document.querySelector('#printPage').innerHTML += result)
  //       .catch(error => console.log('error', error));
  //     return (setPrintedPages(labcode, index - 1))
  //   }, 3000);
  // }
  // else {
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow'
  //   };

  //   fetch("/printPage/" + labcode[index], requestOptions)
  //     .then(response => response.text())
  //     .then(result => document.querySelector('#printPage').innerHTML += result)
  //     .catch(error => console.log('error', error));
  //   setTimeout(function () {
  //     closeLoader(), window.print()
  //   }, 3000);
  //   return (null)
  // }
}

// setTimeout(function () { closeLoader(), window.print() }, 10000);
function creatgroupPrintPage(labCode) {
  document.querySelector('#printPage').innerHTML = ""
  var dataP = JSON.parse(labCode)
  // console.log(labCode)
  // console.log(dataP.length)
  setPrintedPages(dataP, dataP.length - 1)
  // for (var i = 0; i <= dataP.length; i++) {

  // }
  // var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  // xhr.addEventListener("readystatechange", function () {
  //   openLoader()
  //   if (this.readyState === 4) {
  //     if (this.responseText == null) {
  //       window.location = '/login'
  //     }

  //     document.querySelector('#printPage').innerHTML += this.responseText;
  //     document.querySelector('#printed').id = "printed"+i.toString();
  //   }
  // });
  // xhr.open("GET", "/printPage/" + dataP[i]);
  // xhr.send();
  // }
}


function groupPrint() {
  let params = new URLSearchParams(location.search);
  try {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "branch": document.getElementById('id_branch').value,
      "pageNumber": params.get('pageNumber')
    }
  }
  catch {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "pageNumber": params.get('pageNumber')
    }
  }
  var setdata = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      creatgroupPrintPage(this.responseText)
      // setTimeout(function () { closeLoader(), window.print() }, 10000);
      // document.getElementById('searchCustomerByPasport').value = ""
    }
  });

  xhr.open("POST", "/groupPrintData");
  xhr.send(setdata);

}


function setPrintedPagesFast(dataP, index) {
  var setdata = JSON.stringify(dataP[index]);
  if (index > 0) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("POST", "/printPageFast", false);
    xhr.send(setdata);
    return (setPrintedPagesFast(dataP, index - 1))
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("POST", "/printPageFast", false);
    xhr.send(setdata)
    setTimeout(function () {
      window.print(),
        closeLoader()
    }, 2000);
    return (null)
  }
}

function creatgroupPrintPageFast(data) {
  document.querySelector('#printPage').innerHTML = ""
  var dataP = JSON.parse(data)
  // console.log(labCode)
  // console.log(dataP.length)
  setPrintedPagesFast(dataP, dataP.length - 1)
}

function groupPrintFast() {
  let params = new URLSearchParams(location.search);
  try {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "branch": document.getElementById('id_branch').value,
      "pageNumber": params.get('pageNumber')
    }
  }
  catch {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "pageNumber": params.get('pageNumber')
    }
  }
  var setdata = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }

      creatgroupPrintPageFast(this.responseText)
    }
  });
  xhr.open("POST", "/groupPrintDataFast");
  xhr.send(setdata);
}



function groupPDF(Ministry = false) {
  let params = new URLSearchParams(location.search);
  try {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "branch": document.getElementById('id_branch').value,
      "pageNumber": params.get('pageNumber')
    }
  }
  catch {
    var data = {
      "toDate": document.getElementById('id_toDate').value,
      "fromDate": document.getElementById('id_fromDate').value,
      "testCode": document.getElementById('id_testCode').value,
      "groupCode": document.getElementById('id_groupCode').value,
      "pageNumber": params.get('pageNumber')
    }
  }

  var setdata = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      // openLoader()
      closeLoader()
      setTimeout(function () { document.querySelector('#groupPDFSuccessAlert').style.display = 'block' }, 0);
      setTimeout(function () { document.querySelector('#groupPDFSuccessAlert').style.display = 'none' }, 5000);

      // download('file text', 'myfilename.txt', 'text/plain')
      // download(this.responseText)
    }
  });

  xhr.open("POST", "/groupPDFData/" + Ministry);
  xhr.send(setdata);

}


// function download(data) {


//   for (var index = 0; index < data.length; index++) {

//     var xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;
//     xhr.addEventListener("readystatechange", function () {
//       if (this.readyState === 4) {
//         if (this.responseText == null) {
//           window.location = '/login'
//         }

//         // download('file text', 'myfilename.txt', 'text/plain')
//         // download(this.responseText)
//       }
//     });

//     xhr.open("GET", data[index]);
//     xhr.send();

//   }

// }
// // var a = document.getElementById("a");
// // var file = new Blob(['file text'], { type: 'text/plain' },);
// // a.href = URL.createObjectURL(file);
// // a.download = 'myfilename.txt';
// // document.download = 'myfilename.txt';
// // }



function setPolicyPrintedPages(labcode, index) {
  if (index > 0) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("GET", "/printPagePolicy/" + labcode[index], false);
    xhr.send();
    return (setPolicyPrintedPages(labcode, index - 1))
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        document.querySelector('#printPage').innerHTML += this.responseText;
      }
    });

    xhr.open("GET", "/printPagePolicy/" + labcode[index], false);
    xhr.send()
    setTimeout(function () {
      window.print(),
        closeLoader()
    }, 2000);
    return (null)
  }



  // if (index > 0) {
  //   setTimeout(function () {
  //     var requestOptions = {
  //       method: 'GET',
  //       redirect: 'follow'
  //     };

  //     fetch("/printPagePolicy/" + labcode[index], requestOptions)
  //       .then(response => response.text())
  //       .then(result => document.querySelector('#printPage').innerHTML += result)
  //       .catch(error => console.log('error', error));
  //     return (setPolicyPrintedPages(labcode, index - 1))
  //   }, 3000);
  // }
  // else {
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow'
  //   };

  //   fetch("/printPagePolicy/" + labcode[index], requestOptions)
  //     .then(response => response.text())
  //     .then(result => document.querySelector('#printPage').innerHTML += result)
  //     .catch(error => console.log('error', error));
  //   setTimeout(function () {
  //     closeLoader(), window.print()
  //   }, 3000);
  //   return (null)
  // }
}

function creatgroupPolicyPrintPage(labCode) {
  document.querySelector('#printPage').innerHTML = ""
  var dataP = JSON.parse(labCode)
  setPolicyPrintedPages(dataP, dataP.length - 1)
}

function groupPolicyPrint() {
  let params = new URLSearchParams(location.search);
  var data = {
    "toDate": document.getElementById('id_toDate').value,
    "fromDate": document.getElementById('id_fromDate').value,
    "testCode": document.getElementById('id_testCode').value,
    "groupCode": document.getElementById('id_passport').value,
    "pageNumber": params.get('pageNumber')
  }

  var setdata = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      creatgroupPolicyPrintPage(this.responseText)
      // setTimeout(function () { closeLoader(), window.print() }, 10000);
      // document.getElementById('searchCustomerByPasport').value = ""
    }
  });

  xhr.open("POST", "/groupPolicyPrintData");
  xhr.send(setdata);

}


function exportToExcel() {
  var data = {
    "toDate": document.getElementById('id_toDate').value,
    "fromDate": document.getElementById('id_fromDate').value,
    "testCode": "",
    "groupCode": ""
  }
  var setdata = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }

      setTimeout(function () { closeLoader() }, 3000);
    }
  });

  xhr.open("POST", "/csvExporterInquery");
  xhr.send(setdata);

}

function changPasswordSubmit() {
  if ((document.getElementById('newPassword').value).toString() == (document.getElementById('confirmPassword').value).toString()) {
    var setdata = {
      "newPassword": document.getElementById('newPassword').value,
      "confirmPassword": document.getElementById('confirmPassword').value
    }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    setdata = JSON.stringify(setdata)
    xhr.addEventListener("readystatechange", function () {
      // openLoader()
      if (this.readyState === 4) {
        if (this.responseText == null) {
          window.location = '/login'
        }
        var data = JSON.parse(this.responseText)
        if (data['flag'] == true) {
          document.getElementById('messagesPassword').innerHTML = data['message']
          document.getElementById('messagesPassword').classList = "alert alert-success alert-dismissible fade show"
          document.getElementById('messagesPassword').style.display = "block"
        }
        else {
          document.getElementById('messagesPassword').innerHTML = data['message']
          document.getElementById('messagesPassword').classList = "alert alert-danger alert-dismissible fade show"
          document.getElementById('messagesPassword').style.display = "block"
        }
      }
    });

    xhr.open("POST", "/chagePassword");
    xhr.send(setdata);
  }
  else {
    document.getElementById('messagesPassword').style.display = "block"
    document.getElementById('messagesPassword').innerHTML = "Passwords not same"
  }
}

function editPerson(e, covidId, visaType, costAmount) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      var data = JSON.parse(this.responseText)
      // console.log(data)
      document.getElementById('editFirstName').value = data['FirstName']
      document.getElementById('editLastName').value = data['LastName']
      document.getElementById('editFirstNameLang').value = data['FirstNameLNG']
      // document.getElementByIedititLastNameLang').value=data['LastNameLNG']
      document.getElementById('editPassportNoVisa').value = data['PassportNo']
      document.getElementById('editBirthYear').value = data['DateOfBirth']
      document.getElementById('editTypeOfvisaBulk').value = visaType
      document.getElementById('editGender').value = data['GenderConstId']['Title'].toString() != "Male" ? "5" : "4"
      document.getElementById('editDateOfIssue').value = data['DateOfIssue']
      document.getElementById('editDateOfExpire').value = data['DateOfExpiry']
      document.getElementById('editNationality').value = data['NationalityConstId']['persistenceId']
      document.getElementById('editCountry').value = data['CountryOfBirthConstId']['persistenceId']
      // document.getElementById('detilGhesaseSerial').value = data['NationalityConstId']['persistenceId']
      document.getElementById('editFatherName').value = data['FatherName']
      document.getElementById('editCostAmount').value = costAmount
      // document.getElementById('detilLabCode').value = data['labCode']
      closeLoader()
    }
    closeLoader()
  });

  xhr.open("GET", "/getCustomer/" + e + "/" + covidId);
  xhr.send();

}

function editPersonVisa(e, covidId, visaType) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      var data = JSON.parse(this.responseText)
      console.log(data)
      document.getElementById('editFirstNameVisa').value = data['FirstName']
      document.getElementById('editLastNameVisa').value = data['LastName']
      document.getElementById('editFirstNameLangVisa').value = data['FirstNameLNG']
      // document.getElementById('editLastNameLangVisa').value=data['LastNameLNG']
      document.getElementById('editPassportNoVisa').value = data['PassportNo']
      document.getElementById('editBirthYearVisa').value = data['DateOfBirth']
      document.getElementById('editTypeOfvisaBulkVisa').value = visaType
      document.getElementById('editGenderVisa').value = data['GenderConstId']['Title'].toString() != "Male" ? "5" : "4"
      closeLoader()
    }
    closeLoader()
  });

  xhr.open("GET", "/getCustomer/" + e + "/" + covidId);
  xhr.send();

}

function editSubmit(e, covidId, visaType) {
  var editFirstName = document.getElementById('editFirstName').value
  var editLastName = document.getElementById('editLastName').value
  var editFirstNameLang = document.getElementById('editFirstNameLang').value
  var editCostAmount = document.getElementById('editCostAmount').value
  var editLastNameLang = ""
  // var editLastNameLang =document.getElementById('editLastNameLang').value
  var editPassportNo = document.getElementById('editPassportNo').value
  var editBirthYear = document.getElementById('editBirthYear').value
  var editGender = document.getElementById('editGender').value
  var editTypeOfvisaBulk = document.getElementById('editTypeOfvisaBulk').value

  setdata = {
    "editFirstName": editFirstName,
    "editLastName": editLastName,
    "editFirstNameLang": editFirstNameLang,
    "editLastNameLang": editLastNameLang,
    "editPassportNo": editPassportNo,
    "editBirthYear": editBirthYear,
    "editGender": editGender,
    "editTypeOfvisaBulk": editTypeOfvisaBulk,
    "editCostAmount": editCostAmount,
    "covidId": covidId,
    "visaType": visaType,
  }
  setdata = JSON.stringify(setdata)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    document.getElementById('editModal').style.display = 'none'
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      window.location = window.location
    }
  });
  xhr.open("POST", "/editCustomer");
  xhr.send(setdata);
}

function editSubmitVisa(e, covidId, visaType) {
  var editFirstName = document.getElementById('editFirstName').value
  var editLastName = document.getElementById('editLastName').value
  var editFirstNameLang = document.getElementById('editFirstNameLang').value
  var editLastNameLang = ""
  // var editLastNameLang =document.getElementById('editLastNameLangVisa').value
  var editFatherName = document.getElementById('editFatherName').value
  var editBirthYear = document.getElementById('editBirthYear').value
  var editGender = document.getElementById('editGender').value
  var editTypeOfvisaBulk = document.getElementById('editTypeOfvisaBulk').value
  var editDateOfIssue = document.getElementById('editDateOfIssue').value
  var editDateOfExpire = document.getElementById('editDateOfExpire').value
  var editNationality = document.getElementById('editNationality').value
  var editCountry = document.getElementById('editCountry').value
  var editPassportNo = document.getElementById('editPassportNoVisa').value

  var editCostAmount = document.getElementById('editCostAmount').value
  setdata = {
    "editFirstName": editFirstName,
    "editLastName": editLastName,
    "editFirstNameLang": editFirstNameLang,
    "editLastNameLang": editLastNameLang,
    "editPassportNo": editPassportNo,
    "editBirthYear": editBirthYear,
    "editGender": editGender,
    "editTypeOfvisaBulk": editTypeOfvisaBulk,
    "editFatherName": editFatherName,
    "editDateOfIssue": editDateOfIssue,
    "editDateOfExpire": editDateOfExpire,
    "editNationality": editNationality,
    "editCountry": editCountry,

    "customerId": e,
    "editCostAmount": editCostAmount,
    "covidId": covidId,
    "visaType": visaType
  }
  setdata = JSON.stringify(setdata)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    document.getElementById('editModal').style.display = 'none'
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      // changeStatus('Wait Issuance',covidId)
      window.location = window.location
    }
  });
  xhr.open("POST", "/editCustomer", false);
  xhr.send(setdata);
}

function getCovidDefaultFee(id, index) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      document.querySelector("#new" + index.toString() + " #costBulk").value = this.responseText
      closeLoader()
      return this.responseText
    }
    closeLoader()
  });

  xhr.open("POST", "/getCovidDefaultFee/" + id);
  xhr.send();
}
function exportExeclManagerReport() {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      alert(this.responseText)
      closeLoader()
      return this.responseText
    }
    closeLoader()
  });

  xhr.open("POST", "/managerReportExport");
  xhr.send();
}

function exportExeclErrorList() {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      alert(this.responseText)
      closeLoader()
      return this.responseText
    }
    closeLoader()
  });

  xhr.open("POST", "/exportExeclErrorList");
  xhr.send();
}

function typeOfVisaDropdownChange(type, index, id) {
  // var types=document.getElementById("typeOfvisaBulk")
  var types = document.querySelector("#new" + index.toString() + " #typeOfvisaBulk")

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      closeLoader()
      document.querySelector("#new" + index.toString() + " #costBulk").value = this.responseText
      sumTotalcust()
    }
    closeLoader()
  });

  xhr.open("POST", "/getCovidDefaultFee/" + id);
  xhr.send();


  // document.querySelector("#new" + index.toString() + " #costBulk").value=getCovidDefaultFee(id)

  if (type == "Only_MedicalCOVID19Test" || type == "Only_Insurance") {
    // types.value = id.toString()
    types.disabled = true
    // document.querySelector("#Policy").checked = false
    // document.querySelector("#PolicyPlan").disabled = true
  }
  else {
    // types.value = "12000017"
    types.disabled = false
    // document.querySelector("#Policy").checked = true
    // document.querySelector("#PolicyPlan").disabled = false
  }

}


function policyCheckInradio() {

  count = 0

  var newObj = document.querySelector("#boxHolder #new")
  var newObjChildren = newObj.children

  var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test", "Only_Insurance"]
  for (var i = 0; i <= newObjChildren.length - 1; i++) {
    for (j = 0; j <= radios.length - 1; j++) {
      var check = document.querySelector("#new" + i.toString() + " #" + radios[j].toString())
      if (check.checked) {
        if (check.id == "Only_Visa" || check.id == "Visa_And_MedicalCOVID19Test" || check.id == "Only_Insurance") {
          count++
        }
      }
    }
  }
  if (count >= 1) {
    document.querySelector("#Policy").checked = true
    document.querySelector("#PolicyPlan").disabled = false
  }
  else {
    document.querySelector("#Policy").checked = false
    document.querySelector("#PolicyPlan").disabled = true
  }
}


function typeOfVisaChange(index) {

  var radios = ["Visa_And_MedicalCOVID19Test", "Only_Visa", "Only_MedicalCOVID19Test", "Only_Insurance"]
  for (i = 0; i <= radios.length - 1; i++) {
    // var check=document.getElementById(radios[i])
    var check = document.querySelector("#new" + index.toString() + " #" + radios[i].toString())
    if (check.checked) {
      typeOfVisaDropdownChange(radios[i], index, check.value)
    }
  }
  policyCheckInradio()

}


function confirmReject(status, covidId, persistenceId=null) {

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      // closeLoader()
      changeStatus('RecycleBin',covidId,persistenceId=persistenceId)
    }
    // closeLoader()
  });
  xhr.open("get", "/confirmRejectPolicy/"+covidId);
  xhr.send();
}

// function editTypeOfVisaDropdownChange(type){
//   // var types=document.getElementById("typeOfvisaBulk")
//   var types=document.querySelector("#editTypeOfvisaBulk")
//   if (type=="justTest"){
//     types.value="12000024"
//     types.disabled=true
//   }
//   else{
//     types.value="12000017"
//     types.disabled=false
//   }
// }

// function editTypeOfVisaChange(){
//   var radios=["editVisaAndTest","editJustVisa","editJustTest"]
//   for(i=0;i<=radios.length-1;i++){
//     // var check=document.getElementById(radios[i])
//     var check=document.querySelector("#"+radios[i].toString())
//     if (check.checked){
//       editTypeOfVisaDropdownChange(radios[i])
//     }
//   }
// }

function passportCheck(index, isSearching = false, covidEmbassy = null) {
  var passportNumber = document.querySelector("#new" + index + " #passportNo").value

  if (document.querySelector("#new" + index.toString() + " #passportNo").className.includes("unavailable-pass-number")) {
    document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("unavailable-pass-number")
  }

  if (document.querySelector("#new" + index.toString() + " #passportNo").className.includes("available-pass-number")) {
    document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("available-pass-number")
  }

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }

      if (covidEmbassy && covidEmbassy === 'True') {
        embassyCodeCheck(index)
      }

      if (!isSearching) {
        if (this.responseText >= 1) {
          document.querySelector('#new' + index.toString() + ' #passportNo').style = "border: solid red 1px;position: unset;"
          document.querySelector("#message").innerHTML = "This passport number is available, please search for it"
          document.querySelector("#submitGroup").disabled = true
        }
        else {
          document.querySelector('#new' + index.toString() + ' #passportNo').style = ""
          document.querySelector("#message").innerHTML = ""
          document.querySelector('#new' + index.toString() + ' #firstNameLang').disabled = false
          document.querySelector('#new' + index.toString() + ' #firstName').disabled = false
          document.querySelector('#new' + index.toString() + ' #lastName').disabled = false
          document.querySelector('#new' + index.toString() + ' #gender').disabled = false
          document.querySelector('#new' + index.toString() + ' #passportNo').disabled = false
          document.querySelector('#new' + index.toString() + ' #birthYear').disabled = false
          document.querySelector("#submitGroup").disabled = false
        }
      }
      // window.location = window.location
    }
  });
  xhr.open("POST", "/passportCheck");
  xhr.send(passportNumber);
}

function creditSummaryCheck() {

  var PolicyPlan = document.querySelector("#PolicyPlan").value
  var planData = document.querySelector("#PolicyPlan_"+PolicyPlan).value

  var newObj = document.querySelector("#boxHolder #new")
  var newObjChildren = newObj.children
  var numberOfIssue = newObjChildren.length+1


  console.log(newObjChildren.length+1)
  var premum = Number(planData.split("_")[0])
  var curency = Number(planData.split("_")[1])
  var credit = Number(planData.split("_")[2])
  creditWithMath = (premum/curency)*numberOfIssue
  console.log(creditWithMath)
  if (credit <= (creditWithMath)) {
    document.querySelector("#creditValueMessage").innerHTML = "Your credit is not enough to issue"
    document.querySelector("#submitGroup").disabled = true
    return null
  }
  else {
    document.querySelector("#creditValueMessage").innerHTML = ""
    document.querySelector("#submitGroup").disabled = false
    return true
  }


}

function embassyCodeCheck(index) {
  var passportNumber = document.querySelector("#new" + index + " #passportNo").value

  if (document.querySelector("#new" + index.toString() + " #passportNo").className.includes("unavailable-pass-number")) {
    document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("unavailable-pass-number")
  }

  if (document.querySelector("#new" + index.toString() + " #passportNo").className.includes("available-pass-number")) {
    document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("available-pass-number")
  }

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.querySelector("#embessyCode").value = this.responseText
        if (document.querySelector("#embessyCode").value === "") {
          if (document.querySelector('#new' + index.toString() + ' #passportNo').value) {
            document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("unavailable-pass-number")
          }
        }
        else {
          if (document.querySelector('#new' + index.toString() + ' #passportNo').value) {
            document.querySelector("#new" + index.toString() + " #passportNo").classList.toggle("available-pass-number")
          }
        }
      }
    }
  });
  xhr.open("POST", "/embassyCodeCheck");
  xhr.send(passportNumber);
}

function passportCheckAirport() {
  var passportNumber = document.querySelector("#passportNoAirport").value

  if (document.querySelector("#passportNoAirport").className.includes("unavailable-pass-number")) {
    document.querySelector("#passportNoAirport").classList.toggle("unavailable-pass-number")
  }

  if (document.querySelector("#passportNoAirport").className.includes("available-pass-number")) {
    document.querySelector("#passportNoAirport").classList.toggle("available-pass-number")
  }

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }


      embassyCodeCheckAirport()

      // if (this.responseText >= 1) {
      //   document.querySelector("#new" + index + " #message").innerHTML = "This passport number is available, please search for it"
      //   document.querySelector("#submitGroup").disabled = true

      // }
      // else {

      //   document.querySelector("#new" + index + " #message").innerHTML = ""

      //   document.querySelector('#new' + index.toString() + ' #firstNameLang').disabled = false

      //   document.querySelector('#new' + index.toString() + ' #firstName').disabled = false

      //   document.querySelector('#new' + index.toString() + ' #lastName').disabled = false

      //   document.querySelector('#new' + index.toString() + ' #gender').disabled = false

      //   document.querySelector('#new' + index.toString() + ' #passportNo').disabled = false

      //   document.querySelector('#new' + index.toString() + ' #birthYear').disabled = false

      //   document.querySelector("#submitGroup").disabled = false
      // }
      // window.location = window.location
    }
  });
  xhr.open("POST", "/passportCheck");
  xhr.send(passportNumber);
}
function branchWithAllMiltiChange() {
  var branchSelect = document.getElementById("select2-id_branchWithAllMilti-container")
  var branchInput = document.getElementById("id_branchWithAllMiltiBox")
  childs = branchSelect.children
  console.log((childs.length))
  branchInput.value = ""
  for (var i = 0; i < childs.length; i++) {

    // childs[i].querySelector("#costBulk").value
    // console.log((i))
    // console.log((childs.length))
    // console.log((childs[i]))
    childBigId = (childs[i].getElementsByTagName('span'))[1]['id']
    childId = childBigId.split('-')
    childId = childId[childId.length-1]
    if (childId === '1'){
      for (var j = 0; j <= childs.length; j++) {
        if ((childs[j].getElementsByTagName('span'))[1]['id'] != childBigId){
          b = childs[j].getElementsByTagName('button')
          b[0]['id'] = 'removed0'
          document.getElementById("removed0").click()
        }
      }
      childId = '-1'
      branchInput.value = childId
      return null
    }
    if ((i+1) === childs.length){
      branchInput.value += childId
    }
    else {
      branchInput.value += childId+","
    }


  }
    // newObjChildren = newObj.children

}


function passportImageScaner(file,tabIndex) {
  openLoader()

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      // console.log(this.responseText)
      data = JSON.parse(this.responseText)
      if (data['success'] == 'false'){
        alert(data['message'])
      }
      else {
        data = data['data']
        console.log(data)
        console.log(data['passportTemp'])
        console.log(data['facesTemp'])

        document.querySelector('#new' + tabIndex.toString() + ' #passportNo').value = data['passportNo']
        document.querySelector('#new' + tabIndex.toString() + ' #firstName').value = data['firstName']
        document.querySelector('#new' + tabIndex.toString() + ' #lastName').value = data['lastName']
        document.querySelector('#new' + tabIndex.toString() + ' #fatherName').value = data['fatherName']
        document.querySelector('#new' + tabIndex.toString() + ' #birthYear').value = data['birthYear']
        document.querySelector('#new' + tabIndex.toString() + ' #gender').value = (data['gender']).toString() != "M" ? "5" : "4"
        document.querySelector('#new' + tabIndex.toString() + ' #DateOfIssue').value = data['DateOfIssue']
        document.querySelector('#new' + tabIndex.toString() + ' #DateOfExpire').value = data['DateOfExpire']

        document.querySelector('#new' + tabIndex.toString() + ' #profileBox').alt = JSON.stringify(data['facesTemp']).toString()
        document.querySelector('#new' + tabIndex.toString() + ' #profileBox').src = "static/image/imageProcced/" + data['facesTemp']['uri']

        document.querySelector('#new' + tabIndex.toString() + ' #ScannedImage').alt = JSON.stringify(data['passportTemp']).toString()
        document.querySelector('#new' + tabIndex.toString() + ' #ScannedImage').src = "static/image/imageProcced/" + data['passportTemp']['uri']
        // document.querySelector('#new' + tabIndex.toString() + ' #Country').value = data['Country']
        // document.querySelector('#new' + tabIndex.toString() + ' #Nationality').value = data['Nationality']

      }
      closeLoader()
    }
  });
  xhr.open("POST", "/imageProccor" , false);
  xhr.send(file);




  // }
  // else{
  // alert("Please upload each file !")
  // }

}



function embassyCodeCheckAirport() {
  var passportNumber = document.querySelector("#passportNoAirport").value

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.querySelector("#embessyCodeAirport").value = this.responseText
        if (document.querySelector("#embessyCodeAirport").value === "") {
          if (document.querySelector('#passportNoAirport').value) {
            document.querySelector("#passportNoAirport").classList.toggle("unavailable-pass-number")
          }
        }
        else {
          if (document.querySelector('#passportNoAirport').value) {
            document.querySelector("#passportNoAirport").classList.toggle("available-pass-number")
          }
        }
      }
    }
  });
  xhr.open("POST", "/embassyCodeCheck");
  xhr.send(passportNumber);
}


function managerApprovAll() {
  var fromData = document.getElementById('id_fromDate').value
  var toData = document.getElementById('id_toDate').value
  var passport = document.getElementById('id_passport').value

  var data = {
    "fromData": fromData,
    "toData": toData,
    "passport": passport,
  }
  data = JSON.stringify(data)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }
    }
  });
  xhr.open("POST", "/passportCheck");
  xhr.send(data);



}

function policyChack() {
  if (document.getElementById('Policy').checked) {
    document.getElementById('PolicyPlan').disabled = false
    // document.getElementById('PolicyPlanType').disabled=false
  }
  else {
    document.getElementById('PolicyPlan').disabled = true
    // document.getElementById('PolicyPlanType').disabled=true

  }
}


function refund(covidId) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    openLoader()
    if (this.readyState === 4) {
      if (this.responseText == null) {
        window.location = '/login'
      }

      result = JSON.parse(this.responseText)
      if (result['seccess']) {
        document.getElementById('seccessMessages').innerHTML = result['messsages']
        closeLoader()
        document.getElementById('alertSuccessBulkTable').style = "display:block;text-align: center;"
        setTimeout(function () { document.getElementById('alertSuccessBulkTable').style = "display:none;text-align: center;", window.location = window.location }, 3000);
      }
      else {
        document.getElementById('errorMessage').innerHTML = result['messsages']
        closeLoader()
        document.getElementById('alertErrorBulkTable').style = "display:block;text-align: center;"
        setTimeout(function () { document.getElementById('alertErrorBulkTable').style = "display:none;text-align: center;" }, 3000);
      }
    }
  });
  xhr.open("POST", "/refund/" + covidId);
  xhr.send();
}



