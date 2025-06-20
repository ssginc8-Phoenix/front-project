import styled from 'styled-components';
import LoginStore from '~/features/user/stores/LoginStore';
import {
  deleteReadNotifications,
  getNotifications,
  markNotificationAsRead,
} from '~/features/notification/api/notificationAPI';
import { useEffect, useRef, useState } from 'react';
import { onMessage } from '@firebase/messaging';
import type { NotificationList } from '~/types/notification';
import { messaging } from '~/features/fcm/firebase';
import {
  DateTime,
  MessageContent,
  NotificationBox,
  NotificationItem,
  Title,
  Content,
  BellIcon,
  BellWrapper,
  RedDot,
  NotificationHeader,
  DeleteButton,
} from '~/features/notification/components/Notification.styels';
import { Bell, XCircle } from 'lucide-react';

const Audio = styled.audio`
  display: none;
`;

const NotificationComponent = () => {
  const navigate = useNavigate();

  const user = LoginStore((state) => state.user); //로그인된 사용자 정보 가져오기

  const [visible, setVisible] = useState(false); // 알림 드롭다운 표시 여부 상태
  const [notifications, setNotifications] = useState<NotificationList[]>([]); // 알림 리스트 상태
  const [shake, setShake] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 서버에서 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('알림 조회 실패: ', err);
    }
  };

  // 알림 드롭다운 열릴 때 안 읽은 알림 모두 읽음 처리
  const markAllUnreadAsRead = async () => {
    console.log('모두 읽음 처리');

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    for (const notification of unreadNotifications) {
      try {
        await markNotificationAsRead(notification.notificationId);
      } catch (error) {
        console.error(`알림 ${notification.notificationId} 읽음 처리 실패: `, error);
      }
    }

    // 읽음 처리 후 목록 새로고침
    await fetchNotifications();
  };

  /**
   * 읽은 알림 모두 삭제
   */
  const handleDeleteReadNotifications = async () => {
    console.log('읽은 알림 모두 삭제');

    try {
      await deleteReadNotifications();

      // 삭제 후 목록 새로고침
      await fetchNotifications();
    } catch (error) {
      console.error('읽은 알림 삭제 실패: ', error);
    }
  };

  // FCM 메세지 수신 등록 및 처리
  useEffect(() => {
    if (!messaging || !user) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('수신된 FCM 메세지:', payload);

      setShake(true); // 벨 아이콘 흔들림 시작
      setTimeout(() => setShake(false), 1000); // 1초 후 흗들림 종료

      // 알림 소리 재생 시도
      audioRef.current?.play().catch((e) => console.warn('알림 사운드 차단: ', e));

      // 새 알림 리스트를 서버에서 다시 조회
      fetchNotifications();

      return () => unsubscribe(); // 컴포넌트 언마운트 시 이벤트 해제
    });
  }, [user]);

  // 벨 아이콘 클릭 시 드롭다운 토글
  const toggleDropdown = async () => {
    setVisible((prev) => !prev);
    if (!visible) {
      // 드롭다운이 열릴 때 알림 리스트 새로 고침
      await fetchNotifications();
      // 드롭다운 열릴 때 안 읽은 알림 모두 읽음 처리
      await markAllUnreadAsRead();
    }
  };

  // 컴포넌트 마운트 시 초기 알림 목록 가져오기 (이미 로그인된 경우)
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]); // user가 변경될 때만 실행

  if (!user) return null; // 로그인 안 된 경우 컴포넌트 렌더링 안 함

  return (
    <BellWrapper>
      <BellIcon onClick={toggleDropdown} shake={shake}>
        <Bell size={24} strokeWidth={2} />
      </BellIcon>
      {notifications.some((n) => !n.isRead) && <RedDot />}

      <Audio ref={audioRef} src="/sounds/notification.mp3" />

      {visible && (
        <NotificationBox>
          <NotificationHeader>
            <h4>알림</h4>
            <DeleteButton onClick={handleDeleteReadNotifications} title="읽은 알림 모두 삭제">
              <XCircle size={18} />
            </DeleteButton>
          </NotificationHeader>

          {notifications.length === 0 ? (
            <NotificationItem>
              <MessageContent>
                <Content>알림이 없습니다.</Content>
              </MessageContent>
            </NotificationItem>
          ) : (
            notifications.map((data) => {
              const handleClick = () => {
                if (data.type === '결제 요청' && data.referenceId) {
                  navigate(`/payments/history?paymentRequestId=${data.referenceId}`);
                }
              };

              return (
                <NotificationItem
                  key={data.notificationId}
                  isRead={data.isRead}
                  onClick={handleClick}
                  style={{ cursor: 'pointer' }}
                >
                  <MessageContent>
                    <Title>{data.type}</Title>
                    <Content>{data.content}</Content>
                    <DateTime>{data.createdAt}</DateTime>
                  </MessageContent>
                </NotificationItem>
              );
            })
          )}
        </NotificationBox>
      )}
    </BellWrapper>
  );
};

export default NotificationComponent;
