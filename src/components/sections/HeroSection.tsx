export function HeroSection() {
  return (
    <div className="w-full max-w-[898px] min-w-[720px] px-10">
      <div className="mb-6">
        <p
          className="font-normal text-[#4b5563]"
          style={{ fontSize: "26px", lineHeight: "48px", letterSpacing: "-0.26px" }}
        >
          Hi, my name is
        </p>
        <h1
          className="font-normal text-[#2b4159]"
          style={{ fontSize: "68px", lineHeight: "85px", letterSpacing: "2px" }}
        >
          Ranson Vorpahl
        </h1>
      </div>
      <p
        className="font-normal text-[#2b4159] mb-8"
        style={{ fontSize: "42px", lineHeight: "64px", letterSpacing: "-0.63px" }}
      >
        I am a full-stack designer with over five years of experience crafting
        desktop and mobile experiences in AI, enterprise, ed-tech, and travel.
      </p>
      <p
        className="font-normal text-[#4b5563]"
        style={{ fontSize: "16px", lineHeight: "32px", letterSpacing: "0.16px" }}
      >
        Currently, I work at Cloud Campaign where I build features that help
        businesses of all sizes grow their Social Media presence, with recent
        work exploring ways AI can streamline the process.
      </p>
    </div>
  )
}
