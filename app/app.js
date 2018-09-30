'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.priceComparison',
    'myApp.config',
    'myApp.version',
    'ui.select',
    'ngSanitize',
    'ui.select2',
    'rt.select2'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');

    angular.element(document).ready(function () {
        $(".my-select").chosen();
    });

    $routeProvider.otherwise({redirectTo: '/priceComparison'});
}]).run(['GENERAL_CONFIG', '$rootScope','$http','$q', function(GENERAL_CONFIG,$rootScope,$http,$q) {

    $rootScope.globalData = {countryList:[]};

    var url = GENERAL_CONFIG.REMITTANCE_URL + "countryDetails/retrieveAll";
    var data = {};
    var config = {headers: {}};

    var deferred = $q.defer();
    var promise = $http.post(url, data, config);
    promise.then(
        function (payload) {
            deferred.resolve({payload: payload.data});
            $rootScope.globalData.countryList = payload.data;
        }, function (errorPayload) {
            deferred.resolve({errorPayload: errorPayload.data});
        });

}]);