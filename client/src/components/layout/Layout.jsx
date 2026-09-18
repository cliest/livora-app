import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import MobileCallbar from './MobileCallbar.jsx';

export default function Layout() {
  return (
    <div className="pb-[76px] lg:pb-0">
      <a
        href="#main"
        className="absolute -left-full top-0 z-[999] bg-ink text-white px-5 py-3 rounded-br-lg focus:left-0"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileCallbar />
    </div>
  );
}
