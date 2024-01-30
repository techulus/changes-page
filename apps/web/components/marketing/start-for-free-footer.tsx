import Link from "next/link";
import { ROUTES } from "../../data/routes.data";

export default function StartForFreeFooter() {
  return (
    <div className="bg-indigo-700">
      <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-3xl hero">
          <span className="block">Start free trial</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200 hero">
          Effortlessly{" "}
          <span className="underline decoration-yellow-500 text-white font-semibold">
            create compelling changelogs
          </span>{" "}
          and seamlessly{" "}
          <span className="underline decoration-red-500 text-white font-semibold">
            deliver product updates
          </span>{" "}
          with our no-code changelog tool.
        </p>
        <Link
          href={ROUTES.LOGIN}
          className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 sm:w-auto"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
