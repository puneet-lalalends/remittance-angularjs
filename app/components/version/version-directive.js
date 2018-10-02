'use strict';

angular.module('myApp.version.version-directive', [])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9.]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}).directive('hideon', function ($location) {
    return {
        transclude: true,
        restrict: 'A',
        link: function (scope, element, attrs) {

            if ($location.path() !== "/priceComparison") {
                element.hide();
            } else {
                element.show();
            }
        }
    };
});
