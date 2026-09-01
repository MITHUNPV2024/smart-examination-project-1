import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Scan, Send, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DigitalEvaluation: React.FC = () => {
  const activeBarcode = 'WIT-BARCODE-88741';
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({
    'Q1a': 4, 'Q1b': 4,
    'Q2a': 5, 'Q2b': 3,
    'Q3': 10,
    'Q4a': 8, 'Q4b': 7,
    'Q5': 12,
  });

  const handleScoreChange = (key: string, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const totalScore = Object.values(scores).reduce((acc, curr) => acc + (curr || 0), 0);
  const maxScore = 75;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Double-Blind Evaluator Station
            </span>
            <span className="text-xs text-slate-400">Subject: CSE-101 Data Structures</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 mt-2 flex items-center space-x-3">
            <FileText className="h-6 w-6 text-indigo-400" />
            <span>Digital Script Valuation & Annotation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Anonymous barcode scanning, on-screen PDF annotation, and automated rubric scoring.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Awarded Score</span>
            <span className="text-2xl font-extrabold text-indigo-400">{totalScore} / {maxScore}</span>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsSubmitted(true)}
            className="flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
          >
            <Send className="h-4 w-4" />
            <span>Submit Valuation</span>
          </Button>
        </div>
      </div>

      {isSubmitted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Digital Valuation Submitted Successfully!</h4>
              <p className="text-xs text-slate-300">
                Barcode <span className="font-mono text-indigo-300">{activeBarcode}</span> recorded with total <span className="font-bold text-emerald-400">{totalScore} / {maxScore} marks</span>.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsSubmitted(false)}>Next Script</Button>
        </div>
      )}

      {/* Barcode Scanner Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Active Anonymous Script Barcode</p>
            <p className="text-xs font-mono font-bold text-indigo-400">{activeBarcode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Evaluator Privileges:</span>
          <span className="px-2.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Internal Evaluator #104
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanned Answer Sheet PDF Viewer */}
        <Card className="lg:col-span-7 bg-slate-900/60 border border-slate-800 flex flex-col">
          <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Eye className="h-4 w-4 text-indigo-400" />
              <span>Scanned Answer Script Preview (Page {currentPage} of 12)</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-bold"
              >
                Prev Page
              </button>
              <span className="text-xs text-slate-400 font-mono">{currentPage}/12</span>
              <button
                onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-bold"
              >
                Next Page
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col items-center justify-center min-h-[500px]">
            {/* Simulated Scanned Sheet Canvas */}
            <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl relative space-y-4 font-mono text-xs text-slate-300 select-none">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] text-slate-500">EXAMINATION ANSWER SCRIPT • TERM 2026</span>
                <span className="text-[10px] text-indigo-400 font-bold">{activeBarcode}</span>
              </div>

              {currentPage === 1 && (
                <div className="space-y-3">
                  <p className="text-indigo-300 font-bold text-sm">Question 1: Data Structure Fundamentals</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ans 1a: An array is a linear data structure containing contiguous memory locations. An array of size N takes O(1) time complexity for indexed access...
                  </p>
                  <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 rounded text-emerald-400 text-[10px]">
                    ✓ Evaluator Note: Clear explanation and diagram provided. Awarded 4/5.
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ans 1b: Linked List nodes consist of data and next pointer. Operations include insertion at head O(1), deletion O(1), traversal O(N)...
                  </p>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-3">
                  <p className="text-indigo-300 font-bold text-sm">Question 3: Binary Search Tree Implementation</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ans 3: Algorithm for BST Inorder Traversal (Left, Root, Right). Code snippet written in C++:
                  </p>
                  <pre className="bg-slate-900 p-2.5 rounded text-[10px] text-indigo-300 border border-slate-800">
{`void inorder(Node* root) {
  if (root == NULL) return;
  inorder(root->left);
  cout << root->data << " ";
  inorder(root->right);
}`}
                  </pre>
                  <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 rounded text-emerald-400 text-[10px]">
                    ✓ Evaluator Note: Accurate recursive implementation. Awarded 10/10.
                  </div>
                </div>
              )}

              {currentPage > 2 && (
                <div className="py-16 text-center space-y-2">
                  <FileText className="h-10 w-10 text-slate-700 mx-auto" />
                  <p className="text-slate-500 text-xs">Scanned Sheet Page {currentPage}</p>
                  <p className="text-[10px] text-slate-600">Student answers continued on digital canvas...</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                <span>Evaluator Digital Stamp: VERIFIED</span>
                <span>Page {currentPage} of 12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rubric Scoring & Breakdown Panel */}
        <Card className="lg:col-span-5 bg-slate-900/60 border border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle>Question-Wise Mark Entry</CardTitle>
            <CardDescription>Rubric evaluation breakdown and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {/* Part A */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">
                Part A: Short Questions (Max 5 Each)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q1a: Array Memory (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={scores['Q1a'] || 0}
                    onChange={(e) => handleScoreChange('Q1a', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q1b: Linked List (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={scores['Q1b'] || 0}
                    onChange={(e) => handleScoreChange('Q1b', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q2a: Stack Push (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={scores['Q2a'] || 0}
                    onChange={(e) => handleScoreChange('Q2a', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q2b: Queue Enqueue (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={scores['Q2b'] || 0}
                    onChange={(e) => handleScoreChange('Q2b', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Part B */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-800 pb-1">
                Part B: Long Problems (Max 10 / 15)
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q3: BST Algorithm (Max 10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={scores['Q3'] || 0}
                    onChange={(e) => handleScoreChange('Q3', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q4a: QuickSort (Max 10)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={scores['Q4a'] || 0}
                      onChange={(e) => handleScoreChange('Q4a', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Q4b: MergeSort (Max 10)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={scores['Q4b'] || 0}
                      onChange={(e) => handleScoreChange('Q4b', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Calculated Score:</span>
                <span className="font-extrabold text-indigo-400 text-sm">{totalScore} / {maxScore}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Evaluator Sign-Off Status:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Ready to Submit</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalEvaluation;
