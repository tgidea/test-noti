importScripts("https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js")

const firebaseConfig = {
    apiKey: "AIzaSyDKGsoV344Ximd8NBJhilNOUp5rg8WVhYY",
    authDomain: "notification-167c9.firebaseapp.com",
    projectId: "notification-167c9",
    storageBucket: "notification-167c9.appspot.com",
    messagingSenderId: "835809630294",
    appId: "1:835809630294:web:3e9b2b8e0f66a4225843f7",
    measurementId: "G-GMM91N2NXG",
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();