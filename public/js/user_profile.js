$(function() {
	
	let button = '<button class="btn btn-primary changeButton">Change</button>';
	
	$('.changable').on('mouseenter', function() {
		$('.changable').children('.changeButton').remove();
		$(this).append(button);
		if( $(this).attr('id') == 'profile-div' || $(this).attr('id') == 'user_info') {
			//console.log("hello");
			$(this).children('button').addClass('move-right');
		} else {
			$(this).children('button').addClass('stay-left');
		}
	}).children('.changeButton').mouseout(function() {
		$(this).remove();
	});
	
	/*
	$('.changeButton').click(function() {
		console.log('button clicked');
		jQuery.get('/catalog/users/profile/' + $(this).parent().attr('id'), {name: $('#user_name').val(), email: $('#user_email').val()}, function(data) {
			alert('sent get request');
		});
	});
	*/
	
	$('#user_info').delegate('.changeButton', 'click', function() {
		console.log('button clicked');
		let name1 = $('#user_name').children('.input_name').text();
		//console.log(name1)
		let email = $('#user_email').children('.input_name').text();
		$('#user_name').html('<span style="font-size:.5em">Name: <input name="user_name"></span>').find('input').val(name1);
		//$('#user_email').html('Email: <input name="user_email">').children('input').val(email);
		$(this).addClass('block').removeClass('changeButton').text('Submit').attr('type', 'submit').attr('id', 'submitButton').click(function() {
			var data = $('#user_name input').val();
			console.log(data);
			$.ajax({
				url: '/users/profile/user_info',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({'user_name': data})
			});
		});
		$('.changable').off();
	});
	$('#profile-div').delegate('.changeButton', 'click', function() {
		console.log('button 2 clicked');
		window.location.replace('/users/profile/picture');
	});
});
