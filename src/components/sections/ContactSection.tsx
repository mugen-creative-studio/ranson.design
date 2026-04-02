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
    <div className="max-w-[720px] mx-auto px-4 lg:ml-[360px] xl:ml-[360px]">
      <h2 className="text-4xl font-bold text-navy mb-6">Contact</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <textarea
          placeholder="Message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
        />
        <button
          type="submit"
          className="bg-navy text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-navy-light transition-colors self-start"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
