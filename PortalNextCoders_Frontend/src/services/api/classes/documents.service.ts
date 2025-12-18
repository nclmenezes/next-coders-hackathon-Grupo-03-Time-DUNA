import { ClassDocumentsResponse } from "../../../interfaces/courses/responses/ClassDocuments";
import { ClassDocumentsDto } from "../../../interfaces/courses/requests/ClassDocuments";
import { httpClassProvider } from "../../../providers";

class ClassDocumentsService
{
    GetDocumentsByStudentClassId = async (studentClassId: number): Promise<ClassDocumentsResponse | null> => {    
        try
        {
            const response = await httpClassProvider.get(`StudentClasses/document/${studentClassId}`);

            if (response.status === 204) return null;

            return response.data;
        }
        catch (error)
        {
            console.error('Error:', error);
            throw error;
        }           
    };

    InsertClassDocument = async (documentDto: ClassDocumentsDto): Promise<ClassDocumentsDto | null> => {    
        try
        {
            if (documentDto.documentFile == null) return null;

            const formData = new FormData();
            formData.append('StudentClassId', `${documentDto.studentClassId}`);
            formData.append('DocumentFile', documentDto.documentFile);
            formData.append('DocumentName', documentDto.documentName);

            console.log('formData:', formData)

            const response = await httpClassProvider.post(`StudentClasses/document`, formData, 
            {
                headers:
                {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        }
        catch (error)
        {
            console.error('Error:', error);
            return null;
        }           
    };

    RemoveClassDocument = async (documentDto: ClassDocumentsDto): Promise<boolean> => {    
        try
        {
            const response = await httpClassProvider.delete(`StudentClasses/document`, {
                data: documentDto
            });

            return response.status === 204;
        }
        catch (error)
        {
            console.error('Error:', error);
            return false;
        }           
    };

    UpdateClassDocument = async (documentDto: ClassDocumentsDto): Promise<ClassDocumentsDto | null> => {    
        try
        {
            if (documentDto.documentFile == null) return null;
            
            const formData = new FormData();
            formData.append('studentClassId', `${documentDto.studentClassId}`);
            formData.append('oldDocumentFileName', documentDto.oldDocumentFileName!);
            formData.append('documentFile', documentDto.documentFile);
            formData.append('documentName', documentDto.documentName);

            const response = await httpClassProvider.put(`StudentClasses/document`, formData, 
            {
                headers:
                {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 200) return null;

            return response.data;
        }
        catch (error)
        {
            console.error('Error:', error);
            return null;
        }           
    };
};

export default new ClassDocumentsService();
