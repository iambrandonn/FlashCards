function getNumQuestions() {
	var count = 0;
	$('.key').each(function(element) {
		if ($(this).val().length > 0) {
			count++;
		}
	});

	return count;
}

$('.saveButton').click(function() {
	if (getNumQuestions() < 2) {
		alert('You must provide at least two questions.');
		return;
	}

	var categoryName = $('.categoryName').val();
	if (categoryName.length === 0) {
		$('.categoryName').focus();
		alert('Please provide a category title');
		return;
	}

	localStorage.setItem(categoryName, serializeQuestions());

	var categoryList = localStorage.getItem('categories');
	if (categoryList) {
		categoryList = JSON.parse(categoryList);
	}
	else {
		categoryList = [];
	}

	// See if this list already existed
	var alreadyExists = categoryList.some(function(list) {
		return list === categoryName;
	});

	// Only add it if it didn't exist
	if (!alreadyExists) {
		categoryList.push(categoryName);
		localStorage.setItem('categories', JSON.stringify(categoryList));
	}

	document.location = 'index.html';
});

$('.deleteButton').click(function() {
	var categoryName = $('.categoryName').val();
	localStorage.removeItem(categoryName);

	var categoryList = localStorage.getItem('categories');
	if (categoryList) {
		categoryList = JSON.parse(categoryList);

		categoryList = categoryList.filter(function(theName) {
			return theName !== categoryName;
		});

		localStorage.setItem('categories', JSON.stringify(categoryList));
	}

	document.location = 'addEditList.html';
});

function checkForNewRowNeeded() {
	// is there an empty row still?
	var lastQuestion = $('.question:last');
	if (lastQuestion.find('.key').val().length > 0 || lastQuestion.find('.value').val().length > 0) {
		// add one
		var newRow = Handlebars.templates['question.html']([{
				key: '',
				value: ''
			}
		]);
		$('.questions').append(newRow);
		$('.question:last > .key, .question:last > .value').focus(checkForNewRowNeeded);
	}
}

function serializeQuestions() {
	var questionSet = [];
	$('.question').each(function(index, question) {
		var questionNode = $(question);
		var key = questionNode.find('.key').val();
		var value = questionNode.find('.value').val();
		if (key && value && key.trim().length > 0 && value.trim().length > 0) {
			questionSet.push({
				key: key,
				value: value
			});
		}
	});

	return JSON.stringify(questionSet);
}

function getListNameFromQueryString() {
	return decodeURI(document.location.search).replace('?category=', '');
}

function categoryClickedCallback() {
	document.location = 'addEditList.html?category=' + this.innerHTML;
}

var excludeBuiltinCategories = true;
common.renderCategories(excludeBuiltinCategories, categoryClickedCallback);

var listToEdit = getListNameFromQueryString();
if (listToEdit.length > 0) {
	$('.deleteButton').show();
	$('.categoryName').val(listToEdit);
	var loadedList = localStorage.getItem(listToEdit);
	if (loadedList) {
		var loadedListAsObject = JSON.parse(loadedList);
		var nodesToAdd = Handlebars.templates['question.html'](loadedListAsObject);
		$('.header').after(nodesToAdd);
	}
}
else {
	$('.newLink').hide();
}

$('.key, .value').focus(checkForNewRowNeeded);