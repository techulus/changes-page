import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { InferType } from "yup";
import { notifyError } from "../../../components/core/toast.component";
import PostFormComponent, {
  NewPostSchema,
  PostFormikForm,
} from "../../../components/forms/post-form.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { IPost, PostStatus } from "../../../data/page.interface";
import { ROUTES } from "../../../data/routes.data";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../utils/useDatabase";
import { useUserData } from "../../../utils/useUser";

export async function getServerSideProps({ params, req, res }) {
  const { page_id, post_id } = params;

  const { supabase, user } = await getSupabaseServerClient({ req, res });
  const settings = await createOrRetrievePageSettings(user.id, String(page_id));
  const { data: post } = await supabase
    .from("posts")
    .select(
      "type,title,status,content,page_id,images_folder,publish_at,allow_reactions,notes,email_notified"
    )
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
  const { supabase } = useUserData();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);

  async function updatePost(
    _: PostFormikForm,
    values: InferType<typeof NewPostSchema>
  ) {
    setSaving(true);

    try {
      await supabase
        .from("posts")
        .update({
          ...values,
          publication_date:
            values.status == PostStatus.published
              ? new Date().toISOString()
              : null,
        })
        .match({ id: post_id });

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
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-800">
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