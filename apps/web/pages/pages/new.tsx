import { useRouter } from "next/router";
import { useState } from "react";
import { InferType } from "yup";
import { notifyError } from "../../components/core/toast.component";
import PageFormComponent, {
  NewPageSchema,
  PageFormikForm,
} from "../../components/forms/page-form.component";
import AuthLayout from "../../components/layout/auth-layout.component";
import Page from "../../components/layout/page.component";
import { ROUTES } from "../../data/routes.data";
import { track } from "../../utils/analytics";
import { httpPost } from "../../utils/http";

export default function NewPage() {
  const router = useRouter();

  const [validatingUrl, setValidatingUrl] = useState(false);
  const [saving, setSaving] = useState(false);

  async function doCreatePage(
    formik: PageFormikForm,
    values: InferType<typeof NewPageSchema>
  ) {
    setSaving(true);
    setValidatingUrl(true);

    const { status } = await httpPost({
      url: "/api/pages/validate-url",
      data: {
        url_slug: values.url_slug,
      },
    });

    setValidatingUrl(false);

    if (!status) {
      setSaving(false);
      return formik.setFieldError("url_slug", "Oops! URL has been taken");
    }

    try {
      await httpPost({
        url: "/api/pages/new",
        data: {
          ...values,
        },
      });

      track("PageCreated", {
        url_slug: values.url_slug,
      });

      return await router.push(ROUTES.PAGES);
    } catch (e) {
      notifyError();
      setSaving(false);
    }
  }

  return (
    <>
      <Page title="Create Page" backRoute={ROUTES.PAGES} showBackButton={true}>
        <div className="max-w-8xl mx-auto">
          <div className="rounded-lg sm:border dark:border-gray-700 px-5 py-6 sm:px-6">
            <PageFormComponent
              mode="create"
              validatingUrl={validatingUrl}
              saving={saving}
              onSubmit={doCreatePage}
            />
          </div>
        </div>
      </Page>
    </>
  );
}

NewPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
