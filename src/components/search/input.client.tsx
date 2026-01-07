"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q")?.toString() ?? "").trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form onSubmit={onSubmit} className="Search-menu">
      <input
        type="text"
        name="q"
        defaultValue={params.get("q") ?? ""}
        className="Search-input js-searchInput"
        placeholder={placeholder}
        aria-label="Search"
      />
    </form>
  );
}
