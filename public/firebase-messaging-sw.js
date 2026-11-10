/* Firebase Cloud Messaging service worker for web push. Config values are public identifiers, not secrets. */
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC5sTUEZSEvRdMaVm9JuxsXDWhR0-E1fjA",
  authDomain: "paartha.firebaseapp.com",
  projectId: "paartha",
  appId: "1:1088270011688:web:83b737496c2dd5882d541d",
  messagingSenderId: "1088270011688",
});

const messaging = firebase.messaging();

// Messages with a `notification` payload are shown by the browser automatically.
// Data-only messages are shown here.
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || "Paartha", {
    body: d.body || "",
    icon: "/og_image.png",
    data: { url: d.url || "/" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || (event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.data && event.notification.data.FCM_MSG.data.url) || "/";
  event.waitUntil(self.clients.openWindow(url));
});
