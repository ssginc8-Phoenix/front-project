// import React from 'react';
// import { Card, InfoWrapper, LabelText, ValueText } from './styled/Form';
// import type { Appointment } from '~/types/appointment';
//
// interface Props {
//   appointment: Appointment;
// }
//
// const PatientInfoForm = ({ appointment }: Props) => (
//   <Card>
//     <InfoWrapper>
//       <div>
//         <LabelText>환자 이름</LabelText>
//         <ValueText>{appointment.patientName}</ValueText>
//       </div>
//       <div>
//         <LabelText>진료 ID</LabelText>
//         <ValueText>{appointment.appointmentId}</ValueText>
//       </div>
//       <div>
//         <LabelText>병원 이름</LabelText>
//         <ValueText>{appointment.hospitalName}</ValueText>
//       </div>
//       <div>
//         <LabelText>의사 이름</LabelText>
//         <ValueText>{appointment.doctorName}</ValueText>
//       </div>
//       <div>
//         <LabelText>진료 시간</LabelText>
//         <ValueText>{new Date(appointment.appointmentTime).toLocaleString()}</ValueText>
//       </div>
//       <div>
//         <LabelText>증상</LabelText>
//         <ValueText>{appointment.symptom}</ValueText>
//       </div>
//       {appointment.question && (
//         <div>
//           <LabelText>추가 질문</LabelText>
//           <ValueText>{appointment.question}</ValueText>
//         </div>
//       )}
//     </InfoWrapper>
//   </Card>
// );
//
// export default PatientInfoForm;
