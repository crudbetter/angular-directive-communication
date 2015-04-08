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
				ratingsCtrl.addContributor(scope);

				scope.$watchCollection('articles', function(newArticles, oldArticles) {
					var authorsByName = {};
					var topArticleCount = 0;
					var oneOrMoreTopForCategory = false;

					scope.authorsByName = authorsByName;

					JSON.parse(newArticles).forEach(function(article) {
						if (authorsByName[article.author]) {
							authorsByName[article.author].articleCount++;
						} else {
							authorsByName[article.author] = { articleCount: 1 };
						}

						if (authorsByName[article.author].articleCount > topArticleCount) {
							topArticleCount = authorsByName[article.author].articleCount;
						}
					});

					for (var author in authorsByName) {
						if (authorsByName[author].articleCount == topArticleCount) {
							authorsByName[author].topForCategory = true;
							if (oneOrMoreTopForCategory) {
								authors.forEach(function(author) {
									authorsByName[author].topForCategory = false;
								});
								break;
							}
							oneOrMoreTopForCategory = true;
						} else {
							authorsByName[author].topForCategory = false;
						}
					}

					//ratingsCtrl.recalc();
				});
			}
		};
	});