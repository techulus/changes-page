import { baseOptions } from "@/app/layout.config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          text: "Documentation",
          url: "/docs",
        },
        {
          text: "Zapier",
          url: "https://changes.page/integrations/zapier",
        },
        {
          text: "GitHub",
          url: "https://github.com/techulus/changes-page",
        },
        {
          text: "Support",
          url: "https://changes.page/support",
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
