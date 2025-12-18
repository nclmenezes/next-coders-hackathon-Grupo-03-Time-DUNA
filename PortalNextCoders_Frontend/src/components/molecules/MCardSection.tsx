import {useNavigate} from "react-router";
import {Box, Button, List, Typography} from "@mui/material";

import mask from "../../assets/Training/masks/maskDiv.png";
import Right from '@mui/icons-material/ChevronRight';
import React from "react";
import Modal from "@mui/material/Modal";
import {TypeSpecimen} from "@mui/icons-material";

interface props {
    title: string;
    description: string;
}

function MCardSection({title, description}: props) {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Box
            sx={{
                backgroundImage: `url(${mask})`,
                display: "flex",
                bgcolor: "#ccddf5",
                width: "100%",
                height: 150,
                borderRadius: 1,
                my: 1.5,
                py: 2,
                px: 3,
            }}
        >
            <Box sx={{
                display: "flex",
                width: "100%",
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{pb: 2}}>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontWeight: 600,
                            fontSize: "24px",
                            color: "#212429",
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#495057",
                        }}
                    >
                        {description}
                    </Typography>
                </Box>

                <Box>
                    <Button
                        sx={{
                            color: "#FFFFFF",
                            bgcolor: "#4263EB",
                            "&:hover": {bgcolor: "#4263EB"},
                            height: 40,
                            width: 150,
                            textTransform: "capitalize",
                        }}
                        onClick={() =>
                            handleOpen()
                        }
                    >
                        Saiba mais <Right fontSize="small"/>
                    </Button>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Bolsa de Estudos Gamificada
                        </Typography>

                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            Na Next Coders, a bolsa tem um sistema de “gamificação”. Ou seja: <strong>dependendo do desempenho
                            do aluno, o valor pode até dobrar.</strong>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            <strong>Notas Altas? Mais Bônus!</strong>
                        </Typography>
                        <Typography>
                            <List>
                                <li>Acima de 7: 20%</li>
                                <li>Acima de 8: 30%</li>
                                <li>Acima de 9: 40%</li>
                                <li>Nota 10: 50%</li>
                            </List>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            <strong>Frequência também conta!</strong>
                        </Typography>
                        <Typography>
                            <List>
                                <li>Presença acima de 80%: 30%</li>
                                <li>Presença acima de 90%: 40%</li>
                                <li>Presença de 100%: 50%</li>
                            </List>
                        </Typography>
                        <Typography sx={{mt: 2}}>
                            O valor total do seu auxílio será atualizado mensalmente na plataforma.
                        </Typography>
                    </Box>
                </Modal>

            </Box>
        </Box>
    )
}

export default MCardSection