export const getAppBaseURL = () => {
  return process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
};
