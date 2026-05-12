import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Threat {
  id: string;
  type: string;
  sourceIp: string;
  severity: Severity;
  timestamp: Timestamp | Date;
  status: string;
  description?: string;
}

export type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'resolved';

export interface Incident {
  id: string;
  threatId: string;
  assignedAnalystId?: string;
  status: IncidentStatus;
  priority: Severity;
  resolutionNotes?: string;
  createdAt: Timestamp | Date;
}

export type DeviceStatus = 'online' | 'offline' | 'compromised';

export interface Device {
  id: string;
  name: string;
  ip: string;
  os: string;
  status: DeviceStatus;
  lastActive: Timestamp | Date;
}

export interface SecurityLog {
  id: string;
  type: string;
  message: string;
  severity: string;
  timestamp: Timestamp | Date;
  metadata?: Record<string, any>;
}
