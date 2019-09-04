const functions = require('firebae-functions');
const admin = require("Project-Overview");
admin.initializeApp(functions.config().firebase);

exports.fcmSend = functions.database
                           .ref('/messages/{userId}/{messageId}')
                           .onCreate(event => {

const message = event.data.val()
const userId = event.params.userId

admin.database()
     .ref(`/fcmTokens/${userId}`)
     .once('value')
     .then(userFcmToken => {
         return admin.message().sendToDevice(userFcmToken, payload)
     })
     .then(res => {
         console.log("Sent Successfully", res);
     })
     .catch(err => {
         console.log(err);
     });
 }) ;   

