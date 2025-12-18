import { useState } from "react";

import { Box } from '@mui/material';

import OTitleHome from './OTitleHome';
import MCardsHome from "../../../molecules/MDashboard/MDashboardHome/MCardStepHome";

import Sheet from '../../../../assets/Home/Sheet.png'
import Woman from '../../../../assets/Home/Woman.png'
import Boy from '../../../../assets/Home/Boy.png'

export default function OStepsHome() {
  const [type, setType] = useState('');

  return (
      <Box>
        <Box>
        <OTitleHome />
        </Box>
        
        <Box sx={{display:'flex', flexDirection: 'column', gap: 2}}>
          {type === "Pending" ? 
            <MCardsHome 
              icon={Sheet}
              text='Conclua seu cadastro para dar início ao vestibular'
              description='Você precisa preencher todos os dados obrigatório para poder seguir com a candidatura.'
              textButton='Concluir cadastro'
              buttonPath='/settings'
              Inactive={false}
              />
          : ""}
          
          {(type === "Pending" || type === "Registered") ? 
            <>
              <MCardsHome
              icon={Boy}
              text='Conclua a validação de seus documentos'
              description='Você precisa efetuar a validação dos seus documentos para prosseguir no processo seletivo.'
              textButton='Validar documentos'
              buttonPath=''
              Inactive={type === "Pending"}
              />

            <MCardsHome
              icon={Woman}
              text='Realize o vestibular para seguir com sua candidatura'
              description='Ao clicar em realizar vestibular, você será direciona para um questionário de lógica.'
              textButton='Acessar vestibular'
              buttonPath='/exam'
              Inactive={type === "Pending"}
              />
            </>
          : ""}
        </Box>
      </Box>

  );
}