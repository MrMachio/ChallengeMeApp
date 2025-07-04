import {styled} from "@mui/system";
import {Box} from "@mui/material";

export const ChallengesListWrapper = styled(Box)(({theme}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  width: '100%',
  maxWidth: '1200px',
  mx: 'auto',
  mt: 0,
  '& > *': {
    flexGrow: 0,
    flexShrink: 0,
    width: {
      xs: '100%',
      sm: 'calc(50% - 12px)',
      md: 'calc(33.333% - 16px)'
    }
  }
}));