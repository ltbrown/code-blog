var blog = blog || {};

blog.main = (function() {
	'use strict';
	// cached jquery objects
	var $pLog = $('#pLog'),
		$articleDetail,
		$articleBody,
		$selectAuthor,
		$optgroup,
		$selectCategory;

	// variables
	var article,
		// arObj,
		// eTag,
		uniqueAuthors,
		articleData,
		aboutOpened;
		self = {

		init: function() {
			// Load Data
			self.loadData();
			// calls the sortArticlesOnPubDate to sort the blog.rawdata array based on the publishedOn key of each article object.
			//self.sortArticlesOnPubDate(blog.rawdata);
			//self.makeArticlesHandlebars();
		},
		loadData: function(){
			$.ajax({
				type: "HEAD",
				url: "js/blogArticles.json",
				success: function(data, sucess, xhr){
					//console.log(xhr.getResponseHeader("eTag"));
					var eTag = xhr.getResponseHeader("eTag");
					console.log(eTag);
					console.log(localStorage.ergodicEtag);
					if (eTag == localStorage.ergodicEtag){
						//console.log("Load what's in local storage");
						articleData = JSON.parse(localStorage.getItem('blogData'));
						// console.log("ARTICLE DATA = ", articleData);
						self.sortArticlesOnPubDate(articleData);
						self.makeArticlesHandlebars();
					}else{
						//console.log("getJSON");
						$.getJSON("js/blogArticles.json", function(data){
							//console.log(data);
							localStorage.setItem('blogData', JSON.stringify(data));
							// for (var key in localStorage) {
							//   console.log(key + ' : ' + localStorage[key]);
							// };
							//console.log(localStorage["blogData"]);
							articleData = JSON.parse(localStorage.getItem('blogData'));
							// console log add , object or array to console type cohersion
							// console.log("ARTICLE DATA = ", articleData);
							self.sortArticlesOnPubDate(articleData);
							self.makeArticlesHandlebars();
						});
						localStorage.setItem('ergodicEtag', eTag);
					}
					self.checkLocalStorage();
				}
			});
		},
		checkLocalStorage: function() {
			//console.log('local storage hello');
			//localStorage.setItem('ls_aboutOpened', 'open');
			//console.log(localStorage.getItem('ls_aboutOpened'))
			if(localStorage.getItem('ls_aboutOpened') === 'open'){
				aboutOpened = true;
				$('.about-container').show();
			}else{
				aboutOpened = false;
				$('.about-container').hide();
			}
		},
		// event listeners for this module
		addEventListeners: function() {
			// add click listener to elements
			$('.more').on('click', function(e) {
				e.preventDefault();
				//$(this).prev().siblings().slideDown();
				$(this).parent().find('.hideMe').removeClass('hideMe');
				//$(this).prev().siblings().removeClass('hideMe');
				$(this).next().show();
				$(this).hide();
			});
			$('.hide').on('click', function(e) {
				e.preventDefault();
				$('html, body').animate({ scrollTop: $(this).parent().parent().offset().top - 30 }, 500);
				//$(this).siblings().filter('p:nth-of-type(n+2)').hide();
				$(this).parent().find('p:nth-of-type(n+1)').nextAll().addClass('hideMe');
				$(this).prev().show();
				$(this).hide();
			});
			$('.about').on('click', function(e) {
				e.preventDefault();
				// $('.about-container').toggle();
				//console.log(aboutOpened);
				if(aboutOpened){
					$('.about-container').hide();
					aboutOpened = false;
					localStorage.setItem('ls_aboutOpened', 'closed');
				}else{
					$('.about-container').show();
					aboutOpened = true;
					localStorage.setItem('ls_aboutOpened', 'open');
				}
			});
			$('.top').on('click', function(){
				$('html, body').animate({ scrollTop: $('#main-header').offset().top }, 500);
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
			  		if(filterSelection === 'all'){
			   			// console.log('hi');
				  		$('article').show();
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
			   		if(filterSelection === 'all'){
			   			// console.log('hi');
				  		$('article').show();
				  	}
			  	});

			});
		},

		// initialize the articles section
		initArticles: function() {
			// hides all pargraphs except the first one
			//$articleDetail = $('.article-body p:nth-of-type(n+2)').nextAll();
			$articleDetail = $('.article-body p:nth-of-type(n+1)').nextAll();
			// $articleDetail.hide();
			$articleDetail.addClass('hideMe');
			$articleBody = $('.article-body');
			$articleBody.each(function(){
				$(this).append('<a href="#" class="more"> more&darr;</a>');
				$(this).append('<a href="#" class="hide"> hide&uarr;</a>');
			});
			// hide the hide toggle on each article
			$('.hide').hide();
			self.makeCategoryFilter();
			self.makeAuthorFilter();
			self.addEventListeners();
			self.getStats();
		},

		// makeAuthorFilter
		makeAuthorFilter: function() {
			$selectAuthor = $('<select id="select-author"></select>');
			var $option = $('<option value="all">Filter by Authors</option>');
			$selectAuthor.append($option);
			$('#articles').prepend($selectAuthor);
			var authorArray = [];

			for(var i = 0; i < articleData.length; i++ ){
				var author = articleData[i].author;
				authorArray.push(author);
			}
			// get rid of any dups in authorArray
			uniqueAuthors = $.unique(authorArray);
			//console.log("uniqueAuthors = " + uniqueAuthors.length);

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

			for(var i = 0; i < articleData.length; i++ ){
				var cat = articleData[i].category;
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

		// makeArticlesHandlebars
		makeArticlesHandlebars: function() {
			$.get( "../partials/template.html", function( data ){
				//console.log("Data Loaded: " + data );
				// Handlebars compiles the template into a callable function
		      	var renderer = Handlebars.compile(data);
		     	// put data in a variable
		      	//var articles = blog.rawdata;
		      	var articles = articleData;
		      	//console.log("Number of Articles = " + articles.length);
		      	// call the compiled function with the template data
		      	var result = renderer({articles});
		      	//console.log('hi' + result);
		      	//format date before appending to to #articles
		      	$('#articles').append(result);
			}).done(function() {
			    self.formatDate();
			    // call init articles()
				//self.initArticles();
			    self.formatMarkdownArticles();
			});

		},
		getStats: function(){
			//Total Articles
			var numArticles = $('.article-body').length;
			//console.log('numArticles = ' + numArticles);
			$('.numArticles span').text(numArticles);
			//Unique Authors
			var numUniqueAuthors = uniqueAuthors.length;
			//console.log('numUniqueAuthors = ' + numUniqueAuthors);
			$('.numAuthors span').text(numUniqueAuthors);
			//words on the site
			//$('.numWords').text();

			// $('.article-body').each(function(){
			// 	$(this).text.length;
			// 	console.log($(this).text.length);
			// })

			//
		    //console.log("Article Data = " + articleData[1].markdown);
		    var testData = [
		    	{
				    "title": "Ice Skate Ipsum",
				    "category": "sports",
				    "author": "Ashley Wagner",
				    "authorUrl": "http:\/\/www.figureskatersonline.com\/ashleywagner\/",
				    "publishedOn": "2015-10-26",
				    "body": "<p>Skate     <\/p>"
				 },
				 {
				    "author": "Brook R",
				    "title": "An Example Article",
				    "category": "javascript",
				    "body": "<h1>It has a main header.<\/h1>n<p> The end.<\/p>",
				    "publishedOn": "2015-12-18"
				 },
				 {
				    "author": "Brook R",
				    "title": "An Example Article 2",
				    "category": "javascript",
				    "body": "<h1>It has a main header.<\/h1>n<p> The end.<\/p>",
				    "publishedOn": "2015-10-18"
				 }
				 ,
				 {
				    "author": "Brook R",
				    "title": "An Example Article 3",
				    "category": "javascript",
				    "body": "<h1>It has a main header.<\/h1>n<p>    The end.<\/p>",
				    "publishedOn": "2015-11-18"
				 }
			];

		    // var authorArray = [];
		    // articleData.forEach(function(article){
		    // 	authorArray.push(article.author);
		    // });
		    // console.log(authorArray.join(", "));

		    //word count?
		    //title
		    //
		    //
		    // var authorArray = [];
		    // testData.forEach(function(article){
		    // 	authorArray.push(article.author);
		    // });
		    // console.log(authorArray.join(", "));
		    //

			// var arr = self.filterArticles(testData, "body");
			// console.log(arr);

			// arr.forEach(function(item){
		 //    	var str = item;
		 //    	console.log(item);
		 //    	console.log($(str).text());
		 //    	var newString = $(str).text();
		 //    	var newStringLength = self.countWords(newString);
		 //    	console.log(newStringLength);
		 //    });


			//
			var totalWordsArray = [];
			//map = higher order function (takes another function as a parameter) get title and body?
			var arrMap = articleData.map(function(item){
				return item.body;
			});
			//console.log(arrMap);

			var wordCountBody = 0;
			arrMap.forEach(function(item){
				var str = item;
		    	console.log(item);
		    	console.log($(str).text());
		    	var newString = $(str).text();
		    	totalWordsArray.push(newString);
		    	var newStringLength = self.countWords(newString);
		    	console.log(newStringLength);
		    	if(item === undefined)return;
		    	wordCountBody += newStringLength;
		    });
			console.log('wordCountBody = ' + wordCountBody);

			var wordCountMarkdown = 0;
			$('.markdown').each(function(){
				//console.log($(this).text());
				var newString = $(this).text();
				totalWordsArray.push(newString);
		    	var newStringLength = self.countWords(newString);

		    	//console.log(newStringLength);
		    	wordCountMarkdown += newStringLength;
			});
			console.log('wordCountMarkdown = ' + wordCountMarkdown);

			var totalWords = parseInt(wordCountBody) + parseInt(wordCountMarkdown);
			//console.log(totalWords);
			$('.numWords span').text(totalWords);

			console.log( 'words array =' + totalWordsArray);


			var characterArray = [];
			// var arrMap = totalWordsArray.map(function(item){
			// 	characterArray.push(item.split(''));
			// 	return characterArray
			// });
			var characterCount = 0
			totalWordsArray.forEach(function(item){
				var wordCharacterLength = item.split('').length;
				characterCount+= wordCharacterLength

		    });
			console.log(characterCount);

			console.log(Math.round(characterCount/totalWords));
			var averageWordLength = Math.round(characterCount/totalWords)
			//var charactersArray = charactersArray.split('');
			$('.avgWordLength span').text(averageWordLength);



			// var cleanArray = [];
			// totalWordsArray.forEach(function(item){
			// 	var str = item;
		 //    	console.log(item);
		 //    	console.log($(str).text());
		 //    	var newString = $(str).text();
		 //    	var newStringClean = self.cleanUp(newString);
		 //    	cleanArray.push(newStringClean);
		 //    });
			// console.log(cleanArray);
			//
			//$('.article-body').

			//var arrayOfAwesomeWords = [];
			// totalWordsArray.forEach(function(item){
			// 	var str = item;
		 //    	//console.log($(str).text());
		 //    	var newString = $(str).text();
		 //   		arrayOfAwesomeWords = newString.split(/\s+/);
		 //    });

			//console.log(arrayOfAwesomeWords);

			// var arrMap = articleData.map(function(item){
			// 	return item.markdown;
			// });
			//console.log(arrMap);

			//Word Count
			// var wordCountMarkdown = 0;
			// arrMap.forEach(function(item){
			// 	var markdown = item;
			// 	var m = marked(markdown);
			// 	var str = m;
		 //    	console.log(item);
		 //    	//console.log($(str).text());
		 //    	var newString = $(str).text();
		 //    	var newStringLength = self.countWords(newString);
		 //    	//console.log(newStringLength);
		 //    	wordCountMarkdown += newStringLength;
		 //    });
			// console.log('wordCountMarkdown = ' + wordCountMarkdown);

			//reduce = higher order function (takes another function as a parameter) to get all body and markdown properties?
			//
			//
			//
			// filter = higher order function (takes another function as a parameter)
			// var brook = testData.filter(function(item){
			// 	return item.author === "Brook R";
			// });
			//
			//
			var isBrook = function(item){
				return item.author === 'Brook R';
			}
			var brookArticles = testData.filter(isBrook);
			// console.log(brookArticles);

			//var str="<p>sf sdf asd asd  <b>asd</b> d asd ad&nbsp; asd&nbsp;</p>";
		 	//alert("Plain Text : " + $(str).text());
		 	//alert("Word Count : " +$(str).text().split(" ").length);
		    // var newArr = articleData.filter(function(item){
		    // 	return item.title
		    // })
		},
		cleanUp: function(str){
			str = str.replace(/(^\s*)|(\s*$)/gi,""); // exclude  start and end white-space
    		str = str.replace(/[ ]{2,}/gi," "); // 2 or more space to 1
    		str = str.replace(/\n /,"\n"); // exclude newline with a start spacing
    		return str.split(' ');
		},
		countWords: function(str){
			str = str.replace(/(^\s*)|(\s*$)/gi,""); // exclude  start and end white-space
    		str = str.replace(/[ ]{2,}/gi," "); // 2 or more space to 1
    		str = str.replace(/\n /,"\n"); // exclude newline with a start spacing
    		return str.split(' ').length;
		},
		filterArticles: function(arr, property){
			var filteredArray = [];
			arr.forEach(function(item){
		    	filteredArray.push(item[property]);
		    });
		    return filteredArray;
		},
		formatMarkdownArticles: function(){
			$('.markdown').each(function(){
				//console.log($(this).text());
				var markdown = $(this).text();
				var m = marked(markdown);
				$(this).html(m);
			})
			// call init articles()
			self.initArticles();
		},
		// format date
		formatDate: function() {
			$('.byline').find('time').each(function(){
				//console.log($(this).text());
				var pubdate = $(this).text();
				var string = 'exactly ' + parseInt((new Date() - new Date(pubdate))/60/60/24/1000) + ' days ago';
				$(this).text(string);
				//console.log('string = ' + string);
			});
		},
	};

	return self;

}());
blog.main.init();
