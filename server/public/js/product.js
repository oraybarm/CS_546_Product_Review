(function ($) 
{
  let likeIcon = document.querySelector("#icon"),
    count = document.querySelector("#count");
  var url = window.location.href;
  var id = url.split("/")[4];
  var liked = $.find("#likedProduct");
  var loggedIn = $.find("#loggedIn");

  var flag = false;
  if (liked.length) {
    likeIcon.innerHTML = `<i class="fas fa-thumbs-up"></i>`;
    flag = true;
  }
  console.log(liked.length);

 


  $(".like__btn").click(function (event) {
    //event.preventDefault();
    
    if (!flag) {
      flag = true;
      likeIcon.innerHTML = `<i class="fas fa-thumbs-up"></i>`;
      count.textContent++;
    } 
    else {
      flag = false;
      likeIcon.innerHTML = `<i class="far fa-thumbs-up"></i>`;
      count.textContent--;
    }

    $.ajax({
      type: "POST",
      url: "/products/updateLike",
      data: { productId: id, liked: flag },
    });
  });
})
(window.jQuery);
