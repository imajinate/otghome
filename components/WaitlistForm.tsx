import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-black text-white p-2 rounded"
      >
        {status === "loading" ? "Submitting..." : "Join Waitlist"}
      </button>
      {status === "success" && <p className="text-green-600">You&apos;re on the list 🎉</p>}
      {status === "error" && <p className="text-red-600">Something went wrong. Try again.</p>}
    </form>
  );
}
