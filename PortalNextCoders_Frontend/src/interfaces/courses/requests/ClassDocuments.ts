export interface ClassDocumentsDto {
    studentClassId: number;
    documentFile?: File | null;
    documentName: string;
    documentFileName?: string | null;
    blobContainer?: string | null;
    oldDocumentFileName?: string | null;
}