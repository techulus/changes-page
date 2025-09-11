import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState, type JSX } from "react";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import { createAuditLog } from "../../../../utils/auditLog";
import { withSupabase } from "../../../../utils/supabase/withSupabase";
import { getPage } from "../../../../utils/useSSR";
import { useUserData } from "../../../../utils/useUser";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const page_id = ctx.params?.page_id;
  if (!page_id || Array.isArray(page_id)) {
    return { notFound: true };
  }

  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page_id,
      page,
    },
  };
});

export default function NewRoadmapBoard({
  page_id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { supabase, user } = useUserData();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    if (field === "title") {
      setFormData((prev) => {
        const newFormData = { ...prev, [field]: value };

        // Auto-generate slug from title if slug field is empty or hasn't been manually edited
        if (!prev.slug || prev.slug === generateSlugFromTitle(prev.title)) {
          const slug = generateSlugFromTitle(value);
          newFormData.slug = slug;
        }

        return newFormData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear errors
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreating(true);

    try {
      // Create the roadmap board
      const { data: board, error: boardError } = await supabase
        .from("roadmap_boards")
        .insert({
          page_id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          slug: formData.slug.trim(),
          is_public: true,
        })
        .select()
        .single();

      if (boardError) {
        if (boardError.code === "23505") {
          // Unique constraint violation
          setErrors({ slug: "This slug is already in use" });
        } else {
          console.error("Error creating board:", boardError);
          setErrors({ general: "Failed to create roadmap board" });
        }
        return;
      }

      // Initialize default stages for the board
      await supabase.rpc("initialize_roadmap_columns", { board_id: board.id });

      // Initialize default categories for the board
      await supabase.rpc("initialize_roadmap_categories", {
        board_id: board.id,
      });

      if (user) {
        await createAuditLog(supabase, {
          page_id: page_id,
          actor_id: user.id,
          action: `Created Roadmap Board: ${board.title}`,
          changes: { board },
        });
      }

      // Redirect to the roadmap page
      await router.push(`/pages/${page_id}/roadmap`);
    } catch (error) {
      console.error("Error creating roadmap board:", error);
      setErrors({ general: "Failed to create roadmap board" });
    } finally {
      setIsCreating(false);
    }
  };

  if (!page_id) return null;

  return (
    <Page
      title="New Roadmap Board"
      subtitle="Create a new roadmap board"
      showBackButton={true}
      backRoute={`/pages/${page_id}/roadmap`}
      containerClassName="lg:pb-0"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.general && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">
                  {errors.general}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="e.g., Product Roadmap 2024"
                />
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Describe what this roadmap is for..."
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Slug *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="e.g., product-roadmap-2024"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                URL-friendly identifier for this board. Only lowercase letters,
                numbers, and hyphens allowed.
              </p>
              {errors.slug && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.slug}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/pages/${page_id}/roadmap`)}
                className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Board"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}

NewRoadmapBoard.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
