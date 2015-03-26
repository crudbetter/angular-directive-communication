angular.module('directiveCommunication.controllers')

	.controller('CategoryCtrl', function($scope) {
		var categories;

		$scope.categories = categories = {
			'ES6': [],
			'AngularJS': [],
			'React': []
		};

		$scope.categorize = function(articles, article) {
			var index = articles.indexOf(article);
			
			if (index == -1) {
				articles.push(article);
			} else {
				articles.splice(index, 1);
			}
		};
	});