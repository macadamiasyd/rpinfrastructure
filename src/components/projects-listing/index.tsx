"use client";

import { MouseEvent, useEffect, useState } from "react";
import type { Project, RootQueryToProjectConnection, TaxQuery } from "@/graphql/generated/graphql";
import { queryProjects } from "@/lib/utilities/queryProjects";
import clsx from "clsx";

import ProjectCard from "@/components/cards/project-card";

type Props = {
  taxQuery?: NonNullable<TaxQuery>;
  query?: RootQueryToProjectConnection;
  tags?: string[];
  loading?: boolean;
};
export default function ProjectsListing({ taxQuery, query, tags, loading: loadingProp }: Props) {
  const [hasNext, setHasNext] = useState<boolean>(query?.pageInfo?.hasNextPage ?? false);
  const [cursor, setCursor] = useState<string>(query?.pageInfo?.endCursor ?? "");
  const [projects, setProjects] = useState<Project[]>(query?.nodes ?? []);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const isOverlayLoading = !!loadingProp;

  useEffect(() => {
    setProjects(query?.nodes ?? []);
    setHasNext(!!query?.pageInfo?.hasNextPage);
    setCursor(query?.pageInfo?.endCursor ?? "");
  }, [query]);

  const loadHandler = async () => {
    try {
      setButtonLoading(true);

      const data = await queryProjects({
        after: cursor,
        taxQuery,
        tags: [cursor ? `projects:after:${cursor}` : ``, ...(tags ?? [])],
      });
      if (data) {
        setProjects((prev) => [...prev, ...(data.projects?.nodes ?? [])]);
        setHasNext(!!data.projects?.pageInfo?.hasNextPage);
        setCursor(data.projects?.pageInfo?.endCursor ?? "");
      }
    } catch (error) {
      console.error(`Something went wrong during load more: ${error}`, error);
    } finally {
      setButtonLoading(false);
    }
  };

  const loadMore = async (e: MouseEvent) => {
    e.preventDefault();
    await loadHandler();
  };

  return (
    <div
      className={clsx("columns u-spaceAfterHuge", {
        loading: isOverlayLoading,
      })}
    >
      {isOverlayLoading ? (
        <div
          className="ProjectsListing-loading"
          role="status"
          aria-live="polite"
          aria-busy="true"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            marginBlock: 60,
          }}
        >
          <svg
            className="Spinner"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="60"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span className="show-for-sr">Loading</span>
        </div>
      ) : projects.length > 0 ? (
        <>
          <div className="ProjectGrid row small-up-2 large-up-3 xlarge-up-4">
            {projects.map((proj, index) => (
              <ProjectCard
                key={proj.databaseId ?? index}
                {...proj}
                subtitle={(proj as any)?.project?.subtitle ?? ""}
              />
            ))}
          </div>

          {hasNext && (
            <div className="PostsList-footer u-spaceBeforeLarge">
              <button
                type="button"
                className="PostsList-loadMore js-postsNextBtn button"
                onClick={loadMore}
                disabled={buttonLoading}
                aria-busy={buttonLoading}
              >
                {buttonLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="u-textCenter">Sorry, projects were not found.</h3>
          <p className="u-textCenter">Please try again with different filters.</p>
          <br />
        </>
      )}
    </div>
  );
}
