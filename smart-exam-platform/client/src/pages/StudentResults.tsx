import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, RefreshCw, Printer } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const [isRevalModalOpen, setIsRevalModalOpen] = useState(false);
  const [revalSubmitted, setRevalSubmitted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('PHY-101');

  const results = [
    { code: 'CSE-101', name: 'Intro to Programming & Data Structures', credits: 4, internal: '42/50', external: '45/50', total: 87, grade: 'O', gradePoint: 10, status: 'PASS' },
    { code: 'MTH-101', name: 'Engineering Mathematics I', credits: 4, internal: '35/50', external: '41/50', total: 76, grade: 'A+', gradePoint: 9, status: 'PASS' },
    { code: 'PHY-101', name: 'Applied Physics Laboratory & Mechanics', credits: 4, internal: '28/50', external: '34/50', total: 62, grade: 'B', gradePoint: 7, status: 'PASS' },
    { code: 'ENG-101', name: 'Technical English Communication', credits: 3, internal: '40/50', external: '44/50', total: 84, grade: 'A+', gradePoint: 9, status: 'PASS' },
    { code: 'EEE-101', name: 'Basic Electrical & Electronics', credits: 4, internal: '38/50', external: '42/50', total: 80, grade: 'A+', gradePoint: 9, status: 'PASS' },
    { code: 'ENV-101', name: 'Environmental Studies & Ethics', credits: 3, internal: '45/50', external: '46/50', total: 91, grade: 'O', gradePoint: 10, status: 'PASS' },
  ];

  const handleApplyReval = (e: React.FormEvent) => {
    e.preventDefault();
    setRevalSubmitted(true);
    setTimeout(() => {
      setIsRevalModalOpen(false);
      setRevalSubmitted(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/20 to-slate-900 border border-emerald-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Published Results
            </span>
            <span className="text-xs text-slate-400">Semester 1 Examinations</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2">
            Academic Performance & Grade Sheet
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official semester evaluation sheet, credit points, and revaluation request module.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.print()} className="flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Print Grade Sheet</span>
          </Button>
          <Button variant="primary" onClick={() => setIsRevalModalOpen(true)} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Apply for Revaluation</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Semester SGPA</p>
            <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">8.45</h3>
            <p className="text-[10px] text-slate-500 mt-1">Out of 10.0</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cumulative CGPA</p>
            <h3 className="text-3xl font-extrabold mt-1 text-indigo-400">8.45</h3>
            <p className="text-[10px] text-slate-500 mt-1">Overall Term Score</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Earned Credits</p>
            <h3 className="text-3xl font-extrabold mt-1 text-slate-100">22 / 22</h3>
            <p className="text-[10px] text-slate-500 mt-1">100% Cleared</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Class Standing</p>
            <h3 className="text-3xl font-extrabold mt-1 text-amber-400">First Class with Dist</h3>
            <p className="text-[10px] text-slate-500 mt-1">Rank #4 in Department</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Sheet Table */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle>Semester 1 Mark Ledger</CardTitle>
          <CardDescription>Verified internal and external evaluation score log</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 px-3">Subject Code</th>
                  <th className="pb-3 px-3">Course Title</th>
                  <th className="pb-3 px-3">Credits</th>
                  <th className="pb-3 px-3">Internal (50)</th>
                  <th className="pb-3 px-3">External (50)</th>
                  <th className="pb-3 px-3">Total (100)</th>
                  <th className="pb-3 px-3">Grade</th>
                  <th className="pb-3 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map((r) => (
                  <tr key={r.code} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-400">{r.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{r.name}</td>
                    <td className="py-3 px-3 text-slate-300">{r.credits}</td>
                    <td className="py-3 px-3 text-slate-400">{r.internal}</td>
                    <td className="py-3 px-3 text-slate-400">{r.external}</td>
                    <td className="py-3 px-3 font-bold text-slate-100">{r.total}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Revaluation Request Modal */}
      {isRevalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-indigo-400" />
                <span>Apply for Digital Script Revaluation</span>
              </h3>
              <button onClick={() => setIsRevalModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            {revalSubmitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-100 text-sm">Revaluation Application Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Application ID <span className="font-mono text-indigo-300">REV-2026-8841</span> generated. Scanned script copy will be emailed upon re-audit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyReval} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Paper for Revaluation</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    {results.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} - {r.name} (Grade: {r.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Request Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="radio" name="reqType" defaultChecked className="text-indigo-600" />
                      <span>Revaluation & Mark Verification ($25)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="radio" name="reqType" className="text-indigo-600" />
                      <span>Request Scanned Answer Script Photocopy ($15)</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg space-y-1">
                  <p className="font-semibold text-indigo-300">Revaluation Policy:</p>
                  <p className="text-[11px] text-slate-400">
                    If revaluation alters score by &gt;5%, the revised higher mark will be published and fee refunded.
                  </p>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <Button variant="outline" type="button" onClick={() => setIsRevalModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Application & Pay $25
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
