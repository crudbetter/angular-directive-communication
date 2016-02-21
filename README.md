Communication between AngularJS sibling directives
====================================

### Installation

- `git clone https://github.com/crudbetter/angular-directive-communication.git`
- `npm start`
- Browse to http://localhost:8000/browser/index.html

=====

When I was growing up my sister and I were very different, we often struggled to communicate. My primary forms of communication were designed to be irritating. I perfected them to an extent that I could say nothing and still irritate, simply by mimicking the turning of a crank handle (thus literally "winding up" my sister) - younger brothers, who'd have them!

My sister and I often communicated via our mother, who acted as translator and peacekeeper, similar to a mediator.

Sibling Angular directives can experience communication difficulties. Additionally as developers we want them to know nothing about one another, we call this decoupling.

If my sister and I were decoupled I would have known nothing about her inner demons, I wouldn't have known that simple actions could irritate so much. I did however and it provided me with hours of entertainment!

In this post we will explore, via an example, how sibling directives can be decoupled but still able to communicate effectively.

The example we'll construct is a simple ratings systems for a multi-author blog with the following requirements:

*   authors are rated by the number of articles they have published within a category - top authors are denoted with a `*`
*   categories can be arbitarily grouped to provide additional author ratings - top authors are denoted with a prominent color

The following mockups illustrate the intended behaviour:

![Initial state][1]

In this first mockup both authors have published a single AngularJS article, so both are top authors for the AngularJS category and the Frameworks category grouping. Ravi Kiran is the only author to publish an ES6 article so he is top for the ES6 category and the JS category grouping.

![One article recategorized][2]

In this second mockup "Framework Fatigue: A Survival Guide" has been recategorized as AngularJS and React, with the ratings updated accordingly.

# Identifing re-use

From the mockups we should identify areas of potential re-use. I typically do this by highlighting the mockup as follows:

![Potential re-use highlighted][3]

The resulting nesting of red rectangled indicates components/directives that could be related. It is clear to see a parent-child relationship as well as sibling relationships. I given the rectangles sensible names, these will become directive names.

From here I find it useful to think about markup driving the design of directives, this includes attributes and how scope data is passed in:

```html
<author-ratings title="JavaScript">
  <article-count title="ES6" articles="?"></article-count>
  <article-count title="NG" articles="?"></article-count>
  <article-count title="React" articles="?"></article-count> 
</author-ratings>

<author-ratings title="Frameworks">
  <article-count title="NG" articles="?"></article-count>
  <article-count title="React" articles="?"></article-count> 
</author-ratings>
```

Future requirements could also include rating authors by different criteria, for example by average words per article. The markup above is flexible enough to cater for this:

```html
<author-ratings title="JavaScript">
  <article-count title="ES6" articles="?"></article-count>
  <words-per-article title="ES6" articles="?"></words-per-article>
</author-ratings>
```

OK, enough design, lets look at the implementation next.

# Implementation

To to do this I'll introduce each file involved in turn. I'll describe what's going on through a combination of code comments and text descriptions.

## View

We need a single HTML page to house markup (including that described above). `index.html` starts off as follows:

```html
<html ng-app="directiveCommunication">
  <head>
  <meta charset="UTF-8" />
  <title>angular-directive-communication</title>
  <meta name="viewport" 
    content="width=device-width, initial-scale=1" />
  <link href="styles.css" rel="stylesheet" />
  </head>
  <body>
    <h1>
      Exploring communication between directives in AngularJS
    </h1>

    <div ng-controller="CategoryCtrl">

      <ratings class="column" title="JavaScript">
        <article-count title="ES6" 
          articles="categories['ES6'].articles">
        </article-count>
        <article-count title="NG" 
          articles="categories['AngularJS'].articles">
        </article-count>
        <article-count title="React" 
          articles="categories['React'].articles">
        </article-count> 
      </ratings>

      <ratings class="column" title="Frameworks">
        <article-count title="NG" 
          articles="categories['AngularJS'].articles">
        </article-count>
        <article-count title="React" 
          articles="categories['React'].articles">
        </article-count> 
      </ratings>

      <div class="column" ng-controller="ArticleCtrl">
        <div ng-repeat="article in articles">
          <p>{{article.title}}</p>
          <p>- {{article.author}}</p>
          <label ng-repeat="(title, category) in categories">
            <input type="checkbox" 
              ng-checked="category.contains(article)" 
              ng-click="category.toggle(article)" />
            {{title}}
          </label>
        </div>
      </div>

    </div>

    <script src="../node_modules/angular/angular.js"></script>
    <script src="app.js"></script>
    <script src="controllers/article.js"></script>
    <script src="controllers/category.js"></script>
    <script src="directives/articleCount.js"></script>
    <script src="directives/authorRatings.js"></script>
  </body>
</html>
```    

From here we can study the JavaScript files referenced in `<script>` tags. First up is `app.js`, a simple file which boostraps the app as follows:

```javascript
angular.module('directiveCommunication.controllers', []);
angular.module('directiveCommunication.directives', []);

angular.module('directiveCommunication', [
  'directiveCommunication.controllers',
  'directiveCommunication.directives',
]);
```

## Controllers

Next is the two controller files, `article.js` and `category.js`. `ArticleCtrl` and `CategoryCtrl` provide the functionalitly for categorising the small list of articles in the far right column, which are then passed into `<article-count>` elements.

This functionality isn't central to the topic of this repository (directive communication), so I'll leave the reader to explore if they wish.

## Directives

OK, so lets examine the directives in detail, starting with the child/sibling directive, `articleCount`. To keep descriptions terse I'll refer to directive instances as `articleCount`s or `authorRatings`.

### articleCount

I mentioned earlier that as developers we have a desire to decouple things. `articleCount`s should not know about each other. For example the ES6 `articleCount` should not set whether authors in the NG `articleCount` are top for the JavaScript grouping.

From a high-level, `articleCount`s must do two things when the array of articles they are passed changes:

1 establish which author(s) have the most articles in the array, and 2 tell a parent `authorRatings` about it

#### Code

```javascript
angular.module('directiveCommunication.directives')

  .directive('articleCount', function(AuthorRating) {
    return {
      restrict: 'E',
      // ^ denotes articleCount must be a child of authorRatings
      require: '^authorRatings', 
      scope: {
        articles: '=',
        title: '@'
      },
      templateUrl: 'templates/articleCount.html',
      link: function(scope, el, attrs, ratingsCtrl) {
        var authorRatingsToReset = {};

        scope.$watchCollection('articles', function(articles) {
          // keep a track of article counts keyed by author
          var articleCounts = {};
          var topArticleCount = 0;

          articles.forEach(function(article) {
            if (articleCounts[article.author]) {
              articleCounts[article.author]++;
            } else {
              articleCounts[article.author] = 1;
            }

            if (articleCounts[article.author] > topArticleCount) {
              topArticleCount = articleCounts[article.author];
            }
          });

          // reset the scope property ready for template use
          scope.authorRatings = {};

          for (var author in articleCounts) {
            // ratings for an author may have been created by
            // another articleCount so get from parent
            scope.authorRatings[author] = 
              ratingsCtrl.getAuthorRating(author);
            scope.authorRatings[author].updateCategory(
              scope.title, 
              articleCounts[author] == topArticleCount
            );

            // we've updated ratings for this author so 
            // they don't need a category reset
            delete authorRatingsToReset[author];
          }

          Object.keys(authorRatingsToReset).forEach(function(author) {
            authorRatingsToReset[author].resetCategory(scope.title);
          });

          authorRatingsToReset = scope.authorRatings;

          ratingsCtrl.updateGrouping();
        });
      }
    };
  });
```  

#### Template

The HTML that gets inserted inside `<article-count>` elements is as follows.

```html
<div>
  <span>{{title}}</span>
  <ul>
    <li ng-repeat="(name, rating) in authorRatings"
      ng-class="{ highlight: rating.isTopForGrouping }">
      {{name}}
      <span ng-if="rating.topForCategory(title)">*</span>
    </li>
  </ul>
</div>
```    

In the template above you may notice the `rating.isTopForGrouping` property access and the `rating.topForCategory` function invocation. These will be discussed in a later section, for now we'll continue with the `authorRatings` directive.

### authorRatings

I mentioned earlier that parents act as mediators between their children. In the example `articleCount`s tell `authorRatings` when their top author(s) have changed, `authorRatings` then set whether authors in all their `articleCount`s are top for the grouping. `authorRatings` purpose therefore is to encapsulate how `articleCount`s interact.

#### Code

```javascript
angular.module('directiveCommunication.directives')

  .controller('AuthorRatingsCtrl', function($scope, AuthorRating) {
    var authorRatings = {};

    this.getAuthorRating = function(name) {
      if (!authorRatings[name]) {
        // call a constructor function injected in to the controller
        // cache the resulting instance
        // there is only ever one per author
        authorRatings[name] = new AuthorRating();
      }

      return authorRatings[name];
    };

    this.updateGrouping = function() {
      var authors = Object.keys(authorRatings);

      var topCategoryCount = Math.max.apply(null,
        // flatten authorRatings cache to an array
        // of top for category counts, e.g. 3 authorRatings might 
        // produce [1, 2, 1], which is passed to Math.max 
        authors.reduce(function(topCategoryCounts, author) {
          return topCategoryCounts.concat(
            [authorRatings[author].topForCategories.length]
          );
        }, [])
      );

      // now we have a topCategoryCount loop through and update 
      // each authorRating with it
      authors.forEach(function(author) {
        authorRatings[author].updateGrouping(topCategoryCount);
      });
    };
  })

  .directive('authorRatings', function() {
    return {
      restrict: 'E',
      controller: 'AuthorRatingsCtrl',
      transclude: true,
      scope: {
        title: '@'
      },
      templateUrl: 'templates/authorRatings.html'
    };
  });
```   

In the code above you will have noticed that the `authorRatings` directive object itself is very small, with no link or compile function. So you might ask why does it exists, why not just set `AuthorRatingsCtrl` as the controller for `articleCount`s? Well, we want an instance of `AuthorRatingsCtrl` per arbitary grouping of `articleCount`s, not per instance of `articleCount`.

#### Template

The somewhat simple HTML that gets inserted inside of `<author-ratings>` elements is as follows:

```html
<div>
  <span>Ratings for {{title}}</span>
  <!--  declare where <article-counts> are going to be inserted with ng-transclude -->
  <div ng-transclude />
</div> 
```

### AuthorRating model

So far you may have noticed references to properties and functions that have yet to be introduced:

*   the link function for `articleCount` calling `updateCategory` and `resetCategory`
*   the template for `articleCount` calling `topForCategory` and accessing `isTopForGrouping`
*   `AuthorRatingsCtrl` calling `updateGrouping` and accessing `topForCategories`

All of these properties and methods exist on a model that was extracted from an early version of `AuthorRatingsCtrl`. I believe this helps to keep code modular, testable and easier to reason about.

#### Code

The `AuthorRatings` model is implemented as a constructor function returned from an Angular factory - this makes it injectable (see `AuthorRatingsCtrl` above). It's code is as follows and should hopefully complete a mental image of how `authorRatings` and `articleCount`s work together:

```javascript
angular.module('directiveCommunication.directives')

  .factory('AuthorRating', function() {
    function AuthorRating() {
      this.topForCategories = [];
      this.isTopForGrouping = false;
    }

    // saves having ugly indexOf calls in templates
    AuthorRating.prototype.topForCategory = function(category) {
      return this.topForCategories.indexOf(category) >= 0;
    }

    AuthorRating.prototype.updateCategory = function(category, isTop) {
      var categoryIndex = this.topForCategories.indexOf(category);

      // always remove category
      var spliceArgs = [
        categoryIndex >= 0 ? 
          categoryIndex : 
          this.topForCategories.length,
        1
      ];

      // (re)add category if top
      isTop && spliceArgs.push(category);

      Array.prototype.splice.apply(this.topForCategories, spliceArgs);
    }

    AuthorRating.prototype.updateGrouping = function(topCategoryCount) {
      this.isTopForGrouping = 
        (this.topForCategories.length == topCategoryCount);
    }

    AuthorRating.prototype.resetCategory = function(category) {
      var categoryIndex = this.topForCategories.indexOf(category);

      if (categoryIndex >= 0) {
        this.topForCategories.splice(categoryIndex, 1);
      }
    }

    return AuthorRating;
  });
```  

## More flexibility

It is possible for `articleCount` to work in isolation, without an `authorRatings` parent or sibling `articleCount`s. Let's quickly see how that can be achieved before drawing this post to a conclusion. To do this I'll just highlight the changes to `articleCount.js`.

Angular allows directives to specify optional dependencies with a preceding `?`, so

```javascript
require: '^authorRatings'
```    

becomes

```javascript
require: '?^authorRatings'  
```

In the link function we need to check if `ratingsCtrl` exists before using it, so

```javascript
for (var author in articleCounts) {
  scope.authorRatings[author] = ratingsCtrl.getAuthorRating(author);
  scope.authorRatings[author].updateCategory(
    scope.title, 
    articleCounts[author] == topArticleCount
  );

  delete authorRatingsToReset[author];
}
```

becomes

```javascript
for (var author in articleCounts) {
  scope.authorRatings[author] = ratingsCtrl ? 
    ratingsCtrl.getAuthorRating(author) : 
    new AuthorRating();
  scope.authorRatings[author].updateCategory(
    scope.title, 
    articleCounts[author] == topArticleCount
  );

  delete authorRatingsToReset[author];
}
```    

and

```javascript
ratingsCtrl.updateGrouping();
```    

becomes

```javascript
ratingsCtrl && ratingsCtrl.updateGrouping();
```    

This flexibility allows the following markup usage in `index.html`:

```html
<author-ratings class="column" title="JavaScript">
  <article-count title="ES6" 
    articles="categories['ES6'].articles"></article-count>
  <article-count title="NG" 
    articles="categories['AngularJS'].articles"></article-count>
  <article-count title="React" 
    articles="categories['React'].articles"></article-count> 
</author-ratings>

<author-ratings class="column" title="Frameworks">
  <article-count title="NG" 
    articles="categories['AngularJS'].articles"></article-count>
  <article-count title="React" 
    articles="categories['React'].articles"></article-count> 
</author-ratings>

<div class="column">
  <article-count title="NG Only" 
    articles="categories['AngularJS'].articles"></article-count>
</div>
```    

# Conclusion

I introduced this post by stating that as developers we want directives to be decoupled yet still able to communicate. We then explored using a parent directive to facilitate communication between sibling children directives. We've also seen that extracting models can help to modularise our code and keep our views readable. If you have any comments, good, bad or constructive, I would love to hear them, either below or on [Twitter][5].

Below is a demonstration of the fully working example:

![Demonstration][7]

Lastly, if you want to see an example of parent and sibling children directives in the wild, check out the [accordion][8] of the Angular UI bootstrap library.

 [1]: DirectiveCommunicationMockup1.png
 [2]: DirectiveCommunicationMockup2.png
 [3]: DirectiveCommunicationHighlight.png
 [4]: http://crudbetter.com/angularjs-checkbox-lists/
 [5]: http://twitter.com/crudbetter
 [7]: DirectiveCommunicationDemo.gif
 [8]: http://angular-ui.github.io/bootstrap/#/accordion
