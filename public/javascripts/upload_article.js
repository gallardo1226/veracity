$(document).ready(function() {

	$('#body').wysihtml5({ toolbar: { "fa": true, 'link': false }});

	$('#submit').click(function() {
		$('#content').val($('#body').html());
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