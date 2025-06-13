import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';

/** Firebase 프로젝트 설정 정보 */
const firebaseConfig = {
  apiKey: 'AIzaSyC3hjT-m5uDbdyyFVxvwG1HDMznK4ck1B4',
  authDomain: 'docto-7be85.firebaseapp.com',
  projectId: 'docto-7be85',
  storageBucket: 'docto-7be85.firebasestorage.app',
  messagingSenderId: '740021590634',
  appId: '1:740021590634:web:bc7612da37ff1ee4c30813',
  measurementId: 'G-KKQ5Q7DSM0',
};

/** Firebase 앱 초기화 (앱에서 Firebase 기능 사용 가능해짐) */
const app = initializeApp(firebaseConfig);

let messaging;

/** Messaging 객체 가져오기*/
if (typeof window !== 'undefined') {
  // 클라이언트 환경에서만 실행
  messaging = getMessaging(app);
}

export { messaging, getToken, onMessage };
