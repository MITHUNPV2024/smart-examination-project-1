import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react';

export const ExamSchedules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdSession, setCreatedSession] = useState(false);

  const sessions = [
    { id: 'SESS-2026-01', name: 'End Semester Term Exams 2026', type: 'REGULAR', startDate: '2026-07-15', endDate: '2026-07-30', status: 'SCHEDULED', papers: 42 },
    { id: 'SESS-2026-02', name: 'Mid Term Internal Assessment I', type: 'INTERNAL', startDate: '2026-09-10', endDate: '2026-09-18', status: 'DRAFT', papers: 38 },
    { id: 'SESS-2026-03', name: 'Supplementary & Revaluation Exams', type: 'SUPPLEMENTARY', startDate: '2026-08-05', endDate: '2026-08-12', status: 'COMPLETED', papers: 14 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Exam Administration
            </span>
            <span className="text-xs text-slate-400">Term Session Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-indigo-400" />
            <span>Examination Session & Timetable Planner</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure academic exam sessions, publish paper timetables, and monitor clash detection logs.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setCreatedSession(false);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Exam Session</span>
        </Button>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sessions.map((s) => (
          <Card key={s.id} className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                  {s.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.status === 'SCHEDULED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  s.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {s.status}
                </span>
              </div>
              <CardTitle className="text-base mt-2">{s.name}</CardTitle>
              <CardDescription>{s.type} • {s.papers} Total Scheduled Papers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Start Date:</span>
                  <span className="font-semibold">{s.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">End Date:</span>
                  <span className="font-semibold">{s.endDate}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">Manage Timetable</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base">Configure Exam Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            {createdSession ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-100 text-sm">Exam Session Created & Published!</h4>
                <p className="text-xs text-slate-300">Clash detection passed with 0 timetable conflicts.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setCreatedSession(true); }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Session Title</label>
                  <input type="text" defaultValue="End Term Regular Exams 2026" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                    <input type="date" defaultValue="2026-07-15" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                    <input type="date" defaultValue="2026-07-30" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end space-x-3">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Create Session</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSchedules;
