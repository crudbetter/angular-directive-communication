angular.module('directiveCommunication.directives')

	.directive('articleCount', function() {
		return {
			restrict: 'E',
			require: '^ratings',
			scope: {
				articles: '@',
				title: '@'
			},
			template: 
				'<section>' +
					'<h4>{{title}}</h4>' +
					'<ul>' +
						'<li ng-repeat="(name, articleCount) in authors">{{name}} : {{articleCount}}</li>' +
					'</ul>' +
				'</section>',
			link: function(scope, el, attrs, ratingsCtrl) {
				ratingsCtrl.addContributor(scope);

				scope.$watchCollection('articles', function(articles) {
					scope.authors = JSON.parse(articles).reduce(function(map, article) {
						map[article.author] ?
							map[article.author]++ :
							map[article.author] = 1;
						return map;
					}, {});
				});
			}
		};
	});