import { IconShield, IconTooth, IconSparkle, IconBraces, IconCrown, IconBolt } from '../components/ui/icons.jsx';

// Maps the PriceCategoryIcon Postgres enum (admin-selected) to the actual
// icon component — used by Pricing.jsx and Emergency.jsx.
export const PRICE_ICON_MAP = {
  SHIELD: IconShield,
  TOOTH: IconTooth,
  SPARKLE: IconSparkle,
  BRACES: IconBraces,
  CROWN: IconCrown,
  BOLT: IconBolt,
};
