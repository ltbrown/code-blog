var $pLog = $('#pLog');
function clearLog() { $pLog.html(""); }
function mylog(v)   { $pLog.html($pLog.html() + v + "<br>"); }
/*-------------------*
 | jQuery demo: sort |
 *-------------------*/
var articles = [
	{ author  : "Mary",
		address : "99 Salmon St."
	},
	{ author  : "Zelda",
		address : "10 Main St."
	},
	{ author  : "Aaron",
		address : "10 Zoom Ave."
	},
	{ author  : "Carly",
		address : "10 Main St."
	}
];
function sortArticlesOnAuthor(A) {
	A.sort(
		function(a, b) {
			if (a.author > b.author) { return  1; }
			if (a.author < b.author) { return -1; }
			return 0;
		}
	);
}
function printAuthors(arr, label) {
	var authList = label + ": ";
	var commaStr = ", ";
	for (var ii = 0; ii < arr.length; ii++) {
		if (ii == arr.length-1) {  commaStr = ""; }
		authList += arr[ii].author + commaStr;
	}
	mylog(authList);
}
printAuthors(articles, "Article authors");
sortArticlesOnAuthor(articles);
mylog("<br>After sorting:");
printAuthors(articles, "Article authors");
