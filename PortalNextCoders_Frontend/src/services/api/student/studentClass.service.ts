import { httpStudentProvider } from "../../../providers";

export interface ClassTrails {
  trailId: number;
  studentClassId: number;
  orderNumber: number | null;
}

class StudentClassService 
{
    UpdateLinkTrailToClass = async (studentClassId: number, courseId: number) => {
      try{
        await httpStudentProvider.put(`student/class/${studentClassId}/${courseId}`);
      }catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };      
};

export default new StudentClassService();
