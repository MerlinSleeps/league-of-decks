export const DOMAIN = {
  Fury: "Fury",
  Calm: "Calm",
  Body: "Body",
  Mind: "Mind",
  Chaos: "Chaos",
  Order: "Order",
} as const;

export type Domain = keyof typeof DOMAIN;
export type DomainValue = (typeof DOMAIN)[Domain];
