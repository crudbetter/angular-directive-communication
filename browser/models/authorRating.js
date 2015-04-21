angular.module('directiveCommunication.directives')

	.factory('AuthorRating', function() {
		function AuthorRating() {
			this.topForCategories = [];
			this.isTopForGrouping = false;
		}

		AuthorRating.prototype.topForCategory = function(category) {
			return this.topForCategories.indexOf(category) >= 0;
		}

		AuthorRating.prototype.updateCategory = function(category, isTop) {
			var categoryIndex = this.topForCategories.indexOf(category);
			var spliceArgs = [
				categoryIndex >= 0 ? categoryIndex : this.topForCategories.length,
				1
			];

			isTop && spliceArgs.push(category);

			Array.prototype.splice.apply(this.topForCategories, spliceArgs);
		}

		AuthorRating.prototype.updateGrouping = function(topCategoryCount) {
			this.isTopForGrouping = (this.topForCategories.length == topCategoryCount);
		}

		AuthorRating.prototype.resetCategory = function(category) {
			var categoryIndex = this.topForCategories.indexOf(category);
				
			if (categoryIndex >= 0) {
				this.topForCategories.splice(categoryIndex, 1);
			}
		}

		return AuthorRating;
	});