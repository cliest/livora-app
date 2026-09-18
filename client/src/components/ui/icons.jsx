// Small inline icon set — same stroke icons used throughout the original
// static build (stroke="currentColor", 2px width, round caps).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const IconShield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconXray = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M3 9h18" />
  </svg>
);

export const IconBolt = (p) => (
  <svg {...base} {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
);

export const IconCamera = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconTooth = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3c2.5 0 3 1.5 4.5 1.5S20 3.6 20 7c0 5-1.6 14-3.5 14S15 16 12 16s-2.6 5-4.5 5S4 12 4 7c0-3.4 2-2.5 3.5-2.5S9.5 3 12 3Z" />
  </svg>
);

export const IconRootCanal = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2v20" />
    <path d="M8 6h8" />
    <path d="M9 22c0-4-2-6-2-10a5 5 0 0 1 10 0c0 4-2 6-2 10" />
  </svg>
);

export const IconCrown = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12h18" />
    <path d="M5 12V8a7 7 0 0 1 14 0v4" />
    <path d="M7 12v4a5 5 0 0 0 10 0v-4" />
  </svg>
);

export const IconImplant = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2v8" />
    <path d="M8 6h8" />
    <path d="M9 10h6l-1 12h-4L9 10Z" />
  </svg>
);

export const IconBraces = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="9" width="20" height="6" rx="2" />
    <path d="M7 9v6M12 9v6M17 9v6" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v2M18.4 5.6l-1.4 1.4M21 12h-2M18.4 18.4 17 17M12 19v2M5.6 18.4 7 17M3 12h2M5.6 5.6 7 7" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const IconKid = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01M15 9h.01" />
  </svg>
);

export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export const IconPriceTag = (p) => (
  <svg {...base} {...p}>
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const IconMapPin = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconStar = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
  </svg>
);

export const IconCheckCircle = (p) => (
  <svg {...base} {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m22 4-10 10-3-3" />
  </svg>
);
