import { useState } from "react";

type WaitlistFormProps = {
  inputPadding?: string;
  inputBorderColor?: string;
  inputBorderRadius?: string;
  buttonBg?: string;
  buttonTextColor?: string;
  buttonRadius?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
};

export default function WaitlistForm({
  inputPadding = "8px",
  inputBorderColor = "#D1D5DB",
  inputBorderRadius = "8px",
  buttonBg = "#30A46C",
  buttonTextColor = "white",
  buttonRadius = "8px",
  buttonLabel = "🏅 Join the Beta Waitlist – Free to Join",
  successMessage = "You’re on the list 🎉",
  errorMessage = "Something went wrong. Try again.",
}: WaitlistFormProps) {
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
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      {/* Input */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: inputPadding,
          border: `1px solid ${inputBorderColor}`,
          borderRadius: inputBorderRadius,
          width: "100%",
          fontSize: "22px",
          height: "50px",
        }}
      />

      {/* Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: buttonBg,
          color: buttonTextColor,
          fontSize: "22px",
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: buttonRadius,
          border: "none",
          cursor: "pointer",
        }}
      >
        {status === "loading" ? "Submitting..." : buttonLabel}
      </button>

      {/* Status */}
      {status === "success" && <p style={{ color: "green" }}>{successMessage}</p>}
      {status === "error" && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}
