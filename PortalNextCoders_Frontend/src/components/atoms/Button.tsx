import { Button } from '@mui/material';

interface ButtonProps {
  isActive?: boolean;
  click?: (param?: any, param2?: any) => void;
  text?: string;
}

function ButtonDesign({ isActive, click, text}: ButtonProps) {
  return (
    <Button
      variant="contained"
      size="large"
      type='submit'
      disabled={isActive}
      onClick={click}
      sx={{
        width: { xs: '37ch', md: '51ch' },
        height: 50,
        background: "#2342C0",
        borderRadius: 2,
        textTransform: 'capitalize',
        "&.Mui-disabled": {
          background: "#9EA6AD",
          color: "#FFFFFF"
        },
      }}>
      {text}
    </Button>
  )
}

export default ButtonDesign;