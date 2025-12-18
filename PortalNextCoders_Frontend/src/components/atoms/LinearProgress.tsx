import { Box, Typography, useTheme } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { StandardCSSProperties } from "@mui/system";
import { Schedule, CheckCircle } from "@mui/icons-material";

interface LinearProgressWithLabelProps extends LinearProgressProps {
  value: number;
  hours?: string;
  text?: string;
  width?: StandardCSSProperties["width"];
  direction?: StandardCSSProperties["flexDirection"];
  align?: StandardCSSProperties["alignItems"];
}

export const LinearProgressWithLabel = (
  props: LinearProgressWithLabelProps
) => {
  const { value, width, direction, align, text, hours, ...other } = props;
  const theme = useTheme();

  const getProgressColor = (value: number) => {
    if (value === 100) return theme.palette.success.main;
    if (value >= 70) return theme.palette.warning.main;
    if (value >= 30) return theme.palette.info.main;
    return theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: props.direction || "column",
        gap: 1,
        alignItems: props.align || "flex-start",
        width: props.width || "100%",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {value === 100 ? (
            <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
          ) : null}
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {`${Math.round(props.value)}%`} {props.text}
          </Typography>
        </Box>

        {props.hours && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
                fontWeight: 400,
              }}
            >
              {props.hours}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${theme.palette.action.hover}50`,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: getProgressColor(value),
              transition: 'all 0.3s ease',
            },
          }}
          {...other}
        />
      </Box>
    </Box>
  );
};
