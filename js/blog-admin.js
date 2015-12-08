var blog = blog || {};

blog.admin = (function() {
	'use strict';
	// cached jquery objects
	var $title = $('#title');
   	var $category = $('#category');
   	var $author = $('#author');
  	var $authorUrl = $('#authorUrl');
   	var $date = $('#date');

	var $textareaMarkdown = $('#textarea-markdown');
  	var $rawHTMLOutput = $('#rawHTML-output');
  	var $markdownOutput = $('#markdown-output');
  	var $jsonOutput    = $('#JSON-output');

  	var $articleDetail,
		$articleBody;

	// variables
	var dataObj = {}; // empty object, filled in to during JSON string update
	var self = {
			// starts things off
			init: function() {
				// add event listeners
				self.addEventListeners();
				// render once on docuemnt load
				self.checkLocalStorage();
				// hljs.configure({useBR: true});
			},
			checkLocalStorage: function() {
				//delete localStorage.ls_title;
				//console.log(localStorage.getItem('ls_title'));
				if(localStorage.getItem('ls_title') != null){
					var localTitle = localStorage.getItem('ls_title');
					$title.val(localTitle);
				}
				if(localStorage.getItem('ls_category') != null){
					var localTitle = localStorage.getItem('ls_category');
					$category.val(localTitle);
				}
				if(localStorage.getItem('ls_author') != null){
					var localTitle = localStorage.getItem('ls_author');
					$author.val(localTitle);
				}
				if(localStorage.getItem('ls_authorUrl') != null){
					var localTitle = localStorage.getItem('ls_authorUrl');
					$authorUrl.val(localTitle);
				}
				if(localStorage.getItem('ls_date') != null){
					var localTitle = localStorage.getItem('ls_date');
					$date.val(localTitle);
				}
				if(localStorage.getItem('ls_textarea') != null){
					var localTitle = localStorage.getItem('ls_textarea');
					$textareaMarkdown.val(localTitle);
				}
				self.render();
			},

			// event listeners for this module
			addEventListeners: function() {
				// add click listener to elements
				$('#submit-article').on('click', function(e) {
					//console.log('hi');
					e.preventDefault();
					//TODO: submit button will add jsonStr to blogArticles? or dynamically create blogArticles.js
				});

				 // on user input (article editing text area), calls render to update the live output paragraphs
				$textareaMarkdown.on('input', function(){
					self.render();
					$(this).removeClass('is-initial');
					var text = $(this).val();
					localStorage.setItem('ls_textarea', text);
				});

				// on user input (input fields), calls render to update the JSON obj
				// localStorage.setItem('ls_aboutOpened', 'open');
				// console.log(localStorage.getItem('ls_aboutOpened'))
				//$title.on('input', self.render);
				$title.on('input', function(){
					var text = $(this).val();
					localStorage.setItem('ls_title', text);
					console.log(localStorage.getItem('ls_title'));
					self.render();
				});
				//$category.on('input', self.render);
				$category.on('input', function(){
					var text = $(this).val();
					localStorage.setItem('ls_category', text);
					self.render();
				});
				//$author.on('input', self.render);
				$author.on('input', function(){
					var text = $(this).val();
					localStorage.setItem('ls_author', text);
					self.render();
				});
				//$authorUrl.on('input', self.render);
				$authorUrl.on('input', function(){
					var text = $(this).val();
					localStorage.setItem('ls_authorUrl', text);
					self.render();
				});
				//$date.on('input', self.render);
				$date.on('input', function(){
					var text = $(this).val();
					localStorage.setItem('ls_date', text);
					self.render();
				});

				// when use click article preview button show template preview
				$('#preview-article').on('click', function(e) {
					//console.log('hi');
					e.preventDefault();
					self.resetArticlePreview();
					self.makeArticlesHandlebars();
				});

				// on user input (input fields), remove is-initial class and empty article preview
				$('input').on('input', function(){
					$(this).removeClass('is-initial');
					self.resetArticlePreview();
				});
			},

			addMoreHideEventListenert: function(){
				// add click listener to elements
				$('.more').on('click', function(e) {
					e.preventDefault();
					//$(this).prev().siblings().slideDown();
					$(this).parent().find('.hideMe').removeClass('hideMe');
					$(this).next().show();
					$(this).hide();
				});
				$('.hide').on('click', function(e) {
					e.preventDefault();
					// $('html, body').animate({ scrollTop: $(this).parent().parent().offset().top - 30 }, 500);
					//$(this).siblings().not('p:first-child').hide();
					$articleDetail = $('.article-body p:nth-of-type(n+1)').nextAll();
					// $articleDetail.hide();
					$articleDetail.addClass('hideMe');
					$(this).prev().show();
					$(this).hide();
				});
			},

			// initialize the articles section
			initArticle: function() {
				// hides all pargraphs except the first one
				// $articleDetail = $('.article-body p:first-child').siblings();
				// $articleDetail.hide();
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
				// self.makeCategoryFilter();
				// self.makeAuthorFilter();
				self.addMoreHideEventListenert();
			},

			// empties the #article-preview node when new info in input
			resetArticlePreview: function(){
				$('#article-preview').empty();
			},

			// updates the live preview areas when new info is input
			render: function() {
				// raw article markdown
				var textareaVal = $textareaMarkdown.val();
				// marked library does it's magic
				// converts markdown to html
    			var m = marked(textareaVal);
			    // renders the html created by markdown
			    // render article preview (rendered as HTML)
			    $markdownOutput.html(m);
			    // displays the raw html that was created from the markdown
			    // render raw markup
			    $rawHTMLOutput.text(m);
			    $('.code').each(function(i, block) {
				  hljs.highlightBlock(block);
				});

				// $('pre code').each(function(i, block) {
				//     hljs.highlightBlock(block);
				//  });

			    // default input field values
			    if($title.val() == ""){
			    	$title.val('New Title');
			    }
			    if($category.val() == ""){
			    	$category.val('horses');
			    }
			    if($author.val() == ""){
			    	$author.val('Author Name');
			    }
			    if($authorUrl.val() == ""){
			    	$authorUrl.val('http://example.me.com');
			    }
			    if($date.val() == ""){
			    	$date.val('2015\-11\-05');
			    }
			    // update JSON data object
			    dataObj.title = $title.val();
			   	dataObj.category = $category.val();
			   	dataObj.author = $author.val();
			  	dataObj.authorUrl = $authorUrl.val();
			   	dataObj.publishedOn = $date.val();
			    dataObj.body = m;
			    var jsonStr = $jsonOutput.text(JSON.stringify(dataObj));
			},

			// make article preview from handlebars template by passing in the dataObj
			makeArticlesHandlebars: function() {
				// use the same template as index.html
				$.get( "../partials/template.html", function( data ){
					console.log("Data Loaded: " + data );
					var renderer = Handlebars.compile(data);
					var articles = [dataObj];
					console.log(articles);
					var result = renderer({articles});
					console.log('hi' + result);
					$('#article-preview').append(result);
				}).done(function() {
					//self.formatMarkdownArticles();
					self.initArticle();
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
				self.initArticle();
			}
		};
	return self;

}());
blog.admin.init();

