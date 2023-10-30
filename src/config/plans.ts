import { PAID_PLAN_PRICE } from "./config";

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 20,
    pagesPerPdf: 20,
    price: {
      amount: PAID_PLAN_PRICE,
    },
  },
];
