import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface AssistanceRequest {
  patientName: string;
  queueNumber: string;
  room: string;
  requestedAt: string;
}

interface AssistanceContextValue {
  request: AssistanceRequest | null;
  requestAssistance: (request: AssistanceRequest) => void;
  clearAssistance: () => void;
}

const AssistanceContext = createContext<AssistanceContextValue | null>(null);

export function AssistanceProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<AssistanceRequest | null>(null);

  const requestAssistance = useCallback((next: AssistanceRequest) => setRequest(next), []);
  const clearAssistance = useCallback(() => setRequest(null), []);

  const value = useMemo<AssistanceContextValue>(
    () => ({ request, requestAssistance, clearAssistance }),
    [request, requestAssistance, clearAssistance],
  );

  return <AssistanceContext.Provider value={value}>{children}</AssistanceContext.Provider>;
}

export function useAssistance(): AssistanceContextValue {
  const ctx = useContext(AssistanceContext);
  if (!ctx) throw new Error('useAssistance must be used within an AssistanceProvider');
  return ctx;
}
