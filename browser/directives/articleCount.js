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
				scope.$watchCollection('articles', function(articles) {
					var articleCounts = {};
					var topArticleCount = 0;

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

					ratingsCtrl.reset(scope.title);

					for (var author in articleCounts) {
						scope.authorRatings[author] = ratingsCtrl.getAuthorRating(author);
						
						if (articleCounts[author] == topArticleCount) {
							ratingsCtrl.updateAuthorRating(author, scope.title, true);
						} else {
							ratingsCtrl.updateAuthorRating(author, scope.title, false);
						}
					}

					ratingsCtrl.update();
				});
			}
		};
	});