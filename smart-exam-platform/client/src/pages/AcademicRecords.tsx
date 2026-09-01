import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Database, Plus } from 'lucide-react';

export const AcademicRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DEPT' | 'COURSE' | 'SUBJECT'>('DEPT');

  const departments = [
    { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Prof. Severus Snape', courses: 4, students: 640 },
    { code: 'ECE', name: 'Electronics & Communication', hod: 'Prof. Minerva McGonagall', courses: 3, students: 510 },
    { code: 'MECH', name: 'Mechanical Engineering', hod: 'Prof. Albus Dumbledore', courses: 2, students: 380 },
  ];

  const subjects = [
    { code: 'CSE-101', name: 'Intro to Programming & Data Structures', credits: 4, course: 'B.Tech CSE', semester: 'Sem 1' },
    { code: 'MTH-101', name: 'Engineering Mathematics I', credits: 4, course: 'B.Tech CSE', semester: 'Sem 1' },
    { code: 'PHY-101', name: 'Applied Physics & Mechanics', credits: 4, course: 'B.Tech CSE', semester: 'Sem 1' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Institution Master Data
            </span>
            <span className="text-xs text-slate-400 font-semibold">Academic Architecture</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <Database className="h-6 w-6 text-indigo-400" />
            <span>Academic Records & Curriculum Roster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Departments, Degree Courses, Semester Curriculums, and Subject Master Lists.
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2 shadow-lg shadow-indigo-600/30">
          <Plus className="h-4 w-4" />
          <span>Add Academic Entity</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('DEPT')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'DEPT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Departments (3)
        </button>
        <button
          onClick={() => setActiveTab('SUBJECT')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'SUBJECT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Curriculum Subjects (3)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'DEPT' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((d) => (
            <Card key={d.code} className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                    {d.code}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{d.courses} Degree Programs</span>
                </div>
                <CardTitle className="text-base mt-2">{d.name}</CardTitle>
                <CardDescription>HOD: {d.hod}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs flex justify-between items-center text-slate-300">
                  <span>Enrolled Students:</span>
                  <strong className="text-indigo-400 text-sm font-bold">{d.students}</strong>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-3 px-3">Subject Code</th>
                    <th className="pb-3 px-3">Course Title</th>
                    <th className="pb-3 px-3">Credits</th>
                    <th className="pb-3 px-3">Course Degree</th>
                    <th className="pb-3 px-3">Semester</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subjects.map((s) => (
                    <tr key={s.code} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-400">{s.code}</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">{s.name}</td>
                      <td className="py-3 px-3 text-slate-300">{s.credits} Credits</td>
                      <td className="py-3 px-3 text-slate-400">{s.course}</td>
                      <td className="py-3 px-3 text-slate-400">{s.semester}</td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="glass">Edit Syllabus</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcademicRecords;
