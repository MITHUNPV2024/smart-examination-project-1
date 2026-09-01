import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { subject: 'Maths', average: 78, ward: 85 },
  { subject: 'Physics', average: 72, ward: 68 },
  { subject: 'Chemistry', average: 81, ward: 90 },
  { subject: 'Programming', average: 75, ward: 94 },
  { subject: 'Mechanics', average: 65, ward: 72 },
];

export const ParentWard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Parent/Guardian Portal
            </span>
            <span className="text-xs text-slate-400">Academic Year 2026-2027</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <User className="h-6 w-6 text-indigo-400" />
            <span>Ward Performance Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ward: <strong className="text-slate-200">Harry Potter</strong> (Roll No: <span className="font-mono text-indigo-300">WIT-CSE-2026-001</span>)
          </p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-right text-xs">
          <p className="text-slate-400">Current Semester</p>
          <p className="font-bold text-indigo-400 text-sm">Semester 1 B.Tech CSE</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ward Semester CGPA</p>
            <h3 className="text-3xl font-extrabold mt-1 text-indigo-400">8.45</h3>
            <p className="text-[10px] text-slate-500 mt-1">Rank #4 in Department</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Attendance Percentage</p>
            <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">87.5%</h3>
            <p className="text-[10px] text-slate-500 mt-1">Status: Regular Attendance</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fee Clearance</p>
            <h3 className="text-3xl font-extrabold mt-1 text-slate-100">100% Cleared</h3>
            <p className="text-[10px] text-emerald-400 mt-1">No outstanding dues</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Subject Performance Comparison</CardTitle>
            <CardDescription>Comparing Ward's score against class average</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subject" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="average" name="Class Average" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ward" name="Ward Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mentor Notes */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Faculty Mentor Notes</CardTitle>
            <CardDescription>Feedback from subject instructors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-indigo-400">CSE-101 Data Structures Lab</p>
              <p className="text-slate-300 leading-relaxed">
                "Harry demonstrates exceptional proficiency in algorithm design and laboratory practicals."
              </p>
              <p className="text-[10px] text-slate-500 font-semibold pt-1">- Prof. Remus Lupin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentWard;
