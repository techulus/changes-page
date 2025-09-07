import { IPage } from "@changes-page/supabase/types/page";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { InferType } from "yup";
import { notifyError } from "../../../components/core/toast.component";
import PageFormComponent, {
  PageFormikForm,
} from "../../../components/forms/page-form.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import { NewPageSchema } from "../../../data/schema";
import { httpPost } from "../../../utils/http";
import { withSupabase } from "../../../utils/supabase/withSupabase";
import { getPage } from "../../../utils/useSSR";
import { useUserData } from "../../../utils/useUser";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const { page_id } = ctx.params;

  const page = await getPage(supabase, page_id as string);

  return {
    props: { page_id, page },
  };
});

export default function EditPage({
  page_id,
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { supabase } = useUserData();
  const router = useRouter();

  const [validatingUrl, setValidatingUrl] = useState(false);
  const [saving, setSaving] = useState(false);

  async function doUpdatePage(
    formik: PageFormikForm,
    values: InferType<typeof NewPageSchema>
  ) {
    setSaving(true);
    setValidatingUrl(true);

    const { status } = await httpPost({
      url: "/api/pages/validate-url",
      data: {
        url_slug: values.url_slug,
        page_id,
      },
    });

    setValidatingUrl(false);

    if (!status) {
      setSaving(false);
      return formik.setFieldError("url_slug", "Oops! URL has been taken");
    }

    try {
      await supabase
        .from("pages")
        .update(values as IPage)
        .match({ id: page_id });

      return await router.push(ROUTES.PAGES);
    } catch (e) {
      notifyError();
      setSaving(false);
    }
  }

  if (!page_id) return null;

  return (
    <>
      <Page
        title={page.title}
        subtitle="Edit Page"
        backRoute={`${ROUTES.PAGES}/${page_id}`}
        showBackButton={true}
      >
        <div className="max-w-8xl mx-auto">
          <div className="rounded-lg sm:border dark:border-gray-700 px-5 py-6 sm:px-6">
            <PageFormComponent
              page={page as IPage}
              mode="edit"
              validatingUrl={validatingUrl}
              saving={saving}
              onSubmit={doUpdatePage}
            />
          </div>
        </div>
      </Page>
    </>
  );
}

EditPage.getLayout = function getLayout(page: any) {
  return <AuthLayout>{page}</AuthLayout>;
};
