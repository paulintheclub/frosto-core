import InfoPage from '@/components/client/info-page';
import { infoData } from '@/lib/info-data';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  const { slug } = params;
  const data = infoData[slug as keyof typeof infoData];

  if (!data) {
    notFound();
  }

  return <InfoPage data={data} />;
}

export async function generateStaticParams() {
  return Object.keys(infoData).map((slug) => ({
    slug,
  }));
}
