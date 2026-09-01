import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, BookOpen, FileText, CheckSquare, Calendar, Award, 
  Clock, TrendingUp, AlertCircle, AlertTriangle, ShieldCheck, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Seed Mock Data for Charts
const enrollmentData = [
  { year: '2022', students: 1200 },
  { year: '2023', students: 1450 },
  { year: '2024', students: 1600 },
  { year: '2025', students: 1900 },
  { year: '2026', students: 2300 },
];

const performanceData = [
  { subject: 'Maths', average: 78, ward: 85 },
  { subject: 'Physics', average: 72, ward: 68 },
  { subject: 'Chemistry', average: 81, ward: 90 },
  { subject: 'Programming', average: 75, ward: 94 },
  { subject: 'Mechanics', average: 65, ward: 72 },
];

const facultyMarkDistribution = [
  { range: '90-100 (O)', count: 12 },
  { range: '80-89 (A+)', count: 24 },
  { range: '70-79 (A)', count: 32 },
  { range: '60-69 (B)', count: 15 },
  { range: '50-59 (C)', count: 8 },
  { range: 'Below 50 (F)', count: 4 },
];

const examCompletionData = [
  { name: 'Completed', value: 70, color: '#6366f1' },
  { name: 'Ongoing', value: 20, color: '#f59e0b' },
  { name: 'Pending', value: 10, color: '#10b981' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold font-display">System Administration</h2>
          <p className="text-sm text-slate-400">System status, user rosters, and audit trails</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/admin/reports')}>Export Audit Logs</Button>
          <Button variant="primary" onClick={() => navigate('/admin/exams')}>Create Exam Session</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Enrolled Students</p>
                <h3 className="text-2xl font-bold mt-1">2,300</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Department Listings</p>
                <h3 className="text-2xl font-bold mt-1">8</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Database className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Active Subjects</p>
                <h3 className="text-2xl font-bold mt-1">112</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Exam Schedules</p>
                <h3 className="text-2xl font-bold mt-1">18</h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Student Registration Growth</CardTitle>
            <CardDescription>Enrollment trend statistics over the past 5 academic terms</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="students" stroke="#6366f1" fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Session Completion Status</CardTitle>
            <CardDescription>Breakdown of current term exam completion</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={examCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {examCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex space-x-4 mt-4 text-xs font-semibold">
              {examCompletionData.map((item) => (
                <div key={item.name} className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recents Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Log Feed */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <span>Platform Audit Logs</span>
            </CardTitle>
            <CardDescription>Security tracking & privilege activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { log: 'System Setting [PLATFORM_NAME] modified by Super Admin', time: '10 mins ago', ip: '192.168.1.5' },
              { log: 'New Examiner Profile [Filius Flitwick] created', time: '1 hour ago', ip: '192.168.1.1' },
              { log: 'Student Roll No: WIT-CSE-2026-001 updated course records', time: '3 hours ago', ip: '127.0.0.1' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/60 pb-3 last:border-b-0">
                <div>
                  <p className="font-medium text-slate-200">{item.log}</p>
                  <p className="text-slate-500 mt-0.5">IP: {item.ip}</p>
                </div>
                <span className="text-slate-400 font-semibold">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Academic announcements */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-indigo-500" />
              <span>Announcements</span>
            </CardTitle>
            <CardDescription>Broadcasting notifications to the college</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Revaluation Portals Opened', body: 'Supplementary students can register for revaluation via portal.', date: 'Jun 28, 2026' },
              { title: 'AI Exam Generator System Maintenance', body: 'The Blooms taxonomy validator goes down on Sunday 12:00 AM.', date: 'Jun 25, 2026' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-indigo-400">{item.title}</h4>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFacultyDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold font-display">Faculty Workspace</h2>
          <p className="text-sm text-slate-400">Questions banks, script evaluation, and results analyzer</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/faculty/questions')}>Open Question Bank</Button>
          <Button variant="primary" onClick={() => navigate('/faculty/questions')}>Generate Question Paper</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assigned Subjects</p>
                <h3 className="text-2xl font-bold mt-1">2</h3>
                <p className="text-[10px] text-indigo-400 mt-1">CSE-101 (Data Structures)</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Scripts Pending Evaluation</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-400">12</h3>
                <p className="text-[10px] text-slate-500 mt-1">Term Exams - Regular</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Questions in Bank</p>
                <h3 className="text-2xl font-bold mt-1">45</h3>
                <p className="text-[10px] text-emerald-400 mt-1">Blooms Classified: 100%</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckSquare className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Distribution */}
        <Card className="lg:col-span-2 bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Grade Distribution Analysis</CardTitle>
            <CardDescription>Term assessment outcome chart for CSE-101</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyMarkDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evaluation Progress List */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Pending Digital Valuations</CardTitle>
            <CardDescription>Assess scanning barcodes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { roll: 'WIT-CSE-2026-001', paper: 'CSE-101 Regular', date: 'Jun 28' },
              { roll: 'WIT-CSE-2026-005', paper: 'CSE-101 Regular', date: 'Jun 28' },
              { roll: 'WIT-CSE-2026-008', paper: 'CSE-101 Regular', date: 'Jun 28' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-slate-100">{item.roll}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.paper}</p>
                </div>
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => navigate(role === 'INTERNAL_EXAMINER' || role === 'EXTERNAL_EXAMINER' ? '/examiner/evaluation' : '/faculty/evaluation')}
                >
                  Evaluate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold font-display">Student Portal</h2>
          <p className="text-sm text-slate-400">Timetables, grades, and registrations</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/student/exams')}>Download Hall Ticket</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Sem CGPA</p>
                <h3 className="text-3xl font-extrabold mt-1 text-indigo-400">8.45</h3>
                <p className="text-[10px] text-slate-500 mt-1">Semester 1 of 8</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Attendance Rate</p>
                <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">87.5%</h3>
                <p className="text-[10px] text-slate-500 mt-1">Minimum requirement: 75%</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Courses</p>
                <h3 className="text-3xl font-extrabold mt-1">6 Subjects</h3>
                <p className="text-[10px] text-slate-500 mt-1">Total Credits: 24</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <Card className="lg:col-span-2 bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Upcoming Exam Schedules</CardTitle>
            <CardDescription>Term examinations dates & session slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { code: 'CSE-101', name: 'Intro to Programming & Data Structures', date: 'July 15, 2026', time: '10:00 AM - 01:00 PM', hall: 'Block B - Room 204' },
              { code: 'MTH-101', name: 'Engineering Mathematics I', date: 'July 17, 2026', time: '10:00 AM - 01:00 PM', hall: 'Block A - Main Audi' },
              { code: 'PHY-101', name: 'Applied Physics Laboratory & Mechanics', date: 'July 20, 2026', time: '02:00 PM - 05:00 PM', hall: 'Block B - Room 301' },
            ].map((item) => (
              <div key={item.code} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-800/40 border border-slate-800 rounded-lg space-y-2 sm:space-y-0">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600/20 text-indigo-400 rounded border border-indigo-500/20">{item.code}</span>
                  <h4 className="text-sm font-semibold text-slate-100 mt-1.5">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date} • {item.time}</span>
                  </p>
                </div>
                <div className="text-right sm:text-right text-xs">
                  <p className="font-semibold text-slate-300">Room Seat allocation</p>
                  <p className="text-indigo-400 font-bold mt-0.5">{item.hall}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grade Analytics */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Internal & Mid-term summaries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { sub: 'Data Structures', code: 'CSE-101', internal: '42/50', grade: 'O', status: 'PASS' },
              { sub: 'Engineering Math', code: 'MTH-101', internal: '35/50', grade: 'A+', status: 'PASS' },
              { sub: 'Engineering Physics', code: 'PHY-101', internal: '28/50', grade: 'B', status: 'PASS' },
            ].map((item) => (
              <div key={item.code} className="flex justify-between items-center border-b border-slate-800/60 pb-3 last:border-b-0">
                <div>
                  <p className="text-xs font-semibold text-slate-100">{item.sub}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Internal Assessment: {item.internal}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">{item.grade}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderParentDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display">Parent Portal</h2>
          <p className="text-sm text-slate-400">Ward: Harry Potter (WIT-CSE-2026-001)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ward Semester CGPA</p>
            <h3 className="text-3xl font-extrabold mt-1 text-indigo-400">8.45</h3>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ward Attendance</p>
            <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">87.5%</h3>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Term Fees</p>
            <h3 className="text-3xl font-extrabold mt-1 text-slate-300">None</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade comparison */}
        <Card className="lg:col-span-2 bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Subject Performance Analysis</CardTitle>
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

        {/* Academic Notices */}
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle>Ward Progress Notes</CardTitle>
            <CardDescription>Feedback from faculty mentors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg space-y-1 text-xs">
              <p className="font-semibold text-slate-200">CSE-101 Practical Lab</p>
              <p className="text-slate-400 mt-1 leading-relaxed">"Excellent work in laboratory experiments. Consistently submits records on time."</p>
              <p className="text-[10px] text-indigo-400 mt-2 font-medium">- Prof. Remus Lupin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (role) {
    case 'SUPER_ADMIN':
    case 'COLLEGE_ADMIN':
      return renderAdminDashboard();
    case 'DEPARTMENT_HOD':
    case 'FACULTY':
      return renderFacultyDashboard();
    case 'INTERNAL_EXAMINER':
    case 'EXTERNAL_EXAMINER':
      return renderFacultyDashboard(); // share evaluation workspace
    case 'STUDENT':
      return renderStudentDashboard();
    case 'PARENT':
      return renderParentDashboard();
    default:
      return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <AlertTriangle className="h-12 w-12 text-rose-500 animate-pulse" />
          <h3 className="text-xl font-bold">Access Denied</h3>
          <p className="text-sm text-slate-400">Account status is pending validation by the system administrator.</p>
        </div>
      );
  }
};

export default Dashboard;
