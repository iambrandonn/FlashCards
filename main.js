/*global Handlebars, common, samples */
var SpeechRecognition = window.mozSpeechRecognition ||
	window.msSpeechRecognition ||
	window.oSpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.SpeechRecognition;

var currentProblem;
var currentScore = 0;
var highScore = 0;
var timerCtx = document.getElementById('cnvTimer').getContext('2d');
var timerCanvasHeight = document.getElementById('cnvTimer').height;
var beginTime;
var errorOccurred = false;
var selectedCategory = 'builtin-addition';
var problemsForSelectedCategory;
var selectedLanguage = navigator.language;

function selectLanguage(newValue) {
	var dropdown = document.getElementsByClassName('languageSelector')[0];
    for(var i = 0; i < dropdown.options.length; i++) {
        if(dropdown.options[i].value === newValue) {
           dropdown.selectedIndex = i;
           return;
        }
    }

    if (newValue.length === 2) {
		for(i = 0; i < dropdown.options.length; i++) {
			if(dropdown.options[i].value.substring(0, 2) === newValue) {
				dropdown.selectedIndex = i;
				return;
			}
		}
    }

    // Default to US english if not found
    selectedLanguage = 'en-US';
    selectLanguage(selectedLanguage);
}

function getQuestionFromList(theList) {
	var index = getRandomInteger(theList.length) - 1;
	return theList[index];
}

function generateAdditionProblem() {
	var first = getRandomInteger(10);
	var second = getRandomInteger(10);
	return {
		firstNumber: first,
		secondNumber: second,
		value: first + second
	};
}

function generateSubtractionProblem() {
	var prob = generateAdditionProblem();
	var first = prob.value;
	var second = prob.firstNumber;
	return {
		firstNumber: first,
		secondNumber: second,
		value: prob.secondNumber
	};
}

function generateMultiplicationProblem() {
	var first = getRandomInteger(10);
	var second = getRandomInteger(10);
	return {
		firstNumber: first,
		secondNumber: second,
		value: first * second
	};
}

function generateDivisionProblem() {
	var prob = generateMultiplicationProblem();
	var first = prob.value;
	var second = prob.firstNumber;
	return {
		firstNumber: first,
		secondNumber: second,
		value: prob.secondNumber
	};
}

function getRandomInteger(ceiling) {
	return Math.floor(Math.random() * ceiling + 1);
}

function showNextProblem() {
	var problemText;
	var previousProblem = currentProblem;
	while (previousProblem === currentProblem) {
		switch (selectedCategory) {
			case 'builtin-addition':
				currentProblem = generateAdditionProblem();
				problemText = currentProblem.firstNumber + ' + ' + currentProblem.secondNumber;
				break;
			case 'builtin-subtraction':
				currentProblem = generateSubtractionProblem();
				problemText = currentProblem.firstNumber + ' - ' + currentProblem.secondNumber;
				break;
			case 'builtin-multiplication':
				currentProblem = generateMultiplicationProblem();
				problemText = currentProblem.firstNumber + ' x ' + currentProblem.secondNumber;
				break;
			case 'builtin-division':
				currentProblem = generateDivisionProblem();
				problemText = currentProblem.firstNumber + ' / ' + currentProblem.secondNumber;
				break;
			case 'builtin-capitals':
				currentProblem = getQuestionFromList(samples.capitals);
				problemText = currentProblem.key;
				break;
			case 'builtin-chemSymbols':
				currentProblem = getQuestionFromList(samples.chemSymbols);
				problemText = currentProblem.key;
				break;
			case 'builtin-spanish':
				currentProblem = getQuestionFromList(samples.spanishWords);
				problemText = currentProblem.key;
				break;
			default:
				currentProblem = getQuestionFromList(window.problemsForSelectedCategory);
				problemText = currentProblem.key;
				break;
		}
	}
	document.getElementsByClassName('problem')[0].textContent = problemText;
}

function startSpeechRecognition() {
	var currentTime = 60;
	var timer;
	var speech = new SpeechRecognition();
	speech.continuous = true;
	speech.interimResults = true;
	speech.lang = selectedLanguage;
	speech.onstart = function() {
		// Run for 60 seconds and stop
		setTimeout(function() {
			speech.stop();
		}, 60000);

		document.getElementsByClassName('scores')[0].classList.remove('hidden');
		document.getElementsByClassName('card')[0].classList.remove('hidden');
		document.getElementsByClassName('iHeard')[0].classList.remove('hidden');
		document.getElementById('secondInstructions').style.display = '';

		errorOccurred = false;
		currentScore = 0;
		document.getElementById('currentScoreValue').textContent = currentScore;
		beginTime = new Date().getTime();
		window.requestAnimationFrame(updateTimer);

		var timeRemaining = document.getElementsByClassName('timeRemaining')[0];
		timeRemaining.textContent = '1:00';
		timeRemaining.classList.remove('expired');

		timer = setInterval(function() {
			var timeToShow = '';
			if (currentTime > 59) {
				timeToShow = '1:00';
			}
			if (currentTime < 10) {
				timeToShow = '0:0' + currentTime;
			}
			else {
				timeToShow = '0:' + currentTime;
			}

			currentTime--;

			timeRemaining.textContent = timeToShow;
		}, 1000);

		// Show the first question
		showNextProblem();
	};


	speech.onend = function() {
		currentTime = 60;
		clearInterval(timer);
		var timeRemaining = document.getElementsByClassName('timeRemaining')[0];
		timeRemaining.textContent = '1:00';
		timeRemaining.classList.add('expired');
		doneSound.play();
		errorOccurred = true;
		startButton.textContent = 'Restart';

		var previousHigh = common.getHighScoreFor(selectedCategory);
		if (previousHigh < currentScore) {
			common.setHighScoreFor(selectedCategory, currentScore);
			common.renderCategories();
			document.getElementById('highScoreValue').innerHTML = currentScore;
		}

		var highlighted = document.getElementsByClassName('highlight');
		for (var i = 0; i < highlighted.length; i++) {
			highlighted[i].classList.remove('highlight');
		}
	};

	speech.onerror = speech.onend;

	speech.onresult = function(event) {
		var iHeard = '';

		for (var i = event.resultIndex; i < event.results.length; i++) {
			if (!event.results[i].isFinal) {
				iHeard += event.results[i][0].transcript;
			}
		}
		setIHeardText(iHeard);
		checkAnswer(iHeard);
	};

	speech.start();
}

function checkAnswer(guess) {
	var trimmedGuess = guess.trim().toLowerCase();
	var answer = currentProblem.value;
	if (typeof answer === 'string') {
		answer = answer.toLowerCase();
	}


	if (/skip|next question/gi.test(guess) || trimmedGuess.indexOf(answer) >= 0) {
		showNextProblem();
	}

	if (trimmedGuess.indexOf(answer) >= 0) {
		currentScore++;
		var scoreElement = document.getElementById('currentScoreValue');
		scoreElement.textContent = currentScore;

		if (currentScore > highScore) {
			scoreElement.classList.add('highlight');
		}
	}
}

function setIHeardText(textToDisplay) {
	document.getElementById('iHeardText').textContent = textToDisplay;
}

function paintTimer(percent) {
	timerCtx.clearRect(0, 0, 1000, 1000);
	var radiusToUse = (timerCanvasHeight / 2) - 5;
	var grd = timerCtx.createRadialGradient(radiusToUse + 5,radiusToUse + 5, (radiusToUse - 15), radiusToUse - 5, radiusToUse - 5,(radiusToUse) + 10);
	grd.addColorStop(0,'rgb(' + Math.ceil(255 - (255 * percent)) + ', ' + Math.ceil(255 * percent) + ', 0)');
	grd.addColorStop(1,"black");

	// Fill with gradient
	timerCtx.fillStyle = grd;
	timerCtx.lineWidth = 4;
	timerCtx.beginPath();
	timerCtx.arc(radiusToUse + 5, radiusToUse + 5, radiusToUse, Math.PI * 3 / 2, Math.PI * 2 * percent - (Math.PI / 2), false);
	timerCtx.lineTo(radiusToUse + 5, radiusToUse + 5);
	timerCtx.closePath();
	timerCtx.stroke();
	timerCtx.fill();
}

function updateTimer() {
	if (errorOccurred) {
		return;
	}

	var now = new Date().getTime();
	var percent = (now - beginTime) / 60000;
	paintTimer(1 - percent);
	if (percent < 1) {
		window.requestAnimationFrame(updateTimer);
	}
}

function detectIfSpeechSupported() {
	var supportMessage;
	var warningsElement = document.getElementsByClassName('warnings')[0];
	if (SpeechRecognition) {
		supportMessage = "Cool!  Your browser supports speech recognition.  Have fun!";
	}
	else {
		warningsElement.classList.add('unsupported');
		supportMessage = "Sorry... Your browser doesn't support speech recognition yet.  Try Google Chrome version 25.";
	}
	warningsElement.innerHTML = supportMessage;
}

function switchToSecondInstructions() {
	var first = document.getElementById('firstInstructions');
	if (first.style.display !== 'none') {
		document.getElementById('secondInstructions').style.display = 'block';
		first.style.display = 'none';
	}
}

detectIfSpeechSupported();
common.renderCategories();
paintTimer(0.99999);
selectLanguage(selectedLanguage);

setTimeout(function() {
	document.getElementsByClassName('leftArrow')[0].style['margin-left'] ='0';
	setTimeout(function() {
		document.getElementsByClassName('leftArrow')[0].style['opacity'] ='0';
		document.getElementById('categoryComponent').style['box-shadow'] ='0 0 0 rgb(0, 115, 121)';
	}, 1500);
}, 300);

var startButton = document.getElementsByClassName('startButton')[0];
startButton.addEventListener('click', function() {
	if (this.classList.contains('disabled')) {
		window.alert('Please choose a category');
		return ;
	}

	startSpeechRecognition();
});

var languageSelector = document.getElementsByClassName('languageSelector')[0];
languageSelector.addEventListener('change', function() {
	selectedLanguage = languageSelector.options[languageSelector.selectedIndex].value;
});

var doneSound = new Audio('done.mp3');
