$(document).ready(function() {
	$('#btnSubmit').attr('disabled','disabled');

	$('input').keyup(function() {
		if ($('#inputFirst').val() !== '' && $('#inputLast').val() !== '' && $('#inputEmail').val() !== '')
			$('#btnSubmit').attr('disabled', false);
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
		$('.remove-confirm:visible, .reset-confirm:visible').slideUp(function() {
			$('.remove:hidden, .reset:hidden').slideDown();
		});
		$(this).slideUp(function() {
			$(this).next().slideDown();
		});
	});

	$('.reset-confirm').click(function() {
		var id = $(this).val();
		$(this).slideUp(function() {
			$(this).prev().slideDown();
		});
		var icon = $(this).prev();
		var html = icon.html();
		$(this).prev().html('<img width="15" src="/images/loading.gif"/>').addClass('disabled');
		$.ajax({
			type: 'POST',
			url: '/util/resetpassword',
			data: {id:id},
			success: function(data) {
				$('#message').append('<div class="alert alert-success" role="alert">' + data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				icon.removeClass('disabled').html(html);
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">' + data.statusText).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				icon.removeClass('disabled').html(html);
			}
		});
	});

	$('.remove').click(function() {
		$('.remove-confirm:visible, .reset-confirm:visible').slideUp(function() {
			$('.remove:hidden, .reset:hidden').slideDown();
		});
		$(this).slideUp(function() {
			$(this).next().slideDown();
		});
	});

	$('.remove-confirm').click(function() {
		var icon = $(this).prev();
		var html = icon.html();
		var id = $(this).val();
		$(this).slideUp(function() {
			$(this).prev().slideDown();
		});
		$(this).prev().html('<img width="15" src="/images/loading.gif"/>').addClass('disabled');
		$.ajax({
			type: 'POST',
			url: '/util/removeuser',
			data: {id:id},
			success: function(data) {
				icon.closest('tr').slideUp(function() {
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
				icon.removeClass('disabled').html(html);
			}
		});
	});

	$('#users').on('click', '.demote', function() {
		var icon = $(this);
		var id = $(this).find('input:hidden').val();
		var html = $(this).html();
		$(this).html('<img width="15" src="/images/loading.gif"/>').addClass('disabled');
		$.ajax({
			type: 'POST',
			url: '/util/updatestatus',
			data: {id:id, status:false},
			success: function(data) {
				console.log('success');
				icon.removeClass('disabled active demote').addClass('promote').html(html).attr('title', 'Promote');
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">There was a problem updating this user').hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				icon.removeClass('disabled').html(html);
			}
		});
	});

	$('#users').on('click', '.promote', function() {
		var icon = $(this);
		var id = $(this).find('input:hidden').val();
		var html = $(this).html();
		$(this).html('<img width="15" src="/images/loading.gif"/>').addClass('disabled');
		$.ajax({
			type: 'POST',
			url: '/util/updatestatus',
			data: {id:id, status:true},
			success: function(data) {
				console.log('success');
				icon.removeClass('disabled promote').addClass('active demote').html(html).attr('title', 'Demote');
			},
			error: function(data) {
				$('#message').append('<div class="alert alert-danger" role="alert">'+data).hide().slideDown().delay('3000').slideUp(function() {
					$('.alert').remove();
				});
				icon.removeClass('disabled').html(html);
			}
		});
	});
});