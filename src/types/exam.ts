export interface ExamMark {
  id: number;
  marks: string;
  index: {
    id: number;
    index_no: string;
  };
}

export interface Exam {
  id: number;
  title: string;
  exam_date: Date | string;
  desc: string;
  marks: ExamMark[];
}