(function ($) {
    const profileContainer = document.querySelector(".profileContainer");

    const dataCanUpdate = profileContainer.getAttribute("data-can-update");
    const dataIsUpdated = profileContainer.getAttribute(
        "data-update-successful"
    );

    const toastEl = document.querySelector(".toast");
    const toast = new bootstrap.Toast(toastEl, []);

    if (dataCanUpdate) {
        toast.show();
    }

    if (dataIsUpdated) {
        toast.show();
    }

    var profileNameField = document.getElementById("name");
    var profileFileField = document.getElementById("file");

    var forms = document.querySelectorAll(".needs-validation");

    profileNameField.addEventListener("input", function () {
        var val = document.getElementById("name").value;
        if (!isValidUsername(val)) {
            profileNameField.setCustomValidity("invalid");
        } else {
            profileNameField.setCustomValidity("");
        }
    });

    profileFileField.addEventListener("input", function () {
        var val = document.getElementById("file").value;
        const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
        const fileType = this.files[0].type;

        if (
            !validImageTypes.includes(fileType) ||
            this.files[0].size / 1024 / 1024 > 2
        ) {
            profileFileField.setCustomValidity("invalid");
        } else {
            profileFileField.setCustomValidity("");
        }
    });

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
})(jQuery);
