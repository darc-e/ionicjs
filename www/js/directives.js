angular.module('starter.directives', [])

.directive('stockList', ['$compile', function($compile) {
  return {
    restrict: 'A',
    templateUrl: 'templates/partials/stock-list.html'
  };
}]);
// .directive('stockList', ['$compile', function($compile) {
//     var currentTemplate = {
//       market:'Markets',
//       account:'Accounts'
//     };
//     function link (scope, element, attrs) {
//       alert(attrs.stockList);
//       element.html(currentTemplate[attrs.stockList]).show();
//       $compile(element.contents())(scope);
//     }
//   return {
//     restrict: 'A',
//     link: link
//   };
// }]);