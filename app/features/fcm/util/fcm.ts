import { getToken, onMessage } from '@firebase/messaging';
import { registerToken } from '~/features/fcm/api/fcmAPI';
import { messaging } from '~/features/fcm/firebase';

// FCM Web Push 인증서 키 (VAPID_KEY)
const VAPID_KEY =
  'BAkCTG2ZIY4xZB5qzR3uyL_etq91zhLk4FS8Ts_IJ9SAGJgrMDCO2mIW4cxvpUF0Zz-Y7-r3OWBxMvwiA7Po0bU';

// 서버에 토큰 등록할 때 사용하는 요청 타입 정의
interface RegisterTokenRequest {
  userId: number;
  token: string;
}

/**
 * 사용자의 브라우저에서 알림 권한 요청 + 허용 시 토큰 발급 -> 서버에 저장
 */
export const requestPermissionAndRegisterToken = async (userId: number) => {
  // 알림 권한 요청 (알림 허용 or 차단 팝업 발생)
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('알림이 허락됨');

    try {
      // 권한 허용됨 -> FCM 토큰 발급 시도
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (currentToken) {
        console.log('FCM Token: ', currentToken);

        // 서버에 토큰 등록 (PUT /api/v1/fcm/token)
        const requestBody: RegisterTokenRequest = {
          userId,
          token: currentToken,
        };

        await registerToken(requestBody);
      } else {
        console.log('사용 가능한 등록 토큰이 없습니다.');
      }
    } catch (error) {
      console.log('토큰을 가져오는 동안 오류가 발생했습니다.', error);
    }
  } else {
    console.log('알림 허용이 수락되지 않았습니다.');
  }
};

/**
 * Foreground 상태에서 FCM 메세지 수신 (브라우저가 켜져 있을 때)
 */
export const listenForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Foreground message 수신: ', payload);

    // 브러우저 알림 띄우기 예시
    if (payload.notification) {
      new Notification(payload.notification.title ?? '', {
        body: payload.notification.body,
      });
    }
  });
};
