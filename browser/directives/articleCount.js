angular.module('directiveCommunication.directives')

	.directive('articleCount', function() {
		return {
			restrict: 'E',
			require: '^ratings',
			scope: {
				articles: '@',
				title: '@'
			},
			templateUrl: 'template/articleCount.html',
			link: function(scope, el, attrs, ratingsCtrl) {

				/*scope.$watchCollection('articles', function(newArticles, oldArticles) {
					var authorsByName = {};
					var topArticleCount = 0;
					var oneOrMoreTopForCategory = false;

					JSON.parse(newArticles).forEach(function(article) {
						if (authorsByName[article.author]) {
							authorsByName[article.author].articleCount++;
						} else {
							authorsByName[article.author] = { 
								articleCount: 1
							};
						}

						if (authorsByName[article.author].articleCount > topArticleCount) {
							topArticleCount = authorsByName[article.author].articleCount;
						}
					});

					for (var author in authorsByName) {
						if (authorsByName[author].articleCount == topArticleCount) {
							authorsByName[author].topForCategory = true;
							if (oneOrMoreTopForCategory) {
								Object.keys(authorsByName).forEach(function(name) {
									authorsByName[name].topForCategory = false;
								});
								break;
							}
							oneOrMoreTopForCategory = true;
						} else {
							authorsByName[author].topForCategory = false;
						}
					}
				});*/

				scope.$watchCollection('articles', function(articles) {
					var articleCounts = {};
					var topArticleCount = 0;
					var oneOrMoreTopForCategory = false;

					JSON.parse(articles).forEach(function(article) {
						if (articleCounts[article.author]) {
							articleCounts[article.author]++;
						} else {
							articleCounts[article.author] = 1;
						}

						if (articleCounts[article.author] > topArticleCount) {
							topArticleCount = articleCounts[article.author];
						}
					});

					scope.authorRatings = {};

					for (var author in articleCounts) {
						scope.authorRatings[author] = ratingsCtrl.getAuthorRating(author);
						
						if (articleCounts[author] == topArticleCount) {
							ratingsCtrl.updateAuthorRating(author, scope.title, true);
						} else {
							ratingsCtrl.updateAuthorRating(author, scope.title, false);
						}
					}
				});
			}
		};
	});