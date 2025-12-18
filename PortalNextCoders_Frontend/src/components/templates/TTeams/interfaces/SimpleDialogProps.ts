export interface SimpleDialogProps {
    open: boolean;
    selectedValue?: string;
    onClose: (value?: string) => void;
    studentClassId: number;
    newClassId?: number;
}