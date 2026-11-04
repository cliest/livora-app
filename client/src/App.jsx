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

// Public site only. The staff dashboard is a separate app (admin.html →
// src/admin/main.jsx), served by Nginx at a private address.
export default function App() {
  return (
    <Routes>
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
