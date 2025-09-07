import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState, type JSX } from "react";
import { InferType } from "yup";
import { notifyError } from "../../../components/core/toast.component";
import PostFormComponent, {
  PostFormikForm,
} from "../../../components/forms/post-form.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import { NewPostSchema } from "../../../data/schema";
import { getSupabaseServerClientForSSR } from "../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../utils/useDatabase";
import { useUserData } from "../../../utils/useUser";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { page_id, post_id } = ctx.params;

  const { supabase } = await getSupabaseServerClientForSSR(ctx);
  const settings = await createOrRetrievePageSettings(String(page_id));
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", post_id as string)
    .single();

  return {
    props: {
      page_id,
      post_id,
      post,
      settings,
    },
  };
}

export default function EditPost({
  page_id,
  post_id,
  post,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { supabase, user } = useUserData();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);

  async function updatePost(
    _: PostFormikForm,
    values: InferType<typeof NewPostSchema>
  ) {
    setSaving(true);

    try {
      const newPost = { ...values };
      if (newPost.status == PostStatus.published && !newPost.publication_date) {
        newPost.publication_date = new Date().toISOString();
      }

      await supabase.from("posts").update(newPost).match({ id: post_id });

      await supabase.from("page_audit_logs").insert({
        page_id: page_id,
        actor_id: user.id,
        action: `Updated Post: ${newPost.title}`,
        changes: newPost,
      });

      return await router.push(`${ROUTES.PAGES}/${page_id}`);
    } catch (e) {
      setSaving(false);
      notifyError();
    }
  }

  return (
    <Page
      title="Update Post"
      backRoute={`${ROUTES.PAGES}/${page_id}`}
      showBackButton={true}
    >
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900">
        <PostFormComponent
          post={post as IPost}
          pageSettings={settings}
          pageId={String(page_id)}
          postId={String(post_id)}
          saving={saving}
          onSubmit={updatePost}
        />
      </div>
    </Page>
  );
}

EditPost.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
