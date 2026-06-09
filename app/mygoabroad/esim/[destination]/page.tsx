import { notFound } from "next/navigation";
import { getDestinationBySlug, destinations } from "../_data/destinations";
import EsimDetailPage from "./_components/EsimDetailPage";

export function generateStaticParams() {
  return destinations.map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const dest = getDestinationBySlug(destination);
  if (!dest) return { title: "eSIM Not Found | GoAbroad" };
  return {
    title: `${dest.name} eSIM | GoAbroad`,
    description: dest.description,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const dest = getDestinationBySlug(destination);
  if (!dest) notFound();

  return <EsimDetailPage destination={dest} />;
}
