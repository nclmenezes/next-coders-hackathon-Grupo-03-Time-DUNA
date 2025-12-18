import React from 'react';
import { Button } from '@mui/material';
import { CourseDetail } from '../../../services/studentNew/studentNew.service';

interface CourseButtonProps {
  item: CourseDetail;
  primaryCourse: boolean;
  onAccess: (item: CourseDetail) => void;
  onEnroll: (item: CourseDetail) => void;
}

const buttonStyles = {
  base: {
    mt: 2,
    width: "100%",
    borderRadius: 2,
    fontWeight: 600,
  },
  access: {
    backgroundColor: '#4263dc',
    boxShadow: '0 2px 8px rgba(66, 99, 220, 0.25)',
    '&:hover': {
      backgroundColor: '#3651c7',
      boxShadow: '0 3px 12px rgba(66, 99, 220, 0.35)'
    }
  },
  enroll: {
    backgroundColor: '#4caf50',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
    '&:hover': {
      backgroundColor: '#45a049',
      boxShadow: '0 3px 12px rgba(76, 175, 80, 0.35)'
    }
  }
};

const CourseButton: React.FC<CourseButtonProps> = ({
  item,
  primaryCourse,
  onAccess,
  onEnroll
}) => {
  const shouldShowAccessButton = primaryCourse || item.isEnrolled;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    shouldShowAccessButton ? onAccess(item) : onEnroll(item);
  };

  return (
    <Button
      variant="contained"
      sx={{
        ...buttonStyles.base,
        ...(shouldShowAccessButton ? buttonStyles.access : buttonStyles.enroll)
      }}
      onClick={handleClick}
    >
      {shouldShowAccessButton ? 'Acessar Curso' : 'Matricule-se'}
    </Button>
  );
};

export default CourseButton;
