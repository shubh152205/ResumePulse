'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, UploadCloud, FileText, TrendingUp, Sparkles, MoreVertical, ArrowRight, Target } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface Resume {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  score: number;
  targetRole: string;
  uploadDate: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const q = query(
      collection(db, 'resumes'),
      where('userId', '==', user.uid),
      orderBy('uploadDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedResumes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Resume[];
      setResumes(fetchedResumes);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching resumes: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const avgScore = resumes.length > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.score || 0), 0) / resumes.length)
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search resumes..." 
              className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload New Resume
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!</h1>
            <p className="text-gray-500 mt-1">Here is your resume analysis overview for today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Resumes</p>
              <h3 className="text-3xl font-black text-gray-900">{resumes.length}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Avg. Score</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-black text-gray-900">{avgScore}</h3>
                <span className="text-gray-400 font-medium">/100</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+15% improvement</span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-2">Goal Progress</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Recent Uploads Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Uploads</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Resume Name</th>
                    <th className="px-6 py-4 font-semibold">Score</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date Uploaded</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading resumes...</td>
                    </tr>
                  ) : resumes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No resumes uploaded yet.</td>
                    </tr>
                  ) : (
                    resumes.map((resume) => (
                      <tr key={resume.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/analysis?id=${resume.id}`} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${resume.fileType.toLowerCase() === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                              <span className={`text-[10px] font-black uppercase ${resume.fileType.toLowerCase() === 'pdf' ? 'text-red-600' : 'text-blue-600'}`}>
                                {resume.fileType}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">{resume.fileName}</p>
                              <p className="text-xs text-gray-500">Targeting: {resume.targetRole || 'Not specified'}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-gray-900">{resume.score || 0}</span>
                            <span className="text-xs text-gray-400 font-medium">/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            resume.status === 'Analysis Complete' ? 'bg-green-50 text-green-700' :
                            resume.status === 'Processing' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              resume.status === 'Analysis Complete' ? 'bg-green-500' :
                              resume.status === 'Processing' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></span>
                            {resume.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {resume.uploadDate?.toDate ? resume.uploadDate.toDate().toLocaleDateString() : 'Just now'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Boost Score Banner */}
          <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl font-extrabold mb-3">Boost your score by 20 points!</h2>
              <p className="text-blue-100 leading-relaxed mb-6">
                Our latest AI model found that adding quantifiable metrics to your experience section increases recruiter interest by 45%. Try our &quot;Action Verbs&quot; tool.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
                Get Pro Tips
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden md:flex relative z-10 w-48 h-48 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm items-center justify-center flex-col gap-3 transform rotate-3 hover:rotate-0 transition-transform">
              <Sparkles className="w-12 h-12 text-white" />
              <span className="text-xs font-bold tracking-widest uppercase opacity-80">AI Optimized</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
