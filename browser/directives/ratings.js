angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope) {
		var contributors = [];
		var topAuthors = [];

		this.addContributor = function(contributorScope) {
			contributors.push(contributorScope);

			/*contributorScope.$watchCollection('topAuthors', function(newTopAuthors, oldTopAuthors) {
				if (!angular.isArray(newTopAuthors)) {
					return;
				}

				var contributorsByAuthor = {};

				contributors.forEach(function(contributor) {
					contributor.topAuthors.forEach(function(author) {
						contributorsByAuthor[author] = Array.prototype.concat(contributorsByAuthor[author] || [], contributor);
					});
				});

				$scope.topAuthors = topAuthors;
					topAuthors.length = 0;
					topContributorCount = 0;

					Object.keys(contributorsByAuthor).forEach(function(author) {
						var contributorCount = contributorsByAuthor[author].length;

						if (contributorCount > topContributorCount) {
							topAuthors.splice(0, topAuthors.length, author);
							topContributorCount = contributorCount;
						} else if (contributorCount == topContributorCount) {
							topAuthors.length = 0;
						}
					});
			});*/
		};

		this.recalc = function() {
			contributors.forEach(function(contributor) {
				
			});
		};
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
					'<span>{{topAuthors}}</span>' + 
					'<span>Ratings for {{title}}</span>' +
					'<div ng-transclude />' +
				'</div>'
		};
	});