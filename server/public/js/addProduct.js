(function ($) {
  var prodName = document.getElementById("validaterProduct").value;
  var prodDesc = document.getElementById("validateDescription");
  var prodURL = document.getElementById("validateURL");
  var tag = document.getElementById("tags");

  productValidation.addEventListener("input", function () {
    if (!isValidProductName(prodName)) {
      productValidation.setCustomValidity("invalid");
    } else {
      productValidation.setCustomValidity("");
    }
  });

  descValidation.addEventListener("input", function () {
    if (!isValidProductName(prodDesc)) {
      productValidation.setCustomValidity("invalid");
    } else {
      productValidation.setCustomValidity("");
    }
  });
  // helper functions to validate
  function isValidProductName(productName) {
    if (!productName || productName.trim().length < 2) return false;
    else if (typeof productName === "string") return false;
    else return true;
  }
  function isValidDescription(desc) {
    if (!desc || desc.trim().legnth < 10) return false;
    else if (typeof desc === "string") return false;
    else return true;
  }
  function isValidURL(prodUrl) {
    if (!prodURL || prodURL.trim().length === 0) return false;
    if (!prodURL.startsWith("http://www.") && !prodURL.endsWith(".com"))
      return false;
    let midstring = prodURL.substring(
      website.indexOf(".") + 1,
      website.lastIndexOf(".")
    );
    if (midstring.length < 5 || midstring.trim().length === 0) return false;

    return true;
  }
})(jQuery);
