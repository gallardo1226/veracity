$(document).ready(function() {
	$('#btnSubmit').attr('disabled','disabled');

	$('input').keyup(function() {
		if ($('#inputFirst').val() != '' && $('#inputLast').val() != '' && $('#inputEmail').val() != '')
			$('#btnSubmit').attr('disabled', false);
	});

	$('#users').on('click', '.remove', function() {
		$(this).slideUp(function() {
			$(this).after('<span class="temp">Are you sure? <div class="btn-group"><button class="btn btn-sm btn-warning confirm">Yes</button><button class="btn btn-sm btn-primary cancel">No</button></div></span>');
			$('.temp').hide().slideDown();
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
		var id = $(this).closest('span').prev().val();
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
				t.text('Promote').addClass('promote').removeClass('demote');
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
				t.text('Demote').addClass('demote').removeClass('promote');
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