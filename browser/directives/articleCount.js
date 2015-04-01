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
				var topAuthors = [];
				var topArticleCount = 0;

				ratingsCtrl.addContributor(scope);

				scope.$watchCollection('articles', function(newArticles, oldArticles) {
					scope.articlesByAuthor = {};

					JSON.parse(newArticles).forEach(function(article) {
						scope.articlesByAuthor[article.author] = Array.prototype.concat(scope.articlesByAuthor[article.author] || [], article);
					});

					topArticleCount = 0;

					Object.keys(scope.articlesByAuthor).forEach(function(author) {
						var articleCount = scope.articlesByAuthor[author].length;

						if (articleCount > topArticleCount) {
							topAuthors.splice(0, topAuthors.length, author);
							topArticleCount = articleCount;
						} else if (articleCount == topArticleCount) {
							topAuthors.length = 0;
						}
					})§
				});

				scope.isTopAuthor = function(author) {
					return topAuthors.indexOf(author) >= 0;
				};
			}
		};
	});