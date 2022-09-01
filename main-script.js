function begin() {
	var data_divCaption = divCaption.getBoundingClientRect();
	divCaption.style.width = data_divCaption['width'] * 1.10 + "px";
	divCaption.style.height = data_divCaption['height'] * 0.90 + "px";
	divCaption.style.borderWidth = data_divCaption['height'] / 16 + "px";
	divSpace0.style.height = data_divCaption['height'] * 1.25 + "px";
	
	var data_divText1 = divText1.getBoundingClientRect();
	divSpace1.style.height = data_divText1['height'] * 0.5 + "px";
	divSpace2.style.height = data_divText1['height'] * 0.2 + "px";
	
	var data_divText2 = divText2.getBoundingClientRect();
	divSpace3.style.height = data_divText2['height'] * 0.5 + "px";
	divSpace4.style.height = data_divText2['height'] * 0.2 + "px";
	
	var data_divText3 = divText3.getBoundingClientRect();
	divSpace5.style.width = data_divText3['width'] * 0.5 + "px";
	
	var data_textfield1 = textfield1.getBoundingClientRect();
	textfield1.style.width = data_textfield1['width'] * 0.4 + "px";
}

function ONINPUT_textfield1() {
	var str = textfield1.value;
	var regex = /[0-9]/;
	if(!regex.test(str[str.length - 1])) {
		var len = str.length;
		textfield1.value = len == 1 ? "" : str.substring(0, str.length - 1);
	}
}

function start(n) {
	location.assign('checkers.html?n=' + n);
}
