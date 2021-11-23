(function ($) {
  const profileContainer = document.querySelector(".profileContainer");

  const dataCanUpdate = profileContainer.getAttribute("data-can-update");
  const dataIsUpdated = profileContainer.getAttribute("data-update-successful");

  const toastEl = document.querySelector(".toast");
  const toast = new bootstrap.Toast(toastEl, []);

  if (dataCanUpdate) {
    toast.show();
  }

  if (dataIsUpdated) {
    toast.show();
  }
})(jQuery);
