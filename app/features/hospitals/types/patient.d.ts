// src/features/hospitals/types/patient.ts

// 이미 정의된 PatientSummary (예시)
export interface PatientSummary {
  patientId: number;
  name: string;
  address: string;
  // ...그 외 API에서 내려주는 필드
}

/**
 * 환자 정보에 geocode 결과를 합쳐둔 타입
 */
export interface PatientWithCoords extends PatientSummary {
  /** geocode 결과 위도 */
  lat: number;
  /** geocode 결과 경도 */
  lng: number;
}
