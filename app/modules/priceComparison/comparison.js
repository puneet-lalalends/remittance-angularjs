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

    $scope.showPricepageData = {providerList: [],currentPrice:""};

    $scope.comparePriceFromPriceList = function () {

        $scope.showPricepageData.srcCurrency = $scope.showPricepageData.srcCountry.countryCurrency;
        $scope.showPricepageData.destCurrency = $scope.showPricepageData.desCountry.countryCurrency;

        delete $scope.showPricepageData.providerList;
        delete $scope.showPricepageData.currentPrice;

        $location.path("/priceList/" + JSON.stringify($scope.showPricepageData));
    };

    $scope.fetchProviders = function (dataParam) {

        var promise = PriceComparisonService.fetchProvidesFunc(dataParam);
        promise.then(
            function (answer) {
                $scope.showPricepageData.providerList = answer.payload;
            },
            function (error) {
            },
            function (progress) {
            });
    };

    $scope.fetchCurrentPrice = function (dataParam) {

        var promise = PriceComparisonService.fetchCurrentPriceFunc(dataParam);
        promise.then(
            function (answer) {
                $scope.showPricepageData.currentPrice = answer.payload.currencyRate;
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

        var dataParamForCurrentPrice =  {
            "sourceCountryCurrency":$scope.showPricepageData.srcCountry.countryCurrency,
            "targetCountryCurrency":$scope.showPricepageData.desCountry.countryCurrency
        };

        $scope.fetchCurrentPrice(dataParamForCurrentPrice);
    }
}])

    .service('PriceComparisonService', ['GENERAL_CONFIG', '$http', '$q', function (GENERAL_CONFIG, $http, $q) {

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

    return function (amountSend,transferFees) {

        return parseFloat(amountSend) - parseFloat(transferFees);
    };
});

