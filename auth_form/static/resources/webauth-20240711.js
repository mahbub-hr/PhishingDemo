
/* This function can be used for form validation but it also used to disable the login button when the form is submitted.  Then it is replaced with text and an image of moving dots to indicate to the user that their request is being processed. 

This is done to prevent the effects from double clicking the login button or repeatedly clicking the login button when the server is slow.

If form validation is done, the user should be returned to the form before the login button is disabled.

For form validation, first the status message (such as incorrect or missing fields) is removed so the user knows the new status message is for the next attempt.  
*/

function setErrorMessage(message) {
	var loginModalTopAlertDiv = document.getElementById('login-modal-top-alert');
	loginModalTopAlertDiv.style.display = 'block';
	loginModalTopAlertDiv.classList.remove('alert-warning');
	loginModalTopAlertDiv.classList.add('alert-danger');
	loginModalTopAlertDiv.innerHTML = message;
}

function submitForm() {
	/* Setting the display to none instead of clearing the innerHTML or setting visibility to hidden stops an IE 7 blank space */
	var loginModalTopAlertDiv = document.getElementById('login-modal-top-alert');
	loginModalTopAlertDiv.innerHTML = '';
	loginModalTopAlertDiv.style.display = 'none';

	// If logged in, the j_username field will be disabled, so enable it prior to the POST request or the field data won't be sent
	var j_usernameField = document.getElementById('j_username');
	if (j_usernameField)
		j_usernameField.disabled = false;

	if (formFieldsNotBlank()) {
		if (j_usernameNotNumber()) {
			// Change text of button to indicate progress, disable button to prevent double clicking when server is slow
			var button = document.forms["webauth_login_form"].elements["submit_form"];
			button.disabled = true;
			button.value = 'Logging in';

			return true;
		} else {
			setErrorMessage('Please enter your name based UCInetID.<br />Example: panteater');
			return false;
		}
	} else {
		setErrorMessage('Please enter a UCInetID and password.')
		return false;
	}
}

function formFieldsNotBlank() {
	var j_username = document.forms["webauth_login_form"].elements["j_username"];
	var j_password = document.forms["webauth_login_form"].elements["j_password"];

	if (isNotEmpty(j_username) && isNotEmpty(j_password)) {
		return true;
	} else {
		return false;
	}
}

function j_usernameNotNumber() {
	var j_username = document.forms["webauth_login_form"].elements["j_username"];
	if (j_username.value.match(/^\d+$/)) {
		return false;
	} else {
		return true;
	}
}

/* Function taken from OReilly Javascript Cookbook */
/* trimming whitespaces added */
function isNotEmpty(elem) {
	var str = elem.value.trim();
	if (str == null || str.length == 0) {
		return false;
	} else {
		return true;
	}
}

function autofillDetect() {

	document.getElementById("j_password").addEventListener("change", function() {
		console.log('change pass')
		document.getElementById("j_password").setAttribute('value', document.getElementById("j_password").value);
		document.getElementById("j_username").setAttribute('value', document.getElementById("j_username").value);
	});
	
	function onAutoFillStart(el) { el.classList.add('is-autofilled') }
	function onAutoFillCancel(el) { el.classList.remove('is-autofilled') }
	function onAnimationStart(event) {
		switch (event.animationName) {
			case 'onAutoFillStart':
				return onAutoFillStart(event.target)
				break;
			case 'onAutoFillCancel':
				return onAutoFillCancel(event.target)
				break;
		}
	}
	document.getElementById("j_username").addEventListener('animationstart', onAnimationStart, false);
	document.getElementById("j_password").addEventListener('animationstart', onAnimationStart, false);
}


// - The logout() function is an AJAX call made in template_full.twig when the user clicks the logout button
// to display two inputs for the UCInetID and j_password fields
// - The getUsernameFieldHTML() function is called by logout()
function logout() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/j_username/webauth_logout?' + Math.random());
	xhr.onload = function () {
		if (xhr.status === 200) {
			// Change the j_username field, clear error messages, and reset the tabindex attrs on the j_password and login button fields
			document.getElementById('login-modal-top-alert').style.display = 'none';
			const uciNetIDField = document.getElementById("j_username");
			const j_passwordField = document.getElementById("j_password");

			uciNetIDField.addEventListener('blur', function () { this.placeholder = "" });
			uciNetIDField.addEventListener('focus', function () { this.placeholder = "Example: ptanteater" });
			uciNetIDField.addEventListener('input', function () { this.setAttribute('value', this.value) });
			uciNetIDField.addEventListener('keyup', function () { this.setAttribute('value', this.value) });
			uciNetIDField.placeholder = '';
			uciNetIDField.value = ""
			uciNetIDField.setAttribute("value", "");
			uciNetIDField.setAttribute('aria-label', 'U-C-I-net-I-D');

			j_passwordField.setAttribute("tabindex", "2");
			j_passwordField.setAttribute("value", "");
			j_passwordField.value = "";
			

			document.getElementById('logout-button-div').style.display = 'none';
			document.getElementsByClassName('moving-placeholder')[0].setAttribute('data-text', 'UCInetID');
			document.getElementsByClassName('logged-in')[0].className = "not-logged-in"

			document.getElementById("j_username").addEventListener("change", function () {
				document.getElementById("j_username").setAttribute('value', document.getElementById("j_username").value);
			});

			document.forms['webauth_login_form'].elements['_eventId_proceed'].setAttribute("tabindex", "3");

			uciNetIDField.focus();
		} else {
			setErrorMessage("Logout was unsuccessful. Please try again.");
		}
	};
	xhr.send();
}         
