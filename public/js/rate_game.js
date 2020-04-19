var rating = false;

$(function() {
	var star = '<div class="star rating-circle"><i class="fas fa-star"></i></div>';
	var shadedStar = '<div class="star rating-circle rating-chosen"><i class="fas fa-star"></i></div>';
	for(let i = 0; i < 5; i++) {
		if( $('#stars').val() && i < parseInt($('#stars').val())) {
			$('#rating-container').append(shadedStar);
		} else { 
			$('#rating-container').append(star);
		}
	}
	$('.rating-circle').on('mouseenter', function() {
		if(!rating) {
			$('#rating-container').children().removeClass('rating-hover').removeClass('rating-chosen');
			$(this).addClass('rating-hover');
			$(this).prevAll().addClass('rating-hover');
			$(this).nextAll().removeClass('rating-hover');
		}
	}).on('click', function() {
		$(this).removeClass('rating-hover');
		$(this).prevAll().removeClass('rating-hover');
		$(this).addClass('rating-chosen');
		$(this).prevAll().addClass('rating-chosen');
		var chosenRating = $('.rating-circle').index(this) + 1;
		//console.log(chosenRating);
		$('#stars').val(chosenRating);
		rating = true;
	});
	$('#rating-container').on('mouseleave', function() {
		rating = false;
	});
});