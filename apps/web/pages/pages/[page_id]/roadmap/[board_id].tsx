import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { type JSX } from "react";
import { SecondaryButton } from "../../../../components/core/buttons.component";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import RoadmapBoard from "../../../../components/roadmap/RoadmapBoard";
import { withSupabase } from "../../../../utils/supabase/withSupabase";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";
import { getPage } from "../../../../utils/useSSR";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const page_id = String(ctx.params?.page_id);
  const board_id = String(ctx.params?.board_id);

  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  const settings = await createOrRetrievePageSettings(String(page_id));

  const { data: board, error: boardError } = await supabase
    .from("roadmap_boards")
    .select(
      `
      *,
      roadmap_columns (
        *
      ),
      roadmap_items (
        *,
        roadmap_categories (
          id,
          name,
          color
        ),
        roadmap_votes (
          id
        )
      ),
      roadmap_categories (
        *
      )
    `
    )
    .eq("id", board_id)
    .eq("page_id", page_id)
    .single();

  if (boardError || !board) {
    console.error("Failed to fetch roadmap board data", boardError);
    return {
      notFound: true,
    };
  }

  const columns = (board.roadmap_columns || []).sort(
    (a, b) => (a.position || 0) - (b.position || 0)
  );
  const items = (board.roadmap_items || []).sort(
    (a, b) => (a.position || 0) - (b.position || 0)
  );
  const categories = (board.roadmap_categories || []).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return {
    props: {
      page_id,
      page,
      settings,
      board,
      columns: columns || [],
      items: items || [],
      categories: categories || [],
    },
  };
});

export default function RoadmapBoardDetails({
  page_id,
  board,
  columns,
  items,
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (!page_id || !board) return null;

  return (
    <>
      <Page
        title={board.title}
        subtitle={`${board.is_public ? "Public" : "Private"} Roadmap • ${
          board.description || "No description"
        }`}
        showBackButton={true}
        backRoute={`/pages/${page_id}/roadmap`}
        containerClassName="lg:pb-0"
        fullWidth={true}
        buttons={
          <SecondaryButton
            label="Settings"
            onClick={() =>
              router.push(`/pages/${page_id}/roadmap/${board.id}/settings`)
            }
          />
        }
      >
        <RoadmapBoard
          board={board}
          columns={columns}
          items={items}
          categories={categories}
        />
      </Page>
    </>
  );
}

RoadmapBoardDetails.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
