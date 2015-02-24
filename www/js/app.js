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
    });

