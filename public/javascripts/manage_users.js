$(document).ready(function() {
	$('#btnSubmit').attr('disabled','disabled');

	$('input').keyup(function() {
		if ($('#inputFirst').val() !== '' && $('#inputLast').val() !== '' && $('#inputEmail').val() !== '')
			$('#btnSubmit').attr('disabled', false);
	});

	// $('#users').on('mouseenter', 'tr', function() {
	// 	$(this).find('.promote,.demote,.reset,.remove').animate({opacity: 1.0}, 'fast');
	// });

	// $('#users').on('mouseleave', 'tr', function() {
	// 	$(this).find('.promote,.demote,.reset,.remove').animate({opacity: 0.0}, 'fast');
	// });

	$('.role a').click(function() {
		$(this).addClass('hidden').next().removeClass('hidden').val($(this).text());
	});

	$('.role .cancel').click(function() {
		$(this).closest('.input-group').addClass('hidden').prev().removeClass('hidden');
	});

	$('.role .confirm').click(function() {
		t = $(this);
		id = t.val();
		role = t.parent().prev().val();
		$.ajax({
			type: 'POST',
			url: '/util/updaterole',
			data: {
				id : id,
				role : role,
			},
			success: function(data) {
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				t.closest('.input-group').addClass('hidden').prev().removeClass('hidden').text(role);
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			},
		});
	});

	$('#btnSubmit').click(function(event) {
		if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/.test($('#inputEmail').val())) {
			event.preventDefault();
			$('#message').append('<div class="alert alert-warning" role="alert">Email address is invalid').hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
		}
	});

	$('.reset').click(function() {
		$(this).slideUp(function() {
			$(this).next().slideDown();
		});
	});

	$('.reset-confirm').click(function() {
		var id = $(this).val();
		$(this).slideUp(function() {
			$(this).prev().slideDown();
		});
		var html = $(this).prev().html();
		$(this).prev().html('<img width="15" src="/images/loading.gif"/>');
		// $.ajax({
		// 	type: 'POST',
		// 	url: '/util/resetpassword',
		// 	data: {id:id},
		// 	success: function(data) {
		// 		$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
		// 			$('.alert').remove();
		// 		});
		// 		$('.temp-reset').slideUp(function() {
		// 			$(this).closest('td').find('.reset').slideDown();
		// 			$(this).remove();
		// 		});
		// 	},
		// 	error: function(data) {
		// 		$('#message').append('<div class="alert alert-danger" role="alert">' + data.statusText).hide().slideDown().delay('3000').slideUp(function() {
		// 			$('.alert').remove();
		// 		});
		// 	}
		// });
	});

	$('.remove').click(function() {
		$(this).slideUp();
		$(this).next().slideDown();
	});

	$('.remove-confirm').click(function() {
		t = $(this);
		var id = $(this).val();
		$.ajax({
			type: 'POST',
			url: '/util/removeuser',
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
				$('#message').append('<div class="alert alert-danger" role="alert">' + data.statusText).hide().slideDown().delay('3000').slideUp(function() {
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
			url: '/util/updatestatus',
			data: {id:id, status:false},
			success: function(data) {
				t.attr('title', 'Promote').addClass('promote btn-info').removeClass('demote btn-primary').find('span').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
				t.parent().prev().find('span').remove();
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
			url: '/util/updatestatus',
			data: {id:id, status:true},
			success: function(data) {
				console.log('success');
				t.attr('title', 'Demote').addClass('demote btn-primary').removeClass('promote btn-info').find('span').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
				t.parent().prev().append('<span class="glyphicon glyphicon-ok">');
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">'+data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});
});