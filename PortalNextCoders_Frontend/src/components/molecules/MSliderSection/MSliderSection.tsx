import React from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CourseDetail } from "../../../services/studentNew/studentNew.service";
import MModalRegistrationCourse from "../MModalRegistrationCourseExtra/MModalRegistrationCourse";
import CourseCard from "./CourseCard";
import { useSliderLogic } from "./useSliderLogic";
import { SLIDER_CONSTANTS, containerStyles, slideStyles } from "./constants";

class SlideErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, color: "#9EA6AD", fontSize: 14 }}>
          Não foi possível carregar este curso.
        </Box>
      );
    }
    return this.props.children;
  }
}

type KeenSliderSectionProps = {
  title: string;
  items?: CourseDetail[];
  primaryCourse: boolean;
};

const MSliderSection: React.FC<KeenSliderSectionProps> = ({
  title,
  items = [],
  primaryCourse = false,
}) => {
  const {
    hoveredIndex,
    setHoveredIndex,
    modalOpen,
    courseExtraChosen,
    handleCardClick,
    handleAccess,
    handleEnroll,
    closeModal
  } = useSliderLogic(primaryCourse);

  // Stronger sanitizer to ensure 'item' is an object and 'contentHandsOnTrails' is always an array
  const sanitizeCourse = (it: any) => {
    const base = typeof it === "object" && it !== null ? it : {};
    const trails = Array.isArray(base?.contentHandsOnTrails) ? base.contentHandsOnTrails : [];
    return { ...base, contentHandsOnTrails: trails };
  };

  const safeItems = (items ?? [])
    .filter((it) => it != null)
    .map(sanitizeCourse)
    .filter((it) => typeof it === "object");

  return (
    <>
      <MModalRegistrationCourse
        open={modalOpen}
        onClose={closeModal}
        dataCourse={courseExtraChosen}
      />
      
      <Box sx={containerStyles.main}>
        <Typography variant="h6" sx={containerStyles.title}>
          {title}
        </Typography>
        
        {safeItems.length === 0 && (
          <Typography variant="body1" sx={containerStyles.emptyMessage}>
            Nenhum curso encontrado.
          </Typography>
        )}
        
        {safeItems.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={SLIDER_CONSTANTS.SPACING.between}
            navigation
            slidesPerView={"auto"}
            style={{ width: "100%" }}
          >
            {safeItems.map((item: any, idx: number) => (
              <SwiperSlide key={item?.id ?? idx} style={slideStyles(hoveredIndex === idx)}>
                <SlideErrorBoundary>
                  <CourseCard
                    item={item} // already sanitized with contentHandsOnTrails: []
                    index={idx}
                    isHovered={hoveredIndex === idx}
                    primaryCourse={primaryCourse}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleCardClick(item)}
                    onAccess={handleAccess}
                    onEnroll={handleEnroll}
                  />
                </SlideErrorBoundary>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </>
  );
};

export default MSliderSection;
