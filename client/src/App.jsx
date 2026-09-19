import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Emergency from './pages/Emergency.jsx';
import Pricing from './pages/Pricing.jsx';
import Book from './pages/Book.jsx';
import Contact from './pages/Contact.jsx';
import ThankYou from './pages/ThankYou.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';
import RequireAdmin from './components/admin/RequireAdmin.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminOverview from './pages/admin/Overview.jsx';
import AdminBookings from './pages/admin/Bookings.jsx';
import AdminMessages from './pages/admin/Messages.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import AdminTeam from './pages/admin/Team.jsx';
import AdminTestimonials from './pages/admin/Testimonials.jsx';
import AdminPrices from './pages/admin/Prices.jsx';
import AdminAccreditations from './pages/admin/Accreditations.jsx';
import AdminUsers from './pages/admin/Users.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/team" element={<AdminTeam />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/prices" element={<AdminPrices />} />
        <Route path="/admin/accreditations" element={<AdminAccreditations />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/book" element={<Book />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
