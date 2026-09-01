import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Plus, Search, Sparkles, CheckCircle2, Cpu, Printer, Trash2, GraduationCap, Edit3 } from 'lucide-react';

// Types
interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  units: string[];
}

interface Question {
  id: string;
  subjectCode: string;
  text: string;
  bloom: string;
  difficulty: string;
  marks: number;
  unit: string;
  author: string;
}

// Default seed data
const defaultSubjects: Subject[] = [
  { code: 'CSE-101', name: 'Data Structures', credits: 4, semester: 1, units: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Sorting & Searching', 'Hashing'] },
  { code: 'MTH-101', name: 'Engineering Mathematics I', credits: 4, semester: 1, units: ['Matrices & Determinants', 'Differential Calculus', 'Integral Calculus', 'Differential Equations', 'Laplace Transform'] },
];

const defaultQuestions: Question[] = [
  { id: 'Q-001', subjectCode: 'CSE-101', text: 'Explain the difference between Array and Linked List with memory representation diagrams.', bloom: 'UNDERSTAND', difficulty: 'EASY', marks: 5, unit: 'Arrays & Linked Lists', author: 'Prof. Remus Lupin' },
  { id: 'Q-002', subjectCode: 'CSE-101', text: 'Implement a C++ function to perform Inorder Traversal of a Binary Search Tree recursively.', bloom: 'APPLY', difficulty: 'MEDIUM', marks: 10, unit: 'Trees & Graphs', author: 'Prof. Severus Snape' },
  { id: 'Q-003', subjectCode: 'CSE-101', text: 'Compare the time complexity of QuickSort vs MergeSort in worst-case scenarios. Justify when to use each.', bloom: 'ANALYZE', difficulty: 'HARD', marks: 10, unit: 'Sorting & Searching', author: 'Prof. Remus Lupin' },
  { id: 'Q-004', subjectCode: 'CSE-101', text: 'Design a Stack data structure using two Queues. Write pseudocode for push and pop operations.', bloom: 'CREATE', difficulty: 'HARD', marks: 15, unit: 'Stacks & Queues', author: 'Prof. Albus Dumbledore' },
  { id: 'Q-005', subjectCode: 'CSE-101', text: 'Define Stack Overflow and Underflow conditions in array implementation.', bloom: 'REMEMBER', difficulty: 'EASY', marks: 2, unit: 'Stacks & Queues', author: 'Prof. Filius Flitwick' },
];

export const QuestionBank: React.FC = () => {
  // Core state
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

  // Filter state
  const [selectedBloom, setSelectedBloom] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(false);
  const [isSyllabusViewOpen, setIsSyllabusViewOpen] = useState(false);

  // Add Subject form state
  const [newSubject, setNewSubject] = useState<{ code: string; name: string; credits: number; semester: number; unitsText: string }>({
    code: '', name: '', credits: 3, semester: 1, unitsText: '',
  });

  // Add Question form state
  const [newQuestion, setNewQuestion] = useState<{ subjectCode: string; text: string; bloom: string; difficulty: string; marks: number; unit: string; author: string }>({
    subjectCode: subjects[0]?.code || '', text: '', bloom: 'REMEMBER', difficulty: 'EASY', marks: 2, unit: '', author: '',
  });

  // Generator state
  const [genSubject, setGenSubject] = useState(subjects[0]?.code || '');
  const [genMarks, setGenMarks] = useState('75');

  // Filtered questions
  const filtered = questions.filter((q) => {
    if (selectedBloom !== 'ALL' && q.bloom !== selectedBloom) return false;
    if (selectedSubject !== 'ALL' && q.subjectCode !== selectedSubject) return false;
    if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase()) && !q.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Handlers
  const handleAddSubject = () => {
    if (!newSubject.code.trim() || !newSubject.name.trim()) return;
    const units = newSubject.unitsText.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    const subject: Subject = {
      code: newSubject.code.trim().toUpperCase(),
      name: newSubject.name.trim(),
      credits: newSubject.credits,
      semester: newSubject.semester,
      units: units.length > 0 ? units : ['Unit 1', 'Unit 2', 'Unit 3'],
    };
    setSubjects((prev) => [...prev, subject]);
    setNewSubject({ code: '', name: '', credits: 3, semester: 1, unitsText: '' });
    setIsAddSubjectModalOpen(false);
  };

  const handleDeleteSubject = (code: string) => {
    setSubjects((prev) => prev.filter(s => s.code !== code));
    setQuestions((prev) => prev.filter(q => q.subjectCode !== code));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim() || !newQuestion.subjectCode) return;
    const id = `Q-${String(questions.length + 1).padStart(3, '0')}`;
    const question: Question = {
      id,
      subjectCode: newQuestion.subjectCode,
      text: newQuestion.text.trim(),
      bloom: newQuestion.bloom,
      difficulty: newQuestion.difficulty,
      marks: newQuestion.marks,
      unit: newQuestion.unit || 'General',
      author: newQuestion.author.trim() || 'Faculty Member',
    };
    setQuestions((prev) => [...prev, question]);
    setNewQuestion({ subjectCode: subjects[0]?.code || '', text: '', bloom: 'REMEMBER', difficulty: 'EASY', marks: 2, unit: '', author: '' });
    setIsAddQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter(q => q.id !== id));
  };

  const handleGeneratePaper = () => {
    setGeneratedPaper(true);
  };

  // Get subject details helper
  const getSubject = (code: string) => subjects.find(s => s.code === code);

  // Get questions for AI generator subject
  const genQuestions = questions.filter(q => q.subjectCode === genSubject);
  const genSubjectObj = getSubject(genSubject);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/20 to-slate-900 border border-purple-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Bloom's Taxonomy Repository
            </span>
            <span className="text-xs text-slate-400">Course Outcome (CO) Aligned</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-purple-400" />
            <span>Syllabus, Question Bank & AI Blueprint</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add custom subjects & syllabus units, create classified questions, and auto-generate balanced question papers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsSyllabusViewOpen(true)} className="flex items-center space-x-1.5">
            <GraduationCap className="h-4 w-4" />
            <span>Manage Syllabus</span>
          </Button>
          <Button variant="outline" onClick={() => setIsAddQuestionModalOpen(true)} className="flex items-center space-x-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => { setGeneratedPaper(false); setIsGeneratorModalOpen(true); }}
            className="flex items-center space-x-2 shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI Paper Generator</span>
          </Button>
        </div>
      </div>

      {/* Syllabus Chips */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Syllabus Subjects ({subjects.length})</h3>
          <Button size="sm" variant="glass" onClick={() => setIsAddSubjectModalOpen(true)} className="flex items-center space-x-1">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Subject</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => {
            const qCount = questions.filter(q => q.subjectCode === s.code).length;
            return (
              <div
                key={s.code}
                className={`px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  selectedSubject === s.code
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-md shadow-purple-600/10'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-purple-500/30'
                }`}
                onClick={() => setSelectedSubject(selectedSubject === s.code ? 'ALL' : s.code)}
              >
                <span className="font-mono text-[10px] text-purple-400 mr-1.5">{s.code}</span>
                {s.name}
                <span className="ml-2 text-[10px] text-slate-500">({qCount} Q&apos;s • {s.units.length} Units • {s.credits} Cr)</span>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <p className="text-xs text-slate-500 italic">No subjects added yet. Click "Add Subject" to create your first syllabus entry.</p>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question text or code..."
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={selectedBloom}
            onChange={(e) => setSelectedBloom(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Bloom Levels</option>
            <option value="REMEMBER">Remember</option>
            <option value="UNDERSTAND">Understand</option>
            <option value="APPLY">Apply</option>
            <option value="ANALYZE">Analyze</option>
            <option value="EVALUATE">Evaluate</option>
            <option value="CREATE">Create</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => (
              <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-purple-400">{filtered.length}</span> of {questions.length} questions
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="h-10 w-10 text-slate-700 mx-auto" />
            <p className="text-sm text-slate-500">No questions found. Add questions to your syllabus subjects!</p>
          </div>
        )}
        {filtered.map((q) => (
          <Card key={q.id} className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-purple-600/20 text-purple-400 border border-purple-500/20">
                    {q.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {q.subjectCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Bloom: {q.bloom}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800/60 text-slate-400">
                    Unit: {q.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs flex-shrink-0">
                  <span className="font-bold text-amber-400">{q.marks} Marks</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{q.difficulty}</span>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-100 leading-relaxed">{q.text}</p>

              <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
                <span>Author: {q.author}</span>
                <div className="flex items-center space-x-3">
                  <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1">
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== MODAL: Add Subject / Syllabus ===== */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                <span>Add New Subject & Syllabus</span>
              </h3>
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. CSE-201"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Credits</label>
                  <select
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, credits: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(c => (
                      <option key={c} value={c}>{c} Credit{c > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <select
                    value={newSubject.semester}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, semester: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Syllabus Units / Topics (one per line) *</label>
                <textarea
                  value={newSubject.unitsText}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, unitsText: e.target.value }))}
                  rows={5}
                  placeholder={`Enter each unit/topic on a new line:\nProcess Management\nMemory Management\nFile Systems\nI/O Systems\nSecurity & Protection`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">These units will appear as tags when adding questions to this subject.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="outline" onClick={() => setIsAddSubjectModalOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={handleAddSubject}
                  disabled={!newSubject.code.trim() || !newSubject.name.trim()}
                  className="flex items-center space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Subject to Syllabus</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Manage Syllabus View ===== */}
      {isSyllabusViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                <span>Syllabus Manager ({subjects.length} Subjects)</span>
              </h3>
              <div className="flex items-center space-x-3">
                <Button size="sm" variant="glass" onClick={() => { setIsSyllabusViewOpen(false); setIsAddSubjectModalOpen(true); }}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Subject
                </Button>
                <button onClick={() => setIsSyllabusViewOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {subjects.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-8">No subjects registered. Add your first subject!</p>
              )}
              {subjects.map((s) => {
                const qCount = questions.filter(q => q.subjectCode === s.code).length;
                return (
                  <div key={s.code} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 hover:border-purple-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-purple-600/20 text-purple-400 border border-purple-500/20">{s.code}</span>
                          <h4 className="font-bold text-slate-100 text-sm">{s.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {s.credits} Credits • Semester {s.semester} • {qCount} Questions in Bank
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(s.code)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition-colors"
                        title="Delete subject and all its questions"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Syllabus Units ({s.units.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.units.map((unit, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-medium">
                            {idx + 1}. {unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Add Question ===== */}
      {isAddQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                <span>Add New Question to Bank</span>
              </h3>
              <button onClick={() => setIsAddQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject *</label>
                  <select
                    value={newQuestion.subjectCode}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, subjectCode: e.target.value, unit: '' }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {subjects.length === 0 && <option value="">-- No subjects added --</option>}
                    {subjects.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Syllabus Unit / Topic</label>
                  <select
                    value={newQuestion.unit}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  >
                    <option value="">-- Select Unit --</option>
                    {(getSubject(newQuestion.subjectCode)?.units || []).map((u, idx) => (
                      <option key={idx} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Text *</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                  rows={3}
                  placeholder="Enter the full question text here..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bloom Level *</label>
                  <select
                    value={newQuestion.bloom}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, bloom: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  >
                    <option value="REMEMBER">Remember</option>
                    <option value="UNDERSTAND">Understand</option>
                    <option value="APPLY">Apply</option>
                    <option value="ANALYZE">Analyze</option>
                    <option value="EVALUATE">Evaluate</option>
                    <option value="CREATE">Create</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, marks: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newQuestion.author}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Prof. Name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="outline" onClick={() => setIsAddQuestionModalOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.text.trim() || !newQuestion.subjectCode}
                  className="flex items-center space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question to Bank</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: AI Question Paper Generator ===== */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>AI Question Paper Blueprint Generator</span>
              </h3>
              <button onClick={() => setIsGeneratorModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            {!generatedPaper ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Subject</label>
                    <select
                      value={genSubject}
                      onChange={(e) => setGenSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    >
                      {subjects.map(s => (
                        <option key={s.code} value={s.code}>{s.code} {s.name} ({s.credits} Credits)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Exam Marks</label>
                    <select
                      value={genMarks}
                      onChange={(e) => setGenMarks(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    >
                      <option value="75">75 Marks (End Term Standard)</option>
                      <option value="50">50 Marks (Mid Term)</option>
                      <option value="100">100 Marks (Full Paper)</option>
                    </select>
                  </div>
                </div>

                {genQuestions.length > 0 ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
                    ✓ {genQuestions.length} questions available in bank for <strong>{genSubject}</strong>. Ready to generate!
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                    ⚠ No questions in bank for <strong>{genSubject}</strong>. Add questions first for accurate paper generation.
                  </div>
                )}

                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
                  <p className="font-bold text-purple-300">Bloom's Taxonomy Distribution Blueprint:</p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                    <div>• Remember/Understand: 30%</div>
                    <div>• Apply/Analyze: 50%</div>
                    <div>• Evaluate/Create: 20%</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={() => setIsGeneratorModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleGeneratePaper} className="flex items-center space-x-1.5">
                    <Cpu className="h-4 w-4" />
                    <span>Generate Question Paper Blueprint</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">Question Paper Blueprint Generated!</h4>
                    <p className="text-xs text-slate-300">
                      Total {genMarks} Marks • Subject: {genSubjectObj?.name || genSubject} • {genQuestions.length} Q&apos;s sourced from bank.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs text-slate-200">
                  <p className="font-extrabold text-indigo-400 text-center border-b border-slate-800 pb-2">
                    WESTSIDE INSTITUTE OF TECHNOLOGY • END TERM QUESTION PAPER 2026
                  </p>
                  <p className="text-center text-slate-400 text-[11px]">
                    Subject: {genSubjectObj?.code} — {genSubjectObj?.name} ({genSubjectObj?.credits} Credits)
                  </p>

                  <div className="space-y-2 pt-1">
                    <p className="font-bold text-purple-400">PART A (Short Answer Questions)</p>
                    {genQuestions.filter(q => q.bloom === 'REMEMBER' || q.bloom === 'UNDERSTAND').slice(0, 3).map((q, i) => (
                      <p key={q.id} className="text-slate-400 text-[11px]">Q{i + 1}. {q.text} (Bloom: {q.bloom}, {q.marks} Marks)</p>
                    ))}
                    {genQuestions.filter(q => q.bloom === 'REMEMBER' || q.bloom === 'UNDERSTAND').length === 0 && (
                      <p className="text-slate-600 text-[11px] italic">Add Remember/Understand level questions for this section.</p>
                    )}

                    <p className="font-bold text-purple-400 pt-2">PART B (Application & Analysis)</p>
                    {genQuestions.filter(q => q.bloom === 'APPLY' || q.bloom === 'ANALYZE').slice(0, 3).map((q, i) => (
                      <p key={q.id} className="text-slate-400 text-[11px]">Q{i + 4}. {q.text} (Bloom: {q.bloom}, {q.marks} Marks)</p>
                    ))}
                    {genQuestions.filter(q => q.bloom === 'APPLY' || q.bloom === 'ANALYZE').length === 0 && (
                      <p className="text-slate-600 text-[11px] italic">Add Apply/Analyze level questions for this section.</p>
                    )}

                    <p className="font-bold text-purple-400 pt-2">PART C (Design & Evaluation)</p>
                    {genQuestions.filter(q => q.bloom === 'EVALUATE' || q.bloom === 'CREATE').slice(0, 2).map((q, i) => (
                      <p key={q.id} className="text-slate-400 text-[11px]">Q{i + 7}. {q.text} (Bloom: {q.bloom}, {q.marks} Marks)</p>
                    ))}
                    {genQuestions.filter(q => q.bloom === 'EVALUATE' || q.bloom === 'CREATE').length === 0 && (
                      <p className="text-slate-600 text-[11px] italic">Add Evaluate/Create level questions for this section.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm" onClick={() => setGeneratedPaper(false)}>Back to Config</Button>
                  <Button variant="primary" size="sm" onClick={() => window.print()} className="flex items-center space-x-1.5">
                    <Printer className="h-4 w-4" />
                    <span>Print Question Paper</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
