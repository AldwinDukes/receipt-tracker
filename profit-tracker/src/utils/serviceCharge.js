const CHARGE_TIERS = [
  { limit: 10000, rate: 15, isPerK: true },
  { limit: 1000, rate: 20, isPerK: true },
  { limit: 700, rate: 15, isPerK: false },
  { limit: 50, rate: 10, isPerK: false },
];

const calculateCharge = (amount) => {
  // Find the first tier that the amount is greater than or equal to
  const tier = CHARGE_TIERS.find((t) => amount >= t.limit);

  if (!tier) return 0;

  return tier.isPerK ? Math.floor(amount / 1000) * tier.rate : tier.rate;
};

export { calculateCharge };
