/*global console, Handlebars */
var currentTime = 60;
var timer;
var currentProblem;
var currentScore = 0;
var timerCtx = document.getElementById('cnvTimer').getContext('2d');
var timerCanvasHeight = document.getElementById('cnvTimer').height;
var beginTime;
var errorOccurred = false;
var selectedProblemSet = 'builtin-addition';

var capitals = [
	{key:'Alabama', value: 'Montgomery'},
	{key:'Alaska', value: 'Juneau'},
	{key:'Arizona', value: 'Phoenix'},
	{key:'Arkansas', value: 'Little Rock'},
	{key:'California', value: 'Sacramento'},
	{key:'Colorado', value: 'Denver'},
	{key:'Connecticut', value: 'Hartford'},
	{key:'Delaware', value: 'Dover'},
	{key:'Florida', value: 'Tallahassee'},
	{key:'Georgia', value: 'Atlanta'},
	{key:'Hawaii', value: 'Honolulu'},
	{key:'Idaho', value: 'Boise'},
	{key:'Illinois', value: 'Springfield'},
	{key:'Indiana', value: 'Indianapolis'},
	{key:'Iowa', value: 'Des Moines'},
	{key:'Kansas', value: 'Topeka'},
	{key:'Kentucky', value: 'Frankfort'},
	{key:'Louisiana', value: 'Baton Rouge'},
	{key:'Maine', value: 'Augusta'},
	{key:'Maryland', value: 'Annapolis'},
	{key:'Massachusetts', value: 'Boston'},
	{key:'Michigan', value: 'Lansing'},
	{key:'Minnesota', value: 'Saint Paul'},
	{key:'Mississippi', value: 'Jackson'},
	{key:'Missouri', value: 'Jefferson City'},
	{key:'Montana', value: 'Helena'},
	{key:'Nebraska', value: 'Lincoln'},
	{key:'Nevada', value: 'Carson City'},
	{key:'New Hampshire', value: 'Concord'},
	{key:'New Jersey', value:'Trenton'},
	{key:'New Mexico', value: 'Santa Fe'},
	{key:'New York', value: 'Albany'},
	{key:'North Carolina', value: 'Raleigh'},
	{key:'North Dakota', value: 'Bismarck'},
	{key:'Ohio', value: 'Columbus'},
	{key:'Oklahoma', value: 'Oklahoma City'},
	{key:'Oregon', value: 'Salem'},
	{key:'Pennsylvania', value: 'Harrisburg'},
	{key:'Rhode Island', value: 'Providence'},
	{key:'South Carolina', value: 'Columbia'},
	{key:'South Dakota', value:	'Pierre'},
	{key:'Tennessee', value: 'Nashville'},
	{key:'Texas', value: 'Austin'},
	{key:'Utah', value: 'Salt Lake City'},
	{key:'Vermont', value: 'Montpelier'},
	{key:'Virginia', value: 'Richmond'},
	{key:'Washington', value: 'Olympia'},
	{key:'West Virginia', value: 'Charleston'},
	{key:'Wisconsin', value: 'Madison'},
	{key:'Wyoming', value: 'Cheyenne'}
];

var chemSymbols = [
	{key:'Ac', value: 'Actinium'},
	{key:'Ag', value: 'Silver'},
	{key:'Al', value: 'Aluminium'},
	{key:'Am', value: 'Americium'},
	{key:'Ar', value: 'Argon'},
	{key:'As', value: 'Arsenic'},
	{key:'At', value: 'Astatine'},
	{key:'Au', value: 'Gold'},
	{key:'B', value: 'Boron'},
	{key:'Ba', value: 'Barium'},
	{key:'Be', value: 'Beryllium'},
	{key:'Bh', value: 'Bohrium'},
	{key:'Bi', value: 'Bismuth'},
	{key:'Bk', value: 'Berkelium'},
	{key:'Br', value: 'Bromine'},
	{key:'C', value: 'Carbon'},
	{key:'Ca', value: 'Calcium'},
	{key:'Cd', value: 'Cadmium'},
	{key:'Ce', value: 'Cerium'},
	{key:'Cf', value: 'Californium'},
	{key:'Cl', value: 'Chlorine'},
	{key:'Cm', value: 'Curium'},
	{key:'Cn', value: 'Copernicium'},
	{key:'Co', value: 'Cobalt'},
	{key:'Cr', value: 'Chromium'},
	{key:'Cs', value: 'Caesium'},
	{key:'Cu', value: 'Copper'},
	{key:'Db', value: 'Dubnium'},
	{key:'Ds', value: 'Darmstadtium'},
	{key:'Dy', value: 'Dysprosium'},
	{key:'Er', value: 'Erbium'},
	{key:'Es', value: 'Einsteinium'},
	{key:'Eu', value: 'Europium'},
	{key:'F', value: 'Fluorine'},
	{key:'Fe', value: 'Iron'},
	{key:'Fl', value: 'Flerovium'},
	{key:'Fm', value: 'Fermium'},
	{key:'Fr', value: 'Francium'},
	{key:'Ga', value: 'Gallium'},
	{key:'Gd', value: 'Gadolinium'},
	{key:'Ge', value: 'Germanium'},
	{key:'H', value: 'Hydrogen'},
	{key:'He', value: 'Helium'},
	{key:'Hf', value: 'Hafnium'},
	{key:'Hg', value: 'Mercury'},
	{key:'Ho', value: 'Holmium'},
	{key:'Hs', value: 'Hassium'},
	{key:'I', value: 'Iodine'},
	{key:'In', value: 'Indium'},
	{key:'Ir', value: 'Iridium'},
	{key:'K', value: 'Potassium'},
	{key:'Kr', value: 'Krypton'},
	{key:'La', value: 'Lanthanum'},
	{key:'Li', value: 'Lithium'},
	{key:'Lr', value: 'Lawrencium'},
	{key:'Lu', value: 'Lutetium'},
	{key:'Lv', value: 'Livermorium'},
	{key:'Md', value: 'Mendelevium'},
	{key:'Mg', value: 'Magnesium'},
	{key:'Mn', value: 'Manganese'},
	{key:'Mo', value: 'Molybdenum'},
	{key:'Mt', value: 'Meitnerium'},
	{key:'N', value: 'Nitrogen'},
	{key:'Na', value: 'Sodium'},
	{key:'Nb', value: 'Niobium'},
	{key:'Nd', value: 'Neodymium'},
	{key:'Ne', value: 'Neon'},
	{key:'Ni', value: 'Nickel'},
	{key:'No', value: 'Nobelium'},
	{key:'Np', value: 'Neptunium'},
	{key:'O', value: 'Oxygen'},
	{key:'Os', value: 'Osmium'},
	{key:'P', value: 'Phosphorus'},
	{key:'Pa', value: 'Protactinium'},
	{key:'Pb', value: 'Lead'},
	{key:'Pd', value: 'Palladium'},
	{key:'Pm', value: 'Promethium'},
	{key:'Po', value: 'Polonium'},
	{key:'Pr', value: 'Praseodymium'},
	{key:'Pt', value: 'Platinum'},
	{key:'Pu', value: 'Plutonium'},
	{key:'Ra', value: 'Radium'},
	{key:'Rb', value: 'Rubidium'},
	{key:'Re', value: 'Rhenium'},
	{key:'Rf', value: 'Rutherfordium'},
	{key:'Rg', value: 'Roentgenium'},
	{key:'Rh', value: 'Rhodium'},
	{key:'Rn', value: 'Radon'},
	{key:'Ru', value: 'Ruthenium'},
	{key:'S', value: 'Sulfur'},
	{key:'Sb', value: 'Antimony'},
	{key:'Sc', value: 'Scandium'},
	{key:'Se', value: 'Selenium'},
	{key:'Sg', value: 'Seaborgium'},
	{key:'Si', value: 'Silicon'},
	{key:'Sm', value: 'Samarium'},
	{key:'Sn', value: 'Tin'},
	{key:'Sr', value: 'Strontium'},
	{key:'Ta', value: 'Tantalum'},
	{key:'Tb', value: 'Terbium'},
	{key:'Tc', value: 'Technetium'},
	{key:'Te', value: 'Tellurium'},
	{key:'Th', value: 'Thorium'},
	{key:'Ti', value: 'Titanium'},
	{key:'Tl', value: 'Thallium'},
	{key:'Tm', value: 'Thulium'},
	{key:'U', value: 'Uranium'},
	{key:'Uuo', value: 'Ununoctium'},
	{key:'Uup', value: 'Ununpentium'},
	{key:'Uus', value: 'Ununseptium'},
	{key:'Uut', value: 'Ununtrium'},
	{key:'V', value: 'Vanadium'},
	{key:'W', value: 'Tungsten'},
	{key:'Xe', value: 'Xenon'},
	{key:'Y', value: 'Yttrium'},
	{key:'Yb', value: 'Ytterbium'},
	{key:'Zn', value: 'Zinc'},
	{key:'Zr', value: 'Zirconium'}
];

var spanishWords = [
	{key:'escuela', value:'school'},
	{key:'manzana', value:'apple'},
	{key:'mesa', value:'table'},
	{key:'verde', value:'green'},
	{key:'nariz', value:'nose'},
	{key:'ciencia', value:'science'},
	{key:'biblioteca', value:'library'},
	{key:'médico', value:'doctor'},
	{key:'queso', value:'cheese'},
	{key:'puerta', value:'door'},
	{key:'coche', value:'car'},
	{key:'árbol', value:'tree'},
	{key:'playa', value:'beach'},
	{key:'brazo', value:'arm'},
	{key:'perro', value:'dog'},
	{key:'maestro', value:'teacher'}
];

function generateSpanishQuestion() {
	var index = getRandomInteger(spanishWords.length) - 1;
	return spanishWords[index];
}

function generateCapitalsQuestion() {
	var index = getRandomInteger(capitals.length) - 1;
	return capitals[index];
}

function generateChemicalSymbolQuestion() {
	var index = getRandomInteger(chemSymbols.length) - 1;
	return chemSymbols[index];
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
	switch (selectedProblemSet) {
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
			currentProblem = generateCapitalsQuestion();
			problemText = currentProblem.key;
			break;
		case 'builtin-chemSymbols':
			currentProblem = generateChemicalSymbolQuestion();
			problemText = currentProblem.key;
			break;
		case 'builtin-spanish':
			currentProblem = generateSpanishQuestion();
			problemText = currentProblem.key;
			break;
	}
	document.getElementsByClassName('problem')[0].textContent = problemText;
}

function startSpeechRecognition() {
	var speech = new webkitSpeechRecognition();
	speech.continuous = true;
	speech.interimResults = true;
	speech.onstart = function() {
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

		showIHeard();

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

		var previousHigh = getHighScoreFor(selectedProblemSet);
		if (previousHigh < currentScore) {
			setHighScoreFor(selectedProblemSet, currentScore);
			renderProblemSets();
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

	speech.lang = 'en-US';
	speech.start();
}

function checkAnswer(guess) {
	var trimmedGuess = guess.trim().toLowerCase();
	var answer = currentProblem.value;
	if (typeof answer === 'string') {
		answer = answer.toLowerCase();
	}

	if (answer == trimmedGuess || trimmedGuess === 'skip') {
		showNextProblem();
	}

	if (answer == trimmedGuess) {
		currentScore++;
		document.getElementById('currentScoreValue').textContent = currentScore;
	}
}

function setIHeardText(textToDisplay) {
	document.getElementById('iHeardText').textContent = textToDisplay;
}

function hideIHeard() {
	document.getElementsByClassName('iHeard')[0].classList.add('hidden');
}

function showIHeard() {
	document.getElementsByClassName('iHeard')[0].classList.remove('hidden');
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

function getHighScoreFor(problemSet) {
	if (localStorage) {
		var score = localStorage.getItem(problemSet + 'HighScore');
		if (score >= 0) {
			return score;
		}
		else {
			return 0;
		}
	}

	return 0;
}

function setHighScoreFor(problemSet, score) {
	if (localStorage) {
		localStorage.setItem(problemSet + 'HighScore', score);
	}
}

function renderProblemSets() {
	var problemSetsHtml = Handlebars.templates['problemSets.html']({
		problemSets: [
			{
				name: 'builtin-addition',
				displayName: 'Addition',
				highScore: getHighScoreFor('builtin-addition'),
				checked: selectedProblemSet === 'builtin-addition'
			},
			{
				name: 'builtin-subtraction',
				displayName: 'Subtraction',
				highScore: getHighScoreFor('builtin-subtraction'),
				checked: selectedProblemSet === 'builtin-subtraction',
				alternate: true
			},
			{
				name: 'builtin-multiplication',
				displayName: 'Multiplication',
				highScore: getHighScoreFor('builtin-multiplication'),
				checked: selectedProblemSet === 'builtin-multiplication'
			},
			{
				name: 'builtin-division',
				displayName: 'Division',
				highScore: getHighScoreFor('builtin-division'),
				checked: selectedProblemSet === 'builtin-division',
				alternate: true
			},
			{
				name: 'builtin-capitals',
				displayName: 'US State Capitals',
				highScore: getHighScoreFor('builtin-capitals'),
				checked: selectedProblemSet === 'builtin-capitals'
			},
			{
				name: 'builtin-chemSymbols',
				displayName: 'Chemical Symbols',
				highScore: getHighScoreFor('builtin-chemSymbols'),
				checked: selectedProblemSet === 'builtin-chemSymbols',
				alternate: true
			},
			{
				name: 'builtin-spanish',
				displayName: 'Spanish Vocabulary',
				highScore: getHighScoreFor('builtin-spanish'),
				checked: selectedProblemSet === 'builtin-spanish'
			}
		]
	});

	document.getElementsByClassName('problemSets')[0].innerHTML = problemSetsHtml;

	var problemSetRadios = document.getElementsByName('problemSet');
	for (var i = 0; i < problemSetRadios.length; i++) {
		problemSetRadios[i].addEventListener('click', problemSetChanged);
	}
}

function problemSetChanged() {
	selectedProblemSet = this.value;
}

renderProblemSets();
paintTimer(0.99999);

var startButton = document.getElementsByClassName('startButton')[0];
startButton.addEventListener('click', function() {
	startSpeechRecognition();
});

var doneSound = new Audio('done.mp3');