import Link from "next/link";
import { type RootQueryToProjectConnection, type TaxQuery } from "@/graphql/generated/graphql";
import { ProjectsArchiveQuery } from "@/graphql/queries";
import { query } from "@/lib/api/client";

import ProjectsListing from "../projects-listing";

type Props = {
  title?: string | null;
  description?: string | null;
  taxQuery?: NonNullable<TaxQuery>;
  tags?: string[];
};

type ProjectQueryResult = {
  projects?: RootQueryToProjectConnection;
};

export default async function ProjectsArchive({ title, description, taxQuery, tags }: Props) {
  const { data } = await query<ProjectQueryResult>({
    query: ProjectsArchiveQuery,
    variables: {
      taxQuery: taxQuery,
    },
  });

  return (
    <div className="u-wrap">
      <section className="u-wrap Projects">
        <div className="row">
          <div className="columns large-3">
            <Link
              href="/portfolio"
              className="u-linkBack Projects-backLink {{ back_is_hashlink ? 'js-backLink'}}"
            >
              <svg className="Icon Icon-arrow-left">
                <use xlinkHref="#icon-arrow-left" />
              </svg>
              Back
            </Link>
            {title ? <h2 className="Projects-title">{title}</h2> : null}
          </div>
          <ProjectsListing taxQuery={taxQuery} query={data?.projects} tags={tags} />
        </div>

        {description ? (
          <div className="row u-spaceBeforeHuge">
            <div className="columns large-5">
              <div className="PullQuote">{description}</div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
