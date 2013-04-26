var SpeechRecognition = window.mozSpeechRecognition ||
  window.msSpeechRecognition ||
  window.oSpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.SpeechRecognition;

function homeCtrl($scope) {
  $scope.warningsClasses = 'warnings';

  if (SpeechRecognition) {
    $scope.warnings = "Cool!  Your browser supports speech recognition.  Have fun!";
  }
  else {
    $scope.warningsClasses += ' unsupported';
    $scope.warnings = "Sorry... Your browser doesn't support speech recognition yet.  Try Google Chrome version 25.";
  }

  $scope.categories = [
    {
      name: 'builtin-addition',
      displayName: 'Addition'
    },
    {
      name: 'builtin-subtraction',
      displayName: 'Subtraction'
    },
    {
      name: 'builtin-multiplication',
      displayName: 'Multiplication'
    },
    {
      name: 'builtin-division',
      displayName: 'Division'
    },
    {
      name: 'builtin-capitals',
      displayName: 'US State Capitals'
    },
    {
      name: 'builtin-chemSymbols',
      displayName: 'Chemical Symbols'
    },
    {
      name: 'builtin-spanish',
      displayName: 'Spanish Vocabulary'
    }
  ];

  var problemsAsString = localStorage.getItem('categories');
  if (problemsAsString) {
    var categoryArray = JSON.parse(problemsAsString);
    categoryArray.forEach(function(categoryName) {
      $scope.categories.push({
        name: categoryName,
        displayName: categoryName
      });
    });
  }

  $scope.categoryChanged = function(event) {
    if (window.switchToSecondInstructions) {
      window.switchToSecondInstructions();
    }

    document.getElementsByClassName('startButton')[0].classList.remove('disabled');
    var previouslySelected = document.getElementsByClassName('selected');
    for (var i = 0; i < previouslySelected.length; i++) {
      previouslySelected[i].classList.remove('selected');
    }
    this.classList.add('selected');

    window.selectedCategory = this.attributes.name.value;
    window.problemsForSelectedCategory = JSON.parse(localStorage.getItem(window.selectedCategory));

    window.highScore = common.getHighScoreFor(window.selectedCategory);
    document.getElementById('highScoreValue').innerHTML = window.highScore;
  };

  $scope.startButtonClasses = 'startButton disabled';
  $scope.startClicked = function() {
    if ($scope.startButtonClasses.indexOf('disabled') >= 0) {
      window.alert('Please choose a category');
      return ;
    }

    startSpeechRecognition();
  };
}

function startSpeechRecognition() {
  alert('start speech');
}