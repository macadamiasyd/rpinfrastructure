import { notFound } from "next/navigation";

import NewsArchive from "@/components/news-archive";

type Props = {
  params: Promise<DayParams>;
};
type DayParams = {
  year: string;
  month: string;
  day: string;
};
export default async function Day({ params }: Props) {
  const { year, month, day } = await params;
  if (isNaN(Number(year)) || isNaN(Number(month)) || isNaN(Number(day))) {
    return notFound();
  }
  return (
    <NewsArchive
      year={Number(year)}
      params={{
        year: Number(year),
        month: Number(month),
        day: Number(day),
      }}
    />
  );
}
