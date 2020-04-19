
$(function() {
	
	$('.up-vote-button').on('click', function() {
		console.log($('#userid').val());
		if($(this).hasClass('green')) {
			$.ajax({
				url: '/help/faqs/remove_like',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({'userid': $('#userid').val(), 'faqid': $(this).val()})
			});
			$(this).removeClass('green');
			var count = parseInt($(this).next('.vote_count').text()) - 1;
			$(this).next('.vote_count').text(count);
		} else {
			$.ajax({
				url: '/help/faqs/add_like',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({'userid': $('#userid').val(), 'faqid': $(this).val()}),
			});
			$(this).addClass('green');
			console.log($(this).next('.vote_count').text());
			var count = parseInt($(this).next('.vote_count').text()) + 1;
			$(this).next('.vote_count').text(count);
		}
	});
});