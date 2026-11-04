import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo.jsx';
import { api } from '../../admin/api.js';
import { Skeleton } from '../../components/ui/Skeleton.jsx';

export default function AdminOverview() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-summary'], queryFn: api.adminSummary });

  const cards = [
    { label: 'Pending bookings', value: data?.pendingBookings, to: '/bookings' },
    { label: 'Pending messages', value: data?.pendingMessages, to: '/messages' },
    { label: "Today's bookings", value: data?.todaysBookings, to: '/bookings' },
  ];

  return (
    <div>
      <Seo title="Admin Overview | Livora Dental Clinic" description="Staff dashboard." path="/" noindex />
      <h1 className="text-[1.6rem] mb-s4">Overview</h1>

      <div className="grid sm:grid-cols-3 gap-s3 mb-s5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-white border border-line rounded-[18px] p-s4 hover:shadow-card transition-shadow">
            <span className="block text-[2.2rem] font-extrabold text-cyan leading-none">
              {isLoading ? <Skeleton className="h-[2.2rem] w-14" /> : c.value}
            </span>
            <span className="text-[0.9rem] text-muted">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-line rounded-[18px] p-s4 mb-s4">
        <h2 className="text-[1.1rem] mb-s3">Manage site content</h2>
        <div className="flex flex-wrap gap-s2">
          <Link to="/settings" className="btn btn--outline btn--sm">Site settings</Link>
          <Link to="/team" className="btn btn--outline btn--sm">Team members</Link>
          <Link to="/testimonials" className="btn btn--outline btn--sm">Testimonials</Link>
          <Link to="/prices" className="btn btn--outline btn--sm">Prices</Link>
          <Link to="/accreditations" className="btn btn--outline btn--sm">Accreditations</Link>
        </div>
      </div>

      <div className="bg-white border border-line rounded-[18px] p-s4">
        <h2 className="text-[1.1rem] mb-s3">Access</h2>
        <div className="flex flex-wrap gap-s2">
          <Link to="/users" className="btn btn--outline btn--sm">Admin users</Link>
        </div>
      </div>
    </div>
  );
}
