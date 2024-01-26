import { getPageByIntegrationSecret } from "../../../../utils/useDatabase";

const authenticateZapierIntegration = async (req, res) => {
  if (req.method === "GET") {
    const { page_secret_key } = req.query;

    if (!page_secret_key) {
      res.status(400).json({
        error: { statusCode: 400, message: "Page secret is missing" },
      });
    }

    try {
      const page = await getPageByIntegrationSecret(page_secret_key);

      return res.status(200).json({ title: page?.title });
    } catch (err) {
      console.log("authenticateZapierIntegration", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
};

export default authenticateZapierIntegration;
