export interface UserRequest {
  email: string;
  password: string;
}

interface ProfileProps {
  name: string;
  imageUrl: string;
}

interface User {
  userId: number;
  name: string;
  profileImageUrl: string;
}

interface PatientRequest {
  userId: number;
  residentRegistrationNumber: string;
}

interface DoctorInfo {
  specialization: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface AddDoctorListRequest {
  doctorInfos: DoctorInfo[];
}

interface FindEmailRequest {
  name: string;
  phone: string;
}

interface SendVerifyCode {
  email: string;
}

interface ConfirmVerifyCode {
  email: string;
  code: string;
}

interface ResetPassword {
  email: string;
  password: string;
}
