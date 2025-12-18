import { useEffect, useState, useRef } from "react";
import { LocalizationProvider, StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isValid } from 'date-fns';
import { makeStyles } from '@mui/styles';
import { Box, TextField, styled, ClickAwayListener } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";


interface IMultiDatePicker<TValue> {
    label: string;
    multiple?: boolean;
    separator?: string;
    value?: TValue;
    onChange?: (selectedDates: TValue) => any;
    sx?: SxProps<Theme> | undefined;
}


const HighlightedDay = styled(PickersDay)(({ theme, selected }) => ({
    ...(selected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }),
    ...(!selected && {
        backgroundColor: "transparent !important",
    })
}));

const useStyles = makeStyles({
    hideControls: {
        '& .MuiPickersToolbar-root, & .MuiDialogActions-root': {
            display: 'none',
        },
    },
});


const areDateListsEqual = (list1: Date[], list2: Date[]) => {
    if (list1.length !== list2.length) {
        return false;
    }

    const sortedList1 = [...list1].map(date => date.getTime()).sort((a, b) => a - b);;
    const sortedList2 = [...list2].map(date => date.getTime()).sort((a, b) => a - b);;


    for (let i = 0; i < sortedList1.length; i++) {
        if (sortedList1[i] !== sortedList2[i]) {
            return false;
        }
    }

    return true;
}

const ServerDay = (props: any) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const highlightedDayStrings = highlightedDays.map((d: any) => format(d, 'yyyy-MM-dd'));
    const dayString = format(day, 'yyyy-MM-dd');

    const isSelected = highlightedDayStrings.includes(dayString)

    return (
        <HighlightedDay
            {...other}
            day={day}
            selected={isSelected}
            outsideCurrentMonth={outsideCurrentMonth}
        />
    );
};


const MultiDatePicker = <TValue extends Date | Date[] | null>({ label, multiple = false, separator = ' & ', value, onChange, sx }: IMultiDatePicker<TValue>) => {
    const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);
    const [selectedValue, setSelectedValue] = useState<Date | null | undefined>(null)
    const [showCalendar, setShowCalendar] = useState<boolean>(false)
    const refTextField = useRef<HTMLDivElement>(null);
    const classes = useStyles();


    useEffect(() => {
        if (selectedValue !== null && showCalendar) setSelectedValue(null)
    }, [selectedValue])

    useEffect(() => {
        if (multiple) {
            const newValue = Array.isArray(value) ? value.map(v => typeof v === 'string' ? parseISO(v) : v) : [];
            const datesOnly: Date[] = newValue.filter(date => isValid(date)) as Date[];
            if(areDateListsEqual(highlightedDays, datesOnly)) return;
            setHighlightedDays(datesOnly);
        } else {
            const newValue = !Array.isArray(value) && value ? [typeof value === 'string' ? parseISO(value) : value] : [];
            const datesOnly: Date[] = newValue.filter(date => isValid(date)) as Date[];
            if(areDateListsEqual(highlightedDays, datesOnly)) return;
            setHighlightedDays(datesOnly);
        }
    }, [value, multiple, highlightedDays]);

    useEffect(() => {
        if (showCalendar) return;
        const monthCounts = highlightedDays.reduce((acc: any, date) => {

            const month = format(date, 'yyyy-MM');
            if (!acc[month]) {
                acc[month] = 1;
            } else {
                acc[month]++;
            }
            return acc;
        }, {});

        let mostHighlightedMonth = new Date();
        let maxCount = 0;
        for (const [month, count] of Object.entries(monthCounts) as [string, number][]) {
            if (count > maxCount) {
                mostHighlightedMonth = parseISO(month + '-01');
                maxCount = count;
            }
        }
        setSelectedValue(mostHighlightedMonth)
    }, [highlightedDays, showCalendar])



    const notifyChange = (newHighlightedDays: Date[]) => {
        if (!onChange) return
        if (multiple) {
            onChange(newHighlightedDays as unknown as TValue);
        } else {
            onChange((newHighlightedDays[0]  || null) as unknown as TValue);
        }
    };

    const selectHandler = (_value: Date | null) => {
        if (_value !== null) {
            const dayString = format(_value, 'yyyy-MM-dd');
            let newHighlightedDays;

            if (highlightedDays.find(d => format(d, 'yyyy-MM-dd') === dayString)) {
                newHighlightedDays = highlightedDays.filter(d => format(d, 'yyyy-MM-dd') !== dayString);
            } else {
                if (multiple)
                    newHighlightedDays = [...highlightedDays, _value];
                else {
                    newHighlightedDays = [_value];
                    setShowCalendar(false)
                }
            }
            setSelectedValue(_value)
            setHighlightedDays(newHighlightedDays);
            notifyChange(newHighlightedDays);
        }
    };


    return (
        <ClickAwayListener onClickAway={() => setShowCalendar(false)}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    ...sx
                }}
            >
                <TextField
                    fullWidth
                    ref={refTextField}
                    label={label}
                    value={highlightedDays.length ? highlightedDays.map(el => format(el, 'dd/MM/yyyy')).join(separator) : ''}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                        sx: {
                            borderBottomLeftRadius: showCalendar ? '0' : '4px',
                            borderBottomRightRadius: showCalendar && (refTextField.current !== null && refTextField.current.offsetWidth < 324) ? '0' : '4px'
                        }
                    }}
                    onFocus={() => setShowCalendar(true)}
                    focused={showCalendar}
                />
                {showCalendar && <Box
                    sx={{
                        border: 'solid rgb(25, 118, 210) 2px',
                        borderRadius: '4px',
                        position: 'absolute',
                        bgcolor: 'background.paper',
                        zIndex: 10000,
                        '& .MuiPickersStaticWrapper-staticWrapperRoot': {
                            backgroundColor: '#fff',
                        },
                        marginTop: '-2px',
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        maxWidth: '324px'

                    }}
                >
                    <Box
                        sx={{
                            width: refTextField.current === null ? '0' : refTextField.current.offsetWidth - 4,
                            height: '4px',
                            bgcolor: 'white',
                            marginTop: '-3px',
                            maxWidth: '320px'
                        }}
                    >

                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StaticDatePicker
                            slots={{
                                day: ServerDay,
                            }}
                            slotProps={{
                                day: {
                                    highlightedDays,
                                } as any,
                            }}
                            onChange={selectHandler}
                            value={selectedValue}
                            className={classes.hideControls}
                        />
                    </LocalizationProvider>
                </Box>}
            </Box>
        </ClickAwayListener>
    );
}

export default MultiDatePicker;