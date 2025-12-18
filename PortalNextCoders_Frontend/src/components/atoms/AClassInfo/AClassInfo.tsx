import { Container, Box } from "@mui/material";
import { IAgentClass, IStudentClassData } from "../../../interfaces/teams/class.interfaces";

interface IClassInfoProps {
    agentClass: IAgentClass;
    studentClass: IStudentClassData;
};

const AClassInfo = ({ studentClass, agentClass }: IClassInfoProps) => {
    const getFormattedAverage = (average: number): string => average == null ? '0.00' : average.toFixed(2);
    const getFormattedString = (infoToFormat: string) => {
        if (infoToFormat) return infoToFormat;
        return 'Informação pendente!';
    };
    const getFormattedCertificateSponsor = (): string => {
        const { sponsor } = agentClass.studentClassCertificate || {};
        if (!sponsor) return 'Informação pendente!';
        return sponsor;
    };
    const getFormattedCertificateIssue = (): string => {
        const { issueAt } = agentClass.studentClassCertificate || {};
        if (!issueAt) return 'Informação pendente!';
        return issueAt.split('T')[0];
    };
    const getFormattedHandsOnSchedule = (): string => {
        const handsSchedule = agentClass.studentClassSchedulers.find(el => el.activityType?.id === 3);
        if (handsSchedule) return handsSchedule.scheduledAt.split('T')[1];
        return 'Informação pendente!';
    };

    return (
        <Container
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '10px 10px 20px 10px'
            }}
        >   
            <Box>
                <p style={{ color: '#0A5995', textAlign: 'center' }}>Informações gerais</p>
                Contratante: {getFormattedString(agentClass.maintainer.name)}<br />
                Turma: {getFormattedString(agentClass.name)}<br />
                Quantidade de vagas: {agentClass.studentQuantity}
            </Box>
            <Box>
                <p style={{ color: '#0A5995', textAlign: 'center' }}>Estatísticas</p>
                Média das notas: {getFormattedAverage(studentClass.grade)}<br />
                Média da presença: {getFormattedAverage(studentClass.attendance)}%<br />
            </Box>
            <Box>
                <p style={{ color: '#0A5995', textAlign: 'center' }}>Informações do certificado</p>
                Patrocinador: {getFormattedCertificateSponsor()}<br />
                Data de emissão: {getFormattedCertificateIssue()}<br />
            </Box>
            <Box>
                <p style={{ color: '#0A5995', textAlign: 'center' }}>Hands-On</p>
                Horário programado: {getFormattedHandsOnSchedule()}<br />
            </Box>
        </Container>
    );
};

export default AClassInfo;