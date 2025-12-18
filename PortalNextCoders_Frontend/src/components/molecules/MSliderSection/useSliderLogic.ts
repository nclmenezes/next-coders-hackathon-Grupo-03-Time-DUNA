import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CourseDetail } from '../../../services/studentNew/studentNew.service';

export const useSliderLogic = (primaryCourse: boolean) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [courseExtraChosen, setCourseExtraChosen] = useState<CourseDetail | null>(null);

  const navigateToTraining = (item: CourseDetail) => {
    const path = primaryCourse ? "/training" : `/training/courseExtra/${item.id}`;
    navigate(path);
  };

  const handleCardClick = (item: CourseDetail) => { 
    if (item.isEnrolled || primaryCourse) {
      navigateToTraining(item);
      return;
    }
    setCourseExtraChosen(item);
    setModalOpen(true);
  };

  const handleAccess = (item: CourseDetail) => {
    navigateToTraining(item);
  };

  const handleEnroll = (item: CourseDetail) => {
    setCourseExtraChosen(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return {
    hoveredIndex,
    setHoveredIndex,
    modalOpen,
    courseExtraChosen,
    handleCardClick,
    handleAccess,
    handleEnroll,
    closeModal
  };
};
