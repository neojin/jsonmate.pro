import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function App(): JSX.Element {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const [json, setJson] = React.useState('');
  const [error, setError] = React.useState('');

  const onBlur = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    let json = '';

    try {
      const parsedJson = JSON.parse(event.target.value);
      json = JSON.stringify(parsedJson, null, 2);
      setError('');
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(e.message);
        json = event.target.value;
      }
    }
    setJson(json);
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setJson(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>JSONMate</Box>
      {error && json && (
        <Box>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Grid container component="main">
        <form style={{ width: '100%' }}>
          <TextField
            style={{ width: '100%', fontSize: '1rem' }}
            multiline
            minRows={20}
            placeholder="Paste your JSON here. Click anywhere else to format it."
            onBlur={onBlur}
            onChange={onChange}
            value={json}
          />
        </form>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
