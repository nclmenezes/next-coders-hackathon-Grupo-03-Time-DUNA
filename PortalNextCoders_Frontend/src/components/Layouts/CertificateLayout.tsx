import logoAdmin from "../../assets/cert.png";
import { useState, useEffect, useRef, FC } from 'react';
import { ICertificateProps } from '../../interfaces/certificate.interface'

const monthDictionary: { [key: string]: string } = {
    "0": "Janeiro",
    "1": "Fevereiro",
    "2": "Março",
    "3": "Abril",
    "4": "Maio",
    "5": "Junho",
    "6": "Julho",
    "7": "Agosto",
    "8": "Setembro",
    "9": "Outubro",
    "10": "Novembro",
    "11": "Dezembro"
};

const CertificateLayout : FC<ICertificateProps> = ({ userInfo, certificateDetails }) => {
    const [isRendered, setIsRendered] = useState(false);

    const [nameFontSize, setNameFontSize] = useState(6); // max font name size
    const studentNameRef = useRef<HTMLDivElement>(null);

    const classDate = certificateDetails === undefined ? new Date() : new Date(certificateDetails?.issueDate);

    useEffect(() => {
        if (!studentNameRef.current) return;

        const { offsetHeight } = studentNameRef.current;
        const maxRecArea = 298;

        if (offsetHeight > maxRecArea) setNameFontSize(nameFontSize - 0.2);
    }, [isRendered, nameFontSize]);

    return (
        <div id='content-id' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '1190px',
        }}>
            <div style={{
                position: 'relative',
                width: '1366px',
                height: '850px',
            }}>
                <img src={logoAdmin} alt="background" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }} />
                <div
                    style={{
                        position: 'relative',
                        top: '155px',
                        left: '210px',
                        width: '700px',
                        height: '298px'
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            wordWrap: 'break-word'
                        }}
                        ref={studentNameRef}
                    >
                        <p
                            style={{
                                color: '#BBFF54',
                                fontSize: `${nameFontSize}em`,
                                fontFamily: 'Plus Jakarta Sans,sans-serif',
                                fontWeight: 'bolder',
                                letterSpacing: '-5px',
                            }}
                            onLoad={() => setIsRendered(true)}
                        >
                            {userInfo.name?.toUpperCase()}
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '465px',
                        left: '214.5px',
                        width: '510px',
                        height: '120px'
                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontSize: '18.8px',
                            fontFamily: 'Plus Jakarta Sans,sans-serif',
                            fontWeight: '400'
                        }}
                    >
                        concluiu com êxito a formação de <strong
                        style={{
                            color: 'white',
                            fontSize: '18.8px',
                            fontFamily: 'Plus Jakarta Sans,sans-serif',
                            fontWeight: '700'
                        }}
                    >
                        {certificateDetails?.courseName}
                    </strong>
                        , com carga horária total de 512 horas.
                    </h2>
                    <h2
                        style={{
                            color: '#BAFE53',
                            fontSize: '18.8px',
                            fontFamily: 'Plus Jakarta Sans,sans-serif',
                            fontWeight: '700'
                        }}
                    >
                        Uma formação patrocinada por {certificateDetails?.contractorName}.
                    </h2>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '600px',
                        left: '215px',
                        width: '450px',
                        height: '23px',
                        overflow: 'hidden'
                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            fontSize: '17px',
                            fontFamily: 'Plus Jakarta Sans,sans-serif',
                            fontWeight: '600'
                        }}
                    >
                        {
                            certificateDetails != null &&
                            `${certificateDetails.signatureLocation}, ${classDate.getDate()} de ${monthDictionary[classDate.getMonth().toString()]}  de ${classDate.getFullYear()}.`
                        }
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CertificateLayout;
  
  
  