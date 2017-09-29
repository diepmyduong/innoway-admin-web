// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyCV7iiP9I8axVH3zT1AzltHlvcDWYoOySs",
  authDomain: "dashboard-version-2-0.firebaseapp.com",
  databaseURL: "https://dashboard-version-2-0.firebaseio.com",
  projectId: "dashboard-version-2-0",
  storageBucket: "dashboard-version-2-0.appspot.com",
  messagingSenderId: "16906134069"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received message ', payload);
  // Customize notification here
  let notificationTitle = payload.data.notification_title;
  
  try {
    payload.data.notification_options = JSON.parse(payload.data.notification_options);
  }catch(err){
    payload.data.notification_options = null
  }
  let notificationOptions = payload.data.notification_options
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      windowClient.postMessage(payload);
    }
  })
  .then(() => {
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  return promiseChain;
});