import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, Printer, ShieldCheck, QrCode, FileText, CheckCircle2 } from 'lucide-react';

export const StudentExams: React.FC = () => {
  const { user } = useAuth();
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);
  const [selectedSeatMap, setSelectedSeatMap] = useState<string | null>(null);

  const exams = [
    {
      code: 'CSE-101',
      name: 'Intro to Programming & Data Structures',
      date: 'July 15, 2026',
      time: '10:00 AM - 01:00 PM',
      hall: 'Block B - Room 204',
      bench: 'Seat Row #3, Desk 14',
      invigilator: 'Prof. Severus Snape',
      status: 'CONFIRMED',
    },
    {
      code: 'MTH-101',
      name: 'Engineering Mathematics I',
      date: 'July 17, 2026',
      time: '10:00 AM - 01:00 PM',
      hall: 'Block A - Main Auditorium',
      bench: 'Seat Row #1, Desk 05',
      invigilator: 'Prof. Filius Flitwick',
      status: 'CONFIRMED',
    },
    {
      code: 'PHY-101',
      name: 'Applied Physics Laboratory & Mechanics',
      date: 'July 20, 2026',
      time: '02:00 PM - 05:00 PM',
      hall: 'Block B - Room 301',
      bench: 'Seat Row #4, Desk 22',
      invigilator: 'Prof. Remus Lupin',
      status: 'CONFIRMED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Academic Term 2026-2027
            </span>
            <span className="text-xs text-slate-400">Semester 1 Examinations</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2">
            Exam Schedules & Hall Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access verified room seating matrix, exam timings, and official downloadable admit card.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsHallTicketModalOpen(true)}
          className="flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <FileText className="h-4 w-4" />
          <span>Generate Hall Ticket</span>
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Scheduled Papers</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">3 Examinations</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verification Clearance</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-400">100% Cleared</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Biometric & Fee Approved</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Exam Center</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">Westside Campus</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Tech City Block A & B</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Timetable List */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle>Schedule & Room Allocations</CardTitle>
          <CardDescription>Verified seat plan and invigilation assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.code}
              className="p-5 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/30">
                    {exam.code}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{exam.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{exam.date}</span>
                      <span>•</span>
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>{exam.time}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{exam.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Assigned Examination Hall:</span>
                  <p className="text-slate-200 font-semibold mt-0.5 flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{exam.hall}</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Desk & Bench Position:</span>
                  <p className="text-indigo-400 font-bold mt-0.5">{exam.bench}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Invigilator:</span>
                  <p className="text-slate-300 font-semibold mt-0.5">{exam.invigilator}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedSeatMap(exam.code)}
                  className="text-xs flex items-center space-x-1.5"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>View Seat Location Matrix</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seat Map Modal */}
      {selectedSeatMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-lg">Seating Matrix Layout - {selectedSeatMap}</h3>
              <button
                onClick={() => setSelectedSeatMap(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg text-xs font-semibold">
                [FRONT PODIUM / EXAMINER DESK]
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {Array.from({ length: 16 }).map((_, i) => {
                  const isUserSeat = i === 5;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-center text-xs font-bold ${
                        isUserSeat
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/40 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isUserSeat ? 'YOUR SEAT (#14)' : `Desk ${i + 1}`}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedSeatMap(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Hall Ticket Modal */}
      {isHallTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative my-8 print:p-0 print:shadow-none">
            {/* Modal Controls */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Document Preview</span>
              <div className="flex items-center space-x-3">
                <Button size="sm" variant="primary" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-1.5" />
                  Print Hall Ticket
                </Button>
                <button
                  onClick={() => setIsHallTicketModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Content */}
            <div className="space-y-6 text-slate-900">
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold tracking-wide uppercase">Westside Institute of Technology</h1>
                  <p className="text-xs font-semibold text-slate-600">Office of the Controller of Examinations</p>
                  <p className="text-[11px] text-slate-500">Semester End Examinations Admit Card (Term 2026-2027)</p>
                </div>
                <div className="text-right">
                  <div className="p-2 border-2 border-slate-900 rounded-lg inline-block bg-slate-50">
                    <QrCode className="h-12 w-12 text-slate-900" />
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">VERIFIED REG-987654321</p>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-300 rounded-lg text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Candidate Name</p>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Roll Number</p>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">WIT-CSE-2026-001</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Registration No</p>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">REG-987654321</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Course & Dept</p>
                  <p className="font-semibold text-slate-800">B.Tech Computer Science & Engg</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Semester</p>
                  <p className="font-semibold text-slate-800">Semester 1 (First Term)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Exam Center</p>
                  <p className="font-semibold text-slate-800">Block B Main Examination Center</p>
                </div>
              </div>

              {/* Timetable Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-700">Course Exam Schedule & Invigilator Sign-Off</h3>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2 font-bold">Paper Code</th>
                      <th className="border border-slate-300 p-2 font-bold">Subject Name</th>
                      <th className="border border-slate-300 p-2 font-bold">Date & Session</th>
                      <th className="border border-slate-300 p-2 font-bold">Hall / Bench</th>
                      <th className="border border-slate-300 p-2 font-bold">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((ex) => (
                      <tr key={ex.code} className="border border-slate-300">
                        <td className="border border-slate-300 p-2 font-mono font-bold text-indigo-900">{ex.code}</td>
                        <td className="border border-slate-300 p-2 font-semibold text-slate-900">{ex.name}</td>
                        <td className="border border-slate-300 p-2 text-slate-700">{ex.date}<br/>{ex.time}</td>
                        <td className="border border-slate-300 p-2 font-semibold text-slate-800">{ex.hall}</td>
                        <td className="border border-slate-300 p-2 text-center text-slate-300 font-mono">[ __________ ]</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions & Signatures */}
              <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-600">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Important Instructions:</p>
                  <p>1. Candidates must carry this admit card along with valid College ID.</p>
                  <p>2. Electronic devices are strictly prohibited inside the examination hall.</p>
                </div>
                <div className="text-center font-semibold text-slate-800 border-t border-slate-900 pt-2 px-4">
                  Controller of Examinations<br/>
                  <span className="text-[9px] text-slate-500">(Digitally Signed & Validated)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
