angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope, AuthorRating) {
		var authorRatings = {};

		this.getAuthorRating = function(name) {
			if (!authorRatings[name]) {
				authorRatings[name] = new AuthorRating();
			}

			return authorRatings[name];
		}

		this.resetCategory = function(category) {
			Object.keys(authorRatings).forEach(function(author) {
				authorRatings[author].resetCategory(category);
			});
		}

		this.updateGrouping = function() {
			var authors = Object.keys(authorRatings);
			var topCategoryCount = Math.max.apply(null,
				authors.reduce(function(topCategoryCounts, author) {
					return topCategoryCounts.concat([authorRatings[author].topForCategories.length]);
				}, [])
			);

			authors.forEach(function(author) {
				authorRatings[author].updateGrouping(topCategoryCount);
			});
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
			templateUrl: 'template/ratings.html'
		};
	});