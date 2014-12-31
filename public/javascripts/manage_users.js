$(document).ready(function() {
	$('#btnSubmit').attr('disabled','disabled');

	$('input').keyup(function() {
		if ($('#inputFirst').val() != '' && $('#inputLast').val() != '' && $('#inputEmail').val() != '')
			$('#btnSubmit').attr('disabled', false);
	});

	$('#users').on('mouseenter', 'tr', function() {
		$(this).find('.promote,.demote,.reset,.remove').animate({opacity: 1.0}, 'fast');
	});

	$('#users').on('mouseleave', 'tr', function() {
		$(this).find('.promote,.demote,.reset,.remove').animate({opacity: 0.0}, 'fast');
	});

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
			url: '/admin/updaterole',
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

	$('#users').on('click', '.reset', function() {
		$(this).after('<div class="temp-reset" style="display:none;"><div class="btn-group"><button class="btn btn-sm btn-success confirm" title="Confirm"><span class="glyphicon glyphicon-ok"</span></button><button class="btn btn-sm btn-danger cancel" title="Cancel"><span class="glyphicon glyphicon-remove"</span></button></div></div>');
		$('.temp-reset button').css({opacity: 1.0});
		$(this).slideUp(function() {
			$('.temp-reset').slideDown();
		});
	});

	$('#users').on('click', '.temp-reset .cancel', function() {
		$('.temp-reset').slideUp(function() {
			$(this).closest('td').find('.reset').slideDown();
			$(this).remove();
		});
	});

	$('#users').on('click', '.temp-reset .confirm', function() {
		t = $(this);
		var id = $(this).parent().parent().prev().val();
		$.ajax({
			type: 'POST',
			url: '/admin/resetpassword',
			data: {id:id},
			success: function(data) {
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				$('.temp-reset').slideUp(function() {
					$(this).closest('td').find('.reset').slideDown();
					$(this).remove();
				});
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data.statusText).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
			}
		});
	});

	$('#users').on('click', '.remove', function() {
		$(this).after('<div class="temp-remove" style="display:none;"><div class="btn-group"><button class="btn btn-sm btn-success confirm" title="Confirm"><span class="glyphicon glyphicon-ok"</span></button><button class="btn btn-sm btn-danger cancel" title="Cancel"><span class="glyphicon glyphicon-remove"</span></button></div></div>');
		$('.temp-remove button').css({opacity: 1.0});
		$(this).slideUp(function() {
			$('.temp-remove').slideDown();
		});
	});

	$('#users').on('click', '.temp-remove .cancel', function() {
		$('.temp-remove').slideUp(function() {
			$(this).closest('td').find('.remove-remove').slideDown();
			$(this).remove();
		});
	});

	$('.role')

	$('#users').on('click', '.temp-remove .confirm', function() {
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
			url: '/admin/updatestatus',
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
			url: '/admin/updatestatus',
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