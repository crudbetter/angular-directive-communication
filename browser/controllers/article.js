angular.module('directiveCommunication.controllers')

	.controller('ArticleCtrl', function($scope) {

		$scope.articles = [
			{ title: 'Writing AngularJS apps using ES6', author: 'Ravi Kiran' },
			{ title: 'Managing Client-Only State In AngularJS', author: 'Mike Godfrey' },
			{ title: 'Framework Fatigue: A Survival Guide', author: 'Mike Godfrey' }
		];
		
	});