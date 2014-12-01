$(document).ready(function() {
	$('#btnSubmit').attr('disabled','disabled');

	$('input').keyup(function() {
		if ($('#inputFirst').val() != '' && $('#inputLast').val() != '' && $('#inputEmail').val() != '')
			$('#btnSubmit').attr('disabled', false);
	});

	$('#users').on('mouseenter', 'tr', function() {
		$(this).find('button').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
	});

	$('#users').on('mouseleave', 'tr', function() {
		$(this).find('button').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0.0}, 'fast');
	});

	$('#btnSubmit').click(function(event) {
		if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/.test($('#inputEmail').val())) {
			event.preventDefault();
			$('#message').append('<div class="alert alert-warning" role="alert">Email address is invalid').hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
		}
	});

	$('#users').on('click', '.reset', function() {
		id = $(this).val();
		$.ajax({
			type: 'POST',
			url: '/admin/resetpassword',
			data: {id:id},
			success: function(data) {
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});

	$('#users').on('click', '.remove', function() {
		$(this).after('<div class="temp"><div class="btn-group"><button class="btn btn-sm btn-success confirm"><span class="glyphicon glyphicon-ok"</span></button><button class="btn btn-sm btn-danger cancel"><span class="glyphicon glyphicon-remove"</span></button></div></div>');
		$(this).slideUp(function() {
			$('.temp').slideDown();
		});
	});

	$('#users').on('click', '.cancel', function() {
		$('.temp').slideUp(function() {
			$(this).closest('td').find('.remove').slideDown();
			$(this).remove();
		});
	});

	$('#users').on('click', '.confirm', function() {
		t = $(this);
		var id = $(this).parent().parent().prev().val();
		$.ajax({
			type: 'POST',
			url: '/admin/removeuser',
			data: {id:id},
			success: function(data) {
				t.closest('tr').slideUp(function() {
					$(this).remove();
				});
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});

	$('#users').on('click', '.demote', function() {
		t = $(this);
		var id = $(this).val();
		$.ajax({
			type: 'POST',
			url: '/admin/updatestatus',
			data: {id:id, status:false},
			success: function(data) {
				t.text('Promote').addClass('promote btn-success').removeClass('demote btn-info');
				t.parent().prev().text('No');
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">There was a problem updating this user').hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});

	$('#users').on('click', '.promote', function() {
		t = $(this);
		var id = $(this).val();
		$.ajax({
			type: 'POST',
			url: '/admin/updatestatus',
			data: {id:id, status:true},
			success: function(data) {
				console.log('success');
				t.text('Demote').addClass('demote btn-info').removeClass('promote btn-success');
				t.parent().prev().text('Yes');
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">'+data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});
});