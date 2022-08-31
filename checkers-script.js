var n = 0;
var checkerLength = 0;
var fieldLength = 0;
var checkerBorderLength = 0;
var isGoing = 'B';
var focusChecker = null;

function begin() {
	var parameters = location.search;
	if(parameters != null) {
		parameters = parameters.substring(1);
		var arrayParameters = parameters.split('&');
		for(var i = 0; i < arrayParameters.length; i++) {
			str = arrayParameters[i];
			if(str.startsWith('n=')) {
				n = parseInt(str.substring(2));
				break;
			}
		}
	}
	
	fieldLength = Math.floor(window.innerWidth / 20);
	checkerLength = Math.floor(fieldLength * 0.95);
	checkerBorderLength = Math.floor((fieldLength - checkerLength) / 2);
	divSpace0.style.height = fieldLength * 0.25 + 'px';
	
	var borderLength = 5;
	tableGame.style.borderSpacing = borderLength + 'px';
	tableGame.style.borderWidth = 0.8 * borderLength + 'px';
	divSpace1.style.height = borderLength * 2 + 'px';
	
	var data_buttonCancel = buttonCancel.getBoundingClientRect();
	buttonStartGame.style.width = data_buttonCancel['width'] + 'px';
	
	for(var i = 0; i < n; i++) {
		var newRow = document.createElement('TR');
		newRow.setAttribute('ID', 'row' + i);
		tableGame.appendChild(newRow);
		for(var j = 0; j < n; j++) {
			var newCell = document.createElement('TD');
			newCell.setAttribute('CLASS', 'field' + (i + j) % 2);
			var idNewCell = i + '-' + j;
			newCell.setAttribute('ID', 'cell' + idNewCell);
			newCell.setAttribute('ONMOUSEMOVE', 'recolourCell("' + idNewCell + '")');
			newCell.setAttribute('ONMOUSEOUT', 'returnColorCell("' + idNewCell + '")');	
			if((i + j) % 2 == 1) 
				newCell.setAttribute('ONCLICK', 'ONCLICK_field("' + idNewCell + '")');
			newCell.style.width = fieldLength + 'px';
			newCell.style.height = fieldLength + 'px';
			newRow.appendChild(newCell);
		}
	}
}

function ONCLICK_field(id) {
	var arrayData = id.split('-');
	var row = parseInt(arrayData[0]);
	var col = parseInt(arrayData[1]);
	var cell = document.getElementById('cell' + id);
	var checker = cell.firstChild;
	
	if(checker != null) {
		var data_checker = checker.id.split('-');
		var groupChecker = data_checker[1];
		if(groupChecker === isGoing) {
			if(focusChecker == null)
				focusChecker = new Array();
			else {
				var oldChecker = document.getElementById(focusChecker['idChecker']);
				oldChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
			}
			focusChecker['idChecker'] = checker.id;
			focusChecker['row'] = row;
			focusChecker['col'] = col; 
			checker.setAttribute('CLASS', 'checkers focus' + groupChecker);
		}
	} else if(focusChecker != null) {
		var data_checker = focusChecker['idChecker'].split('-');
		var rowChecker = focusChecker['row'];
		var colChecker = focusChecker['col'];
		var groupChecker = data_checker[1];
		
		var thisChecker = document.getElementById(focusChecker['idChecker']);
		var oldCell = thisChecker.parentNode;
		
		var isQueen = data_checker.length == 4 ? true : false;
		if(!isQueen) {
			var canGo_col = Math.abs(colChecker - col) == 1;
			differenceRow = row - rowChecker;
			canGo_row = groupChecker == 'A' && differenceRow == 1 ||
						groupChecker == 'B' && differenceRow == -1 ? 
						true : false;
			canGo = canGo_col && canGo_row;
			if(canGo) {
				oldCell.removeChild(thisChecker);
				cell.appendChild(thisChecker);
				isGoing = groupChecker == 'A' ? 'B' : 'A';
				focusChecker = null;
				thisChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
			}
		}
		
		
		
	}
}
function recolourCell(id) {
    var gray = '#474747ff';
    var dark_gray = '#1f1f1fff';
    var border = '#dee0aaff';

	var arrayData = id.split('-');
	var rows = parseInt(arrayData[0]);
	var cols = parseInt(arrayData[1]);
	
	var cell = document.getElementById('cell' + id);
	cell.style.background = (rows + cols) % 2 == 0 ? gray : dark_gray;
	
	var checker = cell.firstChild;
	if(checker != null) checker.style.borderColor = border;
}

function returnColorCell(id) {
	var dark_gray_1 = '#262626ff';
    var dark_gray_2 = '#333333ff';
    var gray = '#e0e0e0ff';

	var arrayData = id.split('-');
	var rows = parseInt(arrayData[0]);
	var cols = parseInt(arrayData[1]);
	
	var cell = document.getElementById('cell' + id);
	cell.style.background = (rows + cols) % 2 == 0 ? dark_gray_2 : dark_gray_1;
	
	var checker = cell.firstChild;
	if(checker != null) checker.style.borderColor = gray;
}

function start() {
	var numberCheckers = n * n / 2 - n;
	drawCheckers('A', numberCheckers);
	drawCheckers('B', numberCheckers);
	
	buttonStartGame.value = "Новая игра";
	buttonStartGame.setAttribute('ONCLICK', 'restart()');
}

function drawCheckers(groupChecker, numberCheckers) {
	var startPosition = 0, finalPosition = numberCheckers / 2, k = 0;
	if(groupChecker === 'B') {
		startPosition = finalPosition;
		finalPosition = numberCheckers;
		k = 2;
	}
	
	for(var i = startPosition; i < finalPosition; i++) {
		row = Math.floor(2 * i / n) + k;
		col = Math.floor((i * 2 + 1) % n - (row % 2));
		var cellChecker = document.getElementById('cell' + row + '-' + col);
		
		var divChecker = document.createElement('DIV');
		divChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
		divChecker.setAttribute('ID', 'checker-' + groupChecker + '-' + i);
		divChecker.style.borderWidth = checkerBorderLength + 'px';
		divChecker.style.width = checkerLength + 'px';
		divChecker.style.height = checkerLength + 'px';
		
		cellChecker.appendChild(divChecker);
	}
}

function restart() {
	
}

function cancel() {
	
}
