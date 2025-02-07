import { PostStatus } from "@changes-page/supabase/types/page";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { InferType } from "yup";
import { notifyError } from "../../../components/core/toast.component";
import PostFormComponent, {
  PostFormikForm,
} from "../../../components/forms/post-form.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import { NewPostSchema } from "../../../data/schema";
import { track } from "../../../utils/analytics";
import { httpPost } from "../../../utils/http";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../utils/useDatabase";

export async function getServerSideProps({ params, req, res }) {
  const { page_id } = params;

  const { user } = await getSupabaseServerClient({ req, res });
  const settings = await createOrRetrievePageSettings(user.id, String(page_id));

  return {
    props: {
      page_id,
      settings,
    },
  };
}

export default function NewPost({
  page_id,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);

  async function createPost(
    _: PostFormikForm,
    values: InferType<typeof NewPostSchema>
  ) {
    setSaving(true);

    try {
      await httpPost({
        url: "/api/posts",
        data: {
          ...values,
        },
      });

      track("PostCreated");

      if (values.status !== PostStatus.draft) {
        return await router.replace(`${ROUTES.PAGES}/${page_id}?yay=true`);
      }

      return await router.replace(`${ROUTES.PAGES}/${page_id}`);
    } catch (_) {
      setSaving(false);
      notifyError();
    }
  }

  return (
    <Page
      title="New Post"
      backRoute={`${ROUTES.PAGES}/${page_id}`}
      showBackButton={true}
    >
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900">
        <PostFormComponent
          pageId={String(page_id)}
          pageSettings={settings}
          saving={saving}
          onSubmit={createPost}
        />
      </div>
    </Page>
  );
}

NewPost.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
