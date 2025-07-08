import axios from 'axios';

const HOST = 'https://beanstalk.docto.click/api/v1/notifications';

/**
 * 알림 리스트 가져오기
 */
export const getNotifications = async () => {
  const res = await axios.get(`${HOST}`, {
    withCredentials: true,
  });

  return res.data;
};

/**
 * 알림 읽음 상태로 변경
 * @param notificationId - 읽음 처리할 알림 ID
 */
export const markNotificationAsRead = async (notificationId: number) => {
  const res = await axios.patch(
    `${HOST}/${notificationId}/read`,
    {},
    {
      // 빈 객체를 body로 보냄
      withCredentials: true,
    },
  );
  return res.data;
};

/**
 * 읽은 알림 모두 삭제
 */
export const deleteReadNotifications = async () => {
  const res = await axios.patch(
    `${HOST}/delete`,
    {},
    {
      withCredentials: true,
    },
  );
  return res.data;
};
