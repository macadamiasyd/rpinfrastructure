import { notFound } from "next/navigation";

import NewsArchive from "@/components/news-archive";

type Props = {
  params: Promise<MonthParams>;
};
type MonthParams = {
  year: string;
  month: string;
};
export default async function Month({ params }: Props) {
  const { year, month } = await params;
  if (isNaN(Number(year)) || isNaN(Number(month))) {
    return notFound();
  }
  return (
    <NewsArchive
      year={Number(year)}
      params={{
        year: Number(year),
        month: Number(month),
      }}
    />
  );
}
