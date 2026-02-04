import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-2">Raven Roofing Owner SaaS</h1>
      <p className="text-zinc-300 mb-6">Admin dashboard for Jobs / Projects / Users.</p>
      <Link className="underline" href="/login">Go to Login</Link>
    </div>
  );
}
