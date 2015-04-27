angular.module('directiveCommunication.controllers')

	.controller('CategoryCtrl', function($scope) {
		function Category() {
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

		$scope.categories = {
			'ES6': new Category(),
			'AngularJS': new Category(),
			'React': new Category()
		};

	});