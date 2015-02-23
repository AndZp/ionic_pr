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

    })

    .service('parseService', function parseService(chatService) {
        var parseService = this;
        parseService.loginUser = "";

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


        parseService.getMessFromParse = function () {


            var query1 = new Parse.Query(parseService.ChatTab);
            query1.equalTo("fromUser", parseService.loginUser);
            var query2 = new Parse.Query(parseService.ChatTab);
            query2.equalTo("toUser", parseService.loginUser);
            var query3 = new Parse.Query(parseService.ChatTab);
            query3.equalTo("toUser", chatService.toAllUser);
            var query = new Parse.Query.or(query1, query2, query3);
            query.find({
                success: function (results) {
                    console.log("RECEIVED " + results.length + " chat messages");
                    chatService.arrMessParseChat = results;

                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }


    })
;