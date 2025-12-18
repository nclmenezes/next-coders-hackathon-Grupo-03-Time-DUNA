import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Modal, IconButton } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { set } from 'date-fns';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

interface IPdf {
    file: string | File | undefined;
    visible: boolean;
    onClose?: () => void;
    closeButton?: boolean;
}



interface DocumentLoadSuccess {
    numPages: number;
}

const PdfViewer: React.FC<IPdf> = ({ file, visible, onClose, closeButton = true }) => {
    const pdfScale = 0.6
    const [pageWidth, setPageWidth] = useState(window.innerWidth * pdfScale);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfDocument, setPdfDocument] = useState<string | File | undefined>(undefined);

    useEffect(() => {
        if (file instanceof File) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const content = event.target?.result;
                if (typeof content === 'string' && content.startsWith('http') && content !== undefined) setPdfDocument(content);
                else setPdfDocument(file);
            };
            reader.readAsText(file);
        }
        else setPdfDocument(file);

        const handleResize = () => {
            setPageWidth(window.innerWidth * pdfScale);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: DocumentLoadSuccess) => {
        setNumPages(numPages);
    };

    const handleDownload = async () => {
        if (file === undefined) return;

        if (file instanceof File) {
            try {
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name || 'download.pdf';
                a.click();
                URL.revokeObjectURL(url);
                return;
            } catch (error) {
                console.error('Download error:', error);
            }
        }
        if (typeof file === 'string') {
            try {
                const response = await fetch(file);
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', file.endsWith('.pdf') ? `${file.split("/").pop()}` : `${file.split("/").pop()}.pdf`);
                document.body.appendChild(link);
                link.click();
                if (link.parentNode) link.parentNode.removeChild(link);
            } catch (error) {
                console.error('Download error:', error);
            }
        }
    };

    const handleOpenInNewTab = () => {
        if (file instanceof File) return;
        window.open(file, '_blank');
    };

    return (
        <Modal
            open={visible}
            onClose={onClose}
            aria-labelledby="pdf-viewer-modal"
            aria-describedby="pdf-viewer-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: '90vw',
                    maxHeight: '95vh',
                    boxShadow: 24,
                    pt: 0, pr: 2, pb: 2, pl: 2,
                    overflow: 'auto',
                    backgroundColor: '#494949',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        position: 'sticky',
                        top: -1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        pt: 1,
                        zIndex: 1,
                        backgroundColor: '#494949',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                        }}
                    >
                        {file !== undefined && (
                            <IconButton
                                aria-label="download"
                                sx={{
                                    color: 'grey.500',
                                }}
                                onClick={handleDownload}
                            >
                                <DownloadIcon />
                            </IconButton>)}
                        { !(file instanceof File) &&
                        (<IconButton
                            aria-label="open in new tab"
                            sx={{
                                color: 'grey.500',
                            }}
                            onClick={handleOpenInNewTab}
                        >
                            <OpenInNewIcon />
                        </IconButton>)}
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ color: 'grey.500', display: closeButton ? 'block' : 'none' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ width: '100%' }}>
                    {pdfDocument && <Document file={pdfDocument} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={pageWidth}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        ))}
                    </Document>}
                </Box>
            </Box>
        </Modal>
    );
}


export default PdfViewer;
