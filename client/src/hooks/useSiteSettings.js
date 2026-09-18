import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';

// Today's real values, used as placeholderData so every page renders
// correct-looking contact details immediately instead of flashing empty
// state while the first fetch resolves. Deliberately NOT initialData:
// initialData is treated as already-fetched, so combined with staleTime it
// would suppress the real request — meaning a change made in the admin
// dashboard would never show up on a fresh page load. placeholderData has
// no such effect; the real fetch still fires on mount.
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
    placeholderData: DEFAULT_SETTINGS,
  });

  return {
    ...data,
    telHref: `tel:${data.phoneDial}`,
    waHref: `https://wa.me/${data.phoneDial.replace(/[^\d]/g, '')}`,
  };
}
