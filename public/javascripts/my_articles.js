$(document).ready(function() {
	$('body').timeago();

	$('.delete').click(function() {
		$(this).parent().slideUp(function() {
			$(this).next().slideDown();
		});
	});

	$('.cancel').click(function() {
		$(this).parent().slideUp(function() {
			$(this).prev().slideDown();
		});
	});

	$('.confirm').click(function() {
		t = $(this);
		var id = $(this).val();
		$.ajax({
			type: 'POST',
			url: '/staff/deletearticle',
			data: {id:id},
			success: function(data) {
				t.closest('.thumbnail').parent().slideUp(function() {
					$(this).remove();
				});
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data.statusText).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});
});