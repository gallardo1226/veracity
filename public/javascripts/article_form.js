$(document).ready(function() {

	tinymce.init({
		selector: "textarea",
		menubar: false,
		statusbar: false,
		height: 400
	});

	exts = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

	$('#uploadPic').change(function() {
		$('#imgName').removeClass('text-danger');
		img = document.getElementById("uploadPic");
		file = img.value;
		if (file) {
			file = file.slice(file.lastIndexOf('\\') + 1);
			ext = file.slice(file.lastIndexOf('.'));
			valid = false;
			for (i = 0; i < exts.length; i++) {
				if (ext.toLowerCase() == exts[i]) {
					valid = true;
					break;
				}
			}
			if (valid)
				$('#imgName').text(file);
			else {
				$('#uploadPic').remove();
				$('.btn-file').append('<input id="uploadPic" type="file" name="img">');
				$('#imgName').addClass('text-danger').text('File must be an image');
			}
		}
	});

	$('.add').click(function() {
		var div = $(this).closest('.form-group');
			div.after('<div class="form-group">' + div.html() + '</div>');
			div.next().find('.add').addClass('remove btn-danger').removeClass('add btn-success').find('span').addClass('glyphicon-minus').removeClass('glyphicon-plus');
	});

	$('#formUploadArticle').on('click', '.remove', function() {
		$(this).closest('.form-group').remove();
	});
});