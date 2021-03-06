/*
*   Basic javascript file used on most web pages
*   Provides framework especially for client side input validation and ajax setup
*/

/*
    Error Legend:

    460 : Missing Password
    461 : Missing New Password
    462 : Missing Username
    463 : Unexpected Data
    464 : Invalid User
    465 : User already exists
    466 : User exists and is you
    467 : Mismatched Verification
    468 : Empty Body
    469 : Password Reset Warrant
    470 : Email verification out
    471 : Inactive User
    472 : Missing Info
    473 : Empty query
*/

var global = {
    request : reqData => {
        let xhr = new XMLHttpRequest();
        xhr.open(reqData.how, reqData.to);
        xhr.onreadystatechange = () => {
            reqData.handle();
        }
        xhr.send(reqData.data);
    }, 
    
    requireFields : fieldId => {
        if (filterOut()) {
            document.getElementById(fieldId).classList.add('fulfilled');
            document.getElementById(fieldId).classList.remove('required');
            for (let m of document.querySelectorAll('.user-info')) {
                if (m.classList.contains('required')) {
                    document.getElementById('submit').setAttribute('disabled', 'disabled');
                    break;
                } else {
                    document.querySelector('#submit').removeAttribute('disabled');
                }
            }
        } else {
            document.getElementById(fieldId).classList.add('required');
            document.getElementById(fieldId).classList.remove('fulfilled');
        }
        function filterOut () {
            var input = document.getElementById(fieldId);
            if (fieldId == 'email') {
                var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (input.value.match(filter)) {
                    return true;
                } else {
                    return false;
                }
            } else if (fieldId == 'passwd' || fieldId == 'passwdVer') {
                var pas1 = document.getElementById('passwd'),
                    pas2 = document.getElementById('passwdVer'),
                    filter = /^([a-zA-Z0-9.]){6,20}$/;
                    if (fieldId == 'passwd') {
                        var other = 'passwdVer';
                    } else {
                        var other = 'passwd';
                    }
    
                    if (pas1.value == pas2.value && pas1.value.match(filter)) {
                        document.getElementById(other).classList.add('fulfilled');
                        document.getElementById(other).classList.remove('required');
                        return true;
                    } else {
                        document.getElementById(other).classList.add('required');
                        document.getElementById(other).classList.remove('fulfilled');
                        return false;
                    }
            } else if (fieldId == 'username') {
                var username = document.getElementById(fieldId),
                    filter = /^([a-zA-Z0-9]){8,20}$/;

                    if (username.value.match(filter)) {
                        return true;
                    } else {
                        return false;
                    }
            } else {
                return true;
            }
        }
    } , 
    submitForm : url => {
        var data = new FormData(),
        inputs = document.querySelectorAll('.user-info');

        for (let m of inputs) {
            data.append(m.name, m.value)
            console.log(m.name, ' ', m.value);
        }
        console.log(data, " ", url)
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = '/'
            } else if (this.readyState == 4 && this.status > 400 && this.status < 500) {
                openModal(this.responseText);
            } else if (this.readyState == 4 && this.status > 499) {
                openModal(this.responseText);
            }
        }
        xhr.send(data);
    }  , 
    redirect : url => {
        console.log(url);
        window.location.href = url;
    } ,
    openModal : message => {
        if (message) {
            document.getElementById('mod-body').innerHTML = message;
        }
        var modal = document.getElementById('mod-modal');
        modal.style.display = "block";
        document.getElementById('mod-error').style.display = 'none';
    } , 
    closeElement : (element, err) => {
        if (err) {
            var errorBox = document.getElementById('error-box');
            errorBox.innerHTML = err;
        }
        document.getElementById(element).style.display = 'none';
    }
}