import {
    Box, Button, Checkbox,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import {useNavigate} from "react-router";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import mailService from "../../../services/api/Email/mail.service";
import {PageControlBar, PageHeader} from "../../pages/Candidate/styles";
import SendIcon from '@mui/icons-material/Send';
import MLoading from "../MLoading";
import _ from "lodash";
import {MCheckBoxTableGrid} from "../MGrid/MCheckBoxTableGrid";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import {showNotFoundErrorToast} from "../../../utils/toast";


function MCommunication() {
    const navigate = useNavigate();

    const [mailList, setMailList] = useState<any[]>([]);
    const [mailSelectedList, setMailSelectedList] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [defaultRowsPerPage] = useState(10);
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [studentClass, setStudentClass] = useState("");
    const [role, setRole] = useState("");
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelectedEmails = new Set(mailSelectedList.map(mail => JSON.stringify({ name: mail.name, email: mail.email })));
            setSelectedEmails(newSelectedEmails);
        } else {
            setSelectedEmails(new Set());
        }
    };

    const handleSelectEmail = (name: string, email: string) => {
        const newSelectedEmails = new Set(selectedEmails);
        const emailObject = { name, email };
        const emailString = JSON.stringify(emailObject);

        if (newSelectedEmails.has(emailString)) {
            newSelectedEmails.delete(emailString);
        } else {
            newSelectedEmails.add(emailString);
        }

        setSelectedEmails(newSelectedEmails);
    };

    const getMailList = async () => {
        setIsLoading(true);
        const mailData = await mailService.getMails();
        setIsLoading(false);
        setMailList(mailData);
        const totalRecords = mailData.length;
        setMailSelectedList(mailData.slice(0, defaultRowsPerPage));
        setTotalPages(totalRecords);
    };

    const paginateMailList = async () => {
        setMailSelectedList(mailList.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }
    const applyFilters = (mailList: any[], name: string, studentClass: string, role: string): any[] => {
        return mailList.filter(mail =>
            mail.name.toLowerCase().includes(name.toLowerCase()) &&
            (studentClass ? mail.class === studentClass : true) &&
            (role ? mail.role === role : true)
        );
    };

    const filterMailList = () => {
        const filteredList = applyFilters(mailList, name, studentClass, role);
        setMailSelectedList(filteredList.slice(0, rowsPerPage));
        setTotalPages(Math.ceil(filteredList.length / rowsPerPage));
    };

    //TODO- organzie file and add feedback if mail list is empty
    //TODO - add dictionary for student and role
    useEffect(() => {
        getMailList();
    }, []);

    useEffect(() => {
        filterMailList();
    }, [name, studentClass, role, rowsPerPage]);

    useEffect(() => {
        paginateMailList();
    }, [page, rowsPerPage]);

    useEffect(() => {
        getMailList();
    }, []);

    useEffect(() => {
        setRowsPerPage(defaultRowsPerPage);
    }, [defaultRowsPerPage]);

    const TABLE_HEAD = [
        {
            title: "Selecionar",
            field: "select",
            minWidth: 50,
        },
        {
            title: "Email",
            field: "email",
        },
        {
            title: "Nome",
            field: "name",
            minWidth: 200,
        },
        {
            title: "Cargo",
            field: "role",
            minWidth: 145,
        },
        {
            title: "Turma",
            field: "class",
            minWidth: 150,
        },
    ];

    const tableRows = mailSelectedList.map((mail) => ({
        id: mail.id,
        select: (
            <Checkbox
                checked={Array.from(selectedEmails).some((item) => JSON.parse(item).email === mail.email)}
                onChange={() => handleSelectEmail(mail.name, mail.email)}
            />
        ),
        name: <div>{mail.name}</div>,
        email: <div>{mail.email}</div>,
        role: <div>{mail.role}</div>,
        class: <div>{mail.class}</div>,
    }));

    const debouncedFilterName = useCallback(
        _.debounce((value: string) => {
            setName(value);
        }, 100),
        []
    );

    const handleFilterName = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === "") {
            handleCleanFilterButtonClick();
        } else {
            debouncedFilterName(value);
        }
    };
    const handleFilterClass = (event: SelectChangeEvent) => {
        setStudentClass(event.target.value);
    };
    const handleFilterRole = (event: SelectChangeEvent) => {
        setRole(event.target.value);
    };
    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleSendButtonClick = () => {
        if (selectedEmails.size === 0) {
            showNotFoundErrorToast('Selecione ao menos um email para enviar');
            return;
        }
        const emails = Array.from(selectedEmails).map(email => JSON.parse(email));
        navigate("/communicationEngine", { state: { selectedEmails: emails } });
    };
    const handleCleanFilterButtonClick = () => {
        setName("");
        setStudentClass("");
        setRole("");
        setSelectedEmails(new Set());
        setPage(0);
        getMailList();
    };
    function getDistinctClasses(mailList: any[]): string[] {
        const classSet = new Set<string>();
        mailList.forEach(mail => {
            if (mail.class) {
                classSet.add(mail.class);
            }
        });
        return Array.from(classSet);
    }
    function getDistinctRoles(mailList: any[]): string[] {
        const classSet = new Set<string>();
        mailList.forEach(mail => {
            if (mail.role) {
                classSet.add(mail.role);
            }
        });
        return Array.from(classSet);
    }

    return (
        <Box>
            <PageHeader>
                <h1>Comunicação Next Coders</h1>
            </PageHeader>

            <PageControlBar>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Nome do Candidato"
                                value={name}
                                variant="outlined"
                                onChange={handleFilterName}
                                inputProps={{maxLength: 50, autoComplete: "off"}}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Turma</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={studentClass}
                                label="Turma"
                                onChange={handleFilterClass}
                            >
                                {getDistinctClasses(mailList).map((classValue) => (
                                    <MenuItem key={classValue} value={classValue}>
                                        {classValue}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Cargo</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={role}
                                label="Cargo"
                                onChange={handleFilterRole}
                            >
                                {getDistinctRoles(mailList).map((classValue) => (
                                    <MenuItem key={classValue} value={classValue}>
                                        {classValue}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1}>
                        <FormControl fullWidth>
                            <InputLabel id="rows-per-page-label">
                                Registros
                            </InputLabel>
                            <Select
                                labelId="rows-per-page-label"
                                value={rowsPerPage}
                                defaultValue={10}
                                label="Registros"
                                onChange={(event) => {
                                    const value = parseInt(event.target.value as string);
                                    setRowsPerPage(value);
                                }}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1}>
                        <Button
                            variant="contained"
                            sx={{minWidth: 100, bgcolor: "#679d12", top: '10px', left: '15px', padding: '10px'}}
                            onClick={handleSendButtonClick}
                            startIcon={<SendIcon/>}
                        >
                            Enviar Email
                        </Button>
                    </Grid>

                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            sx={{minWidth: 100, bgcolor: "#e38d23", top: '10px', left: '15px', padding: '10px'}}
                            onClick={handleCleanFilterButtonClick}
                            startIcon={<CleaningServicesIcon/>}
                        >
                            Limpar Filtros
                        </Button>
                    </Grid>
                </Grid>
            </PageControlBar>

            {isLoading ? (
                <MLoading/>
            ) : (
                <MCheckBoxTableGrid
                    tableHead={TABLE_HEAD}
                    tableRows={tableRows}
                    // rowCallback={handleCandidateClick}
                    paginationConfig={{
                        page,
                        totalPages,
                    }}
                    paginationCallback={handlePaginationClick}
                    rowsPerPage={rowsPerPage}
                    handleSelectAll={handleSelectAll}
                    selectedEmails={selectedEmails}
                />
            )}
        </Box>
    );
}

export default MCommunication