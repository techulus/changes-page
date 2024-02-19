export async function runWorkflow(
  workflowId: string,
  data: any
): Promise<string> {
  const { success, result } = await fetch(
    `https://manageprompt.com/api/v1/run/${workflowId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MANAGEPROMPT_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((response) => response.json());

  if (!success) {
    throw new Error("Failed to run workflow");
  }

  return result;
}

export async function getPubToken(): Promise<string> {
  const { token, success } = await fetch(
    `https://manageprompt.com/api/v1/token`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MANAGEPROMPT_SECRET}`,
      },
    }
  ).then((response) => response.json());

  if (!success) {
    throw new Error("Failed to get token");
  }

  return token;
}
