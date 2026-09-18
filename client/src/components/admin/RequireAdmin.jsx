import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../../lib/api.js';
import AdminLayout from './AdminLayout.jsx';

// Gates every /admin/* route (except /admin/login) behind the existing
// cookie-session admin auth. Renders nothing conclusive until the session
// check resolves, so there's no flash of protected content.
export default function RequireAdmin() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-me'],
    queryFn: api.adminMe,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <span className="text-muted text-sm">Loading…</span>
      </div>
    );
  }

  if (isError || !data?.admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout admin={data.admin}>
      <Outlet />
    </AdminLayout>
  );
}
