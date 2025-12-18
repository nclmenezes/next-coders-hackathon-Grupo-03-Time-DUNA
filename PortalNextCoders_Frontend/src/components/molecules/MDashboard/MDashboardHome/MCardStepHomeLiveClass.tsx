import { Box, Card, Typography, Button, ListItemIcon, Tooltip } from "@mui/material";
import { showSuccessToast } from "../../../../utils/toast";
import { parse, differenceInMinutes } from 'date-fns';

interface MCardStepProps {
    icon?: string;
    classTime: string;
    buttonPath: string | null;
    inactive: boolean;
};

const minutesBefore = 30;

export default function MCardStepHomeLiveClass({
                                       icon,
                                       classTime,
                                       buttonPath,
                                       inactive
                                   }: MCardStepProps) {
    
    const handleAvailableSoon = () => {
        showSuccessToast(`Link para aula ao vivo disponível apenas ${minutesBefore} minutos antes do início da aula!`, {
            position: "top-center",
            duration: 2000,
        });
    };

    const isBeforeMinutesClass = ()  => {
        const today = new Date();
        const targetDate = parse(classTime, 'HH:mm', today);
        const diffMinutes = differenceInMinutes(targetDate, today);
        return diffMinutes <= minutesBefore;
    };

    const handleGoToClass = () => {
        if (isBeforeMinutesClass()) return window.open(buttonPath || "", '_blank');
        handleAvailableSoon();
    };

    return (
        <Card
            variant="outlined"
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                justifyContent: "space-between",
                width: "100%",
                height: "80px",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon sx={{ p: 1 }}>
                    <img src={icon} height={50} width={50} style={{ margin: 4 }} />
                </ListItemIcon>
                <Box sx={{ py: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "19px",
                            fontSize: "16px",
                            color: "#212429",
                            paddingBottom: "8px",
                        }}
                    >
                        {`Assista nossa aula ao vivo hoje às ${classTime}.`}
                    </Typography>
                </Box>
            </Box>

            <Box>
                <Tooltip title={inactive ? "Entre em contato com o seu professor para obter o link!" : ""}>
                    <span>
                    <Button
                        onClick={() => handleGoToClass()}
                        size="large"
                        variant="contained"
                        disabled={inactive}
                        sx={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            fontWeight: "500",
                            lineHeight: "15px",
                            fontSize: "12px",
                            textTransform: "none",
                            background: "#4263EB",
                            color: "#FFFFFF",
                            borderRadius: "4px",
                            height: "42px",
                            width: "182px",
                            "&:disabled": { color: "#fff", background: "#9EA6AD" }
                        }}
                    >
                        Ir para a aula
                    </Button>
                    </span>
                </Tooltip>
            </Box>
        </Card>
    );
}
