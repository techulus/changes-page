import { IPageSettings } from "@changespage/supabase/types/page";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";
import { withAuth } from "../../../../utils/withAuth";

const getPageSettings = withAuth<IPageSettings>(async (req, res, { user }) => {
  if (req.method === "GET") {
    const { page_id } = req.query;

    try {
      console.log("getPageSettings", user?.id);

      const data = await createOrRetrievePageSettings(String(page_id));

      return res.status(200).json(data);
    } catch (err) {
      console.log("getPageSettings", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
});

export default getPageSettings;
