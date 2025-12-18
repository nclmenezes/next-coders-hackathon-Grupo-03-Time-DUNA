import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import CertificateService from "../../services/student/certificate.service";
import { useEffect, useState } from "react";
import PdfViewer from "./Files/PdfViewer"

const CertificatePublicView = () => {
    const { certificateId } = useParams();
    const navigate = useNavigate();
    const [certificateUrl, setCertificateUrl] = useState<string | undefined>(undefined)
    const BASE_BLOB_URL = "https://nextcodersfiles.blob.core.windows.net/certificate/";

    const getCertificate = async () => {
        if (certificateId == null) return;
        const certificateResponse = await CertificateService.getCertificateById(certificateId);
        if (!certificateResponse) return navigate("/login");
        setCertificateUrl(certificateResponse.certificateId);
    };

    useEffect(() => {
        if (certificateId == null || certificateId?.length !== 38) navigate("/login");
        getCertificate();
    }, []);

    return certificateUrl ? (
        <PdfViewer file={BASE_BLOB_URL + certificateUrl} visible={true} closeButton={false} />

      ) : (
        <div>Verificando certificado...</div>
      );
};

export default CertificatePublicView;