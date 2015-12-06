var blog = blog || {};

blog.admin = (function() {
	'use strict';
	// cached jquery objects
	var $title = $('#title');
   	var $category = $('#category');
   	var $author = $('#author');
  	var $authorUrl = $('#authorUrl');
   	var $date = $('#date');

	var $tBody    = $('#tBody');
  	var $pHrawOut = $('#pHrawOut');
  	var $pMarkOut = $('#pMarkOut');
  	var $pJson    = $('#pJson');

	// variables
	var mObj = {}; // Empty object, filled in to during JSON string update
	var self = {
//initialize admin
			init: function() {
				//console.log($('#title').val());
				self.addEventListeners();
				 // Render once on doc load
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
				 // Any character change (article editing) updates the live output paragraphs
				$tBody.on('input', function(){
					self.render();
					$(this).removeClass('initial');
				});

				 // Any character change (input fields) updates the JSON output
				$title.on('input', self.render);
				$category.on('input', self.render);
				$author.on('input', self.render);
				$authorUrl.on('input', self.render);
				$date.on('input', self.render);

				$('#preview-article').on('click', function(e) {
					//console.log('hi');
					e.preventDefault();
					self.resetArticlePreview();
					self.makeArticlesHandlebars();
				});
				$('input').on('focus', self.resetArticlePreview);
				$('input').on('input', function(){
					$(this).removeClass('initial');
				});
			},
			resetArticlePreview: function(){
				$('#article-preview').empty();
			},
			render: function() {
				var bodVal = $tBody.val(); // Raw article markup
    			var m = marked(bodVal); // Convert markup to html
			    $pHrawOut.text(m); // Render raw markup
			    $pMarkOut.html(m); // Render article preview (rendered as HTML)

			    // Update JSON article
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
			    	$authorUrl.val('http:\/\/example.me.com');
			    }
			    if($date.val() == ""){
			    	$date.val('2015\-11\-05');
			    }
			    mObj.title = $title.val();
			   	mObj.category = $category.val();
			   	mObj.author = $author.val();
			  	mObj.authorUrl = $authorUrl.val();
			   	mObj.publishedOn = $date.val();
			    mObj.body = m;
			    var jsonStr = $pJson.text(JSON.stringify(mObj));
			},
			// makeArticlesHandlebars
			makeArticlesHandlebars: function() {
				var template = $('#itemTemplate').html();
				// Handlebars compiles the template into a callable function
			      var renderer = Handlebars.compile(template);
			      // put data in a variable
			      var article = mObj;
			      //console.log(article);

			      var result = renderer(article);
			      //console.log('hi' + result);
			      //format date before appending to to #articles

			      $('#article-preview').append(result);
			      //self.formatDate();
			    // call init articles()
				//self.initArticles();
			},

		};
	return self;

}());
blog.admin.init();

