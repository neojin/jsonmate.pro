import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useWindowDimensions from './hooks/useWindowDimensions';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import Footer from './components/Footer';
import jmespath from 'jmespath';

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

  const onBlur = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    editor: any,
  ) => {
    const value = editor.getValue();
    let json = '';

    if (!value) {
      setJson('');
      setError('');
      setIsJsonValid(false);
      return;
    }

    try {
      const parsedJson = JSON.parse(value);
      json = JSON.stringify(parsedJson, null, 2);
      setError('');
      setIsJsonValid(true);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(e.message);
        json = value;
        setIsJsonValid(false);
      }
    }
    setJson(json);
  };

  const onChange = (value: string) => {
    setError('');
    setIsJsonValid(false);
    setJson(value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isJsonValid) {
      const jmespathQuery = event.target[0].value;
    }
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
          <AceEditor
            placeholder="Paste your JSON here. Click anywhere else to format it."
            mode="json"
            theme="github"
            width="100%"
            height={`${height - 200}px`}
            onBlur={onBlur}
            onChange={onChange}
            fontSize={15}
            value={json}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Container>
        <Footer isJsonValid={isJsonValid} json={json} onSubmit={onSubmit} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
