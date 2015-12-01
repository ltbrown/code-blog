$(function() {

	// variables
	var article;

	// sort articles on publishedOn date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
	function sortArticlesOnPubDate(A) {
		A.sort(
			function(a, b) {
				if (a.publishedOn < b.publishedOn) { return  1; }
				if (a.publishedOn > b.publishedOn) { return -1; }
				return 0;
			}
		);
	}

	// constructor function for article objects in blog.rawdata array
	function makeAr(obj) {
		// adds the properties passed in from obj
		this.title = obj.title;
		this.category = obj.category;
		this.author = obj.author;
		this.authorUrl = obj.authorUrl;
		this.publishedOn = obj.publishedOn;
		this.body = obj.body;
	}

	// added toHtml() method to the prototype of the makeAr object
	makeAr.prototype.toHtml = function() {
		// makes a copy of article.arTemplate
		var $newAr = $('.arTemplate').clone();
		// removes the .arTemplate class from the jquery object you just created with clone()
		$newAr.removeClass('arTemplate');
		// find the first instance of h1 tag and put the value of the title property
		$newAr.find('h1:first').html(this.title);
		// find the anchor tag in .byline and put the value of the author property
		$newAr.find('.byline a').html(this.author);
		// find the anchor tag in .byline and put the value of the authorUrl property
		$newAr.find('.byline a').attr('href', this.authorUrl);
		// find the time tag and put the value of parseInt(new Date() - new Date(this.publishedOn))/60/60/24/1000) which takes todays date and subtracts the publishedOn date (e.g. 2015-11-05) note parseInt that makes sure they are numbers so you can do math on them.
		$newAr.find('time').html('exactly ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');
		// find the .article-body and insert the value of the body property
		$newAr.find('.article-body').html(this.body);
		// append a horizontal rule at the bottom of each article
		$newAr.append('<hr>');
		return $newAr;
	}

	// calls the sortArticlesOnPubDate to sort the blog.rawdata array based on the publishedOn key of each article object.
	sortArticlesOnPubDate(blog.rawdata);

	// cycles through all the objects in the blog.rawdata array and makes a new instance makeAr, then append the code returned from the toHtml() method of the makeAr object, to #articles section in index.html
	for(var i = 0; i < blog.rawdata.length; i++ ){
		// var that holds each article object in the blog.rawdata array
		article = blog.rawdata[i];
		// pass the article object to the makeAr constructor function
		var arObj = new makeAr(article);
		// append the
		$('#articles').append(arObj.toHtml());
	}

});
