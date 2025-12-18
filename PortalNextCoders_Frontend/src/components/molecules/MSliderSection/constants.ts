export const SLIDER_CONSTANTS = {
  CARD_DIMENSIONS: {
    normal: { width: 300, height: 180 },
    hovered: { width: 340, height: 320 }
  },
  SPACING: {
    between: 22,
    maxWidth: "1500px"
  },
  COLORS: {
    primary: "#4263dc",
    text: "#666",
    border: "#f0f0f0"
  }
};

export const containerStyles = {
  main: {
    maxWidth: SLIDER_CONSTANTS.SPACING.maxWidth,
    width: "100%",
    mb: 4,
    overflowX: "hidden"
  },
  title: {
    mb: 2,
    fontWeight: 600,
    color: SLIDER_CONSTANTS.COLORS.primary,
    textAlign: "left" as const
  },
  emptyMessage: {
    mb: 2,
    fontWeight: 400,
    color: "#999",
    textAlign: "left" as const
  }
};

export const slideStyles = (isHovered: boolean) => ({
  maxWidth: isHovered ? SLIDER_CONSTANTS.CARD_DIMENSIONS.hovered.width : SLIDER_CONSTANTS.CARD_DIMENSIONS.normal.width,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "max-width 0.3s ease",
  zIndex: isHovered ? 10 : 1,
});
