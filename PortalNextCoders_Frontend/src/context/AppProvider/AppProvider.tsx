import {BrowserRouter} from "react-router-dom";
import {ReactElement} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../../styles/theme";
import GlobalStyles from "../../styles/global";
import {AuthProvider} from "../AuthProvider/AuthProvider";
import {StudentProvider} from "../StudentProvider/StudentProvider";
import {CourseProvider} from "../CourseProvider/CourseProvider";
import {ExtraCourseProvider} from "../ExtraCourseProvider/ExtraCourseProvider";

interface Props {
    children: ReactElement | ReactElement[];
};

export const AppProvider = ({children}: Props) => (
    <BrowserRouter>
        <AuthProvider>
            <StudentProvider>
                <CourseProvider>
                    <ExtraCourseProvider>
                        <ThemeProvider theme={theme}>
                            <GlobalStyles/>
                            {children}
                        </ThemeProvider>
                    </ExtraCourseProvider>
                </CourseProvider>
            </StudentProvider>
        </AuthProvider>
    </BrowserRouter>
);
