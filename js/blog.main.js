var blog = blog || {};

blog.main = (function() {
	'use strict';
	// cached jquery objects
	var $pLog = $('#pLog'),
		$articleDetail,
		$firstParagraph,
		$selectAuthor,
		$optgroup,
		$selectCategory;

	// variables
	var article,
		arObj,
		 self = {

			init: function() {
				// calls the sortArticlesOnPubDate to sort the blog.rawdata array based on the publishedOn key of each article object.
				self.sortArticlesOnPubDate(blog.rawdata);
				self.makeArticles();
			},

			// event listeners for this module
			addEventListeners: function() {
				// add click listener to elements
				$('.more').on('click', function(e) {
					e.preventDefault();
					$(this).prev().siblings().slideDown();
					$(this).next().show();
					$(this).hide();
				});
				$('.hide').on('click', function(e) {
					e.preventDefault();
					$(this).siblings().filter('p:nth-of-type(n+2)').slideUp();
					$(this).prev().show();
					$(this).hide();
				});
				$('.about').on('click', function(e) {
					e.preventDefault();
					$('.about-container').toggle();
				});
				// add change listener to the select elements
				$selectAuthor.on('change', function(){
					// hides all the articles
				 	$('article').hide();
				 	// resets the category filter select element
				 	$selectCategory.prop('selectedIndex',0);
				  	// get the selected filter value
				  	var filterSelection = $selectAuthor.val(); // horse whisperer
				  	// find all the author names in the byline
				  	$('#articles').find('.byline a').each(function(){
				  		var authorName = $(this).text(); // e.g. horse whisperer
				  		if( authorName == filterSelection){
				  			// fadeIn the closest article
				  			$(this).closest('article').fadeIn();
				  		}
				  	});
				});

				$selectCategory.on('change', function(){
					// hides all the articles
					$('article').hide();
					// resets the author filter select element
					$selectAuthor.prop('selectedIndex',0);
					// get the selected filter value
				  	var filterSelection = $selectCategory.val();
				  	// adds cat- to the begining of the filtered selection
				  	var filterSelectionCat = "cat-" + filterSelection;
				  	// iterate over each article and get the class names, it returns a string
				  	$('article').each(function(){
				   		var classNames = $(this).attr('class');
				   		// console.log(typeof classNames);
				   		// make it an array and split on space ' '
				   		var catArray = classNames.split(' ');
				   		// if the article has a class of the matches filteredSelectionCat
				   		if(catArray.indexOf(filterSelectionCat) > -1){
				   			// fadeIn articles with matching category
				   			$(this).fadeIn();
				   		}
				  	});
				});
			},

			// initialize the articles section
			initArticles: function() {
				// hides all pargraphs except the first one
				$articleDetail = $('.article-body p:nth-of-type(n+2)');
				$articleDetail.hide();
				$firstParagraph = $('.article-body');
				$firstParagraph.each(function(){
					$(this).append('<a href="#" class="more"> more&darr;</a>');
					$(this).append('<a href="#" class="hide"> hide&uarr;</a>');
				});
				// hide the hide toggle on each article
				$('.hide').hide();
				self.makeCategoryFilter();
				self.makeAuthorFilter();
				self.addEventListeners();
			},

			// makeAuthorFilter
			makeAuthorFilter: function() {
				$selectAuthor = $('<select id="select-author"></select>');
				var $option = $('<option value="all">Filter by Authors</option>');
				$selectAuthor.append($option);
				$('#articles').prepend($selectAuthor);
				var authorArray = [];

				for(var i = 0; i < blog.rawdata.length; i++ ){
					var author = blog.rawdata[i].author;
					authorArray.push(author);
				}
				// get rid of any dups in authorArray
				var uniqueAuthors = $.unique(authorArray);

				for(var i = 0; i < uniqueAuthors.length; i++ ){
					$option = $("<option></option>");
					//Option's value is the href
					$option.val(uniqueAuthors[i]);
					//Option's text is the text of link
					$option.text(uniqueAuthors[i]);
					//$optgroup.append($option);
					$selectAuthor.append($option);
				}
			},

			// makeCategoryFilter
			makeCategoryFilter: function() {
				$selectCategory = $('<select id="select-category"></select>');
				var $option = $('<option value="all">Filter by Category</option>');
				$selectCategory.append($option);
				$('#articles').prepend($selectCategory);
				var catArray = [];

				for(var i = 0; i < blog.rawdata.length; i++ ){
					var cat = blog.rawdata[i].category;
					catArray.push(cat);
				}
				// get rid of any dups in catArray
				var uniqueCategories = $.unique(catArray);

				for(var i = 0; i < uniqueCategories.length; i++ ){
					$option = $("<option></option>");
					//Option's value is the href
					$option.val(uniqueCategories[i]);
					//Option's text is the text of link
					$option.text(uniqueCategories[i]);
					//$optgroup.append($option);
					$selectCategory.append($option);
				}
			},

			// sort articles on publishedOn date (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
			sortArticlesOnPubDate: function(A) {
				A.sort(
					function(a, b) {
						if (a.publishedOn < b.publishedOn) { return  1; }
						if (a.publishedOn > b.publishedOn) { return -1; }
						return 0;
					}
				);
			},

			// mylog
			mylog: function(v) {
				$pLog.html($pLog.html() + v + "<br>");
			},

			// printPubDate
			printPubDate: function(arr, label) {
				var pubDateList = label + ": ";
				var commaStr = ", ";
				for (var i = 0; i < arr.length; i++) {
					if (i == arr.length-1) {  commaStr = ""; }
					pubDateList += arr[i].publishedOn + commaStr;
				}
				self.mylog(pubDateList);
			},

			// makeArticles
			makeArticles: function() {
				// cycles through all the objects in the blog.rawdata array and makes a new instance makeAr, then append the code returned from the toHtml() method of the makeAr object, to #articles section in index.html
				for(var i = 0; i < blog.rawdata.length; i++ ){
					// var that holds each article object in the blog.rawdata array
					article = blog.rawdata[i];
					// pass the article object to the makeAr constructor function
					var arObj = new self.makeArticle(article);
					// append the cloned template to #articles section
					$('#articles').append(arObj.toHtml());
				}
				// set initial state
				self.initArticles();
			},

			// constructor function for article objects in blog.rawdata array
			makeArticle: function(obj) {
				// adds the properties passed in from obj
				this.title = obj.title;
				this.category = obj.category;
				this.author = obj.author;
				this.authorUrl = obj.authorUrl;
				this.publishedOn = obj.publishedOn;
				this.body = obj.body;
			}

	};
	// prototype for the makeArticle contructor function
	self.makeArticle.prototype.toHtml = function() {
		var categoryClassName = 'cat-' + this.category;
		// makes a copy of article.arTemplate
		var $newAr = $('.arTemplate').clone();
		// removes the .arTemplate class from the jquery object you just created with clone()
		$newAr.removeClass('arTemplate');

		$newAr.addClass(categoryClassName);
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

	return self;

}());
blog.main.init();
