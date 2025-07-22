export interface Request {
  id: string;
  student: string;
  purpose: string;
  createdDate: string;
  processNote: string;
  status: "In Process" | "Completed" | "Pending" | "Rejected";
  responseDate: string;
}
