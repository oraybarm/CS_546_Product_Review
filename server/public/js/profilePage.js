(function ($) {
  const profileContainer = document.querySelector(".profileContainer");

  const dataCanUpdate = profileContainer.getAttribute("data-can-update");
  const dataIsUpdated = profileContainer.getAttribute("data-update-successful");

  const toastEl = document.querySelector(".toast");
  const toast = new bootstrap.Toast(toastEl, []);

  console.log(`dataCanUpdate`, dataCanUpdate, dataIsUpdated);
  if (dataCanUpdate) {
    console.log("here");
    // $(".toast").toast("show");
    toast.show();
  }

  if (dataIsUpdated) {
    console.log("here");
    // $(".toast").toast("show");
    toast.show();
  }
})(jQuery);
