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
		arObj,
		eTag,
		ls_eTag,
		artiData,
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
					eTag = xhr.getResponseHeader("eTag");
					console.log(eTag);
					console.log(localStorage.ergodicEtag);
					if (eTag == localStorage.ergodicEtag){
						console.log("Load what's in local storage");
						artiData = JSON.parse(localStorage.getItem('blogData'));
						//console.log("ARTICLE DATA = ", artiData);
						self.sortArticlesOnPubDate(artiData);
						self.makeArticlesHandlebars();
					}else{
						console.log("getJSON");
						$.getJSON("js/blogArticles.json", function(data){
							//console.log(data);
							localStorage.setItem('blogData', JSON.stringify(data));
							// for (var key in localStorage) {
							//   console.log(key + ' : ' + localStorage[key]);
							// };
							//console.log(localStorage["blogData"]);
							artiData = JSON.parse(localStorage.getItem('blogData'));
							// console log add , object or array to console type cohersion
							// console.log("ARTICLE DATA = ", artiData);
							self.sortArticlesOnPubDate(artiData);
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
			console.log(localStorage.getItem('ls_aboutOpened'))
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
				$(this).prev().siblings().slideDown();
				$(this).next().show();
				$(this).hide();
			});
			$('.hide').on('click', function(e) {
				e.preventDefault();
				$('html, body').animate({ scrollTop: $(this).parent().parent().offset().top - 30 }, 500);
				$(this).siblings().filter('p:nth-of-type(n+2)').hide();
				$(this).prev().show();
				$(this).hide();
			});
			$('.about').on('click', function(e) {
				e.preventDefault();
				// $('.about-container').toggle();
				console.log(aboutOpened);
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
			$articleDetail = $('.article-body p:nth-of-type(n+2)');
			$articleDetail.hide();
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
		},

		// makeAuthorFilter
		makeAuthorFilter: function() {
			$selectAuthor = $('<select id="select-author"></select>');
			var $option = $('<option value="all">Filter by Authors</option>');
			$selectAuthor.append($option);
			$('#articles').prepend($selectAuthor);
			var authorArray = [];

			for(var i = 0; i < artiData.length; i++ ){
				var author = artiData[i].author;
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

			for(var i = 0; i < artiData.length; i++ ){
				var cat = artiData[i].category;
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
		      	var articles = artiData;
		      	// call the compiled function with the template date
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
		formatMarkdownArticles: function(){
			$('.markdown').each(function(){
				console.log($(this).text());
				var markdown = $(this).text();
				var m = marked(markdown);
				$(this).html(m);
			})
			// call init articles()
			self.initArticles();

				// marked library does it's magic
				// converts markdown to html
    			//var m = marked(markdown);
			    // renders the html created by markdown
			    // render article preview (rendered as HTML)
			    //$('.markdown').html(m);


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
