import Swal from 'sweetalert2';

interface ConfirmResult {
  isConfirmed: boolean;
  isDismissed: boolean;
}

/**
 * SweetAlert2를 이용한 확인/취소 팝업을 표시
 * @param title 팝업 제목
 * @param text 팝업 내용
 * @param icon 팝업 아이콘 ('warning', 'info' 등)
 * @returns {Promise<ConfirmResult>} 사용자의 선택 (확인 또는 취소)
 */

export const showConfirmAlert = async (
  title: string,
  text: string,
  icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'warning',
): Promise<ConfirmResult> => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    customClass: {
      container: 'my-sweetalert-popup',
    },
  });

  return {
    isConfirmed: result.isConfirmed,
    isDismissed: result.isDismissed || result.isDenied,
  };
};

export const showSuccessAlert = (title: string, text: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    customClass: {
      container: 'my-sweetalert-popup', // z-index가 높은 CSS 클래스
    },
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    customClass: {
      container: 'my-sweetalert-popup', // z-index가 높은 CSS 클래스
    },
  });
};

export const showInfoAlert = (title: string, text: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'info',
    customClass: {
      container: 'my-sweetalert-popup', // z-index가 높은 CSS 클래스
    },
  });
};
