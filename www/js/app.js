// Ionic Parse Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ionicParseApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ionicParseApp.controllers' is found in controllers.js
var appModule = angular.module('ionicParseApp',
    ['ionic', 'ionicParseApp.controllers', 'starter.directives', 'ionicParseApp.service', 'ngCordova', 'ionic.contrib.frostedGlass', 'monospaced.elastic', 'angularMoment']
    )
    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js



        $stateProvider

            // setup an abstract state for the tabs directive
            .state('welcome', {
                url: '/welcome?clear',
                templateUrl: 'templates/welcome.html',
                controller: 'WelcomeController'
            })

            .state('app', {
                url: '/app?clear',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppController'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeController'
                    }
                }
            })

            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapController'
                    }
                }
            })
            .state('app.prchat', {
                url: '/prchat',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/prchat.html',
                        controller: 'PrchatController'
                    }
                }
            })

            .state('app.chat', {
                url: '/chat',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'chatController'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('app.forgot', {
                url: '/forgot',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forgotPassword.html',
                        controller: 'ForgotPasswordController'
                    }
                }
            })

            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/welcome');
    })
    .run(function ($state, $rootScope, $ionicPlatform, $cordovaPush) {
        Parse.initialize('Bfj14OIaEOk24wtKloARGLo7qJ1OXCDQgWsrkTua', 'jECcTVwgitUjji6rFEnhwBYTDdhNn5rNPfOXbNOw');

        var query = new Parse.Query(Parse.Object.extend("User"));

        query.equalTo("username", "all@admin.com");

        query.find({
            success: function (results) {

                $rootScope.toAllUser = results[0];

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });



        var currentUser = Parse.User.current();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;

        if (currentUser) {
            $rootScope.user = currentUser;
            $rootScope.isLoggedIn = true;
            $state.go('app.home');
        }
        $ionicPlatform.ready(function() {


            parsePlugin.initialize('Bfj14OIaEOk24wtKloARGLo7qJ1OXCDQgWsrkTua', 'TEpPTwzGz8V6kIBLxNhlRnWOgONobzdn1KPnb6NG', function () {

                parsePlugin.subscribe('TestC1', function () {

                    parsePlugin.getInstallationId(function (id) {


                        /* var install_data = {
                         installation_id: id,
                         channels: ['TestC1']
                         }*/


                    }, function (e) {
                        alert('error');
                    });

                }, function (e) {
                    alert('error');
                });

            }, function (e) {
                alert('error');
            });



        });
        var androidConfig = {
            "senderID": "replace_with_sender_id"
        };

        document.addEventListener("deviceready", function () {
            $cordovaPush.register(config).then(function (result) {
                // Success
            }, function (err) {
                // Error
            })

            $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                switch (notification.event) {
                    case 'registered':
                        if (notification.regid.length > 0) {
                            alert('registration ID = ' + notification.regid);
                        }
                        break;

                    case 'message':
                        // this is the actual push notification. its format depends on the data model from the push server
                        alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                        break;

                    case 'error':
                        alert('GCM error = ' + notification.msg);
                        break;

                    default:
                        alert('An unknown GCM event has occurred');
                        break;
                }
            });


            // WARNING: dangerous to unregister (results in loss of tokenID)
            $cordovaPush.unregister(options).then(function (result) {
                // Success!
            }, function (err) {
                // Error
            })

        }, false);

    });

