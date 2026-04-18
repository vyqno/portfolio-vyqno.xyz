export const colors = {
  canvas: "#FAF8F4",
  elevated: "#F2EFE8",
  ink: "#1A1918",
  body: "#4A4744",
  muted: "#8A8680",
  border: "#E2DED6",
  borderStrong: "#C8C3B8",
  accent: "#C2703E",
  accentHover: "#A85C30",
  accentSoft: "#F5E6D8",
  success: "#5C8A5E",
  error: "#B84A3C",
} as const;

export const motion = {
  duration: {
    xs: 0.08,
    sm: 0.16,
    md: 0.24,
    lg: 0.4,
    xl: 0.8,
  },
  easing: {
    standard: "power2.out",
    emphasized: "power3.out",
    spring: "elastic.out(1, 0.5)",
    scroll: "none",
  },
  scrub: 0.5,
} as const;

export const type = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.25rem",
  xl: "1.625rem",
  "2xl": "2.625rem",
  "3xl": "4.25rem",
} as const;
