(function ($) {
    let postId;
    const newPostText = document.querySelector(".communityInput");
    const replyError = document.querySelector(".reply-error");
    const postError = document.querySelector(".post-error");
    const toastEl = document.querySelector(".toast");
    const toast = new bootstrap.Toast(toastEl, []);

    let replyText = document.querySelector(".replyText");
    let postReply = document.querySelector(".postReply");
    const newPostButton = document.querySelector("#communityButton");
    const likePostButton = document.querySelector(".likePost");
    const postIdDiv = document.querySelector(".scontainer");
    if (postIdDiv) {
        postId = postIdDiv.getAttribute("data-id");
    }
    if (newPostButton) {
        newPostButton.addEventListener("click", function () {
            let newPost = newPostText.value;
            if (newPost.length <= 0) {
                document.querySelector(".toast-body").innerHTML =
                    "Please enter a valid reply";
                toast.show();
                postError.classList.add("post-error-confirmed");
                postError.innerHTML = "Please enter a valid reply";
                return;
            }
            newPostText.value = "";
            let post = {
                title: newPost,
            };
            let requestConfig = {
                method: "POST",
                url: "/community",
                contentType: "application/json",
                data: JSON.stringify({
                    post: post,
                }),
            };

            const data = $.ajax(requestConfig).then((data) => {
                const { _id, name, likes, replies, user } = data;
                const newPost = `
                <a href="community/post/${_id}" class="newPost">
                <div className="col-md-4 border-grey w-100">
                    <div class="newPostShadow text-black bg-white mb-3 mt-4">
                        <div class="card-header py-4">${name}</div>
                        <div
                            class="card-body d-flex justify-content-space-between h-50 py-0"
                        >
                            <p
                                class="card-text d-flex align-items-center justify-content-space-between flex-row"
                            >
                                by ${user.name}
                            </p>
                            <p class="card-text">
                                ${replies.length} comments
                            </p>
                            <p class="card-text">
                                ${likes} likes
                            </p>
                        </div>
                    </div>
                </div>
                </a>
                `;
                const postContainer = document.querySelector(".post-container");
                postContainer.insertAdjacentHTML("afterbegin", newPost);
                document.querySelector(".toast-body").innerHTML =
                    "New discussion created";
                toast.show();
            });
        });
    }

    if (likePostButton) {
        likePostButton.addEventListener("click", function () {
            let requestConfig = {
                method: "POST",
                url: `/community/post/${postId}/like`,
                contentType: "application/json",
            };

            const data = $.ajax(requestConfig).then((data) => {
                const { _id, name, likes, replies, user } = data;
                const likeCounter = document.querySelector(".postLikes");
                likeCounter.innerHTML = likes.length;
            });
        });
    }

    if (replyText && postReply) {
        postReply.addEventListener("click", function () {
            replyError.innerHTML = "";
            replyError.classList.remove("reply-error-confirmed");
            if (replyText.value.length <= 0) {
                document.querySelector(".toast-body").innerHTML =
                    "Please enter a valid reply";
                toast.show();
                replyError.classList.add("reply-error-confirmed");
                replyError.innerHTML = "Please enter a valid reply";
                return;
            }
            const reply = replyText.value;
            replyText.value = "";
            let requestConfig = {
                method: "POST",
                url: `/community/post/${postId}/reply`,
                contentType: "application/json",
                data: JSON.stringify({
                    reply,
                }),
            };
            const data = $.ajax(requestConfig).then((data) => {
                const {
                    replyWithUser: { reply, user },
                    replyCount,
                } = data;

                let commentCount = document.querySelector(".commentCount");
                commentCount.innerHTML = replyCount + 1;
                const newReplyHTML = `
                <div class="p-3 d-flex flex-row align-items-start postReply">
        <div
            class="user d-flex w-10 flex-column align-items-center justify-content-between mx-4"
        >
            <img src="/public/images/upload/${user.photo}" class="absolute-avatar" alt="${user.photo}}" />
            <p class="name my-0">${user.name}</p>
        </div>
        <h3 class="reply">${reply}</h3>
    </div>
                `;
                const postContainer = document.querySelector(".s");
                postContainer.insertAdjacentHTML("afterbegin", newReplyHTML);
                document.querySelector(".toast-body").innerHTML =
                    "Reply posted";
                toast.show();
            });
        });
    }
})(jQuery);
