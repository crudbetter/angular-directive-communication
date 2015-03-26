angular.module('directiveCommunication.directives')

	.directive('articleCount', function() {
		return {
			restrict: 'E',
			require: '^ratings',
			scope: {
				articles: '@'
			},
			template: 
				'<div ng-repeat="author in authors">' +
					'<span>' +
						'{{author.name}}' +
					'</span>' +
				'</div>',
			link: function(scope, el, attrs, ratingsCtrl) {
				ratingsCtrl.addContributor(scope);

				/*scope.$watchCollection('articles', function(newArticles, oldArticles) {
					ratingsCtrl.recalculate();
				});*/
			}
		};
	});