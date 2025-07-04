import {styled} from "@mui/system";
import {TextField} from "@mui/material";

export const TextFieldStyled = styled(TextField)(({theme}) => ({
  flex: '1 1 100%',
  minWidth: '100%',
  [theme.breakpoints.up('sm')]: {
    flex: '1 1 50%',
    minWidth: 300,
    maxWidth: 600,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 100,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

