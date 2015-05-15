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
				var authorRatingsToReset = {};

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

						delete authorRatingsToReset[author];
					}

					Object.keys(authorRatingsToReset).forEach(function(author) {
						authorRatingsToReset[author].resetCategory(scope.title);
					});

					authorRatingsToReset = scope.authorRatings;

					ratingsCtrl && ratingsCtrl.updateGrouping();
				});
			}
		};
	});