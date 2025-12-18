import { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { parse, format, subMinutes, isAfter } from 'date-fns';
import maskGreen from "../../../assets/Training/masks/maskGreen.png";
import userWithHeadPhone from "../../../assets/Training/boy.png";
import { BASE_DATE, MINUTES_BEFORE_CLASS_TO_RELEASE_LINK } from '../../../constants/handsOn/handsOn';

interface MHandsOnCardProps {
  HandsOnSchedule: string | null;
  HandsOnLink: string | null;
  HasHandsOnToday: boolean;
};

const MHandsOnCard = ({ HandsOnSchedule, HandsOnLink, HasHandsOnToday }: MHandsOnCardProps) => { 
  const [isHandsAvailable, setIsHandsAvailable] = useState<boolean>(false);
  const checkHandsAvailableTimeRef = useRef<NodeJS.Timeout | null>(null);

  const verifyHandsOnSchedule = (handsAvailableTime: Date): boolean => {
    const timeNow = format(new Date(), 'HH:mm:ss');
    const baseNow = parse(`${BASE_DATE}T${timeNow}`, 'yyyy-MM-dd\'T\'HH:mm:ss', new Date());
    return isAfter(baseNow, handsAvailableTime);
  };

  const verifyInterval = (handsAvailableTime: Date) => {
    if (!checkHandsAvailableTimeRef.current || !verifyHandsOnSchedule(handsAvailableTime)) return;
    setIsHandsAvailable(true);
    clearInterval(checkHandsAvailableTimeRef.current);
  };

  useEffect(() => {
    if (!HandsOnSchedule || !HandsOnLink) return;
    const formatSchedule = parse(`${BASE_DATE}T${HandsOnSchedule.split('T')[1]}`, 'yyyy-MM-dd\'T\'HH:mm:ss', new Date());
    const handsAvailableTime = subMinutes(formatSchedule, MINUTES_BEFORE_CLASS_TO_RELEASE_LINK);
    if (verifyHandsOnSchedule(handsAvailableTime)) return setIsHandsAvailable(true);
    checkHandsAvailableTimeRef.current = setInterval(() => verifyInterval(handsAvailableTime), 10000);
  }, []);
  
  return (
    <Box
      sx={{
        width: '400px',
        height: '400px',
        bgcolor: '#B8D98799',
        borderRadius: '5px',
        backgroundImage: `url(${maskGreen})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      <Box sx={{ flexGrow: 0.3, display: 'flex', alignItems: 'center', marginTop: '20px' }} >
        <Box 
          sx={{
            width: '200px',
            height: '200px',
            background: `url(${userWithHeadPhone}) no-repeat`,
            backgroundSize: 'cover'
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, textAlign: 'center', width: '90%' }} >
        <Typography
            sx={{
                color: 'black',
                fontFamily: "Inter",
                fontWeight: 600
            }}
        >
          Junte-se à nossa aula prática ao vivo!
        </Typography>
        <Typography
          sx={{
            color: 'black',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '0.9em'
          }}
        >
          Interaja diretamente com o professor e tire todas as suas dúvidas em tempo real.
        </Typography>
        <Button
          onClick={() => { if (HandsOnLink) window.open(HandsOnLink, '_blank') }}
          sx={{
            marginTop: '30px',
            bgcolor: '#FFFFFF',
            '&:hover': {
                bgcolor: '#f0f0f0',
            },
            fontFamily: 'Inter',
            fontWeight: 600,
            textTransform: 'none',
            color: '#000000',
            padding: '10px'
          }}
          disabled={!HandsOnLink || !isHandsAvailable}
        >
          {
            !HasHandsOnToday ? 'Infelizmente, não teremos aula prática hoje!' :
            (!HandsOnLink || !HandsOnSchedule) ? 'Aula pendente: link indisponível' :
            isHandsAvailable ? 'Entre na aula agora!' :
            `A aula estará disponível às ${format(parse(HandsOnSchedule, 'yyyy-MM-dd\'T\'HH:mm:ss', new Date()), 'HH:mm')} horas`
          }
        </Button>
      </Box>
    </Box>
  );
};

export default MHandsOnCard;