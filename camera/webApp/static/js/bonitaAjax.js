// function changeStatus(Id, result) {
function changeStatus(statusName, covidId,persistenceId=null) {
  openLoader()
  senData = {
    "duration" : document.getElementById("duration"+persistenceId.toString()).value,
    "travelLawyer" : document.getElementById("travelLawyer"+persistenceId.toString()).value
  }
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "changeStatus/"+statusName+"/"+covidId,false);
  xhr.send(JSON.stringify(senData))
  // xhr.send()
}

function changeStatusCheck( covidId) {
  // openLoader()
  document.getElementById('visaStatusCheck').value
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "changeStatusCheck/"+document.getElementById('visaStatusCheck').value+"/"+covidId,false);
  xhr.send();
}
function submitEvisaCheck( customerId) {
  // openLoader()
  senData = {
    "customerId":customerId,
    "captcha": document.getElementById('captchaCheck').value ,
    "key": document.getElementById('imageKeyCheck').value

  }
  document.getElementById('visaStatusCheck').value
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        // window.location = window.location
      }
    }
    else {
      document.getElementById('checkResp').innerHTML = this.responseText
      // alert("something wrong")
    }
  });
  xhr.open("POST", "submitEvisaCheck/"+customerId);
  xhr.send(JSON.stringify(senData));
}

function issuanceVisa(branchId, covidId) {
  openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "issuanceVisa/"+branchId+"/"+covidId,false);
  xhr.send();
}

function issuanceVisaforquick(branchId, covidId) {
  openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        // window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "issuanceVisa/"+branchId+"/"+covidId,false);
  xhr.send();
}


function quickIssuanceVisa(branchId, covidId,CaseId) {

  // issuanceVisaforquick(branchId, covidId)
  openCaptcha1Modalforquick(CaseId)
  // openCaptcha2Modal(CaseId)

}


function issuanceCaptcha1() {
  // openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.getElementById('imageKey1').value = JSON.parse(this.responseText)['key']
        document.getElementById('captchaImage1').src = "https://evisatraveller.mfa.ir/"+JSON.parse(this.responseText)['image_url']
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "refreshCaptcha",false);
  xhr.send();
}

function issuanceCaptcha1forquick() {
  // openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.getElementById('imageKey1').value = JSON.parse(this.responseText)['key']
        document.getElementById('captchaImage1').src = "https://evisatraveller.mfa.ir/"+JSON.parse(this.responseText)['image_url']
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "refreshCaptcha",false);
  xhr.send();
}

function issuanceCaptcha1Submit(caseId) {
  // openLoader()
  senData = {
    "caseId":caseId,
    "captchaText1": document.getElementById('captchaText1').value ,
    "imageKey1": document.getElementById('imageKey1').value

  }
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "issuanceCaptcha1Submit",false);
  xhr.send(JSON.stringify(senData));
}

function issuanceCaptcha1Submitforquick(caseId) {
  // openLoader()
  senData = {
    "caseId":caseId,
    "captchaText1": document.getElementById('captchaText1').value ,
    "imageKey1": document.getElementById('imageKey1').value

  }
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        windowOnClicknCaptcha1Modal(event)
        openCaptcha2Modal(caseId)
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "issuanceCaptcha1Submit",false);
  xhr.send(JSON.stringify(senData));
}

function issuanceCaptcha2() {
  // openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.getElementById('imageKey2').value = JSON.parse(this.responseText)['key']
        document.getElementById('captchaImage2').src = "https://evisatraveller.mfa.ir/"+JSON.parse(this.responseText)['image_url']
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "refreshCaptcha",false);
  xhr.send();
}

function issuanceCaptchaCheck() {
  // openLoader()
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        document.getElementById('imageKeyCheck').value = JSON.parse(this.responseText)['key']
        document.getElementById('captchaImageCheck').src = "https://evisatraveller.mfa.ir/"+JSON.parse(this.responseText)['image_url']
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("GET", "refreshCaptcha",false);
  xhr.send();
}


function issuanceCaptcha2Submit(caseId) {
  // openLoader()
  senData = {
    "caseId":caseId,
    "captchaText1": document.getElementById('captchaText2').value ,
    "imageKey1": document.getElementById('imageKey2').value ,
    "activeCode2": document.getElementById('activeCode2').value

  }
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      if (this.responseText == null) {
        window.location = '/login'
      }
      else {
        window.location = window.location
      }
    }
    else {
      // alert("something wrong")
    }
  });
  xhr.open("POST", "issuanceCaptcha2Submit",false);
  xhr.send(JSON.stringify(senData));
}


