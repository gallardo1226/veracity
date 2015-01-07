$(document).ready(function() {
	exts = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

	$('#infoForm').on('change', '#uploadPic', function() {
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

	$('#submitEdit').click(function() {
		$('#infoForm').submit();
	});

	$('#cancelChange').click(function() {
		$('#passwordForm :password').each(function() {
			$(this).val('');
		});
	});

	$('#submitChange').click(function() {
		if ($('#newPass').val() != $('#retypePass').val())
			$('#errormessage').text('The passwords do not match').slideDown().delay('5000').slideUp(function() {
				$('#errormessage').text('');
			});
    else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{8,}$/.test($('#newPass').val()))
			$('#errormessage').text('The new password must have at least 8 characters and 1 uppercase, 1 lowercase, and 1 number').slideDown().delay('5000').slideUp(function() {
				$('#errormessage').text('');
			});
		else {
			$.ajax({
				type: 'POST',
				url: '/staff/changepassword',
				data: $('#passwordForm').serialize(),
				success: function(data) {
					console.log(data);
					$('#passModal .close').trigger('click');
					$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
						$('.alert').remove();
					});
				},
				error: function(data) {
					console.log(data);
					$('#errormessage').text(data).slideDown().delay('5000').slideUp(function() {
						$('#errormessage').text('');
					});
				},
			});
		}
	});
});