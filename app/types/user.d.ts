export interface UserRequest {
  email: string;
  password: string;
}

interface ProfileProps {
  name: string;
  imageUrl: string;
}

interface User {
  userId: bigint;
  name: string;
  profileImageUrl: string;
}

interface PatientRequest {
  userId: bigint;
  residentRegistrationNumber: string;
}

interface DoctorInfo {
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
