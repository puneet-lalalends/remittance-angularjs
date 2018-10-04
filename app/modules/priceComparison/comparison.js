'use strict';
angular.module('myApp.priceComparison', ['ngRoute', 'myApp.config'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/priceComparison', {
            templateUrl: 'modules/priceComparison/currencyConverison.html',
            controller: 'PriceComparisonCtrl'
        });

        $routeProvider.when('/priceList/:reqParam', {
            templateUrl: 'modules/priceComparison/showPrice.html',
            controller: 'ShowPriceCtrl'
        });

        $routeProvider.when('/privacy', {
            templateUrl: 'modules/priceComparison/privacyPolicy.html',
            controller: 'StaticDateCtrl'
        });

        $routeProvider.when('/terms', {
            templateUrl: 'modules/priceComparison/terms.html',
            controller: 'StaticDateCtrl'
        });

        $routeProvider.when('/faq', {
            templateUrl: 'modules/priceComparison/faq.html',
            controller: 'StaticDateCtrl'
        });

    }])

    .controller('PriceComparisonCtrl', ['GENERAL_CONFIG', 'PriceComparisonService', '$scope', '$location', '$routeParams', function (GENERAL_CONFIG, PriceComparisonService, $scope, $location, $routeParams) {

        $scope.pageData = {srcCountry: "", desCountry: "", srcCurrency: "", destCurrency: "", amountSend: 300};

        $scope.pageData.srcCountry = {"countryName": "United States", "countryCode": "US", "countryCurrency": "USD"};
        $scope.pageData.desCountry = {"countryName": "India", "countryCode": "IN", "countryCurrency": "INR"};

        $scope.comparePrice = function () {

            $scope.pageData.srcCurrency = $scope.pageData.srcCountry.countryCurrency;
            $scope.pageData.destCurrency = $scope.pageData.desCountry.countryCurrency;
            $location.path("/priceList/" + JSON.stringify($scope.pageData));
        };

    }]).controller('ShowPriceCtrl', ['GENERAL_CONFIG', 'PriceComparisonService', '$scope', '$location', '$routeParams', function (GENERAL_CONFIG, PriceComparisonService, $scope, $location, $routeParams) {

    $scope.showPricepageData = {providerList: [], currentPrice: "",showLoader:false};

    $scope.comparePriceFromPriceList = function () {

        var providerList = $scope.showPricepageData.providerList;
        var currentPrice = $scope.showPricepageData.currentPrice;

        $scope.showPricepageData.srcCurrency = $scope.showPricepageData.srcCountry.countryCurrency;
        $scope.showPricepageData.destCurrency = $scope.showPricepageData.desCountry.countryCurrency;

        delete $scope.showPricepageData.providerList;
        delete $scope.showPricepageData.currentPrice;

        $location.path("/priceList/" + JSON.stringify($scope.showPricepageData));

        $scope.showPricepageData.providerList = providerList;
        $scope.showPricepageData.currentPrice = currentPrice;
    };

    $scope.fetchProviders = function (dataParam) {

        $scope.showPricepageData.showLoader = true;

        var promise = PriceComparisonService.fetchProvidesFunc(dataParam);
        promise.then(
            function (answer) {
                $scope.showPricepageData.providerList = answer.payload;
                $scope.showPricepageData.showLoader = false;
            },
            function (error) {
            },
            function (progress) {
            });
    };

    $scope.fetchCurrentPrice = function (dataParam) {

        $scope.showPricepageData.showLoader = true;

        var promise = PriceComparisonService.fetchCurrentPriceFunc(dataParam);
        promise.then(
            function (answer) {
                $scope.showPricepageData.currentPrice = answer.payload.currencyRate;
                $scope.showPricepageData.showLoader = false;
            },
            function (error) {
            },
            function (progress) {
            });
    };

    if ($routeParams.reqParam) {

        $scope.showPricepageData = $.extend($scope.showPricepageData, JSON.parse($routeParams.reqParam));
        var dataParamForProviders = {
            "sendingAmount": $scope.showPricepageData.amountSend + "",
            "sourceCountryCode": $scope.showPricepageData.srcCountry.countryCode,
            "targetCountryCode": $scope.showPricepageData.desCountry.countryCode,
            "sourceCountryCurrency": $scope.showPricepageData.srcCountry.countryCurrency,
            "targetCountryCurrency": $scope.showPricepageData.desCountry.countryCurrency
        };
        $scope.fetchProviders(dataParamForProviders);

        var dataParamForCurrentPrice = {
            "sourceCountryCurrency": $scope.showPricepageData.srcCountry.countryCurrency,
            "targetCountryCurrency": $scope.showPricepageData.desCountry.countryCurrency
        };

        $scope.fetchCurrentPrice(dataParamForCurrentPrice);
    }
}]).controller('StaticDateCtrl', ['GENERAL_CONFIG', '$scope', '$location','$anchorScroll', function (GENERAL_CONFIG, $scope, $location,$anchorScroll) {

    document.documentElement.scrollTop = 0;

    $scope.gotoAboutUS = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('about');
        // call $anchorScroll()
        $anchorScroll();
    };

    $scope.gotoWhoWeAre = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('how_it_work');
        // call $anchorScroll()
        $anchorScroll();
    };

    $scope.faq = function () {
        $location.path("/faq");
    };

    $scope.privacyPolicy = function () {
        $location.path("/privacy");
    };

    $scope.termsAndCondition = function () {
        $location.path("/terms");
    };

    $scope.logo = function () {
        $location.path("/priceComparison");
    };

    /*$scope.changeTab = function(){
            // if the one you clicked is open,
            if ($(this).find('p').hasClass('open')) {
                // then close it.
                $('.hideSeekTab .open').slideToggle().removeClass('open');
                $('.iconBox').removeClass('closed');
                // otherwise,
            } else {
                // close all tabs,
                $('.hideSeekTab .open').slideToggle().removeClass('open');
                // and open the one you clicked
                $('.iconBox').removeClass('closed');
                $(this).find('p').slideToggle().addClass('open');
                $(this).find('.iconBox').addClass('closed');
            }
    };
    */

    angular.element(document).ready(function () {
        $(function() {
            // when a tab is clicked
            $('.hideSeekTab').on('click', function() {
                // if the one you clicked is open,
                if ($(this).find('p').hasClass('open')) {
                    // then close it.
                    $('.hideSeekTab .open').slideToggle().removeClass('open');
                    $('.iconBox').removeClass('closed');
                    // otherwise,
                } else {
                    // close all tabs,
                    $('.hideSeekTab .open').slideToggle().removeClass('open');
                    // and open the one you clicked
                    $(this).find('p').slideToggle().addClass('open');
                    $('.iconBox').removeClass('closed');
                    $(this).find('.iconBox').addClass('closed');
                }
            });
        });
    });

}])
    .service('PriceComparisonService', ['GENERAL_CONFIG', '$http', '$q','$location', function (GENERAL_CONFIG, $http, $q,$location) {

        this.fetchProvidesFunc = function (dataParam) {

            var url = GENERAL_CONFIG.REMITTANCE_URL + "calculateRemittance/fetch";
            var data = dataParam;
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function (payload) {
                    deferred.resolve({payload: payload.data});
                }, function (errorPayload) {
                    deferred.resolve({errorPayload: errorPayload.data});
                });

            return deferred.promise;
        };

        this.fetchCurrentPriceFunc = function (dataParam) {

            var url = GENERAL_CONFIG.REMITTANCE_URL + "currencyConversion/fetch";
            var data = dataParam;
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function (payload) {
                    deferred.resolve({payload: payload.data});
                }, function (errorPayload) {
                    deferred.resolve({errorPayload: errorPayload.data});
                });

            return deferred.promise;
        };

    }]).filter('getDays', function () {

    return function (input) {

        var transferDate = new Date(input);
        var currentDate = new Date();

        return Math.trunc((transferDate - currentDate) / 1000 / 60 / 60 / 24);
    };
}).filter('whatIsSent', function () {

    return function (amountSend, transferFees) {

        return parseFloat(amountSend) - parseFloat(transferFees);
    };
});

