import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { SatisfactionResponse } from "../../../services/api/student/satisfaction.service";

interface CommentBoxProps {
    open: boolean;
    textSubDescription?: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    responseQuestions: SatisfactionResponse[];
    index: number;
    setValueQuestions: React.Dispatch<React.SetStateAction<SatisfactionResponse[]>>;
    handleSendResponses: () => void;
    handleSendNoResponses: () => void;
}

export const CommentBox: React.FC<CommentBoxProps> = ({ open, setOpen, index, responseQuestions, textSubDescription, handleSendResponses, setValueQuestions, handleSendNoResponses }) => {    
    return (
        <Dialog open={open}>
            <Box sx={{ width: '595px', height: '448px', padding: `20px`, marginTop: `30px` }}>
                <Box sx={{ paddingBottom: `15px` }}>
                    <Typography
                        fontFamily="Raleway"
                        fontSize={30}
                        textAlign="center"
                        fontWeight="bold"
                    >
                        <strong>Recebemos sua avaliação!</strong>
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        fontSize={18}
                        textAlign="center"
                        fontWeight="bold"
                    >
                        <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={{ __html: textSubDescription! }} />
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
                    <TextField
                        onChange={(e: any) =>
                            setValueQuestions({
                                ...responseQuestions,
                                [index]: {
                                    satisfactionQuestionTrailId: responseQuestions[index].satisfactionQuestionTrailId,
                                    studentId: responseQuestions[index].studentId,
                                    answered: true,
                                    response: e.target.value
                                }
                            })} sx={{ width: '415px' }} multiline minRows={4} maxRows={5} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant='contained' sx={{
                        width: '193px',
                        height: `52px`,
                        backgroundColor: ` #4962E3`,
                        borderRadius: `5px`,
                        borderColor: `#B8C6CC`,
                        marginTop: `20px`,
                        textTransform: 'none',
                    }} onClick={handleSendResponses}>Enviar comentário</Button>
                    <Button variant='text' onClick={handleSendNoResponses} 
                        size='small' 
                        sx={{ width: `200px`, height: `24px`, marginTop: '5px', textTransform: 'none', color: `#000000` }}>Não neste momento, obrigado.</Button>
                </Box>
            </Box>
        </Dialog>
    )
};