export interface RegisteredAccount {
  uuid: string;
  login: string;
  email: string;
  role: string;
  company: boolean;
  enabled: boolean;
  lock: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  street: string;
  apartmentNumber: string;
  postalCode: string;
  companyName: string | null;
  nip: string | null;
}
