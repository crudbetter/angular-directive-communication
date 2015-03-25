angular.module('directiveCommunication.controllers')

	.controller('ArticleCtrl', function($scope) {

		function Article(title, author) {
			this.title = title;
			this.author = author;
		}

		$scope.articles = [
			new Article('Writing AngularJS apps using ES6', 'Ravi Kiran'),
			new Article('Managing Client-Only State In AngularJS', 'Mike Godfrey'),
			new Article('Framework Fatigue: A Survival Guide', 'Mike Godfrey')
		];
	});