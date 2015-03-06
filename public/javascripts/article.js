$(document).ready(function() {
	loadLatest();
	loadRelated();
});

function loadLatest() {
	$.ajax({
		url: '/util/featuredarticles',
		success: function(data) {
			$('#right').prepend(data);
		}
	});
}

function loadRelated() {
	id = $('#id').text();
	$.ajax({
		url: '/util/relatedarticles/' + id,
		success: function(data) {
			$('#right').append(data);
		}
	});
}