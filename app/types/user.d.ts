export interface UserRequest {
  email: string;
  password: string;
}

interface ProfileProps {
  name: string;
  imageUrl: string;
}

interface User {
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
