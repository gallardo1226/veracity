$(document).ready(function() {
	$('#changePassSubmit').click(function(event) {
		if ($('#newPass').val() != $('#retypePass').val()) {
			event.preventDefault();
			$('#errormessage').text('The passwords do not match').slideDown().delay('5000').slideUp(function() {
				$('#errormessage').text('');
			});
		}
		else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{8,}$/.test($('#newPass').val())) {
			event.preventDefault();
			$('#errormessage').text('The new password must have at least 8 characters and 1 uppercase, 1 lowercase, and 1 number').slideDown().delay('5000').slideUp(function() {
				$('#errormessage').text('');
			});
		}
	});
});