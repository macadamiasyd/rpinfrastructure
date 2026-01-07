export const formatPostDate = (dateString: string) => {
  const date = new Date(dateString);

  if (!(date instanceof Date)) {
    throw new Error("Invalid date string");
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  const datetime = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

  const display = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return { datetime, display };
};
