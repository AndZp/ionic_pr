/**
 * Created by User on 16.02.2015.
 */
angular.module('ionicParseApp.service', [])
    .service('geoPoints', function Geopoints() {
        var geopoints = this;
        geopoints.arrUsers = [];

    })
    .service('chatService', function chatService() {

        var chatService = this;
        chatService.UserTab = Parse.Object.extend("User");
        chatService.chatTo = "";
        chatService.toAllUser = "";

        chatService.sendPush = function (message) {
            Parse.Push.send({
                channels: ["TestC1"],
                data: {
                    alert: ('New message from ' + message.get('username'))
                }
            }, {
                success: function () {
                    alert("push was send")
                },
                error: function (error) {
                    ("push error" + error)
                }
            });
        }

    })

    .service('parseService', function parseService(chatService, $rootScope, $q) {
        var parseService = this;
        parseService.loginUser = "";
        parseService.ChatMessages = Parse.Object.extend("ChatMessages");
        parseService.ChatTab = Parse.Object.extend("chat");
        parseService.sendToParse = function (messageChatParse) {

            messageChatParse.save(null, {
                success: function (messageChatParse) {
                    // Execute any logic that should take place after the object is saved.
                    console.log('New object created with objectId: ' + messageChatParse.id);
                    //$scope.id =  messageChatParse.id;

                },
                error: function (messageChatParse, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });

        };


        parseService.getUserMessages = function (d) {
            /*
             var deferred = $q.defer();

             setTimeout(function() {
             deferred.resolve(parseService.getMessFromParse());
             }, 1500);

             return deferred.promise;*/
            var deferred = $q.defer();
            var query1 = new Parse.Query(parseService.ChatTab);
            query1.equalTo("fromUser", $rootScope.user);
            var query2 = new Parse.Query(parseService.ChatTab);
            query2.equalTo("toUser", $rootScope.user);
            var query3 = new Parse.Query(parseService.ChatTab);
            query3.equalTo("toUser", $rootScope.toAllUser);
            var query = new Parse.Query.or(query1, query2, query3);
            query.find({
                success: function (results) {
                    console.log("RECEIVED " + results.length + " chat messages");
                    chatService.arrMessParseChat = results;
                    deferred.resolve(results);

                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        parseService.getUserMessages222 = function (d) {
            /*
             var deferred = $q.defer();

             setTimeout(function() {
             deferred.resolve(parseService.getMessFromParse());
             }, 1500);

             return deferred.promise;*/
            var deferred = $q.defer();
            var query1 = new Parse.Query(parseService.ChatMessages);
            query1.equalTo("userId", $rootScope.user.id);
            var query2 = new Parse.Query(parseService.ChatMessages);
            query2.equalTo("toId", $rootScope.user.id);
            var query3 = new Parse.Query(parseService.ChatMessages);
            query3.equalTo("toId", $rootScope.toAllUser.id);
            var query = new Parse.Query.or(query1, query2, query3);
            query.find({
                success: function (results) {
                    console.log("RECEIVED " + results.length + " chat messages");
                    chatService.arrMessParseChat = results;
                    deferred.resolve(results);

                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                    deferred.reject();
                }
            });
            return deferred.promise;
        };



        parseService.getMessFromParse = function () {


            var query1 = new Parse.Query(parseService.ChatTab);
            query1.equalTo("fromUser", $rootScope.user);
            var query2 = new Parse.Query(parseService.ChatTab);
            query2.equalTo("toUser", $rootScope.user);
            var query3 = new Parse.Query(parseService.ChatTab);
            query3.equalTo("toUser", $rootScope.toAllUser);
            var query = new Parse.Query.or(query1, query2, query3);
            query.find({
                success: function (results) {
                    console.log("RECEIVED " + results.length + " chat messages");
                    chatService.arrMessParseChat = results;
                    return results;

                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }


    })
;