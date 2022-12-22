import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useWindowDimensions from './hooks/useWindowDimensions';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

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
    alert: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    form: {
      width: '100%',
    },
    jsonTextarea: {
      width: '100%',
      fontSize: '1rem',
    },
  };

  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { height } = useWindowDimensions();
  const [textareaRows, setTextareaRows] = useState(0);

  useEffect(() => {
    const nHeight = height - 200;
    if (nHeight >= 1000) {
      setTextareaRows(Math.floor(height / 30));
    } else if (nHeight >= 800) {
      setTextareaRows(Math.floor(height / 33));
    } else if (nHeight >= 600) {
      setTextareaRows(Math.floor(height / 40));
    } else if (nHeight >= 400) {
      setTextareaRows(Math.floor(height / 48));
    } else {
      setTextareaRows(Math.floor(height / 60) || 1);
    }
  }, [height]);

  const onBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    let json = '';

    if (!event.target.value) {
      setJson('');
      setError('');
      setIsJsonValid(false);
      return;
    }

    try {
      const parsedJson = JSON.parse(event.target.value);
      json = JSON.stringify(parsedJson, null, 2);
      setError('');
      setIsJsonValid(true);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(e.message);
        json = event.target.value;
        setIsJsonValid(false);
      }
    }
    setJson(json);
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setError('');
    setIsJsonValid(false);
    setJson(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <CssBaseline />
        <Container maxWidth="xl">
          <Box sx={styles.header}>{'jsonmate.pro'}</Box>
          <Box sx={styles.alert}>
            {error && !isJsonValid && <Alert severity="error">{error}</Alert>}
            {!error && isJsonValid && <Alert severity="success">JSON is valid</Alert>}
          </Box>
          <Grid container component="main">
            <form style={styles.form}>
              <TextField
                style={styles.jsonTextarea}
                multiline
                minRows={textareaRows}
                maxRows={textareaRows}
                placeholder="Paste your JSON here. Press tab or click anywhere else to format it."
                onBlur={onBlur}
                onChange={onChange}
                value={json}
              />
            </form>
          </Grid>
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">My sticky footer can be found here.</Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
