import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  FileText, CheckCircle2, Send, Eye, ShieldCheck, Check, X, 
  Sparkles, Award, ArrowLeft, ArrowRight, Printer, 
  ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';

interface KeyPoint {
  id: string;
  description: string;
  maxMarks: number;
  awardedMarks: number;
}

interface EvaluationQuestion {
  id: string;
  qNumber: string;
  part: 'Part A (Short)' | 'Part B (Long)';
  text: string;
  co: string;
  bloom: string;
  maxMarks: number;
  studentAnswerText: string;
  studentDiagramOrCode?: string;
  modelAnswer: string;
  keyPoints: KeyPoint[];
  evaluatorRemarks: string;
  stamps: Array<{ id: string; type: 'correct' | 'incorrect' | 'half' | 'comment'; text: string }>;
}

interface ScriptData {
  barcode: string;
  exam: string;
  subjectCode: string;
  subjectName: string;
  studentIdMasked: string;
  semester: number;
  status: 'UNDER_EVALUATION' | 'EVALUATED';
  questions: EvaluationQuestion[];
}

const initialScripts: Record<string, ScriptData> = {
  'WIT-BARCODE-88741': {
    barcode: 'WIT-BARCODE-88741',
    exam: 'End Semester Term Exam - Regular 2026',
    subjectCode: 'CSE-101',
    subjectName: 'Data Structures and Algorithms',
    studentIdMasked: 'ANON-CANDIDATE-88741',
    semester: 1,
    status: 'UNDER_EVALUATION',
    questions: [
      {
        id: 'q1a',
        qNumber: 'Q1 (a)',
        part: 'Part A (Short)',
        text: 'Explain the memory representation of a One-Dimensional Array and prove why indexed access operates in O(1) time complexity.',
        co: 'CO1 (Arrays & Pointers)',
        bloom: 'UNDERSTAND',
        maxMarks: 5,
        studentAnswerText: `An array is a linear data structure that stores elements in contiguous memory locations. Each element occupies a fixed number of bytes depending on its data type (e.g. 4 bytes for integer).

The memory address of any element at index 'i' is directly computed using the formula:
Address(A[i]) = Base_Address + (i * Element_Size)

Since the Base Address and Element Size are constants known at compile time, the CPU computes the target address using a single addition and multiplication arithmetic operation. No sequential search or traversal of previous elements is required. Therefore, direct random access takes O(1) constant time complexity.`,
        studentDiagramOrCode: `[Memory Layout Diagram]
Base: 0x1000  --> A[0] (Value: 12)
Addr: 0x1004  --> A[1] (Value: 45)
Addr: 0x1008  --> A[2] (Value: 78)
Addr: 0x100C  --> A[3] (Value: 91)`,
        modelAnswer: `Key Requirements:
1. Definition: Contiguous sequential block in physical RAM.
2. Address Formula: Loc(A[i]) = Base_Address + (i - LowerBound) * w (where w is element word size).
3. O(1) Proof: Direct arithmetic calculation in ALU constant clock cycles without memory pointer hops.`,
        keyPoints: [
          { id: 'kp-1-1', description: 'Contiguous memory allocation definition & formula: Base + (i * w)', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-1-2', description: 'Mathematical proof of O(1) ALU arithmetic offset without traversal', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-1-3', description: 'Accurate memory address mapping diagram with offsets', maxMarks: 1, awardedMarks: 1 },
        ],
        evaluatorRemarks: 'Excellent clarity. Address calculation formula and RAM layout diagram are accurately presented.',
        stamps: [
          { id: 'st-1', type: 'correct', text: '✔ Accurate Address Formula (+2)' },
          { id: 'st-2', type: 'correct', text: '✔ Valid O(1) Proof (+2)' },
        ],
      },
      {
        id: 'q1b',
        qNumber: 'Q1 (b)',
        part: 'Part A (Short)',
        text: 'Compare Singly Linked List vs Doubly Linked List in terms of memory overhead and deletion operations.',
        co: 'CO1 (Linked Lists)',
        bloom: 'ANALYZE',
        maxMarks: 5,
        studentAnswerText: `1. Memory Overhead:
- Singly Linked List (SLL): Each node contains Data + 1 Next Pointer (Total 4/8 bytes pointer overhead per node).
- Doubly Linked List (DLL): Each node contains Prev Pointer + Data + Next Pointer (Total 8/16 bytes pointer overhead). DLL requires approximately double the pointer memory overhead compared to SLL.

2. Deletion Operation:
- SLL: To delete a node when given only a pointer to that node, we must find the previous node by traversing from the head. This takes O(N) time complexity.
- DLL: To delete a node given its pointer, we can directly access its previous node via 'node->prev'.
Pointer redirection logic:
  node->prev->next = node->next;
  node->next->prev = node->prev;
  delete node;
Hence, deletion in DLL is executed in O(1) constant time.`,
        studentDiagramOrCode: `SLL: [Head] -> [Data|Next] -> [Data|Next] -> NULL
DLL: NULL <- [Prev|Data|Next] <==> [Prev|Data|Next] -> NULL`,
        modelAnswer: `Key Requirements:
1. Memory: SLL has 1 pointer per node; DLL has 2 pointers per node (Prev + Next), higher memory footprint.
2. Deletion: Given target node reference, SLL requires O(N) traversal to locate predecessor; DLL achieves O(1) deletion via bidirectional links.
3. Node redirection code: node->prev->next = node->next.`,
        keyPoints: [
          { id: 'kp-2-1', description: 'Pointer memory overhead comparison (1 pointer vs 2 pointers per node)', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-2-2', description: 'Deletion time complexity with node reference (O(N) SLL vs O(1) DLL)', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-2-3', description: 'Correct pointer rewiring statements for DLL node deletion', maxMarks: 1, awardedMarks: 0.5 },
        ],
        evaluatorRemarks: 'Clear tabular comparison. Minor omission: null-check for tail node deletion in DLL rewiring.',
        stamps: [
          { id: 'st-3', type: 'correct', text: '✔ Correct Memory Analysis (+2)' },
          { id: 'st-4', type: 'half', text: '½ Handle Boundary Check for Tail (+0.5)' },
        ],
      },
      {
        id: 'q2a',
        qNumber: 'Q2 (a)',
        part: 'Part A (Short)',
        text: 'Demonstrate the step-by-step evaluation of the postfix expression: "5 3 + 8 2 - *" using a Stack data structure.',
        co: 'CO2 (Stacks & Queues)',
        bloom: 'APPLY',
        maxMarks: 5,
        studentAnswerText: `Postfix Expression: 5 3 + 8 2 - *

Step-by-step evaluation using Operand Stack:
1. Scan '5': Operand -> Push(5). Stack: [5]
2. Scan '3': Operand -> Push(3). Stack: [5, 3]
3. Scan '+': Operator -> Pop 3 (op2), Pop 5 (op1). Compute 5 + 3 = 8. Push(8). Stack: [8]
4. Scan '8': Operand -> Push(8). Stack: [8, 8]
5. Scan '2': Operand -> Push(2). Stack: [8, 8, 2]
6. Scan '-': Operator -> Pop 2 (op2), Pop 8 (op1). Compute 8 - 2 = 6. Push(6). Stack: [8, 6]
7. Scan '*': Operator -> Pop 6 (op2), Pop 8 (op1). Compute 8 * 6 = 48. Push(48). Stack: [48]

Expression string ends. Pop remaining item from stack.
Final Result = 48.`,
        modelAnswer: `Tracing Steps:
1. Push 5, 3
2. '+' => 5 + 3 = 8 => Stack: [8]
3. Push 8, 2 => Stack: [8, 8, 2]
4. '-' => 8 - 2 = 6 => Stack: [8, 6]
5. '*' => 8 * 6 = 48 => Final Answer = 48.`,
        keyPoints: [
          { id: 'kp-3-1', description: 'Accurate stack trace for operand push and operator evaluation', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-3-2', description: 'Correct intermediate evaluations: (5+3)=8, (8-2)=6', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-3-3', description: 'Correct final evaluated value (48)', maxMarks: 1, awardedMarks: 1 },
        ],
        evaluatorRemarks: '100% accurate stack transitions. Operands popped in proper order (op1 op op2).',
        stamps: [
          { id: 'st-5', type: 'correct', text: '✔ Perfect Stack Simulation (+5)' },
        ],
      },
      {
        id: 'q2b',
        qNumber: 'Q2 (b)',
        part: 'Part A (Short)',
        text: 'Explain how a Circular Queue overcomes the limitation of a Linear Queue with array implementation.',
        co: 'CO2 (Circular Queues)',
        bloom: 'UNDERSTAND',
        maxMarks: 5,
        studentAnswerText: `Limitation of Linear Queue:
In a linear queue using an array of size N, once elements are dequeued from the front, the 'front' index increases. Even if those initial positions become empty, if the 'rear' index reaches N-1, the queue reports "Queue Overflow". Memory at the beginning is wasted.

How Circular Queue solves this:
A circular queue treats the array as a ring by connecting the last position back to the first position using modulo arithmetic:
- Enqueue pointer: rear = (rear + 1) % MAX_SIZE
- Dequeue pointer: front = (front + 1) % MAX_SIZE

Queue Full Condition:
(rear + 1) % MAX_SIZE == front

Queue Empty Condition:
front == -1 && rear == -1 (or front == rear initially)`,
        modelAnswer: `Key Requirements:
1. False Overflow identification: Empty slots at front unfillable when rear reaches max capacity.
2. Circular wrap-around mechanism using modulo operator: (rear + 1) % SIZE.
3. Queue Full & Empty mathematical conditions.`,
        keyPoints: [
          { id: 'kp-4-1', description: 'Explanation of false overflow and unused memory in linear queues', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-4-2', description: 'Modulo arithmetic wrap-around logic: (rear + 1) % MAX_SIZE', maxMarks: 2, awardedMarks: 2 },
          { id: 'kp-4-3', description: 'Correct Full and Empty boundary check formulas', maxMarks: 1, awardedMarks: 1 },
        ],
        evaluatorRemarks: 'Thorough explanation with correct modulo boundary equations.',
        stamps: [
          { id: 'st-6', type: 'correct', text: '✔ Full Marks Awarded (+5)' },
        ],
      },
      {
        id: 'q3',
        qNumber: 'Q3',
        part: 'Part B (Long)',
        text: 'Construct a Binary Search Tree (BST) for keys [50, 30, 70, 20, 40, 60, 80] and write an algorithm for recursive Inorder Traversal.',
        co: 'CO3 (Trees & BST)',
        bloom: 'APPLY',
        maxMarks: 10,
        studentAnswerText: `Binary Search Tree Construction:
Insert 50 -> Root is 50.
Insert 30 -> 30 < 50, goes to Left of 50.
Insert 70 -> 70 > 50, goes to Right of 50.
Insert 20 -> 20 < 50, 20 < 30, Left of 30.
Insert 40 -> 40 < 50, 40 > 30, Right of 30.
Insert 60 -> 60 > 50, 60 < 70, Left of 70.
Insert 80 -> 80 > 50, 80 > 70, Right of 70.

Resulting Inorder Traversal Output:
20, 30, 40, 50, 60, 70, 80 (Ascending sorted order).`,
        studentDiagramOrCode: `// Recursive Inorder Traversal in C++
struct Node {
  int data;
  Node *left, *right;
};

void inorderTraversal(Node* root) {
  // Base case
  if (root == nullptr) {
    return;
  }
  inorderTraversal(root->left);       // 1. Visit Left Subtree
  cout << root->data << " ";         // 2. Process Current Node
  inorderTraversal(root->right);      // 3. Visit Right Subtree
}`,
        modelAnswer: `Key Requirements:
1. Balanced BST tree diagram with 50 at root, 30 & 70 at depth 1, [20, 40, 60, 80] at depth 2.
2. Recursive Inorder Algorithm with base condition and Left-Root-Right order.
3. Output sequence: 20, 30, 40, 50, 60, 70, 80.`,
        keyPoints: [
          { id: 'kp-5-1', description: 'Accurate BST structure tree diagram with all 7 nodes properly placed', maxMarks: 4, awardedMarks: 4 },
          { id: 'kp-5-2', description: 'Recursive Inorder algorithm with base condition and Left-Root-Right sequence', maxMarks: 4, awardedMarks: 4 },
          { id: 'kp-5-3', description: 'Correct sorted output traversal list [20, 30, 40, 50, 60, 70, 80]', maxMarks: 2, awardedMarks: 2 },
        ],
        evaluatorRemarks: 'Flawless BST construction and clean C++ recursive implementation.',
        stamps: [
          { id: 'st-7', type: 'correct', text: '✔ Complete Tree & Code (+10)' },
        ],
      },
      {
        id: 'q4a',
        qNumber: 'Q4 (a)',
        part: 'Part B (Long)',
        text: 'Explain the Partition algorithm in QuickSort. Trace the partition step for array [38, 27, 43, 3, 9, 82, 10] using the last element as pivot.',
        co: 'CO4 (Sorting Algorithms)',
        bloom: 'ANALYZE',
        maxMarks: 10,
        studentAnswerText: `QuickSort Partition Algorithm:
The partition subroutine chooses a pivot element and rearranges the array such that:
- Elements smaller than or equal to pivot are placed to the left.
- Elements greater than pivot are placed to the right.
- The pivot is placed at its final sorted position.

Tracing using Lomuto Partition (Pivot = 10, last element at index 6):
Array: [38, 27, 43, 3, 9, 82, 10]
i = -1 (pointer for smaller elements)

- j = 0: A[0]=38 > 10. No swap.
- j = 1: A[1]=27 > 10. No swap.
- j = 2: A[2]=43 > 10. No swap.
- j = 3: A[3]=3 <= 10. i=0, swap(A[0], A[3]) => [3, 27, 43, 38, 9, 82, 10]
- j = 4: A[4]=9 <= 10. i=1, swap(A[1], A[4]) => [3, 9, 43, 38, 27, 82, 10]
- j = 5: A[5]=82 > 10. No swap.

Finally, swap pivot with A[i+1] => swap(A[2], A[6]) (swap 43 and 10):
Array after partition: [3, 9, 10, 38, 27, 82, 43]
Pivot 10 is placed at index 2.`,
        modelAnswer: `Lomuto Partition Scheme:
Pivot = 10.
Elements <= 10: 3, 9.
After partition: [3, 9, 10, 38, 27, 82, 43] with pivot index = 2.
Time complexity of partition: O(N) comparisons.`,
        keyPoints: [
          { id: 'kp-6-1', description: 'Clear explanation of partition mechanism and pivot invariant', maxMarks: 3, awardedMarks: 3 },
          { id: 'kp-6-2', description: 'Step-by-step trace of loop iterations, pointer index i, and element swaps', maxMarks: 5, awardedMarks: 4 },
          { id: 'kp-6-3', description: 'Correct final partitioned array state and returned pivot index (2)', maxMarks: 2, awardedMarks: 2 },
        ],
        evaluatorRemarks: 'Very neat iteration-by-iteration trace. Minor note: specify time complexity O(N) of partition step.',
        stamps: [
          { id: 'st-8', type: 'correct', text: '✔ Thorough Trace Provided (+9)' },
        ],
      },
      {
        id: 'q4b',
        qNumber: 'Q4 (b)',
        part: 'Part B (Long)',
        text: 'Explain MergeSort using Divide-and-Conquer strategy. Derive its recurrence relation and time complexity.',
        co: 'CO4 (Divide & Conquer)',
        bloom: 'EVALUATE',
        maxMarks: 10,
        studentAnswerText: `Divide and Conquer Strategy:
1. Divide: Split the array of size N into two halves at mid = (low + high) / 2.
2. Conquer: Recursively sort the left half and right half using MergeSort.
3. Combine: Merge the two sorted halves into a single sorted array using a linear O(N) two-pointer merge algorithm.

Recurrence Relation Derivation:
- Dividing into 2 subproblems of size N/2 takes constant time O(1).
- Solving 2 subproblems takes 2 * T(N/2).
- Merging two sorted halves takes O(N) time.
Overall Recurrence:
T(N) = 2T(N/2) + c*N, for N > 1
T(1) = O(1)

Solving via Master Theorem:
T(N) = a T(N/b) + f(N)
where a = 2, b = 2, f(N) = O(N^1)
Compare n^(log_b a) with f(N):
log_2(2) = 1 => n^1 == f(N)
Since they are equal, Master Theorem Case 2 applies:
T(N) = Θ(N^1 * log N) = O(N log N) in all cases (Best, Average, Worst).`,
        modelAnswer: `Key Requirements:
1. Three Divide-and-Conquer phases (Divide, Conquer, Combine).
2. Recurrence Relation: T(N) = 2T(N/2) + O(N).
3. Derivation using Master Theorem or Recursion Tree (Tree depth log N, work per level N) = O(N log N).`,
        keyPoints: [
          { id: 'kp-7-1', description: 'Divide, conquer, combine explanation with merge logic outline', maxMarks: 4, awardedMarks: 4 },
          { id: 'kp-7-2', description: 'Correct recurrence relation formulation: T(N) = 2T(N/2) + O(N)', maxMarks: 3, awardedMarks: 3 },
          { id: 'kp-7-3', description: 'Rigorous derivation (Master theorem / Tree method) showing O(N log N)', maxMarks: 3, awardedMarks: 3 },
        ],
        evaluatorRemarks: 'Exceptional mathematical derivation using Master Theorem. Full marks.',
        stamps: [
          { id: 'st-9', type: 'correct', text: '✔ Complete Master Theorem Derivation (+10)' },
        ],
      },
      {
        id: 'q5',
        qNumber: 'Q5',
        part: 'Part B (Long)',
        text: 'Design a Hash Table of size 10 using Linear Probing for keys [23, 43, 13, 27, 39, 40] with hash function h(k) = k % 10. Analyze the problem of Primary Clustering.',
        co: 'CO5 (Hashing & Hash Tables)',
        bloom: 'CREATE',
        maxMarks: 15,
        studentAnswerText: `Hash Table Size = 10 (Slots 0 to 9).
Hash Function: h(k) = k % 10
Collision Resolution: Linear Probing h(k, i) = (h(k) + i) % 10

Key Insertions:
1. Key 23: h(23) = 23 % 10 = 3. Slot 3 empty. Place 23 at Index 3.
2. Key 43: h(43) = 43 % 10 = 3. Collision at 3!
   i=1: (3+1)%10 = 4. Slot 4 empty. Place 43 at Index 4.
3. Key 13: h(13) = 13 % 10 = 3. Collision at 3!
   i=1: Slot 4 occupied.
   i=2: (3+2)%10 = 5. Slot 5 empty. Place 13 at Index 5.
4. Key 27: h(27) = 27 % 10 = 7. Slot 7 empty. Place 27 at Index 7.
5. Key 39: h(39) = 39 % 10 = 9. Slot 9 empty. Place 39 at Index 9.
6. Key 40: h(40) = 40 % 10 = 0. Slot 0 empty. Place 40 at Index 0.

Final Hash Table:
Index 0: 40
Index 1: Empty
Index 2: Empty
Index 3: 23
Index 4: 43
Index 5: 13
Index 6: Empty
Index 7: 27
Index 8: Empty
Index 9: 39

Primary Clustering Analysis:
Notice slots 3, 4, 5 form a continuous cluster of occupied cells.
When a cluster forms, any new key that hashes to any slot within or adjacent to the cluster causes more collisions and extends the cluster further. This leads to search time degrading from O(1) toward O(N).
Quadratic Probing h(k, i) = (h(k) + c1*i + c2*i^2) % 10 or Double Hashing solves this issue.`,
        modelAnswer: `Key Requirements:
1. Hash table state: Slots 0: 40, 3: 23, 4: 43, 5: 13, 7: 27, 9: 39.
2. Probe trace for collisions on keys 43 and 13.
3. Primary clustering definition: Consecutive occupied blocks grow into avalanches increasing probe count.
4. Mitigation strategies: Quadratic probing, Double hashing.`,
        keyPoints: [
          { id: 'kp-8-1', description: 'Modulo calculation & step-by-step collision probing trace', maxMarks: 5, awardedMarks: 5 },
          { id: 'kp-8-2', description: 'Correct final hash table state table (Slots 0, 3, 4, 5, 7, 9 occupied)', maxMarks: 5, awardedMarks: 5 },
          { id: 'kp-8-3', description: 'Primary clustering analysis and mitigation explanation (Quadratic probing)', maxMarks: 5, awardedMarks: 4 },
        ],
        evaluatorRemarks: 'Accurate hash table mapping and lucid explanation of primary clustering avalanche effects.',
        stamps: [
          { id: 'st-10', type: 'correct', text: '✔ Clear Probing Calculation (+14)' },
        ],
      },
    ],
  },
};

export const DigitalEvaluation: React.FC = () => {
  const [activeBarcode, setActiveBarcode] = useState<string>('WIT-BARCODE-88741');
  const [scripts, setScripts] = useState<Record<string, ScriptData>>(initialScripts);
  const [activeQIndex, setActiveQIndex] = useState<number>(0);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isFinalSubmitModalOpen, setIsFinalSubmitModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentScript = scripts[activeBarcode] || initialScripts['WIT-BARCODE-88741'];
  const currentQ = currentScript.questions[activeQIndex];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to calculate question total marks from its key points
  const getQuestionTotalScore = (q: EvaluationQuestion): number => {
    return q.keyPoints.reduce((acc, kp) => acc + kp.awardedMarks, 0);
  };

  // Helper to calculate total script score
  const totalScore = currentScript.questions.reduce(
    (acc, q) => acc + getQuestionTotalScore(q),
    0
  );
  const maxScore = currentScript.questions.reduce((acc, q) => acc + q.maxMarks, 0);

  // Update awarded marks for a specific key point
  const handleKeyPointScoreChange = (kpId: string, newScore: number) => {
    setScripts((prev) => {
      const script = { ...prev[activeBarcode] };
      const updatedQuestions = script.questions.map((q, idx) => {
        if (idx !== activeQIndex) return q;
        const updatedKps = q.keyPoints.map((kp) => {
          if (kp.id !== kpId) return kp;
          const clamped = Math.max(0, Math.min(kp.maxMarks, newScore));
          return { ...kp, awardedMarks: clamped };
        });
        return { ...q, keyPoints: updatedKps };
      });
      return { ...prev, [activeBarcode]: { ...script, questions: updatedQuestions } };
    });
  };

  // Award full marks to all key points of current question
  const handleAwardFullMarks = () => {
    setScripts((prev) => {
      const script = { ...prev[activeBarcode] };
      const updatedQuestions = script.questions.map((q, idx) => {
        if (idx !== activeQIndex) return q;
        const updatedKps = q.keyPoints.map((kp) => ({ ...kp, awardedMarks: kp.maxMarks }));
        return {
          ...q,
          keyPoints: updatedKps,
          stamps: [...q.stamps, { id: `st-${Date.now()}`, type: 'correct' as const, text: `✔ Full Marks Verified (+${q.maxMarks})` }],
        };
      });
      return { ...prev, [activeBarcode]: { ...script, questions: updatedQuestions } };
    });
    showToast(`Full marks (${currentQ.maxMarks}/${currentQ.maxMarks}) awarded for ${currentQ.qNumber}!`);
  };

  // Update evaluator remarks for current question
  const handleRemarksChange = (text: string) => {
    setScripts((prev) => {
      const script = { ...prev[activeBarcode] };
      const updatedQuestions = script.questions.map((q, idx) =>
        idx === activeQIndex ? { ...q, evaluatorRemarks: text } : q
      );
      return { ...prev, [activeBarcode]: { ...script, questions: updatedQuestions } };
    });
  };

  // Add digital annotation stamp on student paper
  const handleAddStamp = (type: 'correct' | 'incorrect' | 'half' | 'comment', text: string) => {
    setScripts((prev) => {
      const script = { ...prev[activeBarcode] };
      const updatedQuestions = script.questions.map((q, idx) => {
        if (idx !== activeQIndex) return q;
        return {
          ...q,
          stamps: [...q.stamps, { id: `st-${Date.now()}`, type, text }],
        };
      });
      return { ...prev, [activeBarcode]: { ...script, questions: updatedQuestions } };
    });
    showToast(`Correction stamp "${text}" placed on student script!`);
  };

  // Remove stamp
  const handleRemoveStamp = (stampId: string) => {
    setScripts((prev) => {
      const script = { ...prev[activeBarcode] };
      const updatedQuestions = script.questions.map((q, idx) => {
        if (idx !== activeQIndex) return q;
        return {
          ...q,
          stamps: q.stamps.filter((s) => s.id !== stampId),
        };
      });
      return { ...prev, [activeBarcode]: { ...script, questions: updatedQuestions } };
    });
  };

  // Final submit valuation
  const handleFinalSubmit = () => {
    setScripts((prev) => ({
      ...prev,
      [activeBarcode]: { ...prev[activeBarcode], status: 'EVALUATED' },
    }));
    setIsFinalSubmitModalOpen(false);
    showToast(`Valuation successfully submitted & digitally sealed! Final Marks: ${totalScore}/${maxScore}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl bg-indigo-600 text-white flex items-center space-x-3 border border-indigo-400 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 shadow-2xl text-white gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 tracking-wide uppercase">
              Digital Double-Blind Valuation Station
            </span>
            <span className="text-xs text-indigo-200">
              {currentScript.subjectCode}: {currentScript.subjectName} (Sem {currentScript.semester})
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentScript.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl font-bold font-display text-white mt-2 flex items-center space-x-3">
            <Award className="h-7 w-7 text-indigo-400" />
            <span>Key-Points Question Paper Correction Desk</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Question-by-Question Aligned Correction • Official Model Answer Scheme • Interactive Key Points Rubric Marking.
          </p>
        </div>

        {/* Live Score Counter & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-indigo-500/30 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Awarded Score</span>
            <span className="text-2xl font-extrabold text-emerald-400">
              {totalScore} <span className="text-slate-400 text-sm font-normal">/ {maxScore}</span>
            </span>
          </div>

          <Button
            variant="outline"
            className="border-indigo-400/30 text-white hover:bg-indigo-900/40 text-xs"
            onClick={() => setIsSummaryModalOpen(true)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            <span>View Marksheet</span>
          </Button>

          <Button
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold"
            onClick={() => setIsFinalSubmitModalOpen(true)}
          >
            <Send className="h-4 w-4 mr-1.5" />
            <span>Finalize & Submit Valuation</span>
          </Button>
        </div>
      </div>

      {/* Script Barcode & Candidate Meta Bar */}
      <div className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Script Barcode:</span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 font-mono font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {currentScript.barcode}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Masked Student:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{currentScript.studentIdMasked}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Term:</span>
            <span className="text-slate-700 dark:text-slate-300">{currentScript.exam}</span>
          </div>
        </div>

        {/* Barcode Switcher */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Select Script:</span>
          <select
            value={activeBarcode}
            onChange={(e) => {
              setActiveBarcode(e.target.value);
              setActiveQIndex(0);
              showToast(`Switched to student script ${e.target.value}`);
            }}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="WIT-BARCODE-88741">Candidate 1 (WIT-BARCODE-88741)</option>
            <option value="WIT-BARCODE-88742">Candidate 2 (WIT-BARCODE-88742)</option>
            <option value="WIT-BARCODE-88743">Candidate 3 (WIT-BARCODE-88743)</option>
          </select>
        </div>
      </div>

      {/* QUESTION NAVIGATOR CHIPS */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <span>Question Paper Items ({currentScript.questions.length} Questions)</span>
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Current Question: {activeQIndex + 1} of {currentScript.questions.length}
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          {currentScript.questions.map((q, idx) => {
            const isSelected = idx === activeQIndex;
            const qScore = getQuestionTotalScore(q);
            const isFull = qScore === q.maxMarks;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQIndex(idx)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                <span>{q.qNumber}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isSelected
                      ? 'bg-indigo-800 text-white'
                      : isFull
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {qScore}/{q.maxMarks}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE QUESTION BANNER */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white font-mono">
              {currentQ.qNumber}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentQ.part}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {currentQ.co}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Taxonomy: {currentQ.bloom}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Maximum Marks:</span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm border border-indigo-300 dark:border-indigo-700">
              {currentQ.maxMarks} Marks
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.text}
        </h3>
      </div>

      {/* MAIN TWO-COLUMN ALIGNED WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: STUDENT WRITTEN ANSWER SHEET */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="glass-card flex flex-col shadow-lg border-slate-300 dark:border-slate-800">
            <CardHeader className="py-3 px-5 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <CardTitle className="text-sm flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>Student Written Answer ({currentQ.qNumber})</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Verified digitised student submission
                </CardDescription>
              </div>

              {/* Digital Correction Stamp Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddStamp('correct', '✔ Correct')}
                  className="text-xs h-7 px-2 text-emerald-600 border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  title="Add Correct Stamp"
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  <span>Correct</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddStamp('half', '½ Partial')}
                  className="text-xs h-7 px-2 text-amber-600 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  title="Add Half Mark Stamp"
                >
                  <span>½ Half</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddStamp('incorrect', '✘ Incorrect')}
                  className="text-xs h-7 px-2 text-rose-600 border-rose-500/40 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Add Incorrect Stamp"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  <span>Incorrect</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Paper Canvas */}
              <div className="relative rounded-xl p-6 bg-amber-50/20 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 shadow-inner font-sans space-y-4">
                {/* Paper Header Watermark */}
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px] text-slate-400 font-mono">
                  <span>WIT DIGITAL SCAN • {currentScript.barcode}</span>
                  <span>QUESTION {currentQ.qNumber}</span>
                </div>

                {/* Student Answer Text */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200 font-serif">
                  {currentScript.questions[activeQIndex].studentAnswerText}
                </div>

                {/* Optional Diagram or Code block */}
                {currentScript.questions[activeQIndex].studentDiagramOrCode && (
                  <div className="mt-3 p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono text-xs text-indigo-700 dark:text-indigo-300 whitespace-pre-wrap shadow-xs">
                    {currentScript.questions[activeQIndex].studentDiagramOrCode}
                  </div>
                )}

                {/* Active Evaluator Annotation Stamps on Paper */}
                {currentQ.stamps.length > 0 && (
                  <div className="pt-4 border-t border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Evaluator Applied Stamps on Script:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentQ.stamps.map((stamp) => (
                        <div
                          key={stamp.id}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center space-x-1.5 shadow-xs ${
                            stamp.type === 'correct'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                              : stamp.type === 'half'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          }`}
                        >
                          <span>{stamp.text}</span>
                          <button
                            onClick={() => handleRemoveStamp(stamp.id)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: OFFICIAL MODEL KEY POINTS & MARKING RUBRIC */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="glass-card shadow-lg border-indigo-200 dark:border-indigo-900/50">
            <CardHeader className="py-3 px-5 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  <span>Official Key-Points Marking Scheme</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Verify student response against model criteria
                </CardDescription>
              </div>

              {/* Award Full Marks Button */}
              <Button
                size="sm"
                variant="primary"
                onClick={handleAwardFullMarks}
                className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Award Full ({currentQ.maxMarks}m)</span>
              </Button>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Collapsible Model Answer Summary */}
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/20 dark:bg-indigo-950/30 p-3.5">
                <button
                  type="button"
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="w-full flex justify-between items-center text-xs font-bold text-indigo-700 dark:text-indigo-300"
                >
                  <span className="flex items-center space-x-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Official Solution Scheme</span>
                  </span>
                  {showModelAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showModelAnswer && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans border-t border-indigo-200/60 dark:border-indigo-800/40 pt-2">
                    {currentQ.modelAnswer}
                  </p>
                )}
              </div>

              {/* KEY POINTS CHECKLIST & MARKS BREAKDOWN */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Evaluation Key Points:
                  </h4>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Score: {getQuestionTotalScore(currentQ)} / {currentQ.maxMarks}
                  </span>
                </div>

                <div className="space-y-3">
                  {currentQ.keyPoints.map((kp, idx) => (
                    <div
                      key={kp.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-400/50 transition-all space-y-2.5 shadow-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex-1 leading-snug">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold mr-1">
                            {idx + 1}.
                          </span>
                          {kp.description}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0">
                          Max: {kp.maxMarks}m
                        </span>
                      </div>

                      {/* Marks Selector Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-medium">Award Marks:</span>
                        <div className="flex items-center space-x-1.5">
                          {/* Generate step buttons: 0, 0.5, 1, ..., maxMarks */}
                          {Array.from(
                            new Set([
                              0,
                              ...(kp.maxMarks > 1 ? [1] : []),
                              ...(kp.maxMarks > 2 ? [Math.floor(kp.maxMarks / 2)] : []),
                              kp.maxMarks - 1 > 1 ? kp.maxMarks - 1 : null,
                              kp.maxMarks,
                            ].filter((v): v is number => v !== null))
                          ).map((stepVal) => (
                            <button
                              key={stepVal}
                              type="button"
                              onClick={() => handleKeyPointScoreChange(kp.id, stepVal)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                kp.awardedMarks === stepVal
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                              }`}
                            >
                              {stepVal}
                            </button>
                          ))}
                          <input
                            type="number"
                            min={0}
                            max={kp.maxMarks}
                            step={0.5}
                            value={kp.awardedMarks}
                            onChange={(e) => handleKeyPointScoreChange(kp.id, parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-center font-bold text-indigo-600 dark:text-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Feedback Textarea */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Question Specific Remarks / Annotations:
                </label>
                <textarea
                  rows={2}
                  value={currentQ.evaluatorRemarks}
                  onChange={(e) => handleRemarksChange(e.target.value)}
                  placeholder="Enter remarks for this question (e.g., 'Precise definition, partial logic for tail boundary')..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Navigation Between Questions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={activeQIndex === 0}
                  onClick={() => setActiveQIndex(Math.max(0, activeQIndex - 1))}
                  className="text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  <span>Previous Q</span>
                </Button>

                <div className="text-xs text-slate-500 font-semibold">
                  Total Awarded: <strong className="text-indigo-600 dark:text-indigo-400">{getQuestionTotalScore(currentQ)} / {currentQ.maxMarks}</strong>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  disabled={activeQIndex === currentScript.questions.length - 1}
                  onClick={() => {
                    setActiveQIndex(Math.min(currentScript.questions.length - 1, activeQIndex + 1));
                    showToast(`Saved marks for ${currentQ.qNumber}! Moved to next.`);
                  }}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <span>Save & Next</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FULL MARKSHEET SUMMARY MODAL */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/90">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-500" />
                  <span>Valuation Marksheet Breakdown — {currentScript.barcode}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentScript.subjectCode}: {currentScript.subjectName} • Total Marks: {totalScore} / {maxScore}
                </p>
              </div>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Q. No</th>
                    <th className="py-2.5 px-3">Topic / Syllabus Outcome</th>
                    <th className="py-2.5 px-3 text-center">Max Marks</th>
                    <th className="py-2.5 px-3 text-center">Marks Awarded</th>
                    <th className="py-2.5 px-3">Evaluator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentScript.questions.map((q) => {
                    const qMarks = getQuestionTotalScore(q);
                    return (
                      <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          {q.qNumber}
                        </td>
                        <td className="py-3 px-3 text-slate-800 dark:text-slate-200">
                          {q.co} ({q.bloom})
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-500 dark:text-slate-400">
                          {q.maxMarks}
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          {qMarks}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {q.evaluatorRemarks || 'Satisfactory answer.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-bold text-sm">
                    <td colSpan={2} className="py-3 px-3 text-right">
                      Grand Total Score:
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">{maxScore}</td>
                    <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                      {totalScore}
                    </td>
                    <td className="py-3 px-3 text-xs text-indigo-600 dark:text-indigo-400">
                      Percentage: {Math.round((totalScore / maxScore) * 100)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/90">
              <Button variant="outline" onClick={() => window.print()} className="text-xs">
                <Printer className="h-4 w-4 mr-1.5" />
                <span>Print Marksheet</span>
              </Button>
              <Button variant="primary" onClick={() => setIsSummaryModalOpen(false)} className="text-xs">
                <span>Close Marksheet</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FINALIZE VALUATION CONFIRMATION MODAL */}
      {isFinalSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span>Lock & Submit Valuation</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Script Barcode: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentScript.barcode}</span>
                </p>
              </div>
              <button
                onClick={() => setIsFinalSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Total Awarded Score:</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {totalScore} / {maxScore} Marks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Performance Percentage:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round((totalScore / maxScore) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Evaluator Designation:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Internal Evaluator #104
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Digital Seal Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Double-Blind Hash Verified
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Once sealed, the marks will be locked into the examination controller database and published to the student result ledger.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsFinalSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFinalSubmit}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Confirm & Seal Valuation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalEvaluation;
