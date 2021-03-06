/**
 * Created by User on 23.02.2015.
 */



appModule.controller('chatController', ['$scope', '$rootScope', '$state',
    '$stateParams', 'MockService', '$ionicActionSheet',
    '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval', 'chatService', 'parseService',
    function ($scope, $rootScope, $state, $stateParams, MockService,
              $ionicActionSheet,
              $ionicPopup, $ionicScrollDelegate, $timeout, $interval, chatService, parseService) {

        $scope.toUser = {
            _id: $rootScope.toAllUser.id,
            pic: $rootScope.toAllUser.get("pic"),
            username: $rootScope.toAllUser.get('username')
        }

        // this could be on $rootScope rather than in $stateParams
        $scope.user = {
            _id: $rootScope.user.id,
            pic: $rootScope.user.get("pic"),
            username: $rootScope.user.get('username')
        };

        $scope.input = {
            message: localStorage['userMessage-' + $scope.toUser._id] || ''
        };

        var messageCheckTimer;

        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput; // ^^^

        $scope.$on('$ionicView.enter', function () {
            console.log('UserMessages $ionicView.enter');

            getMessages();

            $timeout(function () {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);

            messageCheckTimer = $interval(function () {
                getMessages();
                console.log("update message")
            }, 10000);
        });

        $scope.$on('$ionicView.leave', function () {
            console.log('leaving UserMessages view, destroying interval');
            // Make sure that the interval is destroyed
            if (angular.isDefined(messageCheckTimer)) {
                $interval.cancel(messageCheckTimer);
                messageCheckTimer = undefined;
            }
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            if (!$scope.input.message || $scope.input.message === '') {
                localStorage.removeItem('userMessage-' + $scope.toUser._id);
            }
        });

        function getMessages() {
            // the service is mock but you would probably pass the toUser's GUID here
            parseService.getUserMessages222({
                toUserId: $scope.toUser._id
            }).then(function (data) {
                $scope.doneLoading = true;
                $scope.messages = data;

                $timeout(function () {
                    viewScroll.scrollBottom();
                }, 0);
            });
        }

        $scope.$watch('input.message', function (newValue, oldValue) {
            console.log('input.message $watch, newValue ' + newValue);
            if (!newValue) newValue = '';
            localStorage['userMessage-' + $scope.toUser._id] = newValue;
        });

        $scope.sendMessage = function (sendMessageForm) {
            var message = new parseService.ChatMessages();
            /*   var message = {
             toId: $scope.toUser._id,
             text: $scope.input.message
             };*/
            message.set('toId', $scope.toUser._id);
            message.set('text', $scope.input.message);


            // if you do a web service call this will be needed as well as before the viewScroll calls
            // you can't see the effect of this in the browser it needs to be used on a real device
            // for some reason the one time blur event is not firing in the browser but does on devices
            keepKeyboardOpen();


            $scope.input.message = '';
            message.set('messageId', new Date().getTime().toString());
            //message._id = new Date().getTime(); // :~)

            //message.date = new Date();
            message.set('date', new Date());

            //message.username = $scope.user.username;
            message.set('username', $scope.user.username);

            // message.userId = $scope.user._id;
            message.set('userId', $scope.user._id);

            //message.pic = $scope.user.picture;
            message.set('picMess', $scope.user.pic);

            parseService.sendToParse(message);
            chatService.sendPush(message);
            $scope.messages.push(message);

            $timeout(function () {
                keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);

            /* $timeout(function () {
             $scope.messages.push(MockService.getMockMessage());
             keepKeyboardOpen();
             viewScroll.scrollBottom(true);
             }, 2000);
             */
            //});
        };

        // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
        function keepKeyboardOpen() {
            console.log('keepKeyboardOpen');
            txtInput.one('blur', function () {
                console.log('textarea blur, focus back on it');
                txtInput[0].focus();
            });
        }

        $scope.onMessageHold = function (e, itemIndex, message) {
            console.log('onMessageHold');
            console.log('message: ' + JSON.stringify(message, null, 2));
            $ionicActionSheet.show({
                buttons: [{
                    text: 'Copy Text'
                }, {
                    text: 'Delete Message'
                }],
                buttonClicked: function (index) {
                    switch (index) {
                        case 0: // Copy Text
                            cordova.plugins.clipboard.copy(message.text);

                            break;
                        case 1: // Delete
                            // no server side secrets here :~)
                            $scope.messages.splice(itemIndex, 1);
                            $timeout(function () {
                                viewScroll.resize();
                            }, 0);

                            break;
                    }

                    return true;
                }
            });
        };

        // this prob seems weird here but I have reasons for this in my app, secret!
        $scope.viewProfile = function (msg) {
            if (msg.get('userId') === $scope.user._id) {
                $state.go('app.home');
            } else {
                $scope.show(msg)
            }
        };

        $scope.show = function (msg) {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Start private chat'},
                    {text: 'Find on map'}
                ],
                destructiveText: 'Delete',
                titleText: '<b>' + msg.get("username") + '</b>',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $state.go('app.chat');
                    }
                    if (index == 1) {
                        $state.go('app.map');
                    }
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function () {
                hideSheet();
            }, 5000);

        };



        // I emit this event from the monospaced.elastic directive, read line 480
        $scope.$on('taResize', function (e, ta) {
            console.log('taResize');
            if (!ta) return;

            var taHeight = ta[0].offsetHeight;
            console.log('taHeight: ' + taHeight);

            if (!footerBar) return;

            var newFooterHeight = taHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

            footerBar.style.height = newFooterHeight + 'px';
            scroller.style.bottom = newFooterHeight + 'px';
        });

    }])

// services
    .factory('MockService', ['$http', '$q',
        function ($http, $q) {
            var me = {};

            me.getUserMessages = function (d) {
                /*
                 var endpoint =
                 'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
                 return $http.jsonp(endpoint).then(function(response) {
                 return response.data;
                 }, function(err) {
                 console.log('get user messages error, err: ' + JSON.stringify(
                 err, null, 2));
                 });
                 */
                var deferred = $q.defer();

                setTimeout(function () {
                    deferred.resolve(getMockMessages());
                }, 1500);

                return deferred.promise;
            };

            me.getMockMessage = function () {
                return {
                    userId: '534b8e5aaa5e7afc1b23e69b',
                    date: new Date(),
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                };
            }

            return me;
        }
    ])

// fitlers
    .filter('nl2br', ['$filter',
        function ($filter) {
            return function (data) {
                if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
            };
        }
    ])

// directives
    .directive('autolinker', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    $timeout(function () {
                        var eleHtml = element.html();

                        if (eleHtml === '') {
                            return false;
                        }

                        var text = Autolinker.link(eleHtml, {
                            className: 'autolinker',
                            newWindow: false
                        });

                        element.html(text);

                        var autolinks = element[0].getElementsByClassName('autolinker');

                        for (var i = 0; i < autolinks.length; i++) {
                            angular.element(autolinks[i]).bind('click', function (e) {
                                var href = e.target.href;
                                console.log('autolinkClick, href: ' + href);

                                if (href) {
                                    //window.open(href, '_system');
                                    window.open(href, '_blank');
                                }

                                e.preventDefault();
                                return false;
                            });
                        }
                    }, 0);
                }
            }
        }
    ])

function onProfilePicError(ele) {
    this.ele.src = ''; // set a fallback
}

function getMockMessages() {
    return {
        "messages": [{
            "_id": "535d625f898df4e80e2a125e",
            "text": "Ionic has changed the game for hybrid app development.",
            "userId": "534b8fb2aa5e7afc1b23e69c",
            "date": "2014-04-27T20:02:39.082Z",
            "read": true,
            "readDate": "2014-12-01T06:27:37.944Z"
        }, {
            "_id": "535f13ffee3b2a68112b9fc0",
            "text": "I like Ionic better than ice cream!",
            "userId": "534b8e5aaa5e7afc1b23e69b",
            "date": "2014-04-29T02:52:47.706Z",
            "read": true,
            "readDate": "2014-12-01T06:27:37.944Z"
        }, {
            "_id": "546a5843fd4c5d581efa263a",
            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "userId": "534b8fb2aa5e7afc1b23e69c",
            "date": "2014-11-17T20:19:15.289Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.328Z"
        }, {
            "_id": "54764399ab43d1d4113abfd1",
            "text": "Am I dreaming?",
            "userId": "534b8e5aaa5e7afc1b23e69b",
            "date": "2014-11-26T21:18:17.591Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.337Z"
        }, {
            "_id": "547643aeab43d1d4113abfd2",
            "text": "Is this magic?",
            "userId": "534b8fb2aa5e7afc1b23e69c",
            "date": "2014-11-26T21:18:38.549Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.338Z"
        }, {
            "_id": "547815dbab43d1d4113abfef",
            "text": "Gee wiz, this is something special.",
            "userId": "534b8e5aaa5e7afc1b23e69b",
            "date": "2014-11-28T06:27:40.001Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.338Z"
        }, {
            "_id": "54781c69ab43d1d4113abff0",
            "text": "I think I like Ionic more than I like ice cream!",
            "userId": "534b8fb2aa5e7afc1b23e69c",
            "date": "2014-11-28T06:55:37.350Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.338Z"
        }, {
            "_id": "54781ca4ab43d1d4113abff1",
            "text": "Yea, it's pretty sweet",
            "userId": "534b8e5aaa5e7afc1b23e69b",
            "date": "2014-11-28T06:56:36.472Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.338Z"
        }, {
            "_id": "5478df86ab43d1d4113abff4",
            "text": "Wow, this is really something huh?",
            "userId": "534b8fb2aa5e7afc1b23e69c",
            "date": "2014-11-28T20:48:06.572Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.339Z"
        }, {
            "_id": "54781ca4ab43d1d4113abff1",
            "text": "Create amazing apps - ionicframework.com",
            "userId": "534b8e5aaa5e7afc1b23e69b",
            "date": "2014-11-29T06:56:36.472Z",
            "read": true,
            "readDate": "2014-12-01T06:27:38.338Z"
        }], "unread": 0
    };
}

// configure moment relative time
moment.locale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});