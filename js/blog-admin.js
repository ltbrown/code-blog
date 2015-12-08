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
				self.render();

				// hljs.configure({useBR: true});

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
				});

				 // on user input (input fields), calls render to update the JSON obj
				$title.on('input', self.render);
				$category.on('input', self.render);
				$author.on('input', self.render);
				$authorUrl.on('input', self.render);
				$date.on('input', self.render);

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
					$(this).prev().siblings().slideDown();
					$(this).next().show();
					$(this).hide();
				});
				$('.hide').on('click', function(e) {
					e.preventDefault();
					// $('html, body').animate({ scrollTop: $(this).parent().parent().offset().top - 30 }, 500);
					$(this).siblings().not('p:first-child').hide();
					$(this).prev().show();
					$(this).hide();
				});
			},

			// initialize the articles section
			initArticle: function() {
				// hides all pargraphs except the first one
				$articleDetail = $('.article-body p:first-child').siblings();
				$articleDetail.hide();
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
				var template = $('#itemTemplate').html();
				// Handlebars compiles the template into a callable function
			    var renderer = Handlebars.compile(template);
			    // put data (object) in a variable
			    // var article = mObj;
			    //console.log(article);
			    // call the handlebars callable function passing the data object
			    var result = renderer(dataObj);
			    //console.log('hi' + result);
				// append template to node in DOM with an ID of #article-preview
			    $('#article-preview').append(result);
			    //self.formatDate();
			    self.initArticle();
			}
		};
	return self;

}());
blog.admin.init();

