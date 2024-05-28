// material-ui
import { Box } from '@mui/material';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    <Box sx={{ 
      position: 'absolute', 
      filter: 'blur(0px)', 
      zIndex: -1, 
      bottom: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url(https://hips.hearstapps.com/hmg-prod/images/woman-hands-in-a-nail-salon-receiving-a-manicure-royalty-free-image-1569259514.jpg?crop=1xw:0.84276xh;center,top)" 
    }}>
    </Box>
  );
};

export default AuthBackground;
