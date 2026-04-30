'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, CheckCircle2, AlertTriangle, Settings, Share2, Download, Eye, Key, LayoutTemplate, Briefcase, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

function AnalysisContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const isTemp = searchParams.get('temp');
      
      if (isTemp === 'true') {
        try {
          const tempData = sessionStorage.getItem('temp_resume_analysis');
          if (tempData) {
            const parsed = JSON.parse(tempData);
            setResume({
              status: 'Analysis Complete',
              score: parsed.overallScore,
              matches: parsed.matches,
              issues: parsed.issues,
              targetRole: parsed.targetRole,
              fileName: 'Uploaded Resume',
              analysisData: tempData
            });
            setLoading(false);
            return;
          }
        } catch(e) {
          console.error('Failed to load temp data', e);
        }
      }

      if (!id || !user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'resumes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setResume({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document or unauthorized!");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, user, router, searchParams]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h2>
        <Link href="/dashboard" className="text-blue-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  let analysisData: any = {};
  try {
    if (resume.analysisData) {
      analysisData = JSON.parse(resume.analysisData);
    }
  } catch (e) {
    console.error("Error parsing analysis data", e);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">ResumePulse</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-gray-500" />
            {resume.status}
          </span>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
            <Share2 className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center overflow-hidden ring-2 ring-gray-100 ml-2">
             {user?.photoURL ? (
               <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
             ) : (
               <span className="text-orange-800 font-bold text-sm">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
        {/* Left Column: PDF Preview */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
              <Eye className="w-4 h-4 text-blue-600" />
              Preview: {resume.fileName}
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-200 ml-2">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center">
            {/* Mock Resume Document */}
            <div className="bg-white w-full max-w-[800px] shadow-lg border border-gray-200 p-12 font-serif text-gray-800 relative">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{user?.displayName || 'Applicant Name'}</h1>
                <p className="text-gray-500 uppercase tracking-wider text-sm">{resume.targetRole || 'Professional'} | Location</p>
              </div>

              <div className="mb-8">
                <h2 className="text-blue-800 font-bold uppercase tracking-wider border-b-2 border-blue-100 pb-2 mb-4 text-sm">Professional Summary</h2>
                <p className="text-sm leading-relaxed">
                  Strategic professional with experience in scaling platforms and managing cross-functional teams. Proven track record in increasing user retention and launching AI-driven features.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-blue-800 font-bold uppercase tracking-wider border-b-2 border-blue-100 pb-2 mb-4 text-sm">Experience</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-gray-900">Senior Role | Company Inc.</h3>
                    <span className="text-gray-500 text-sm italic">2020 — Present</span>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
                    <li className="relative">
                      <span className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-100 rounded-full opacity-50"></span>
                      Led the vision and execution for the flagship automation suite.
                    </li>
                    <li>Collaborated with engineering to reduce technical debt by 20%.</li>
                    <li className="relative">
                      <span className="absolute -left-2 top-0 bottom-0 w-1 bg-red-100 rounded-full opacity-50"></span>
                      Managed a team of designers and developers to ship features.
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-blue-800 font-bold uppercase tracking-wider border-b-2 border-blue-100 pb-2 mb-4 text-sm">Skills</h2>
                <p className="text-sm leading-relaxed">
                  Agile/Scrum, Product Roadmap, SQL, Python, Tableau, Jira, Figma, Stakeholder Management.
                </p>
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 font-sans uppercase tracking-widest">
                Page 1 of 1
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Report */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-8">
          {/* Overall Score Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-8 mb-8">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * (resume.score || 0)) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black text-gray-900">{resume.score || 0}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Score</h2>
                <p className="text-gray-500">Better than 82% of applicants for <strong className="text-gray-900">{resume.targetRole || 'this'}</strong> roles</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100 text-center flex-1">
                <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Matches</div>
                <div className="text-2xl font-black text-green-700">{resume.matches || 0}</div>
              </div>
              <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 text-center flex-1">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Issues</div>
                <div className="text-2xl font-black text-orange-700">{resume.issues || 0}</div>
              </div>
            </div>
          </div>

          {/* Keyword Matching */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Keyword Matching</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {analysisData.keywordMatches && analysisData.keywordMatches.length > 0 ? (
                  analysisData.keywordMatches.map((keyword: string, index: number) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                      <CheckCircle2 className="w-4 h-4" /> {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specific keywords matched.</span>
                )}
              </div>
            </div>
          </div>

          {/* Formatting & Layout */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <LayoutTemplate className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Formatting & Layout Issues</h3>
            </div>
            <div className="p-6 space-y-4">
              {analysisData.formattingIssues && analysisData.formattingIssues.length > 0 ? (
                analysisData.formattingIssues.map((issue: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Formatting Issue</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{issue}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Looks Good!</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">No major formatting issues detected.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Experience Suggestions */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Experience Suggestions</h3>
              </div>
              <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> AI Insights
              </span>
            </div>
            <div className="p-6 space-y-6">
              {analysisData.suggestions && analysisData.suggestions.length > 0 ? (
                analysisData.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">Suggestion {index + 1}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No suggestions available.</div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AnalysisContent />
    </Suspense>
  );
}
