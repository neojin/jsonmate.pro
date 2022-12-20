import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function App(): JSX.Element {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const headerStyles = {
    fontFamily: 'Roboto Mono',
    fontSize: '1.5rem',
    marginTop: '10px',
  };

  const [json, setJson] = React.useState('');
  const [error, setError] = React.useState('');
  const [isJsonValid, setIsJsonValid] = React.useState(false);

  const onBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    let json = '';

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
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={headerStyles}>{'{jsonmate.pro}'}</Box>
        <Box sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
          {error && !isJsonValid && <Alert severity="error">{error}</Alert>}
          {!error && isJsonValid && <Alert severity="success">JSON is valid</Alert>}
        </Box>
        <Grid container component="main">
          <form style={{ width: '100%' }}>
            <TextField
              style={{ width: '100%', fontSize: '1rem' }}
              multiline
              minRows={20}
              placeholder="Paste your JSON here. Press tab or click anywhere else to format it."
              onBlur={onBlur}
              onChange={onChange}
              value={json}
            />
          </form>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
