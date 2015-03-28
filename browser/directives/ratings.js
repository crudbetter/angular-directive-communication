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
				title: '@'
			},
			template:
				'<div>' + 
					'<span>Ratings for {{title}}</span>' +
					'<div ng-transclude />' +
				'</div>',
			link: function(scope, el, attrs, ratingsCtrl) {

			}
		};
	});