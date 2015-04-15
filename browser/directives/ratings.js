angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope) {
		var authorRatings = {};
		var topCategoryCount = 0;

		function AuthorRating() {
			this.topForCategories = [];
			this.isTopForGrouping = false;
		}

		AuthorRating.prototype.topForCategory = function(category) {
			return this.topForCategories.indexOf(category) >= 0;
		}

		this.getAuthorRating = function(name) {
			if (!authorRatings[name]) {
				authorRatings[name] = new AuthorRating();
			}

			return authorRatings[name];
		}

		this.updateAuthorRating = function(name, category, isTop) {
			var rating = authorRatings[name];

			if (isTop) {
				rating.topForCategories.push(category);
			} else {
				rating.topForCategories.splice(rating.topForCategories.indexOf(category), 1);
			}

			if (rating.topForCategories.length >= topCategoryCount) {
				rating.topForGrouping = true;
				topCategoryCount = rating.topForCategories.length;
			} // else { TODO }
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