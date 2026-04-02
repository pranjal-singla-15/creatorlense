import React, { useState } from "react";
import SignIn from "./pages/Sign_In";
import {
  FiBarChart2,
  FiGithub,
  FiLinkedin,
  FiSearch,
  FiShield,
  FiTwitter,
  FiUsers,
} from "react-icons/fi";

export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);

  if (showSignIn) {
    return <SignIn onBack={() => setShowSignIn(false)} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-gray-900">
      <div
        className="fixed inset-0 -z-50 h-full w-full bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 -z-40 h-full w-full bg-slate-950/10 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <nav className="sticky top-0 z-40 border-b border-white/20 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-2 shadow-md">
                <FiSearch size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">CreatorLens</span>
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <a href="#" className="font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="#" className="font-medium text-gray-600 hover:text-gray-900">
                Creators
              </a>
              <a href="#" className="font-medium text-gray-600 hover:text-gray-900">
                Reports
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button className="rounded-lg p-2 hover:bg-white/40" type="button">
                <FiSearch size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="rounded-lg border border-white/60 bg-white/40 px-5 py-2 text-sm hover:bg-white/60"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 py-28 md:py-40">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 via-blue-200/30 to-cyan-200/40 blur-3xl opacity-70" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="z-10 space-y-8">
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Detect Fake{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Influencers
              </span>{" "}
              Instantly
            </h1>

            <p className="max-w-lg text-lg text-gray-600">
              CreatorLens helps brands detect fake followers, measure real engagement,
              and find trustworthy influencers.
            </p>

            <div className="flex gap-4 pt-4">
              <button
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105"
                type="button"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="rounded-xl border border-white/80 bg-white/60 px-8 py-4 backdrop-blur-md"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-[350px] w-[500px] rounded-3xl bg-gradient-to-br from-purple-300/40 to-blue-300/40 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-20 text-center text-4xl font-bold">
            Platform <span className="text-purple-600">Features</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl hover:shadow-xl">
              <div className="mb-6 w-fit rounded-xl bg-purple-100 p-3">
                <FiShield size={22} className="text-purple-700" />
              </div>
              <h3 className="mb-2 font-bold">Fake Follower Detection</h3>
              <p className="text-gray-600">Identify suspicious followers using AI insights.</p>
            </div>

            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl hover:shadow-xl">
              <div className="mb-6 w-fit rounded-xl bg-blue-100 p-3">
                <FiBarChart2 size={22} className="text-blue-700" />
              </div>
              <h3 className="mb-2 font-bold">Engagement Analytics</h3>
              <p className="text-gray-600">Track real engagement metrics.</p>
            </div>

            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl hover:shadow-xl">
              <div className="mb-6 w-fit rounded-xl bg-purple-100 p-3">
                <FiSearch size={22} className="text-purple-700" />
              </div>
              <h3 className="mb-2 font-bold">Authenticity Score</h3>
              <p className="text-gray-600">Score creators based on trust.</p>
            </div>

            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl hover:shadow-xl">
              <div className="mb-6 w-fit rounded-xl bg-cyan-100 p-3">
                <FiUsers size={22} className="text-cyan-700" />
              </div>
              <h3 className="mb-2 font-bold">Creator Comparison</h3>
              <p className="text-gray-600">Compare influencers easily.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gradient-to-b from-white/40 to-white/20 px-6 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-5">
            <div className="space-y-6 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-2">
                  <FiSearch className="text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">CreatorLens</span>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">
                The leading analytics platform for detecting fake influencers and
                measuring authentic engagement.
              </p>

              <div className="flex gap-3">
                <div className="rounded-full bg-white p-2 shadow transition hover:scale-105">
                  <FiTwitter className="text-purple-600" />
                </div>
                <div className="rounded-full bg-white p-2 shadow transition hover:scale-105">
                  <FiLinkedin className="text-purple-600" />
                </div>
                <div className="rounded-full bg-white p-2 shadow transition hover:scale-105">
                  <FiGithub className="text-purple-600" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Dashboard</li>
                <li>Reports</li>
                <li>API</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press Kit</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Guides</li>
                <li>Partners</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
                <li>Security</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between border-t pt-6 text-sm text-gray-600 md:flex-row">
            <p>© 2026 CreatorLens. All rights reserved.</p>

            <div className="mt-4 flex gap-6 md:mt-0">
              <span className="cursor-pointer hover:text-gray-900">Privacy</span>
              <span className="cursor-pointer hover:text-gray-900">Terms</span>
              <span className="cursor-pointer hover:text-gray-900">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
