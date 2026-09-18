import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';

// Today's real values, used as initialData so every page renders the
// correct contact details immediately instead of flashing empty state
// while the first fetch resolves — then silently updates if an admin has
// changed something.
const DEFAULT_SETTINGS = {
  phoneDisplay: '+260 76 073 7805',
  phoneDial: '+260760737805',
  email: 'info@livoradentalclinic.com',
  addressLine1: 'Plot 00, Street Name',
  addressLine2: 'Lusaka, Zambia',
  facebookUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
};

export function useSiteSettings() {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.getSettings()).settings,
    initialData: DEFAULT_SETTINGS,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...data,
    telHref: `tel:${data.phoneDial}`,
    waHref: `https://wa.me/${data.phoneDial.replace(/[^\d]/g, '')}`,
  };
}
