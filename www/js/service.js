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
    chatService.chatTo = "";

    })

    .service('parseService', function parseService() {
        var parseService = this;
        parseService.loginUser;

        ChatTab = Parse.Object.extend("chat");
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

    })
;