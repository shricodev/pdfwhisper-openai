import {
  FREE_PDF_PAGES,
  FREE_PDF_QUOTA,
  FREE_PLAN_PRICE,
  FREE_USER_PDF_SIZE,
  PRO_PDF_PAGES,
  PRO_PDF_QUOTA,
  PRO_PLAN_PRICE,
  PRO_USER_PDF_SIZE,
} from "@/config/config";

export const PLANS = [
  // For free plan
  {
    name: "Free" as const,
    slug: "free" as const,
    quota: FREE_PDF_QUOTA,
    pagesPerPdf: FREE_PDF_PAGES,
    price: {
      amount: FREE_PLAN_PRICE,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  // For pro plan
  {
    name: "Pro" as const,
    slug: "pro" as const,
    quota: PRO_PDF_QUOTA,
    pagesPerPdf: PRO_PDF_PAGES,
    price: {
      amount: PRO_PLAN_PRICE,
      priceIds: {
        // TODO: Change this to use the production key once ready to be put in production.
        // For the dev server, use a test product key and not the production key.
        test: process.env.STRIPE_DEV_PRICE_ID ?? "",
        production: "",
      },
    },
  },
];

export const PRICINGITEMS = [
  {
    plan: "Free",
    tagline: "For small talks with your PDFs",
    quota: PLANS.find((plan) => plan.slug === "free")?.quota,
    features: [
      {
        text: `${FREE_USER_PDF_SIZE}MB file size limit.`,
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: `${FREE_PDF_PAGES} pages per PDF.`,
        footnote: "The maximum number of pages in a single PDF file.",
      },
      {
        text: "Mobile-friendly interface.",
      },
      {
        text: "Higher-quality responses.",
        footnote: "Better algorithmic responses for enhanced content quality.",
        negative: true,
      },
      {
        text: "Priority support.",
        negative: true,
      },
    ],
  },
  {
    plan: "Pro",
    tagline: "For larger projects with higher needs",
    quota: PLANS.find((plan) => plan.slug === "pro")?.quota,
    features: [
      {
        text: `${PRO_USER_PDF_SIZE}MB file size limit.`,
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: `${PRO_PDF_PAGES} pages per PDF.`,
        footnote: "The maximum number of pages in a single PDF file.",
      },
      {
        text: "Mobile-friendly interface.",
      },
      {
        text: "Higher-quality responses.",
        footnote: "Better algorithmic responses for enhanced content quality.",
      },
      {
        text: "Priority support.",
      },
    ],
  },
];
