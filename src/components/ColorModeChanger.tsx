import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Cookies from 'universal-cookie';
import { userPreferencesActions } from '../store/userPreferencesSlice';
import { useDispatch } from 'react-redux';

export default function ColorModeChanger(): JSX.Element {
  const theme = useTheme();
  const dispatch = useDispatch();

  const toggleColorMode = () => {
    const cookies = new Cookies();
    const newPaletteMode = theme.palette.mode === 'light' ? 'dark' : 'light';
    cookies.set('mode', newPaletteMode);
    dispatch(userPreferencesActions.setMode(newPaletteMode));
  };

  return (
    <>
      {theme.palette.mode.charAt(0).toUpperCase() + theme.palette.mode.substring(1)} mode
      <IconButton onClick={toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </>
  );
}
