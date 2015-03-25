angular.module('directiveCommunication.controllers')

	.controller('CategoryCtrl', function($scope) {
		function Category(name) {
			this.name = name;
			this.articles = [];
		}

		Category.prototype.assign = function(article) {
			if (this.articles.indexOf(article) < 0) {
				this.articles.push(article);
			}
		}

		$scope.categories = [
	    new Category('JavaScript'),
	    new Category('AngularJS'),
	    new Category('React')
	  ];

		$scope.assignCategory = function(category, article) {
			category.assign(article);
		};
	});