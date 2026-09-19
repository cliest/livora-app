import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Site settings' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/prices', label: 'Prices' },
  { to: '/admin/accreditations', label: 'Accreditations' },
  { to: '/admin/users', label: 'Admin users' },
];

const navLinkClass = ({ isActive }) =>
  `block px-4 py-[10px] rounded-xl text-[0.92rem] font-semibold transition-colors ${
    isActive ? 'bg-cyan text-white' : 'text-haze-200 hover:bg-white/10 hover:text-white'
  }`;

export default function AdminLayout({ admin, children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await api.adminLogout();
    queryClient.setQueryData(['admin-me'], null);
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-sand">
      <aside className="w-[240px] flex-none bg-ink text-white flex flex-col">
        <div className="px-s3 py-s4 border-b border-white/10">
          <span className="text-[1.1rem] font-extrabold text-white">Livora</span>
          <span className="block text-[0.72rem] uppercase tracking-[0.12em] text-cyan">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-s3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-s3 py-s3 border-t border-white/10">
          <p className="text-[0.82rem] text-haze-600 truncate">{admin.name || admin.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 text-[0.82rem] font-semibold text-cyan hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-s4 md:p-s5">{children}</main>
    </div>
  );
}
