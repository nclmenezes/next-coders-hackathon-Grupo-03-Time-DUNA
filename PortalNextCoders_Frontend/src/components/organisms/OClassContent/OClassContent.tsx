import { Box, Typography } from '@mui/material';
import MClassContent from '../../molecules/MClassContent/MClassContent';
import ClassNotepad from '../../atoms/Sections/ClassNotepad';
import { IModuleClass, ISubModuleClass, IContentClass } from '../../../interfaces/CourseService/courseService.interface';
import { ASSESSMENT_CONTENT_TYPE } from '../../../constants/contentLayout/contentLayout';
import MLoading from '../../molecules/MLoading';
import { LinearProgressWithLabel } from '../../atoms/LinearProgress';
import OAssessment from '../OClass/Assessment/OAssessment';
import OResultAssessment from '../OClass/Assessment/OResultAssessment';
import ABackNextContent from '../../atoms/ABackNextContent/ABackNextContent';
import { Dispatch, SetStateAction } from 'react';

interface IClassContentProps {
    moduleClass: IModuleClass;
    subModuleClass: ISubModuleClass;
    subModuleClassIndex: number;
    contentClassIndex: number;
    handleNextButton: () => void;
    handleBackButton: () => void;
    contentAttendance: () => Promise<boolean>;
    contentLoading: boolean;
    setContentLoading: Dispatch<SetStateAction<boolean>>;
};

const OClassContent = ({
    moduleClass,
    subModuleClass,
    subModuleClassIndex,
    contentClassIndex,
    handleNextButton,
    handleBackButton,
    contentAttendance,
    contentLoading,
    setContentLoading
}: IClassContentProps) => {
    const contentClass: IContentClass = subModuleClass.contents[contentClassIndex];

    const nextButtonText = (): string => {
        if (contentClassIndex !== subModuleClass.contents.length - 1) {
            if (subModuleClass.contents[contentClassIndex + 1].contentType === ASSESSMENT_CONTENT_TYPE) return 'Questionário';
            return 'Próximo conteúdo';
        };
        if (subModuleClassIndex !== moduleClass.subModules.length - 1) return 'Próxima seção';
        return 'Finalizar aula';
    };

    const postContentAttendance = async (): Promise<boolean> => await contentAttendance();

    const nextButton = async () => {
        if (!contentClass.finishAt && !await postContentAttendance()) return;
        handleNextButton();
    };

    return (
        <Box sx={{ display: 'flex', gap: '30px' }}>
            {contentLoading && <MLoading />}
            {
                contentClass.contentType !== ASSESSMENT_CONTENT_TYPE &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexGrow: 2,
                        justifyContent: 'center',
                        visibility: contentLoading ? 'hidden' : 'default'
                    }}
                >  
                        <MClassContent
                            contentType={contentClass.contentType}
                            contentLink={contentClass.contentLink || ''}
                            contentLinkDescription={contentClass.contentLinkDescription || ''}
                            contentName={contentClass.contentName}
                            contentDescription={contentClass.contentDescription || ''}
                        />

                        <ABackNextContent
                            handleBackButton={handleBackButton}
                            nextButtonVisibility={true}
                            handleNextButton={nextButton}
                            nextButtonText={nextButtonText()}
                            backButtonText={(contentClassIndex === 0 || subModuleClass.contents.length === 1) ? 'Seção anterior' : 'Conteúdo anterior'}
                            backButtonVisibility={subModuleClassIndex + contentClassIndex === 0}
                        />
                </Box>
            }
            {
                contentClass.contentType === ASSESSMENT_CONTENT_TYPE &&
                (
                    contentClass.finishAt === null ?
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexGrow: 2,
                            justifyContent: 'center'
                        }}>
                            <OAssessment content={contentClass} contentAttendance={contentAttendance}
                                         setContentLoading={setContentLoading}/>
                            <ABackNextContent
                                handleBackButton={handleBackButton}
                                handleNextButton={nextButton}
                                nextButtonText={nextButtonText()}
                                nextButtonVisibility={false}
                                backButtonText={(contentClassIndex === 0 || subModuleClass.contents.length === 1) ? 'Seção anterior' : 'Conteúdo anterior'}
                                backButtonVisibility={subModuleClassIndex + contentClassIndex === 0}
                            />
                        </Box> :   
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexGrow: 2,
                            justifyContent: 'center',
                            visibility: contentLoading ? 'hidden' : 'default'
                        }}
                    > 
                        {
                            !contentLoading &&
                            <OResultAssessment
                                assessmentId={contentClass.assessmentId!}
                                studentId={moduleClass.studentId}
                                subModuleId={subModuleClass.subModuleId}
                                contentId={contentClass.contentId}
                                trailId={moduleClass.trailId!}
                            />
                        }

                        <ABackNextContent
                            handleBackButton={handleBackButton}
                            handleNextButton={nextButton}
                            nextButtonText={nextButtonText()}
                            nextButtonVisibility={true}
                            backButtonText={(contentClassIndex === 0 || subModuleClass.contents.length === 1) ? 'Seção anterior' : 'Conteúdo anterior'}
                            backButtonVisibility={subModuleClassIndex + contentClassIndex === 0}
                        />
                    </Box>
                )
            }
            <Box sx={{ height: 'auto', width: '1px', bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
            <Box sx={{ flexGrow: 0.5, minWidth: '25%', maxWidth: '30%'}}>
                <Box sx={{ userSelect: 'none' }}>
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            color: 'grey',
                            fontSize: '0.95em'
                        }}
                    >
                        [{moduleClass.trailName}]
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            color: 'black',
                            fontSize: '1.1em'
                        }}
                    >
                        <strong style={{ fontWeight: 700 }}>Aula {moduleClass.moduleOrderNumber}</strong> - {moduleClass.moduleName!.split('-')[1]}<br />
                        <strong style={{ fontWeight: 700 }}>Seção {subModuleClass.subModuleOrderNumber}</strong> - {subModuleClass.subModuleName}
                        <span style={{ color: 'grey', fontSize: '0.95em' }}> [{subModuleClass.subModuleOrderNumber}/{moduleClass.subModules.length}]</span>
                    </Typography>
                </Box>
                <LinearProgressWithLabel
                    value={
                        (100 *
                            subModuleClass.contents
                                .reduce((sum, content) => {
                                    if (content.finishAt !== null) return sum + 1;
                                    return sum;
                                }, 0)
                        ) / subModuleClass.contents.length
                    }
                    width="100%"
                    direction="column-reverse"
                    align="start"
                    text="da seção foi concluída"
                />
                <Box sx={{ marginTop: '15px' }} >
                    {
                        subModuleClass.contents
                            .map((content: IContentClass) => (
                                <ClassNotepad
                                    isAllowed={content.contentType !== ASSESSMENT_CONTENT_TYPE || content.finishAt === null}
                                    isCompleted={content.finishAt !== null}
                                    isSelected={content.contentId === contentClass.contentId}
                                    contentId={content.contentId}
                                    contentType={content.contentType}
                                    contentName={content.contentName}
                                />
                            ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default OClassContent;