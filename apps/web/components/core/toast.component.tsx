import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

const Toaster = dynamic(() =>
  import("react-hot-toast").then((mod) => mod.Toaster)
);

export function createToastWrapper(prefersColorScheme: string) {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style:
          prefersColorScheme === "dark"
            ? {
                background: "#333",
                color: "#fff",
              }
            : {},
      }}
    />
  );
}

export function notifyInfo(message = null) {
  return toast(message);
}

export function notifySuccess(message = null) {
  return toast.success(message);
}

export function notifyError(message = null) {
  return toast.error(
    message || "Something went wrong, please try again or contact support."
  );
}
