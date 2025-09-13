import { runWorkflow } from "../../../utils/manageprompt";
import { withAuth } from "../../../utils/withAuth";

const suggestTitle = withAuth<string[]>(async (req, res) => {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      const result = await runWorkflow("wf_e1eb79b1dc017ca189506d799453caae", {
        content,
      });

      const titles = JSON.parse(result);

      return res.status(200).json(titles);
    } catch (err) {
      console.log("suggestTitle", err?.response?.data || err?.message);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
});

export default suggestTitle;
