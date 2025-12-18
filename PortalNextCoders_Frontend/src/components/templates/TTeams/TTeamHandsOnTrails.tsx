import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import trailService from '../../../services/api/classes/trail.service';
import studentService from "../../../services/student/student.service";

import { IHandsTrail, ITrail } from '../../../interfaces/teams/handsOn.interfaces';

import { Box, Button } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MLoading from "../../molecules/MLoading";


const TTeamHansOnTrails = () => {
    const { classId } = useParams<string>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as IHandsTrail;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [trails, setTrails] = useState<ITrail[]>([]);

    const getClassData = async () => {
        if (state.trails) {
            setTrails(state.trails);
            return setIsLoading(false);
        };
        setIsLoading(true);
        try {
            const classData = await studentService.GetTeamByStudentClassId(Number(classId));
            if (!classData) return setIsLoading(false);
            const trailsData = await trailService.GetAllByCourse(classData.trailId);
            const classTrails = trailsData.map(el => { return { id: el.trailId, name: el.name, modules: el.modules } });
            setTrails(classTrails);
            setIsLoading(false);
        }
        catch (error) {
            console.error('Error:', error);
        };

    };

    const navigateToModules = async (trailId: number) => {
        const trail = trails.find(trail => trail.id === trailId);
        if (!trail) return;

        navigate(`/teams/handsOn/${classId}/modules`, {
            state: {
                ...state,
                trailId,
                trailName: trail.name,
                modules: trail.modules,
                classTrails: trails,
            }
        });
    };

    useEffect(() => {
        getClassData();
    }, []);

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    variant="contained"
                    onClick={
                        () => navigate(
                            state.navigateBack == undefined ?
                            `/teams/detail/${classId}` :
                            state.navigateBack,
                            { state }
                        )
                    }
                    startIcon={<ArrowBackIcon />}
                >
                    {state.navigateBack === undefined ? 'Voltar para detalhes' : 'Voltar para Gestão de Turma'}
                </Button>
            </Box>

            <Box>
                <h1 style={{ fontSize: '26px' }}>Selecione o módulo do Hands-On</h1>
                <h4 style={{ color: 'grey', fontWeight: '400' }} >Turma: {state?.className}</h4>
            </Box>

            {
                isLoading ? <MLoading /> : (
                    <Box
                        sx={{
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1vh',
                                marginTop: '8vh'
                            }}
                        >
                            {
                                trails.map(trail =>
                                    <Button
                                        key={trail.id}
                                        variant="contained"
                                        sx={{
                                            padding: '8px 30px'
                                        }}
                                        onClick={() => navigateToModules(trail.id)}
                                    >
                                        {trail.name}
                                    </Button>
                                )
                            }
                        </Box>
                    </Box >
                )
            }
        </>
    );
};

export default TTeamHansOnTrails;