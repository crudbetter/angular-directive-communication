angular.module('directiveCommunication.controllers')

	.controller('CategoryCtrl', function($scope) {
		function Category(title) {
			this.title = title;
			this.articles = [];
		}

		Category.prototype.contains = function(article) {
			return this.articles.indexOf(article) >= 0;
		}

		Category.prototype.toggle = function(article) {
			var index = this.articles.indexOf(article);
			
			if (index == -1) {
				this.articles.push(article);
			} else {
				this.articles.splice(index, 1);
			}
		}

		$scope.categories = [
			new Category('ES6'),
			new Category('AngularJS'),
			new Category('React')
		];

		$scope.$watchCollection('categories', function(categories) {
			$scope.categoryArticles = categories.reduce(function(map, category) {
				map[category.title] = category.articles;
				return map;
			}, {});
		})

	});