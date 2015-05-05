angular.module('directiveCommunication.directives')

	.directive('articleCount', function(AuthorRating) {
		return {
			restrict: 'E',
			require: '?^authorRatings',
			scope: {
				articles: '=',
				title: '@'
			},
			templateUrl: 'templates/articleCount.html',
			link: function(scope, el, attrs, ratingsCtrl) {
				var prevAuthorRatings = {};

				scope.$watchCollection('articles', function(articles) {
					var articleCounts = {};
					var topArticleCount = 0;

					articles.forEach(function(article) {
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
						scope.authorRatings[author] = ratingsCtrl ? ratingsCtrl.getAuthorRating(author) : new AuthorRating();
						scope.authorRatings[author].updateCategory(scope.title, articleCounts[author] == topArticleCount);

						delete prevAuthorRatings[author];
					}

					Object.keys(prevAuthorRatings).forEach(function(author) {
						prevAuthorRatings[author].resetCategory(scope.title);
					});

					prevAuthorRatings = scope.authorRatings;

					ratingsCtrl && ratingsCtrl.updateGrouping();
				});
			}
		};
	});