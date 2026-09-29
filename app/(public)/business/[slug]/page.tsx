import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessProfile } from "@/components/business/profile";
import { CatalogProblem } from "@/components/catalog-status";
import { logOps } from "@/lib/log";
import { getBusinessBySlug } from "@/lib/repositories";
import { siteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let business;
  try {
    business = await getBusinessBySlug(slug);
  } catch (error) {
    logOps("business-metadata", error);
    return { title: "עסק" };
  }
  if (!business || !business.active) notFound();
  return {
    title: business.name,
    description: business.shortDescription,
    openGraph: {
      title: `${business.name} · Atlitim`,
      description: business.shortDescription,
      url: `/business/${business.slug}`,
    },
  };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let business;
  try {
    business = await getBusinessBySlug(slug);
  } catch (error) {
    logOps("business", error);
    return <CatalogProblem />;
  }
  if (!business || !business.active) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.shortDescription,
    url: `${siteUrl()}/business/${business.slug}`,
    telephone: business.phone ?? undefined,
    address: business.showExactAddress && business.address ? { "@type": "PostalAddress", streetAddress: business.address, addressLocality: "עתלית", addressCountry: "IL" } : { "@type": "PostalAddress", addressLocality: "עתלית", addressCountry: "IL" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BusinessProfile business={business} />
    </>
  );
}
