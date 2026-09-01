import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldAlert, Download, Activity } from 'lucide-react';

export const ReportsAudit: React.FC = () => {
  const auditLogs = [
    { id: 'LOG-9941', action: 'Digital Evaluation Marks Submitted', actor: 'Prof. Severus Snape (FACULTY)', target: 'Paper: CSE-101 Barcode: WIT-88741', ip: '192.168.1.14', time: '5 mins ago', status: 'SUCCESS' },
    { id: 'LOG-9940', action: 'System Setting [ALLOW_STUDENT_REGISTRATION] Updated', actor: 'Albus Dumbledore (SUPER_ADMIN)', target: 'Global System Config', ip: '192.168.1.1', time: '25 mins ago', status: 'SUCCESS' },
    { id: 'LOG-9939', action: 'AI Question Paper Blueprint Generated', actor: 'Remus Lupin (FACULTY)', target: 'CSE-101 End Term Paper', ip: '192.168.1.22', time: '1 hour ago', status: 'SUCCESS' },
    { id: 'LOG-9938', action: 'Failed Auth Attempt (Invalid Password)', actor: 'Unknown User (IP: 45.33.22.11)', target: 'POST /api/v1/auth/login', ip: '45.33.22.11', time: '2 hours ago', status: 'SECURITY_ALERT' },
    { id: 'LOG-9937', action: 'Hall Ticket Generated & Downloaded', actor: 'Harry Potter (STUDENT)', target: 'Reg: REG-987654321', ip: '127.0.0.1', time: '3 hours ago', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Platform Security & Audit Trail
            </span>
            <span className="text-xs text-slate-400 font-semibold">Real-Time Event Stream</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
            <span>Audit Logs & Analytical Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track user access, digital mark submission timestamps, IP address trails, and export system audit data.
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2 shadow-lg shadow-rose-600/20">
          <Download className="h-4 w-4" />
          <span>Export Audit Log (CSV)</span>
        </Button>
      </div>

      {/* Log Feed Card */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>Live Security Audit Feed</span>
          </CardTitle>
          <CardDescription>Monitored transaction logs across all 8 academic roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-indigo-500/30 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-400">{log.id}</span>
                    <span className="font-semibold text-slate-100">{log.action}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SECURITY_ALERT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-400">Actor: <strong className="text-slate-200">{log.actor}</strong> • Target: {log.target}</p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>IP: <span className="font-mono text-slate-300">{log.ip}</span></p>
                  <p className="font-semibold text-slate-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAudit;
