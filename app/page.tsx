'use client';

import Link from 'next/link';
import { FileText, CheckCircle2, Target, MessageSquare, Star, ArrowRight, UploadCloud, Globe, Mail } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      await signInWithGoogle();
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ResumePulse</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#testimonials" className="hover:text-gray-900 transition-colors">Testimonials</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button onClick={signInWithGoogle} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</button>
              <button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-8 py-20 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Star className="w-3.5 h-3.5 fill-current" />
              AI-Powered Success
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Land Your Dream Job with a Data-Driven Resume
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              ResumePulse uses advanced AI and expert insights to optimize your resume for ATS systems and recruiters. Get 3x more interviews today.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                <UploadCloud className="w-5 h-5" />
                Upload Your Resume
              </button>
              <Link href="/analysis" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl text-base font-semibold transition-colors w-full sm:w-auto text-center">
                View Sample Review
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">Join 50,000+ successful job seekers</p>
            </div>
          </div>
          <div className="relative">
            {/* Mockup UI */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Analysis Report</span>
              </div>
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Overall Score</h3>
                    <div className="w-32 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="w-[85%] h-full bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-4xl font-black text-blue-600">85</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-900 font-medium">Strong action verbs used in experience section.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <Target className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-900 font-medium">Contact information is missing LinkedIn profile URL.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl -z-10 opacity-70"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center px-4">
              <div className="text-4xl font-black text-blue-600 mb-1">95%</div>
              <div className="text-sm text-gray-500 font-medium">Success Rate</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-black text-gray-900 mb-1">50k+</div>
              <div className="text-sm text-gray-500 font-medium">Resumes Optimized</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-black text-gray-900 mb-1">25%</div>
              <div className="text-sm text-gray-500 font-medium">Salary Increase</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-black text-gray-900 mb-1">4.9/5</div>
              <div className="text-sm text-gray-500 font-medium">User Rating</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ResumePulse?</h2>
              <p className="text-gray-600 text-lg">Our dual-approach combines lightning-fast AI with the nuanced touch of industry experts.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Smart Scan</h3>
                <p className="text-gray-600 leading-relaxed">Instant scoring based on 50+ critical hiring factors used by modern Applicant Tracking Systems.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Feedback</h3>
                <p className="text-gray-600 leading-relaxed">Detailed annotations from recruiters and hiring managers in your specific industry field.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Optimization</h3>
                <p className="text-gray-600 leading-relaxed">We ensure your resume bypasses automated filters and lands directly in front of human eyes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Flexible Pricing Plans</h2>
              <p className="text-gray-600 text-lg">Choose the level of feedback you need to fast-track your career growth.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {/* Basic */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">$0</span>
                  <span className="text-gray-500 font-medium">/free</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Instant AI Scan</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Overall Score (0-100)</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0">
                      <div className="w-2 h-0.5 bg-gray-200 rounded-full"></div>
                    </div>
                    <span>Expert Recruiter Review</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                  Start for Free
                </button>
              </div>

              {/* Professional */}
              <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">$49</span>
                  <span className="text-gray-500 font-medium">/one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-medium text-gray-900">Advanced AI Diagnostics</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-medium text-gray-900">1-Page Expert Feedback</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-medium text-gray-900">ATS Optimization Guide</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-medium text-gray-900">48-Hour Turnaround</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  Choose Professional
                </button>
              </div>

              {/* Executive */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Executive</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">$99</span>
                  <span className="text-gray-500 font-medium">/one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Full AI + Human Audit</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Industry-Specific Review</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Cover Letter Review</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>LinkedIn Profile Audit</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                  Choose Executive
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to double your interview rate?</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10">Stop guessing what recruiters want. Get the data-driven insights you need to stand out from the competition.</p>
              <Link href="/upload" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Analyze My Resume Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">ResumePulse</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Helping professionals worldwide unlock their career potential through expert resume optimization and AI analysis.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">AI Analysis</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Expert Review</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">ATS Checker</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2024 ResumePulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-400">
            <Globe className="w-5 h-5 hover:text-gray-600 cursor-pointer transition-colors" />
            <Mail className="w-5 h-5 hover:text-gray-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
