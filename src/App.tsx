import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useWindowDimensions from './hooks/useWindowDimensions';
import Footer from './components/Footer';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Grid } from '@mui/material';
import JmesEditor from './components/JmesEditor';
import JsonEditor from './components/JsonEditor';

function App(): JSX.Element {
  const theme = createTheme({
    palette: {
      background: {
        default: '#eeeeee',
      },
    },
  });

  const styles = {
    header: {
      fontFamily: 'Roboto Mono',
      fontSize: '1.5rem',
      marginTop: '10px',
    },
    subHeader: {
      height: '100%',
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'flex-end',
      color: '#888888',
      fontFamily: 'Roboto Mono',
      fontSize: '0.9rem',
    },
    box: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
  };

  const jmesOutput = useSelector((state: RootState) => state.jmesOutput);

  const { height } = useWindowDimensions();
  const editorHeight = height - 250;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.box}>
        <CssBaseline />
        <Container maxWidth="xl">
          <Grid container>
            <Grid item xs={3}>
              <Typography sx={styles.header}>{'jsonmate.pro'}</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography sx={styles.subHeader} textAlign="right">
                validate, format, repair, query, and transform your JSON
              </Typography>
            </Grid>
          </Grid>
          {jmesOutput.showPanel && (
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <JsonEditor height={editorHeight} />
              </Grid>
              <Grid item xs={6}>
                <JmesEditor height={editorHeight} />
              </Grid>
            </Grid>
          )}
          {!jmesOutput.showPanel && <JsonEditor height={editorHeight} />}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
