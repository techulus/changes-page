import { createSignedStreamingUrl } from "../../../utils/manageprompt";
import { withAuth } from "../../../utils/withAuth";

const expandConcept = withAuth<{ url: string }>(async (req, res) => {
  if (req.method === "POST") {
    const { workflowId } = req.body;

    try {
      const url = await createSignedStreamingUrl(workflowId);

      return res.status(200).json({ url });
    } catch (err) {
      console.log("expandConcept", err?.response?.data || err?.message);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
});

export default expandConcept;
