(function () {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");

  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  const datachecksigninAttr = container.getAttribute("data-checksignin");
  const datachecksignupAttr = container.getAttribute("data-checksignup");
  if (datachecksigninAttr.length > 0) {
    container.classList.remove("right-panel-active");
  }
  if (datachecksignupAttr.length > 0) {
    container.classList.add("right-panel-active");
  }

  // signUp form related selectors
  const signUpForm = document.getElementById("signUpForm");
  const signUpname = document.getElementById("signUpName");
  const signUpEmail = document.getElementById("signUpEmail");
  const signUpPassword = document.getElementById("signUpPassword");
  // signIn form related selectors

  // signUp form validation and code
  const signInForm = document.getElementById("signInForm");
  // signUpForm.addEventListener('submit', (e) => {
  // 	e.preventDefault();
  // 	const name = signUpname.value.trim();
  // 	const email = signUpEmail.value.trim();
  // 	const password = signUpPassword.value.trim();
  // });

  var signUpNameField = document.getElementById("validationNameField");
  var signUpEmailField = document.getElementById("validationEmailField");
  var signUpPasswordField = document.getElementById("validationPasswordField");
  var signUpReEnterPasswordField = document.getElementById(
    "validationReEnterPasswordField"
  );
  var signInEmailField = document.getElementById("signInValidationEmailField");
  var signInPasswordField = document.getElementById(
    "signInValidationPasswordField"
  );

  signUpNameField.addEventListener("input", function () {
    var val = document.getElementById("validationNameField").value;
    if (!isValidUsername(val)) {
      signUpNameField.setCustomValidity("invalid");
    } else {
      signUpNameField.setCustomValidity("");
    }
  });

  signUpEmailField.addEventListener("input", function () {
    var val = document.getElementById("validationEmailField").value;

    if (!isValidEmail(val)) {
      signUpEmailField.setCustomValidity("invalid");
    } else {
      signUpEmailField.setCustomValidity("");
    }
  });

  signUpPasswordField.addEventListener("input", function () {
    var val = document.getElementById("validationPasswordField").value;

    if (!isValidPassword(val)) {
      signUpPasswordField.setCustomValidity("invalid");
    } else {
      signUpPasswordField.setCustomValidity("");
    }
  });

  signUpReEnterPasswordField.addEventListener("input", function () {
    var val = document.getElementById("validationReEnterPasswordField").value;

    if (!isValidPassword(val) || validationPasswordField.value != val) {
      signUpReEnterPasswordField.setCustomValidity("invalid");
    } else {
      signUpReEnterPasswordField.setCustomValidity("");
    }
  });

  signInEmailField.addEventListener("input", function () {
    var val = document.getElementById("signInValidationEmailField").value;
    if (!isValidEmail(val)) {
      signInEmailField.setCustomValidity("invalid");
    } else {
      signInEmailField.setCustomValidity("");
    }
  });

  signInPasswordField.addEventListener("input", function () {
    var val = document.getElementById("signInValidationPasswordField").value;
    if (!isValidPassword(val)) {
      signInPasswordField.setCustomValidity("invalid");
    } else {
      signInPasswordField.setCustomValidity("");
    }
  });

  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  // helper functions
  function isValidUsername(username) {
    return /^(?![\s.]+$)[a-zA-Z\s.]{2,}$/.test(username);
  }

  function isValidEmail(email) {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    let passwordRegex = /^[A-Za-z0-9!:',.@#$%^&*()]{6,}$/;
    return passwordRegex.test(password);
  }
})();
