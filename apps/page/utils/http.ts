export const httpPost = async <T = any, U = {}>({
  url,
  data,
}: {
  url: string;
  data?: U;
}): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  const payload = await res.json();

  if (res.status >= 400 || !payload.success) {
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
