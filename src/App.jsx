import { useState } from 'react';
import SignIn from './pages/Sign_In';
import {
  FiBarChart2,
  FiGithub,
  FiSearch,
  FiShield,
  FiTwitter,
  FiLinkedin,
  FiUsers
} from 'react-icons/fi';

export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);

  if (showSignIn) {
    return <SignIn onBack={() => setShowSignIn(false)} />;
  }

  return (
    <div className="relative w-full overflow-x-hidden text-gray-900">
      <div
        className="fixed inset-0 -z-50 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      <div className="fixed inset-0 -z-40 w-full h-full bg-white/5 backdrop-blur-[0.5px]" />

      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-md">
                <FiSearch size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">CreatorLens</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Creators</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Reports</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white/40">
                <FiSearch size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="px-5 py-2 rounded-lg bg-white/40 border border-white/60 hover:bg-white/60 text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative px-6 py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 via-blue-200/30 to-cyan-200/40 blur-3xl opacity-70" />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Detect Fake{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Influencers
              </span>{' '}
              Instantly
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              CreatorLens helps brands detect fake followers, measure real engagement, and find trustworthy influencers.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:scale-105 transition">
                Get Started
              </button>

              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/80"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute w-[500px] h-[350px] bg-gradient-to-br from-purple-300/40 to-blue-300/40 rounded-3xl blur-2xl" />
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20">
            Platform <span className="text-purple-600">Features</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white/50 backdrop-blur-xl p-8 hover:shadow-xl">
              <div className="p-3 bg-purple-100 rounded-xl mb-6 w-fit">
                <FiShield size={22} className="text-purple-700" />
              </div>
              <h3 className="font-bold mb-2">Fake Follower Detection</h3>
              <p className="text-gray-600">Identify suspicious followers using AI insights.</p>
            </div>

            <div className="rounded-2xl bg-white/50 backdrop-blur-xl p-8 hover:shadow-xl">
              <div className="p-3 bg-blue-100 rounded-xl mb-6 w-fit">
                <FiBarChart2 size={22} className="text-blue-700" />
              </div>
              <h3 className="font-bold mb-2">Engagement Analytics</h3>
              <p className="text-gray-600">Track real engagement metrics.</p>
            </div>

            <div className="rounded-2xl bg-white/50 backdrop-blur-xl p-8 hover:shadow-xl">
              <div className="p-3 bg-purple-100 rounded-xl mb-6 w-fit">
                <FiSearch size={22} className="text-purple-700" />
              </div>
              <h3 className="font-bold mb-2">Authenticity Score</h3>
              <p className="text-gray-600">Score creators based on trust.</p>
            </div>

            <div className="rounded-2xl bg-white/50 backdrop-blur-xl p-8 hover:shadow-xl">
              <div className="p-3 bg-cyan-100 rounded-xl mb-6 w-fit">
                <FiUsers size={22} className="text-cyan-700" />
              </div>
              <h3 className="font-bold mb-2">Creator Comparison</h3>
              <p className="text-gray-600">Compare influencers easily.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-20 border-t border-gray-200 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <FiSearch className="text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">CreatorLens</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                The leading analytics platform for detecting fake influencers and measuring authentic engagement.
              </p>

              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-white shadow hover:scale-105 transition">
                  <FiTwitter className="text-purple-600" />
                </div>
                <div className="p-2 rounded-full bg-white shadow hover:scale-105 transition">
                  <FiLinkedin className="text-purple-600" />
                </div>
                <div className="p-2 rounded-full bg-white shadow hover:scale-105 transition">
                  <FiGithub className="text-purple-600" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Dashboard</li>
                <li>Reports</li>
                <li>API</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press Kit</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Guides</li>
                <li>Partners</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
                <li>Security</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2026 CreatorLens. All rights reserved.</p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
              <span className="hover:text-gray-900 cursor-pointer">Terms</span>
              <span className="hover:text-gray-900 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
