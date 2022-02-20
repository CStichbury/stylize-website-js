$(".imgAdd").click(function () {
  $(this)
    .closest(".row")
    .find(".imgAdd")
    .before(
      '<div class="col-sm-2 imgUp"><div class="imagePreview"></div><label class="btn btn-primary">Upload<input type="file" class="uploadFile img" value="Upload Photo" style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i></div>'
    );
});
$(document).on("click", "i.del", function () {
  $(this).parent().remove();
});

function isFileImage(file) {
  const acceptedImageTypes = ["image/jpeg","image/jpg","image/png"];
  return file && $.inArray(file["type"], acceptedImageTypes);
}

let content_img = null;
let style_img = null;

$(function () {
  $(document).on("change", ".uploadFile", function () {
    var uploadFile = $(this);
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
      if (/^image/.test( files[0].type)){ // only image file
    // if (isFileImage(files[0])) {
      var reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files[0]); // read the local file
      console.log('Hello');
      reader.onloadend = function () {
        // set image data as background of div
        //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
        uploadFile
          .closest(".imgUp")
          .find(".imagePreview")
          .css("background-image", "url(" + this.result + ")");
          
        // Save the image
        const input_name = $(this).attr('id');
        if(input_name.contains('content')){
          content_img = this.result;
        } else if (input_name.contains('style')){
          style_img = this.result;
        };

        // If images are loaded, unlock the stylize button
        if(content_img && style_img){
          $('#Stylize').removeAttr('disabled');
        }
      };
    }
  });
});

$(document).ready(function() {
  $("#btnFetch").click(function() {
    // disable button
    $(this).prop("disabled", true);
    // add spinner to button
    $(this).html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );
  });
});

const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});

const loading_state = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Stylizing...`

$('#Stylize').click(async function(){
  const prev_state = $('#Stylize').html()

  $('#Stylize').toggleClass('disabled');
  
  $('#Stylize').empty().append(loading_state);

  await delay(1000);
  
  $('#Stylize').toggleClass('disabled');

  $('#Stylize').empty().append(prev_state);
});

// From this tutorial: https://getbootstrap.com/docs/5.0/components/tooltips/
// Need to add popper js properly
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})