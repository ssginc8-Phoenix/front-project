// import React from 'react';
// import styled from 'styled-components';
// import type { Hospital } from '../../../types/hospital';
//
// interface HospitalCardProps {
//   hospital: Hospital;
//   isSelected: boolean;
//   onSelect: (hospitalId: number) => void;
// }
//
// const CardContainer = styled.div<{ $isSelected: boolean }>`
//   background-color: #ffffff;
//   border-radius: 8px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   padding: 1.5rem;
//   border: 2px solid ${(props) => (props.$isSelected ? '#007bff' : 'transparent')};
//   transition: all 0.2s ease-in-out;
//   cursor: pointer;
//
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//   }
// `;
//
// const HospitalName = styled.h3`
//   font-size: 1.25rem;
//   color: #00499e;
//   margin-bottom: 0.5rem;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;
//
// const DetailText = styled.p`
//   font-size: 0.9rem;
//   color: #6b7280;
//   margin-bottom: 0.3rem;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;
//
// const InfoGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 0.5rem;
//   margin-top: 0.8rem;
// `;
//
// const InfoItem = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 0.9rem;
//   color: #374151;
//
//   svg {
//     margin-right: 0.5rem;
//     color: #007bff;
//   }
// `;
//
// // React.memo로 감싸서 props가 같으면 리렌더링 방지
// const HospitalCard = React.memo(({ hospital, isSelected, onSelect }: HospitalCardProps) => {
//   return (
//     <CardContainer $isSelected={isSelected} onClick={() => onSelect(hospital.hospitalId)}>
//       <HospitalName>{hospital.name}</HospitalName>
//       <DetailText>{hospital.specialization}</DetailText>
//       <InfoGrid>
//         <InfoItem>{hospital.address}</InfoItem>
//         <InfoItem>{hospital.phone}</InfoItem>
//         {hospital.distance !== undefined && <InfoItem>{hospital.distance.toFixed(1)} km</InfoItem>}
//         {hospital.rating !== undefined && (
//           <InfoItem>
//             {hospital.rating.toFixed(1)} ({hospital.reviewCount || 0} 리뷰)
//           </InfoItem>
//         )}
//       </InfoGrid>
//     </CardContainer>
//   );
// });
//
// export default HospitalCard;
