import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useWindowDimensions from './hooks/useWindowDimensions';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import Footer from './components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { jsonInputActions } from './store/jsonInputSlice';
import { RootState } from './store';
import { Grid } from '@mui/material';
import { jsonrepair, JSONRepairError } from 'jsonrepair';

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

  const dispatch = useDispatch();
  const jsonInput = useSelector((state: RootState) => state.jsonInput);
  const jmesOutput = useSelector((state: RootState) => state.jmesOutput);

  const { height } = useWindowDimensions();
  const editorHeight = `${height - 250}px`;

  const removeQuotes = (str: string) => {
    // there is a bug in jsonrepair that doesn't handle quotes correctly
    // so we remove them here
    // TODO: numbers still get returned as valid JSON

    const stripped = str.replace(/^\s+|\s+$/g, '');
    if (
      (stripped.startsWith('"') && stripped.endsWith('"')) ||
      (stripped.startsWith("'") && stripped.endsWith("'"))
    ) {
      return stripped.slice(1, -1);
    }
    return stripped;
  };

  const onBlur = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    editor: any,
  ) => {
    const value = editor.getValue();
    let json = '';

    if (!value) {
      dispatch(jsonInputActions.reset());
      return;
    }

    try {
      const repairJson = jsonrepair(removeQuotes(value));
      const parsedJson = JSON.parse(removeQuotes(repairJson));
      json = JSON.stringify(parsedJson, null, 2);
      dispatch(jsonInputActions.set({ input: json, valid: true, error: '' }));
    } catch (e) {
      if (e instanceof SyntaxError) {
        dispatch(jsonInputActions.set({ input: value, valid: false, error: e.message }));
      }
      if (e instanceof JSONRepairError) {
        dispatch(
          jsonInputActions.set({
            input: value,
            valid: false,
            error: `Repair Error: ${e.message}`,
          }),
        );
      }
    }
  };

  const onChange = (value: string) => {
    dispatch(jsonInputActions.set({ input: value, valid: false, error: '' }));
  };

  const jsonEditor = (
    <>
      <Box sx={styles.alert}>
        {jsonInput.error && !jsonInput.valid && (
          <Alert severity="error">{jsonInput.error}</Alert>
        )}
        {!jsonInput.error && jsonInput.valid && (
          <Alert severity="success">JSON is valid</Alert>
        )}
      </Box>
      <AceEditor
        placeholder="Paste your JSON here. Click anywhere else to validate and format it."
        mode="json"
        theme="github"
        width="100%"
        height={editorHeight}
        onBlur={onBlur}
        onChange={onChange}
        fontSize={jsonInput.input ? 14 : 16}
        value={jsonInput.input}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
      />
    </>
  );

  const jmesEditor = (
    <AceEditor
      mode="json"
      theme="github"
      width="100%"
      height={editorHeight}
      fontSize={14}
      value={jmesOutput.output}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.box}>
        <CssBaseline />
        <Container maxWidth="xl">
          <Grid container>
            <Grid item xs={6}>
              <Typography sx={styles.header}>{'jsonmate.pro'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={styles.subHeader} textAlign="right">
                validate, format, repair, query, and transform your JSON
              </Typography>
            </Grid>
          </Grid>
          {jmesOutput.showPanel && (
            <Grid container spacing={1}>
              <Grid item xs={6}>
                {jsonEditor}
              </Grid>
              <Grid item xs={6}>
                <Box sx={styles.alert}>
                  {jmesOutput.error && <Alert severity="error">{jmesOutput.error}</Alert>}
                  {!jmesOutput.error && <Alert severity="info">JMES Query Output</Alert>}
                </Box>
                {jmesEditor}
              </Grid>
            </Grid>
          )}
          {!jmesOutput.showPanel && jsonEditor}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
