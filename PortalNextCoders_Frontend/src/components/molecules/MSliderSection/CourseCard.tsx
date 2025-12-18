import React from 'react';
import { Typography } from '@mui/material';
import { CourseDetail } from '../../../services/studentNew/studentNew.service';
import CourseButton from './CourseButton';
import LogoImg from '../../../assets/logo.png';

interface CourseCardProps {
  item: CourseDetail;
  index: number;
  isHovered: boolean;
  primaryCourse: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onAccess: (item: CourseDetail) => void;
  onEnroll: (item: CourseDetail) => void;
}

const CARD_DIMENSIONS = {
  normal: { width: 300, height: 180 },
  hovered: { width: 340, height: 320 }
};

const cardStyles = {
  container: (isHovered: boolean) => ({
    background: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: isHovered ? CARD_DIMENSIONS.hovered.width : CARD_DIMENSIONS.normal.width,
    height: isHovered ? CARD_DIMENSIONS.hovered.height : CARD_DIMENSIONS.normal.height,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: isHovered ? "flex-start" : "center",
    boxShadow: isHovered
      ? "0 8px 24px rgba(66,99,235,0.18)"
      : "0 4px 16px rgba(66,99,235,0.08)",
    fontSize: 18,
    color: "#222",
    fontWeight: 500,
    padding: 16,
    textAlign: "center" as const,
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
    transform: isHovered ? "translateY(-6px) scale(1.03)" : "none",
    overflow: "hidden",
    position: "relative" as const,
  }),
  logo: {
    position: "absolute" as const,
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    mb: 1,
    width: "100%",
    textAlign: "left" as const,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "left" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
  }
};

const CourseCard: React.FC<CourseCardProps> = ({
  item,
  isHovered,
  primaryCourse,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onAccess,
  onEnroll
}) => {
  return (
    <div
      style={cardStyles.container(isHovered)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div style={cardStyles.logo}>
        {!isHovered && (
          <img
            src={LogoImg}
            alt="Prime"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {isHovered ? (
        <>
          <div
            style={{
              ...cardStyles.image,
              backgroundImage: `url(${item.image || "https://via.placeholder.com/340x160"})`
            }}
          />

          <Typography variant="subtitle1" sx={cardStyles.title}>
            {item.name}
          </Typography>

          <Typography variant="body2" sx={cardStyles.description}>
            {item.description || "Clique para saber mais sobre este curso."}
          </Typography>

          <CourseButton
            item={item}
            primaryCourse={primaryCourse}
            onAccess={onAccess}
            onEnroll={onEnroll}
          />
        </>
      ) : (
        item.name
      )}
    </div>
  );
};

export default CourseCard;
