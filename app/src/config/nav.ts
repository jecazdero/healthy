import type { Role } from '../types';

export interface NavItem {
  icon: string;
  label: string;
  shortLabel: string;
  path: string;
  /** Renders a small circular quick-action icon button inline (e.g. "Start Break"), sidebar only. */
  quickAction?: { icon: string; label: string };
}

export const ROLE_HOME: Record<Role, string> = {
  patient: '/patient/schedules',
  nurse: '/nurse/waiting-room',
  doctor: '/doctor/waiting-room',
};

export const ROLE_SIDEBAR_SUBTITLE: Record<Role, string> = {
  patient: 'Patient',
  nurse: 'Nurse · Floor Coordinator',
  doctor: 'Doctor · Dr. Alvarez',
};

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  patient: [
    { icon: 'calendar_today', label: 'My Schedules', shortLabel: 'Schedules', path: '/patient/schedules' },
    { icon: 'history', label: 'History of my Health', shortLabel: 'History', path: '/patient/history' },
    { icon: 'account_circle', label: 'My Profile', shortLabel: 'Profile', path: '/patient/profile' },
  ],
  nurse: [
    { icon: 'groups', label: 'Waiting Room', shortLabel: 'Waiting', path: '/nurse/waiting-room' },
    { icon: 'calendar_today', label: 'Schedule', shortLabel: 'Schedule', path: '/nurse/schedule' },
    { icon: 'person', label: 'Patients', shortLabel: 'Patients', path: '/nurse/patients' },
    {
      icon: 'free_breakfast',
      label: 'My Breaks',
      shortLabel: 'Breaks',
      path: '/nurse/breaks',
      quickAction: { icon: 'free_breakfast', label: 'Start Break' },
    },
    { icon: 'account_circle', label: 'My Profile', shortLabel: 'Profile', path: '/nurse/profile' },
  ],
  doctor: [
    { icon: 'list', label: 'Patients (list view)', shortLabel: 'Patients', path: '/doctor/patients' },
    { icon: 'groups', label: 'Waiting Room', shortLabel: 'Waiting', path: '/doctor/waiting-room' },
    {
      icon: 'free_breakfast',
      label: 'My Breaks',
      shortLabel: 'Breaks',
      path: '/doctor/breaks',
      quickAction: { icon: 'free_breakfast', label: 'Start Break' },
    },
    { icon: 'account_circle', label: 'My Profile', shortLabel: 'Profile', path: '/doctor/profile' },
  ],
};
