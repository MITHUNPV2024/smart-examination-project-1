import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ClipboardCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const RoomAllocations: React.FC = () => {
  const [isGenerated, setIsGenerated] = useState(false);

  const rooms = [
    { code: 'BLOCK-B-204', block: 'Block B', name: 'Seminar Hall 204', capacity: 60, allocated: 58, invigilator: 'Prof. Severus Snape', status: 'FULL' },
    { code: 'BLOCK-A-AUDI', block: 'Block A', name: 'Main Auditorium', capacity: 250, allocated: 220, invigilator: 'Prof. Filius Flitwick', status: 'OPTIMAL' },
    { code: 'BLOCK-B-301', block: 'Block B', name: 'Physics Lab 301', capacity: 40, allocated: 36, invigilator: 'Prof. Remus Lupin', status: 'OPTIMAL' },
    { code: 'BLOCK-C-102', block: 'Block C', name: 'Lecture Hall 102', capacity: 80, allocated: 0, invigilator: 'Unassigned', status: 'AVAILABLE' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Exam Center Logistics
            </span>
            <span className="text-xs text-slate-400 font-semibold">Campus Seating Engine</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <ClipboardCheck className="h-6 w-6 text-indigo-400" />
            <span>Room Capacity & Automated Seating Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Allocate exam halls, generate candidate bench matrixes, and assign invigilator rosters.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsGenerated(true)}
          className="flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Auto-Generate Seating Matrix</span>
        </Button>
      </div>

      {isGenerated && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Seating Matrix Generated Successfully!</h4>
              <p className="text-xs text-slate-300">314 candidates distributed across 4 halls with 0 roll number collisions.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsGenerated(false)}>Dismiss</Button>
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((r) => (
          <Card key={r.code} className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                  {r.code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  r.status === 'FULL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  r.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {r.status}
                </span>
              </div>
              <CardTitle className="text-base mt-2">{r.name}</CardTitle>
              <CardDescription>{r.block} • Capacity: {r.capacity} Seats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Allocated Seats:</span>
                  <span className="font-bold text-slate-200">{r.allocated} / {r.capacity}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(r.allocated / r.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs flex justify-between items-center text-slate-300">
                <span>Invigilator: <strong className="text-slate-100">{r.invigilator}</strong></span>
                <Button size="sm" variant="glass">Assign Invigilator</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomAllocations;
