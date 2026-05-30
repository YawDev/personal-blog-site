import { Metadata } from "next";
import Link from "next/dist/client/link";

export const metadata: Metadata = {
  title: "401 | Unauthorized",
  description: "401 - Not Authorized to View Page.",
};


export default function UnauthorizedPage() {
  return (
    <>
       <title>401 | Unauthorized</title>
       <div className="flex flex-col items-center justify-center h-screen">
       <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
       <p className="text-lg text-gray-600">You are not authorized to view this page.</p>
       <Link href="/" className="mt-6 text-blue-500 hover:underline">Go back to Home</Link>
       </div>
    </>

  );
}
