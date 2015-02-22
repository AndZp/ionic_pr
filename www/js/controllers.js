angular.module('ionicParseApp.controllers', [])

.controller('AppController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };
})

.controller('WelcomeController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.login = function() {
        $state.go('app.login');
    };

    $scope.signUp = function() {
        $state.go('app.register');
    };

    if ($rootScope.isLoggedIn) {
        $state.go('app.home');
    }
})

.controller('HomeController', function($scope, $state, $rootScope, geoPoints, chatService) {

    if (!$rootScope.isLoggedIn) {
        $state.go('welcome');
    }
       GeoObject = Parse.Object.extend("User");

        $scope.query = function ()
        {
            var query = new Parse.Query(GeoObject);
            //query.equalTo("name", "Hello");
            query.find({
                success: function(results) {
                    console.log("RECEIVED " + results.length + " results");
                    $scope.results = results;
                    $scope.$digest();
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                    }
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        $scope.findOnMap = function (fUser) {
            geoPoints.arrUsers.push(fUser);
            $state.go('app.map');

        };
        $scope.openChat = function(chatTo) {
            chatService.chatTo = chatTo;
            $state.go('app.prchat');

        }
})


    .controller('MapController', function ($scope, $ionicLoading, geoPoints) {

        $scope.mapCreated = function(map) {
            $scope.map = map;
            var arrUsers = geoPoints.arrUsers;
            if (arrUsers.length>0) {
                var mLocation = new google.maps.LatLng(arrUsers[0].get('location')._latitude, arrUsers[0].get('location')._longitude)
                $scope.map.setCenter(mLocation);
               for (currUser in arrUsers){
                   var mLocation = new google.maps.Marker({
                       position: new google.maps.LatLng( arrUsers[currUser].get('location')._latitude, arrUsers[currUser].get('location')._longitude),
                       map:  $scope.map,
                       title: arrUsers[currUser].get('username')
                   });
               }

            }
        };

        $scope.centerOnMe = function () {
            console.log("Centering")
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                var myLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                    map:  $scope.map,
                    title: "My Location"
                });
                $scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };


    })

.controller('LoginController', function($scope, $state, $rootScope, $ionicLoading, $ionicViewService) {
    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, err) {
                $ionicLoading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Invalid login credentials';
                } else {
                    $scope.error.message = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('app.forgot');
    };
})

.controller('ForgotPasswordController', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };
})

.controller('RegisterController', function($scope, $state, $ionicLoading, $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {

        // TODO: add age verification step

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})





.controller('MainController', function($scope, $state, $rootScope, $stateParams, $ionicHistory) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
    }

    $scope.rightButtons = [{
        type: 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {
            $scope.sideMenuController.toggleRight();
        }
    }];

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };

    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleRight();
    };


})
    .controller('PrchatController', ['$scope', '$timeout', '$ionicFrostedDelegate', '$ionicScrollDelegate', '$rootScope', 'chatService', 'parseService', function ($scope, $timeout, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope, chatService, parseService) {
        $scope.chatTo = chatService.chatTo;
        $scope.messageText = "";
        var messageOptions = [
            {content: '<p>Wow, this is really something huh?</p>'}

        ];

        var messageIter = 0;
        $scope.messages = messageOptions.slice(0, messageOptions.length);

        $scope.add = function() {
            Parse.Push.send({
                channels: ["TestC1"],
                data: {
                    alert: ("Test mess + ")
                }
            }, {
                success: function () {
                    alert("push was send")
                },
                error: function (error) {
                    ("push error" + error)
                }
            });



            var nextMessage = messageOptions[messageIter++ % messageOptions.length];
            $scope.messages.push(angular.extend({}, nextMessage));

            // Update the scroll area and tell the frosted glass to redraw itself
            var messageChatParse = new ChatTab();
            messageChatParse.set("fromUser", $rootScope.user);
            messageChatParse.set("toUser", chatService.chatTo);
            messageChatParse.set("message", $scope.messageText);
            messageChatParse.set("read", false);

            parseService.sendToParse(messageChatParse);


            $scope.messageText = "";

            $ionicScrollDelegate.resize();
            $ionicFrostedDelegate.update();

            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 1);
        };


    }])

    .controller('ChatController', ['$scope', '$timeout', '$ionicFrostedDelegate', '$ionicScrollDelegate', '$rootScope', 'chatService', 'parseService', function ($scope, $timeout, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope, chatService, parseService) {
        $scope.chatTo = chatService.chatTo;
        $scope.messageText = "";
        var messageOptions = [
            {content: '<p>Wow, this is really something huh?</p>'}

        ];

        var messageIter = 0;
        $scope.messages = messageOptions.slice(0, messageOptions.length);

        $scope.add = function () {

            var nextMessage = messageOptions[messageIter++ % messageOptions.length];
            $scope.messages.push(angular.extend({}, nextMessage));

            // Update the scroll area and tell the frosted glass to redraw itself
            var messageChatParse = new ChatTab();
            messageChatParse.set("fromUser", $rootScope.user);
            messageChatParse.set("toUser", chatService.chatTo);
            messageChatParse.set("message", $scope.messageText);
            messageChatParse.set("read", false);

            parseService.sendToParse(messageChatParse);


            $scope.messageText = "";

            $ionicScrollDelegate.resize();
            $ionicFrostedDelegate.update();

            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 1);
        };




    }]);

