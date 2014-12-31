$(document).ready(function() {

	tinymce.init({
		selector: "textarea",
		menubar: false,
		statusbar: false
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

	var numAuthors = 1;
	$('#add').click(function() {
		numAuthors++;
		var div = $(this).closest('.form-group').next();
		if (div.hasClass('hidden'))
			div.removeClass('hidden');
		else
			div.after('<div class="form-group">' + div.html() + '</div>');
	});

	$('#formUploadArticle').on('click', '.remove', function() {
		numAuthors--;
		if ($('select[name="author"]').length > 1)
			$(this).closest('.form-group').remove();
		else
			$(this).closest('.form-group').addClass('hidden');
	});
});