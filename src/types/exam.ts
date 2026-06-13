// export interface ExamMark {
//   id: number;
//   marks: string;
//   index: {
//     id: number;
//     index_no: string;
//   };
// }

// export interface Exam {
//   id: number;
//   title: string;
//   exam_date: Date | string;
//   desc: string;
//   marks: ExamMark[];
// }

export interface ExamMark {
  id: number;
  marks: string;
  index: {
    id: number;
    index_no: string;
    student_name: string;
  };
}

export interface Exam {
  id: number;
  title: string;
  exam_date: Date | string;
  desc: string;
  marks: ExamMark[];
}
