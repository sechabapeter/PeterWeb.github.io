import * as firebase from "firebase/app";
import "firebase/messaging";


const initializedFirebaseApp = firebase.initializeApp({
// Project Settings => Add Firebase to your web app
  messagingSenderId: "649002536133"
});
const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
// Project Settings => Cloud Messaging => Web Push certificates
  "BOQ_W1tDA-Y43tVj2gSsXYUTmPlNbNUU-DAkuIQ8TbFUDJHCW4vMCqf2r7FYNwV51iizAd-94VR2GlWrelqEsMA"
);
export { messaging };