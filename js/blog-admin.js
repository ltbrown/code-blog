var blog = blog || {};

blog.admin = (function() {
	'use strict';
	// cached jquery objects
	var $pLog = $('#pLog');

	var $tBody    = $('#tBody');
  	var $pHrawOut = $('#pHrawOut');
  	var $pMarkOut = $('#pMarkOut');
  	var $pJson    = $('#pJson');

	// variables
	var articleMeta = [];
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
					var title = $('#title').val();
					var name = $('#name').val();
					var url = $('#author-url').val();
					var date = $('#date').val();
					var category = $('#category').val();
					articleMeta.push(title, name, url, date, category);
					self.formatInputs(articleMeta);
					//
				});
				 // Any character change (article editing) updates the live output paragraphs
				$tBody.on('input', self.render);
			},
			render: function() {
				var bodVal = $tBody.val(); // Raw article markup
    			var m = marked(bodVal); // Convert markup to html
			    $pHrawOut.text(m); // Render raw markup
			    $pMarkOut.html(m); // Render article preview (rendered as HTML)

			    // Update JSON article
			    mObj.body = m;
			    var jsonStr = $pJson.text(JSON.stringify(mObj));
			},

			formatInputs: function(Meta) {
					var keys = ["title", "category", "author", "authorUrl", "publishedOn"];
				    var	result = [];
				for ( var i = 0; i < keys.length; i++ ) {
				  result.push( [ keys[i] + ": " + articleMeta[i] ] );
				}
				console.log("hi " + result);
			}

		}
	return self;

}());
blog.admin.init();

/*
var tBody    = $('#tBody');
 var pHrawOut = $('#pHrawOut');
 var pMarkOut = $('#pMarkOut');
 var pJson    = $('#pJson');
 var mObj = {}; // Empty object, filled in to during JSON string update
 function render() {
   var bodVal = tBody.val(); // Raw article markup
   var m = marked(bodVal); // Convert markup to html
   pHrawOut.text(m); // Render raw markup
   pMarkOut.html(m); // Render article preview (rendered as HTML)
   // Update JSON article
   mObj.title = $('#title').val();
   mObj.category = $('#category').val();
   mObj.author = $('#author').val();
   mObj.authorUrl = $('#authorUrl').val();
   mObj.date = $('#date').val();
   // mObj.title = 'hello ';
   mObj.body = m;

   var jsonStr = pJson.text(JSON.stringify(mObj));
 }

 // Any character change (article editing) updates the live output paragraphs
 $('#submitArticle').on('click', function(e){
   e.preventDefault();
   render();
 });
render(); // Render once on doc load
});
*/
