/* eslint-env serviceworker */
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC3hjT-m5uDbdyyFVxvwG1HDMznK4ck1B4',
  authDomain: 'docto-7be85.firebaseapp.com',
  projectId: 'docto-7be85',
  storageBucket: 'docto-7be85.firebasestorage.app',
  messagingSenderId: '740021590634',
  appId: '1:740021590634:web:bc7612da37ff1ee4c30813',
  measurementId: 'G-KKQ5Q7DSM0',
});

const messaging = firebase.messaging();

/**
 * 알림 표시 (백그라운드 메세지 및 메인 스레드 요청 공용)
 */
const displayNotification = (payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || '새로운 알림';
  const notificationBody =
    payload.notification?.body || payload.data?.body || '알림이 도착했습니다.';
  const notificationData = payload.data;

  const notificationOptions = {
    body: notificationBody,
    icon: '/logo-icon.png',
    data: notificationData,
    actions: [],
  };

  // 백엔드에서 'aciton' 필드를 'TAKE_MEDICATION'으로 보낸 경우 '복용 완료' 버튼 추가
  if (notificationData && notificationData.action === 'TAKE_MEDICATION') {
    notificationOptions.actions.push({
      action: 'take_medication',
      title: '복용 완료',
      icon: '/check-icon.png',
    });
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
};

// 백그라운드 메세지 수신 처리
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  displayNotification(payload);
});

/**
 * 메인 스레드로부터 메세지 수신 처리 (포그라운드 알림 요청)
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] 메인 스레드로부터 메세지 수신: ', event.data);
  if (event.data && event.data.type === 'DISPLAY_NOTIFICATION' && event.data.payload) {
    displayNotification(event.data.payload);
  }
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  const notificationData = event.notification.data;
  console.log('[Service Worker] 알림 클릭, 데이터: ', notificationData);
  console.log('[Service Worker] 클릭된 액션: ', event.action);

  // '복용 완료' 버튼 클릭 시
  if (event.action === 'take_medication') {
    console.log('복용 완료 버튼 클릭됨');

    const medicationId = notificationData.referenceId;
    const medicationAlertTimeId = notificationData.medicationAlertTimeId;

    if (medicationId && medicationAlertTimeId) {
      // 백엔드 API 호출
      const API_URL = `${self.location.origin}/api/v1/medications/${medicationId}/taken`;

      const requestBody = {
        medicationAlertTimeId: parseInt(medicationAlertTimeId, 10),
        completedAt: new Date().toISOString(),
      };

      console.log(requestBody.completedAt);

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.ok) {
            console.log('복용 완료 API 호출 성공');
            self.registration.showNotification('복용 완료', {
              body: `${notificationData.medicationName} 복용이 완료되었습니다.`,
              icon: '/check-icon.png',
            });
            event.notification.close(); // 알림 닫기
          } else {
            console.error('복용 완료 API 호출 실패: ', response.statusText);
          }
        })
        .catch((error) => {
          console.error('복용 완료 API 호출 중 오류 발생: ', error);
        });
    } else {
      console.warn('복용 완료 처리에 필요한 데이터가 부족합니다.');
    }
  } else {
    const rootUrl = new URL('/', self.location.origin).href;
    event.waitUtil(clients.openWindow(rootUrl));
  }
});
