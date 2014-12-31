$(document).ready(function() {
	$('#changePassSubmit').click(function(event) {
		if ($('#newPassword').val() != $('#retypePassword').val()) {
			event.preventDefault();
			$('#errormessage').text('The passwords do not match').slideDown().delay('3000').slideUp(function() {
				$('#errormessage').text('');
			});
		}
		else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test($('#newPassword').val())) {
			event.preventDefault();
			$('#errormessage').text('The new password must have at least 8 characters and 1 uppercase, 1 lowercase, and 1 number').slideDown().delay('3000').slideUp(function() {
				$('#errormessage').text('');
			});
		}
	});
});