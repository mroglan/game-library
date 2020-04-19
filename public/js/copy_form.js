$(function() {
	// $('#status').parent().nextAll('div').children('.nullify').val(null);
	if( $('#status').val() != 'Available') {
		$('#due_back').parent().removeClass('status-depend');
	}
	if( $('#status').val() === 'Loaned' || $('#status').val() === 'Reserved') {
		$('#user').parent().removeClass('status-depend');
	}
	if( $('#status').val() === 'Available') {
		$('#status').parent().nextAll('div').children('.nullify').val(null);
	}
	if( $('#status').val() === 'Maintenance') {
		$('#user').val(null);
	}
	
	$('#status').change(function() {
		if($(this).val() === 'Available') {
			$(this).parent().nextAll('div').addClass('status-depend').children('.nullify').val(null);
		} else if( $(this).val() === 'Loaned' || $(this).val() === 'Reserved') {
			$(this).parent().nextAll('div').removeClass('status-depend');
		} else {
			$(this).parent().next('div').removeClass('status-depend');
			$('#user').val(null).parent().addClass('status-depend');
		}
	});
});