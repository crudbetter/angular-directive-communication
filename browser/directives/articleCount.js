angular.module('directiveCommunication.directives')

	.directive('articleCount', function(AuthorRating) {
		return {
			restrict: 'E',
			require: '?^ratings',
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

					ratingsCtrl && ratingsCtrl.resetCategory(scope.title);

					for (var author in articleCounts) {
						scope.authorRatings[author] = ratingsCtrl ? ratingsCtrl.getAuthorRating(author) : new AuthorRating();
						scope.authorRatings[author].updateCategory(scope.title, articleCounts[author] == topArticleCount);
					}

					ratingsCtrl && ratingsCtrl.updateGrouping();
				});
			}
		};
	});