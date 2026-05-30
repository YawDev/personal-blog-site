import { Metadata } from "next";
import Link from "next/dist/client/link";

export const metadata: Metadata = {
  title: { absolute: "404 | Not Found" },
  description: "404 - The page or resource you are looking for does not exist.",
};

export default function NotFoundPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600">Sorry, the resource or page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 text-blue-500 hover:underline">Go back to Home</Link>
      </div>
    </>
  );
}