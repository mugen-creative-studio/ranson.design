"use client"

import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="w-full max-w-[898px] min-w-[720px] px-10">
      <h2
        className="font-normal text-[#2b4159] mb-6"
        style={{ fontSize: "42px", lineHeight: "64px", letterSpacing: "-0.63px" }}
      >
        Contact
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="border border-[#e5e7eb] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b4159]/20"
          style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px", color: "#2b4159" }}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className="border border-[#e5e7eb] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b4159]/20"
          style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px", color: "#2b4159" }}
        />
        <textarea
          placeholder="Message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="border border-[#e5e7eb] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b4159]/20 resize-none"
          style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px", color: "#2b4159" }}
        />
        <button
          type="submit"
          className="rounded-lg px-6 py-3 self-start transition-opacity hover:opacity-90"
          style={{
            background: "#0066b3",
            color: "#f7f8f9",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
