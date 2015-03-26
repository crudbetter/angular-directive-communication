angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope) {
		var contributors = [];

		this.addContributor = function(contributorScope) {
			contributors.push(contributorScope);
		};

		this.recalculate = function() {
			
		}
	})

	.directive('ratings', function() {
		return {
			restrict: 'E',
			controller: 'RatingsCtrl',
			transclude: true,
			scope: {
				name: '@'
			},
			template:
				'<div>' 
					'<span>Ratings for {{name}}</span>' +
					'<div ng-transclude />' +
				'</div>',
			link: function(scope, el, attrs, ratingsCtrl) {

			}
		};
	});