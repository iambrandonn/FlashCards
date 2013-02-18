/*global Handlebars */

var common = {
	getHighScoreFor: function(category) {
		if (localStorage) {
			var score = localStorage.getItem(category + 'HighScore');
			if (score > 0) {
				return score;
			}
			else {
				return 0;
			}
		}

		return 0;
	},

	setHighScoreFor: function(category, score) {
		if (localStorage) {
			localStorage.setItem(category + 'HighScore', score);
		}
	},

	renderCategories: function(excludeBuiltin, clickCallback) {
		var categories;
		if (excludeBuiltin) {
			categories = [];
		}
		else {
			categories = [
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
		}

		common.addCustomCategories(categories);
		var categoriesHtml = Handlebars.templates['categories.html']({
			categories: categories
		});

		document.getElementsByClassName('categoryList')[0].innerHTML = categoriesHtml;

		var categoryElements = document.getElementsByClassName('category');
		for (var i = 0; i < categoryElements.length; i++) {
			if (clickCallback) {
				categoryElements[i].addEventListener('click', clickCallback);
			}
			else {
				categoryElements[i].addEventListener('click', common.categoryChanged);
			}
		}
	},

	addCustomCategories: function(arrayToAddTo) {
		var problemsAsString = localStorage.getItem('categories');
		if (problemsAsString) {
			var categoryArray = JSON.parse(problemsAsString);
			categoryArray.forEach(function(categoryName) {
				arrayToAddTo.push({
					name: categoryName,
					displayName: categoryName
				});
			});
		}
	},

	categoryChanged: function() {
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
	}
};