export interface MoveDialogProps {
    open: boolean;
    selectedValue?: string;
    onClose: (value?: string) => void;
    studentClassId: number;
    newClassId?: number;
}