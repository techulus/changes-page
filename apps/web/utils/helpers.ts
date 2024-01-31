import { notifyError } from "../components/core/toast.component";

export const getAppBaseURL = () => {
  return process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
};

export const httpPost = async ({ url, data = {} }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status == 403) {
    notifyError("Please subscribe to use this feature");
    throw new Error("Missing subscription");
  }

  if (res.status >= 400) {
    throw new Error("Request failed");
  }

  return res.json();
};

export const httpGet = async ({ url }) => {
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

export const httpPut = async ({ url, data = {} }) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status >= 400) {
    throw new Error("Request failed");
  }

  return res.json();
};

export const httpDelete = async ({ url }) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
  });

  if (res.status >= 400) {
    throw new Error("Request failed");
  }

  return res.json();
};
