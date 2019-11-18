// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not want to serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
/*
importScripts('/__/firebase/6.0.2/firebase-app.js');
importScripts('/__/firebase/6.0.2/firebase-messaging.js');
importScripts('/__/firebase/init.js');

firebase.messaging();
*/

importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '865199574649'
/*   messagingSenderId: "865199574649",*/
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

/*
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});

*/
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});