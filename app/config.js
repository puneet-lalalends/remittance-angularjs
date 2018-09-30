'use strict';

var config_module = angular.module('myApp.config', []);

var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'REMITTANCE',
        'APP_VERSION': '0.1',
        'REMITTANCE_URL': 'http://localhost:8080/'
    }
};

angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});