import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
