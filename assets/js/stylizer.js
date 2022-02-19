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

$('#Stylize').click(async function(){
  console.log('YAY!');
  $('#Stylize').attr('disabled', 'disabled');
  
  await delay(1000);
	// if ($('#Stylize').is(':disabled')) {
  $('#Stylize').removeAttr('disabled');
  // }
});