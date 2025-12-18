import {FormControlLabel, Radio, Paper, Box} from '@mui/material';
import React from 'react';

interface MExamAnswerProps {
    index?: number,
    checked: boolean,
    change: (param?: any, param2?: any) => void,
    answer?: string
}

const formControlLabelStyle = {
    "& .MuiFormControlLabel-label": {
        color: '#495057',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '17px'
    }
}

export default function MExamAnswers({index, answer, change, checked}: MExamAnswerProps) {
    const colorChecked = () => checked ? '#1976d236' : '#F8F9FA';

    return (
        <Paper sx={{
            margin: '6px 0',
            backgroundColor: colorChecked,
            borderRadius: '4px',
            padding: '0 10px',
            width: '100%',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '14px',
            lineheight: '17px',
            display: 'flex',
            alignItems: 'center'
        }} elevation={0}>
            <FormControlLabel value={index}
                              control={<Radio checked={checked} onChange={change} sx={{color: '#9EA6AD'}}/>}
                              label={answer} sx={{...formControlLabelStyle}}/>
        </Paper>
    );
}