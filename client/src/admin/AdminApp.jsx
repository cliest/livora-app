import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAdmin from '../components/admin/RequireAdmin.jsx';
import AdminLogin from '../pages/admin/Login.jsx';
import AdminOverview from '../pages/admin/Overview.jsx';
import AdminBookings from '../pages/admin/Bookings.jsx';
import AdminMessages from '../pages/admin/Messages.jsx';
import AdminSettings from '../pages/admin/Settings.jsx';
import AdminTeam from '../pages/admin/Team.jsx';
import AdminTestimonials from '../pages/admin/Testimonials.jsx';
import AdminPrices from '../pages/admin/Prices.jsx';
import AdminAccreditations from '../pages/admin/Accreditations.jsx';
import AdminUsers from '../pages/admin/Users.jsx';

// Paths are relative to the private dashboard address (the router basename).
export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/bookings" element={<AdminBookings />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/team" element={<AdminTeam />} />
        <Route path="/testimonials" element={<AdminTestimonials />} />
        <Route path="/prices" element={<AdminPrices />} />
        <Route path="/accreditations" element={<AdminAccreditations />} />
        <Route path="/users" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
