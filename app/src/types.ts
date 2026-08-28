export type Role = 'patient' | 'nurse' | 'doctor';

export const ROLES: Role[] = ['patient', 'nurse', 'doctor'];

export const ROLE_LABEL: Record<Role, string> = {
  patient: 'Patient',
  nurse: 'Nurse',
  doctor: 'Doctor',
};

export type Device = 'desktop' | 'tablet' | 'mobile';

export type ViewportMode = 'auto' | Device;
