'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, UploadCloud, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Basic validation
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF file. DOCX support is coming soon.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = async (selectedFile: File) => {
    if (!user) {
      alert('Please log in to upload a resume.');
      router.push('/');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate file reading and processing delay for UX
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(interval);
            return 80;
          }
          return prev + 5;
        });
      }, 500);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const analysisResult = await response.json();

      clearInterval(interval);
      setProgress(100);

      console.log('Analysis result received:', analysisResult);
      console.log('Saving to Firestore...');
      
      try {
        // Create a timeout promise to prevent indefinite hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Firestore connection timed out")), 5000)
        );

        // Save to Firestore with timeout
        const docRef = await Promise.race([
          addDoc(collection(db, 'resumes'), {
            userId: user.uid,
            fileName: selectedFile.name,
            fileType: selectedFile.name.split('.').pop() || 'unknown',
            status: 'Analysis Complete',
            score: analysisResult.overallScore || 0,
            targetRole: analysisResult.targetRole || 'Professional',
            matches: analysisResult.matches || 0,
            issues: analysisResult.issues || 0,
            uploadDate: serverTimestamp(),
            analysisData: JSON.stringify(analysisResult)
          }),
          timeoutPromise
        ]) as any;

        console.log('Saved to Firestore with ID:', docRef.id);
        // Redirect to analysis page with the new document ID
        router.push(`/analysis?id=${docRef.id}`);
      } catch (dbError: any) {
        console.error('Failed to save to Firestore:', dbError);
        alert(`Warning: Analysis succeeded, but failed to save to database. Error: ${dbError.message}. Make sure Firestore is enabled in your Firebase console!`);
        // Fallback: save to session storage and redirect without ID (analysis page will need to support this)
        sessionStorage.setItem('temp_resume_analysis', JSON.stringify(analysisResult));
        router.push('/analysis?temp=true');
      }

    } catch (error: any) {
      console.error('Error processing resume:', error);
      alert(`Error: ${error.message || 'An unknown error occurred while processing your resume.'}`);
      setIsProcessing(false);
      setProgress(0);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ResumePulse</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Templates</Link>
          <Link href="/upload" className="text-blue-600 font-bold">Upload</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center overflow-hidden ring-2 ring-gray-100">
             {user?.photoURL ? (
               <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
             ) : (
               <span className="text-orange-800 font-bold text-sm">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full grid md:grid-cols-3 gap-8">
        {/* Left Column: Upload Area */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload your resume</h1>
            <p className="text-gray-500 mt-2 text-lg">Get instant AI-powered feedback on your CV&apos;s performance and ATS compatibility.</p>
          </div>

          {/* Drag & Drop Zone */}
          {!isProcessing && (
            <div 
              className={`bg-white border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer group relative overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-200 hover:bg-blue-50/50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.docx" 
                onChange={handleFileInput}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Drag and drop your resume here</h3>
                <p className="text-gray-500">Or click the button below to browse your files</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm mt-4">
                  Browse files
                </button>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mt-6">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> PDF</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> DOCX</span>
                  <span>MAX 5MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center animate-spin">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                  <span className="font-bold text-gray-900">Processing {file?.name}...</span>
                </div>
                <span className="font-black text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Analyzing layout and keywords</span>
                <span>Please wait...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tips & Upgrade */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tips for a better scan</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Use standard fonts</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Stick to Arial, Calibri, or Helvetica for best readability by ATS.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Avoid graphics & columns</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Complex layouts can confuse automated scanners. Keep it simple.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">No personal photos</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Many companies exclude resumes with photos to avoid bias.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Keywords matter</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Ensure your skills match the job description exactly.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Pro Upgrade Card */}
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3">Pro Analysis</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Upgrade to get a detailed breakdown of how your resume ranks against specific job roles.
              </p>
              <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm text-gray-500">© 2024 ResumePulse AI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
