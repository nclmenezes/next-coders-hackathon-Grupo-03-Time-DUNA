import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { IModuleClass, ISubModuleClass, IContentClass } from "../../../interfaces/CourseService/courseService.interface";
import CourseService from "../../../services/course/course.service";
import StudentContentService from "../../../services/api/student/studentContent.service";
import StudentExtraContentService from "../../../services/api/student/studentExtraContent.service";
import CourseExtraService from "../../../services/course/courseExtra.service";
import { useStudent } from '../../../context/StudentProvider/StudentProvider';
import { ModuleDto } from "../../../interfaces/StudentContents/Responses/Classes";
import {
    LOAD_CLASS_INFO_ERROR_MSG,
    STANDARD_CLASS_SUBMODULE_TYPE,
    HANDSON_SUBMODULE_TYPE,
    POST_ATTENDANCE_ERROR_MSG,
    CLASS_NOT_AVAILABLE_TODAY_ERROR_MSG
} from "../../../constants/contentLayout/contentLayout";
import { ASSESSMENT_CONTENT_TYPE } from '../../../constants/contentLayout/contentLayout';
import MLoading from '../../molecules/MLoading';
import OClassContent from '../../organisms/OClassContent/OClassContent';
import OHandsContent from '../../organisms/OHandsContent/OHandsContent';

const Class = () => {
    const { subModuleId } = useParams<{ subModuleId: string }>();
    const { classes } = useStudent();
    const navigate = useNavigate();
    const localpath = window.location.pathname;
    const [pageLoading, setPageLoading] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const [moduleClass, setModuleClass] = useState<IModuleClass | null>(null);
    const [subModuleClass, setSubModuleClass] = useState<ISubModuleClass | null>(null);
    const [subModuleClassIndex, setSubModuleClassIndex] = useState<number | null>(null);
    const [contentClassIndex, setContentClassIndex] = useState<number | null>(null);

    const showErrorAndNavigate = (errorMessage: string) => {
        showErrorToast(errorMessage);  
    };

    const findSubModuleClass = (subModuleClasses: ISubModuleClass[]) => {
        const currentSubModuleClassIndex = subModuleClasses.findIndex((el => el.subModuleId === Number(subModuleId)));
        if (currentSubModuleClassIndex === -1) return showErrorAndNavigate(LOAD_CLASS_INFO_ERROR_MSG);
        setSubModuleClassIndex(currentSubModuleClassIndex);
        setSubModuleClass(subModuleClasses[currentSubModuleClassIndex]);
        const firstContentIncompleted = subModuleClasses[currentSubModuleClassIndex].contents
          .findIndex((content: IContentClass) => content.finishAt == null);
        if (firstContentIncompleted === -1) return setContentClassIndex(0);
        setContentClassIndex(firstContentIncompleted);
    };
    
    const verifyLimitDate = (limitDateStr: string) => {
        const limitDate = startOfDay(parseISO(limitDateStr));
        const todayDate = startOfDay(new Date());
        if (isBefore(todayDate, limitDate)) return showErrorAndNavigate(CLASS_NOT_AVAILABLE_TODAY_ERROR_MSG);
    };

    const fetchClassData = async () => {
        if (!classes) return showErrorAndNavigate(LOAD_CLASS_INFO_ERROR_MSG);

        let moduleOrderNumber: number | null = null;
        let currentModule: ModuleDto | null  = null;

        for (const trail of classes.trails) {
            for (let i = 0; i < trail.modules.length; i++) {
                for (const subModule of trail.modules[i].subModules) {
                    if (subModule.id === Number(subModuleId)) {
                        moduleOrderNumber = i + 1;
                        currentModule = trail.modules[i];
                    };
                };
            };
        };

        if (moduleOrderNumber === null || !currentModule) return showErrorAndNavigate(LOAD_CLASS_INFO_ERROR_MSG);

        setPageLoading(true);
         let _moduleClass: IModuleClass | null = null;
    if (localpath.includes("extra")) {
      _moduleClass = await CourseExtraService.GetExtraModuleClass({
        StudentClassId: classes.id,
        ModuleId: currentModule.id,
      });
    } else {
      _moduleClass = await CourseService.GetModuleClass({
        StudentClassId: classes.id,
        ModuleId: currentModule.id,
      });
    }
        setPageLoading(false);
        if (!_moduleClass) return;
        verifyLimitDate(_moduleClass.limitDate);
        _moduleClass.trailId = currentModule.trailId;
        _moduleClass.trailName = classes.trails.find(trail => trail.modules.find(module => module.id === currentModule!.id))!.title;
        _moduleClass.moduleName = currentModule.title;
        _moduleClass.moduleOrderNumber = moduleOrderNumber;
        setModuleClass(_moduleClass);
        findSubModuleClass(_moduleClass.subModules);
    };
    
    useEffect(() => {
        fetchClassData();
    }, [classes]);

    const updateContentAttendance = () => {
        if (!moduleClass || !subModuleClass || contentClassIndex === null) return;
        const updatedContents = subModuleClass.contents.map(el => {
            if (el.contentId !== subModuleClass.contents[contentClassIndex].contentId) return el;
            el.finishAt = format(new Date(), 'dd-MM-yyyy\'T\'HH:mm:ss');
            return el;
        });
        const updatedSubModule = { ...subModuleClass, contents: updatedContents };
        setSubModuleClass(updatedSubModule);
        const updatedSubModules = moduleClass.subModules
            .map((subModuleClass: ISubModuleClass) => {
                if (subModuleClass.subModuleId === updatedSubModule.subModuleId) return updatedSubModule;
                return subModuleClass;
            });
        const updatedModuleClass = moduleClass;
        updatedModuleClass.subModules = updatedSubModules; 
        setModuleClass(updatedModuleClass);
    };

    const contentAttendance = async (): Promise<boolean> => {
        if (!subModuleClass || contentClassIndex === null) return false;
        setContentLoading(true);
        
        let postResult: boolean;
        if (subModuleClass.contents[contentClassIndex].contentType == ASSESSMENT_CONTENT_TYPE) {
            postResult = true;
        } else if (localpath.includes("extra")) {
            postResult = await StudentExtraContentService.SaveStudentExtraContentProgress(subModuleClass.contents[contentClassIndex].contentId);
        } else {
            postResult = await StudentContentService.SaveStudentContentProgress(subModuleClass.contents[contentClassIndex].contentId);
        }
        
        setContentLoading(false);
        if (!postResult) showErrorToast(POST_ATTENDANCE_ERROR_MSG);
        if (postResult) updateContentAttendance();
        return postResult;
    };

    const handleNextButton = () => {
        const subModulesQtd = moduleClass!.subModules.length;
        const contentsQtd = subModuleClass!.contents.length;
        if (contentClassIndex === contentsQtd - 1) {
            if (subModuleClassIndex === subModulesQtd - 1) {
                showSuccessToast(`Parabéns! A aula ${moduleClass!.moduleOrderNumber} foi concluída com sucesso.`);
                navigate('/training');
                return;
            };
            setSubModuleClass(moduleClass!.subModules[subModuleClassIndex! + 1])
            setSubModuleClassIndex(subModuleClassIndex! + 1);
            setContentClassIndex(0);
            return;
        };
        setContentClassIndex(contentClassIndex! + 1);
    };

    const handleBackButton = () => {
        if (contentClassIndex === 0 || subModuleClass!.contents.length === 1) {
            setSubModuleClass(moduleClass!.subModules[subModuleClassIndex! - 1])
            setSubModuleClassIndex(subModuleClassIndex! - 1);
            setContentClassIndex(0);
            return;
        };
        setContentClassIndex(contentClassIndex! - 1);
    };

    const renderClass = () => {
        if (pageLoading) return <MLoading />;
        if (!moduleClass || !subModuleClass || subModuleClassIndex === null) return;
        if (contentClassIndex !== null && subModuleClass.subModuleTypeId === STANDARD_CLASS_SUBMODULE_TYPE) 
            return (
                <OClassContent
                    moduleClass={moduleClass}
                    subModuleClass={subModuleClass}
                    subModuleClassIndex={subModuleClassIndex}
                    contentClassIndex={contentClassIndex}
                    handleNextButton={handleNextButton}
                    handleBackButton={handleBackButton}
                    contentAttendance={contentAttendance}
                    contentLoading={contentLoading}
                    setContentLoading={setContentLoading}
                />
            );
        if (subModuleClass.subModuleTypeId === HANDSON_SUBMODULE_TYPE)
            return (
                <OHandsContent
                    moduleClass={moduleClass}
                    subModuleClass={subModuleClass}
                    subModuleClassIndex={subModuleClassIndex}
                    handleNextButton={handleNextButton}
                    handleBackButton={handleBackButton}
                    contentAttendance={contentAttendance}
                    contentLoading={contentLoading}
                    setContentLoading={setContentLoading}
                />
            );
    };

    return renderClass() ?? null;
};

export default Class;