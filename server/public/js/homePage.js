(function () {
  var productNameField = document.getElementById("productName");

  var forms = document.querySelectorAll(".needs-validation");

  var productNameField = document.getElementById("productName");
  var productDescriptionField = document.getElementById("productDescription");
  var productUrl = document.getElementById("productUrl");
  var productTag = document.getElementById("productTag");
  var profileFileField = document.getElementById("file");
  var developer = document.getElementById("developer");

  productNameField.addEventListener("input", function () {
    var val = document.getElementById("productName").value;
    if (!checkValidString(val)) {
      productNameField.setCustomValidity("invalid");
    } else {
      productNameField.setCustomValidity("");
    }
  });

  developer.addEventListener("input", function () {
    var val = document.getElementById("developer").value;
    if (!checkValidString(val)) {
      developer.setCustomValidity("invalid");
    } else {
      developer.setCustomValidity("");
    }
  });

  productDescriptionField.addEventListener("input", function () {
    var val = document.getElementById("productDescription").value;
    if (!checkValidString(val)) {
      productDescriptionField.setCustomValidity("invalid");
    } else {
      productDescriptionField.setCustomValidity("");
    }
  });

  productUrl.addEventListener("input", function () {
    var val = document.getElementById("productUrl").value;
    if (!checkValidWebUrl(val)) {
      productUrl.setCustomValidity("invalid");
    } else {
      productUrl.setCustomValidity("");
    }
  });

  productTag.addEventListener("input", function () {
    var val = document.getElementById("productTag").value;
    if (!checkValidTag(val)) {
      productTag.setCustomValidity("invalid");
    } else {
      productTag.setCustomValidity("");
    }
  });

  profileFileField.addEventListener("input", function () {
    var val = document.getElementById("file").value;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const fileType = this.files[0].type;
    if (
      !fileType ||
      !validImageTypes.includes(fileType) ||
      this.files[0].size / 1024 / 1024 > 3
    ) {
      profileFileField.setCustomValidity("invalid");
    } else {
      profileFileField.setCustomValidity("");
    }
  });

  profileFileField.addEventListener("onchange", function () {
    var val = document.getElementById("file").value;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const fileType = this.files[0].type;
    if (
      !fileType ||
      !validImageTypes.includes(fileType) ||
      this.files[0].size / 1024 / 1024 > 3
    ) {
      profileFileField.setCustomValidity("invalid");
    } else {
      profileFileField.setCustomValidity("");
    }
  });

  function checkValidString(val) {
    if (!val || val.length < 2) {
      return false;
    }
    return true;
  }

  function checkValidWebUrl(val) {
    let re =
      /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$/gm;
    const data = re.test(val);

    return data;
  }

  function checkValidTag(val) {
    if (!val || val.length < 2) {
      return false;
    }
    return true;
  }

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else if (profileFileField.files.length == 0) {
          event.preventDefault();
          event.stopPropagation();
          profileFileField.setCustomValidity("invalid");
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
