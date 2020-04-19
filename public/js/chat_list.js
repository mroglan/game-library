
$(function() {
	
	$('#start_button').on('click', function() {
		$(this).attr('disabled', 'disabled');
		$('.must_click').fadeIn(1000);
	});
	$('#cancel_button').on('click', function() {
		$('#start_button').removeAttr('disabled');
		$('.must_click').fadeOut(1000);
	});
});