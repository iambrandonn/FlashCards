function getListNameFromQueryString() {
	return decodeURI(document.location.search).replace('?list=', '');
}

var listToEdit = getListNameFromQueryString();
if (listToEdit.length > 0) {
	$('.problemSet').val(listToEdit);
	var loadedList = localStorage.getItem(listToEdit);
	if (loadedList) {
		var loadedListAsObject = JSON.parse(loadedList);
		var nodesToAdd = Handlebars.templates['question.html'](loadedListAsObject);
		$('.header').after(nodesToAdd);
	}
}

$('#save').click(function() {
	var problemSetName = $('.problemSet').val();
	localStorage.setItem(problemSetName, serializeQuestions());
	var problemSetList = localStorage.getItem('problemSets');
	if (problemSetList) {
		problemSetList = JSON.parse(problemSetList);
	}
	else {
		problemSetList = [];
	}

	// See if this list already existed
	var alreadyExists = problemSetList.some(function(list) {
		return list === problemSetName;
	});

	// Only add it if it didn't exist
	if (!alreadyExists) {
		problemSetList.push(problemSetName);
		problemSetList = JSON.stringify(problemSetList);
		localStorage.setItem('problemSets', problemSetList);
	}

	document.location = 'index.html';
});

$('.key, .value').focus(checkForNewRowNeeded);

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