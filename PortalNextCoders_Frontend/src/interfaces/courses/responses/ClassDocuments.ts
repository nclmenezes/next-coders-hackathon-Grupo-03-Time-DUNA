export interface ClassDocument {
    documentName: string;
    documentFileName: string;
}

export interface ClassDocumentsResponse {
    studentClassId: number;
    blobUrl: string;
    documents: ClassDocument[];
}