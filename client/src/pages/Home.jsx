import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Features data
const features = [
  {
    icon: "🤖",
    title: "AI-Powered Scoring",
    description:
      "Google Gemini analyses every resume against your job requirements and returns a match score from 0 to 100.",
  },
  {
    icon: "🏆",
    title: "Auto-Ranked Candidates",
    description:
      "Candidates are automatically ranked by match score. Your best fit appears at the top, instantly.",
  },
  {
    icon: "⚡",
    title: "Instant Analysis",
    description:
      "Upload a resume and get a full breakdown of skills, strengths, weaknesses, and interview recommendation in seconds.",
  },
];

// Steps data
const steps = [
  {
    number: "01",
    title: "Post a Job",
    description:
      "Create a job posting with required skills, experience, and description. Takes less than 2 minutes.",
  },
  {
    number: "02",
    title: "Upload Resumes",
    description:
      "Upload candidate resumes in PDF or DOCX format. Our AI immediately begins analysing each one.",
  },
  {
    number: "03",
    title: "Get AI Rankings",
    description:
      "Receive a ranked shortlist with match scores, strengths, weaknesses, and interview recommendations.",
  },
];

// Stats data
const stats = [
  { value: "10x", label: "Faster Screening" },
  { value: "100%", label: "AI Automated" },
  { value: "0", label: "Manual Review Needed" },
];

const Home = () => {

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-bg">

      {/* HERO SECTION */}
      <section
        className="relative px-6 py-32 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 50%, #818cf8 0%, transparent 50%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Google Gemini AI
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Hire Smarter with{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a5b4fc, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-Powered
            </span>{" "}
            Resume Screening
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop spending hours reading resumes. TalentLensAI automatically
            scores, ranks, and analyses every candidate against your job
            requirements — so you can focus on interviewing the best.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 border border-indigo-400/40 text-white font-medium rounded-lg hover:bg-indigo-500/10 transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Everything you need to hire faster
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            TalentLensAI combines AI analysis with a clean recruiter
            dashboard to make hiring decisions effortless.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-surface rounded-xl border border-border p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              How it works
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From job posting to ranked shortlist in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-full h-px bg-border" />
                )}

                <div className="relative">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center mb-4">
                    {step.number}
                  </div>

                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to hire smarter?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-md mx-auto">
            Join recruiters using TalentLensAI to screen candidates
            faster and make better hiring decisions.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">
              TalentLens<span className="text-primary">AI</span>
            </span>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Register
              </Link>
            </div>
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} TalentLensAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;