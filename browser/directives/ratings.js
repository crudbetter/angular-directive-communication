angular.module('directiveCommunication.directives')

	.controller('RatingsCtrl', function($scope) {
		var authorRatings = {};

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
			var categoryIndex = rating.topForCategories.indexOf(category);

			var spliceArgs = [
				categoryIndex >= 0 ? categoryIndex : rating.topForCategories.length,
				1
			];

			isTop && spliceArgs.push(category);

			Array.prototype.splice.apply(rating.topForCategories, spliceArgs);
		}

		this.reset = function(category) {
			var authors = Object.keys(authorRatings);

			authors.forEach(function(author) {
				var rating = authorRatings[author];
				var categoryIndex = rating.topForCategories.indexOf(category);
				
				if (categoryIndex >= 0) {
					rating.topForCategories.splice(categoryIndex, 1);
				}
			});
		}

		this.update = function() {
			var authors = Object.keys(authorRatings);
			var topCategoryCount = Math.max.apply(null,
				authors.reduce(function(topCategoryCounts, author) {
					return topCategoryCounts.concat([authorRatings[author].topForCategories.length]);
				}, [])
			);

			authors.forEach(function(author) {
				authorRatings[author].isTopForGrouping = 
					authorRatings[author].topForCategories.length == topCategoryCount;
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