export const httpPost = async ({
  url,
  data = {},
}: {
  url: string;
  data: any;
}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  const payload = await res.json();

  if (res.status >= 400 || !payload.ok) {
    // throw error with response body
    throw new Error(payload.message);
  }

  return payload;
};

export const httpGet = async ({ url }: { url: string }) => {
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      Cache: "no-cache",
    }),
    credentials: "include",
  });

  if (res.status >= 400) {
    throw new Error("Request failed");
  }

  return res.json();
};
