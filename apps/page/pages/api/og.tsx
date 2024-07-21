import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../public/fonts/Geist-SemiBold.otf", import.meta.url).toString()
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title");
  const body = searchParams.get("body") ?? "";
  const content = searchParams.get("content") ?? "";
  const logo = searchParams.get("logo");

  const fontData = await font;

  const randomNumber = Math.floor(Math.random() * 14) + 1;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          position: "relative",
          background: "#000000",
        }}
      >
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            opacity: 0.75,
          }}
          src={`https://changes.page/images/backgrounds/${randomNumber}.svg`}
          alt="bg"
        />

        <div tw="flex m-h-full">
          <div tw="flex flex-col m-h-full w-full py-12 px-4 p-8">
            <h2 tw="flex flex-col sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span tw="text-white text-7xl font-bold mt-6">{title}</span>
              <span tw="text-white text-5xl mt-6 leading-relaxed">{body}</span>
            </h2>
            <span tw="font-normal text-white text-3xl mt-12 text-ellipsis leading-relaxed">
              {content}
            </span>
          </div>
        </div>

        {!!logo && !logo.includes("svg") && (
          <img
            src={logo}
            tw="rounded-full"
            width={75}
            height={75}
            style={{ position: "absolute", top: 20, right: 25 }}
            alt="logo"
          />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
