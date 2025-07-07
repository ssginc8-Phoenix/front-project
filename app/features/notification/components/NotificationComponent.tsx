import styled from 'styled-components';
import LoginStore from '~/features/user/stores/LoginStore';
import {
  deleteReadNotifications,
  getNotifications,
  markNotificationAsRead,
} from '~/features/notification/api/notificationAPI';
import { useEffect, useRef, useState } from 'react';
import type { NotificationList } from '~/types/notification';
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
import { useNavigate } from 'react-router';
import { NEW_FCM_MESSAGE_EVENT } from '~/features/fcm/util/fcm';

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
  const notificationRef = useRef<HTMLDivElement>(null);
  const bellIconRef = useRef<HTMLDivElement>(null);

  // 서버에서 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      return data;
    } catch (err) {
      console.error('알림 조회 실패: ', err);
      return [];
    }
  };

  // 알림 드롭다운 열릴 때 안 읽은 알림 모두 읽음 처리
  const markAllUnreadAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);

    // 읽지 않은 알림만 필터링
    for (const notification of unreadNotifications) {
      try {
        await markNotificationAsRead(notification.notificationId);
        console.log(`알림 ${notification.notificationId} 읽음 처리 성공`);
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
    if (!user) return;

    // NEW_FCM_MESSAGE_EVENT 이벤트 핸들러 정의
    const handleNewFCMMessage = () => {
      console.log('NEW_FCM_MESSAGE_EVENT 수신됨');

      setShake(true);
      setTimeout(() => setShake(false), 1000);

      audioRef.current?.play().catch((e) => console.warn('알림 사운드 차단: ', e));

      // 새 알림 리스트를 서버에서 다시 조회 (UI 업데이트)
      fetchNotifications();
    };

    window.addEventListener(NEW_FCM_MESSAGE_EVENT, handleNewFCMMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      window.removeEventListener(NEW_FCM_MESSAGE_EVENT, handleNewFCMMessage);
    };
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

  // 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 알림창이 열려있고, 클릭된 요소가 알림창 내부도 아니고, 벨 아이콘도 아니라면 닫기
      if (
        visible &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        bellIconRef.current &&
        !bellIconRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  if (!user) return null; // 로그인 안 된 경우 컴포넌트 렌더링 안 함

  return (
    <BellWrapper>
      <BellIcon onClick={toggleDropdown} $shake={shake} ref={bellIconRef}>
        <Bell size={24} strokeWidth={2} />
      </BellIcon>
      {notifications.some((n) => !n.read) && <RedDot />}

      <Audio ref={audioRef} src="/sounds/notification.mp3" />

      {visible && (
        <NotificationBox ref={notificationRef}>
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
                setVisible(false);
              };

              return (
                <NotificationItem
                  key={data.notificationId}
                  isRead={data.read}
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
