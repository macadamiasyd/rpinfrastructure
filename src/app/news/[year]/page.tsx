import { notFound } from "next/navigation";

import NewsArchive from "@/components/news-archive";

type Props = {
  params: Promise<YearsParams>;
};
type YearsParams = {
  year: string;
};

export default async function Year({ params }: Props) {
  const { year } = await params;
  if (isNaN(Number(year))) {
    return notFound();
  }
  return (
    <NewsArchive
      year={Number(year)}
      params={{
        year: Number(year),
      }}
    />
  );
}
