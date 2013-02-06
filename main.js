var currentTime = 60;
var timer = setInterval(function() {
	var timeToShow = '';
	if (currentTime > 59) {
		timeToShow = '1:00';
	}
	else {
		timeToShow = '0:' + currentTime;
	}

	currentTime--;

	document.getElementsByClassName('timeRemaining')[0].textContent = timeToShow;
}, 1000);