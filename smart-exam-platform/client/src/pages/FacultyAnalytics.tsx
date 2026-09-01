import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, AlertTriangle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gradeDistribution = [
  { grade: 'O (90-100)', count: 14, fill: '#6366f1' },
  { grade: 'A+ (80-89)', count: 28, fill: '#818cf8' },
  { grade: 'A (70-79)', count: 35, fill: '#a5b4fc' },
  { grade: 'B (60-69)', count: 18, fill: '#cbd5e1' },
  { grade: 'C (50-59)', count: 8, fill: '#f59e0b' },
  { grade: 'F (Below 50)', count: 4, fill: '#ef4444' },
];

const coAttainment = [
  { co: 'CO1 (Arrays)', percentage: 88 },
  { co: 'CO2 (Stacks/Queues)', percentage: 82 },
  { co: 'CO3 (Trees)', percentage: 74 },
  { co: 'CO4 (Graphs)', percentage: 68 },
  { co: 'CO5 (Sorting)', percentage: 91 },
];

export const FacultyAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-teal-900/40 via-indigo-900/20 to-slate-900 border border-teal-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Department Evaluation Metrics
            </span>
            <span className="text-xs text-slate-400">Subject: CSE-101 Data Structures</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-teal-400" />
            <span>Class Performance & Outcome Attainment</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Course outcome (CO-PO) attainment percentages, mark distribution, and remedial intervention alerts.
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-1.5">
          <Award className="h-4 w-4" />
          <span>Export Analytics PDF</span>
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Pass Rate</p>
            <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">96.3%</h3>
            <p className="text-[10px] text-slate-500 mt-1">103 passed out of 107</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Class Average Score</p>
            <h3 className="text-3xl font-extrabold mt-1 text-indigo-400">76.8 / 100</h3>
            <p className="text-[10px] text-slate-500 mt-1">Highest: 98, Lowest: 42</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CO Attainment Level</p>
            <h3 className="text-3xl font-extrabold mt-1 text-teal-400">80.6%</h3>
            <p className="text-[10px] text-slate-500 mt-1">Target threshold: 70%</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Remedial Targets</p>
            <h3 className="text-3xl font-extrabold mt-1 text-rose-400">4 Students</h3>
            <p className="text-[10px] text-slate-500 mt-1">Below 50% cutoff mark</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Grade Distribution Breakdown</CardTitle>
            <CardDescription>Number of students per grade band in CSE-101</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="grade" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Course Outcome (CO) Attainment</CardTitle>
            <CardDescription>Attainment percentage by curriculum outcome unit</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coAttainment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis type="category" dataKey="co" stroke="#94a3b8" width={140} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="percentage" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Remedial Targets Table */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <span>Remedial Student Intervention Target List</span>
          </CardTitle>
          <CardDescription>Students requiring additional coaching prior to supplementary exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 px-3">Roll Number</th>
                  <th className="pb-3 px-3">Student Name</th>
                  <th className="pb-3 px-3">Mid-Term Score</th>
                  <th className="pb-3 px-3">Attendance</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { roll: 'WIT-CSE-2026-089', name: 'Neville Longbottom', mark: '42 / 100', att: '64.5%', status: 'NEEDS_COACHING' },
                  { roll: 'WIT-CSE-2026-092', name: 'Seamus Finnigan', mark: '45 / 100', att: '71.0%', status: 'NEEDS_COACHING' },
                  { roll: 'WIT-CSE-2026-098', name: 'Gregory Goyle', mark: '38 / 100', att: '58.0%', status: 'CRITICAL' },
                  { roll: 'WIT-CSE-2026-102', name: 'Vincent Crabbe', mark: '36 / 100', att: '55.0%', status: 'CRITICAL' },
                ].map((s) => (
                  <tr key={s.roll} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-400">{s.roll}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{s.name}</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">{s.mark}</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">{s.att}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button size="sm" variant="glass">Assign Remedial</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyAnalytics;
