import { Box, TextField, IconButton, InputAdornment, SxProps, Theme } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useState, useEffect } from "react";
import PdfViewer from "../../../pages/Files/PdfViewer";
import { showErrorToast } from "../../../../utils/toast";
import PreviewIcon from '@mui/icons-material/Preview';

interface UploadTextFieldProps {
    sx?: SxProps<Theme>;
    onFileChange?: (name: string, file: File | null) => void;
    defaultFile?: File;
    defaultLabel?: string;
    onDelete?: (name: string, file: File | null) => void;
    showDelete?: boolean;
};

const DOCUMENTS_BLOB_URL = 'https://nextcodersfiles.blob.core.windows.net/documents/';

const UploadTextField: React.FC<UploadTextFieldProps> = ({ sx, onFileChange, defaultFile, defaultLabel, onDelete, showDelete }) => {
    const [file, setFile] = useState<File | null>(defaultFile ?? null);
    const [label, setLabel] = useState<string>(defaultLabel ?? "");
    const [pdfDocument, setPdfDocument] = useState<string | File | undefined>(undefined);
    const [openPdfDocument, setOpenPdfDocument] = useState<boolean>(false);

    useEffect(() => {
        if (onFileChange) onFileChange(label, file);
    }, [file]);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
    
        if (file.type !== 'application/pdf') {
            showErrorToast('O arquivo deve ser um PDF');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
            setFile(new File([reader.result as BlobPart], file.name, { type: "application/pdf" }));
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDownload = () => {
        if (!file) return;
        setPdfDocument(DOCUMENTS_BLOB_URL + file.name);
        setOpenPdfDocument(true);
    };

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <PdfViewer file={pdfDocument} visible={openPdfDocument} onClose={() => setOpenPdfDocument(false)} />
            <TextField
                fullWidth
                label={!file ? "Adicione um documento" : label}
                variant="outlined"
                value={file ? file.name : label}
                onChange={(e) => setLabel(e.target.value)}
                InputProps={{
                    readOnly: !!file,
                    endAdornment: (
                        <InputAdornment position="end">
                            {file ? (
                                <>
                                    <IconButton onClick={handleDownload}>
                                        <PreviewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setFile(null);
                                        }}
                                        edge="end"
                                    >
                                        <CloseIcon color="error" />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton color="primary" component="label" disabled={label === ""}>
                                        <CloudUploadIcon />
                                        <input type="file" accept=".pdf" hidden onChange={handleFileUpload} style={{ display: 'none' }} />
                                    </IconButton>
                                    {showDelete && (
                                        <IconButton
                                            onClick={() => {
                                                if (onDelete) onDelete(label, file);
                                            }}
                                            edge="end"
                                        >
                                            <CloseIcon color="error" />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </InputAdornment>
                    ),
                }}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
            />
        </Box>
    );
}

export default UploadTextField;
