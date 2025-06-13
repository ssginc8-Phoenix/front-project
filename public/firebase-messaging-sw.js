/* eslint-env serviceworker */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC3hjT-m5uDbdyyFVxvwG1HDMznK4ck1B4',
  projectId: 'docto-7be85',
  messagingSenderId: '740021590634',
  appId: '1:740021590634:web:bc7612da37ff1ee4c30813',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
