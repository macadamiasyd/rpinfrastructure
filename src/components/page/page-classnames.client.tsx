"use client";

import { useEffect, useMemo } from "react";

type Props = {
  slugParts: string[];
  templateName?: string | null;
  isFrontPage?: boolean;
};

const toKebab = (val?: string | null) =>
  (val ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\-\/_\s]/g, "")
    .replace(/[\s_/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default function PageClassNames({ slugParts, templateName, isFrontPage }: Props) {
  const slugJoined = useMemo(() => toKebab(slugParts.join("/")), [slugParts]);
  const lastSlug = useMemo(() => toKebab(slugParts[slugParts.length - 1] ?? ""), [slugParts]);
  const templateKebab = useMemo(() => toKebab(templateName ?? undefined), [templateName]);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const classes: string[] = [];

    if (templateKebab) classes.push(`page-template-${templateKebab}`);
    if (slugJoined) classes.push(`page-template-${slugJoined}`);
    if (lastSlug) classes.push(lastSlug);
    if (isFrontPage) classes.push("home");

    classes.forEach((c) => body.classList.add(c));
    if (isFrontPage) html.classList.add("home");
    return () => {
      classes.forEach((c) => body.classList.remove(c));
      if (isFrontPage) html.classList.remove("home");
    };
  }, [slugJoined, lastSlug, templateKebab, isFrontPage]);

  return null;
}
