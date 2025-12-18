export type SharedModel = {
  createdAt: Date | null;
  createdBy: string | "";
  updatedAt: Date | null;
  updatedBy: string |  "";
  deletedAt: Date | null; 
  deletedBy: string |  "";
  isDeleted: boolean | null;
}