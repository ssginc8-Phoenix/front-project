// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
// import Header from '~/layout/Header';
// import { useLocation, useParams } from 'react-router';
//
// const PageLayout = styled.div`
//   max-width: 600px;
//   margin: 40px auto;
//   padding: 0 20px;
// `;
// const Form = styled.form`
//   background: #fff;
//   border-radius: 8px;
//   padding: 24px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
// `;
// const ErrorText = styled.p`
//   color: #e74c3c;
//   font-size: 14px;
//   margin: 8px 0;
//   text-align: center;
// `;
//
// const PaymentRequestPage = () => {
//   const { appointmentId } = useLocation().state || {};
//
//   const {
//     data: appointment,
//     isLoading,
//     refetch,
//     isRefetching,
//   } = useAppointmentDetail(appointmentId);
//
//   const [amount, setAmount] = useState('');
//   const [memo, setMemo] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [error, setError] = useState('');
//
//   const validate = () => {
//     if (!amount || Number(amount.replace(/,/g, '')) < 1) {
//       setError('금액은 1원 이상이어야 합니다.');
//       return false;
//     }
//     return true;
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//   };
//
//   const handlePreview = (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     alert(`미리보기\n금액: ₩${amount}\n메모: ${memo || '없음'}\n마감일: ${dueDate || '없음'}`);
//   };
//
//   return (
//     <PageLayout>
//       <Header />
//       <Form onSubmit={handleSubmit}>
//         <PatientInfoForm patient={patient} />
//         <AmountInput value={amount} onChange={setAmount} />
//         <MemoInput value={memo} onChange={setMemo} />
//         <DueDatePicker value={dueDate} onChange={setDueDate} />
//         <ErrorText>{error}</ErrorText>
//         <ActionButtons
//           primary={{
//             text: isLoading ? '생성 중...' : '요청 생성',
//             disabled: isLoading,
//             onClick: handleSubmit,
//           }}
//           secondary={{ text: '미리보기', onClick: handlePreview }}
//         />
//       </Form>
//     </PageLayout>
//   );
// };
//
// export default PaymentRequestPage;
