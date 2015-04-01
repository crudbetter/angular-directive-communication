angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope) {
		var contributors = [];
		var topAuthors = [];

		this.addContributor = function(contributorScope) {
			contributors.push(contributorScope);

			contributorScope.$watchCollection('topAuthors', function() {
				topAuthors = contributors.reduce(function(topAuthors, contributor) {
					return topAuthors.concat(contributor.topAuthors);
				}, []);
			});
		};

		$scope.isTopAuthor = function(author) {
			return topAuthors.indexOf(author) >= 0;
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
				'</div>'
		};
	});