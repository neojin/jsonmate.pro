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
import { useSelector, useDispatch } from 'react-redux';
import { jsonInputActions } from './store/jsonInputSlice';
import { RootState } from './store';
import { Grid } from '@mui/material';

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
      const parsedJson = JSON.parse(value);
      json = JSON.stringify(parsedJson, null, 2);
      dispatch(jsonInputActions.set({ input: json, valid: true, error: '' }));
    } catch (e) {
      if (e instanceof SyntaxError) {
        dispatch(jsonInputActions.set({ input: value, valid: false, error: e.message }));
      }
    }
  };

  const onChange = (value: string) => {
    dispatch(jsonInputActions.set({ input: value, valid: false, error: '' }));
  };

  const jsonEditor = (
    <AceEditor
      placeholder="Paste your JSON here. Click anywhere else to format it."
      mode="json"
      theme="github"
      width="100%"
      height={`${height - 200}px`}
      onBlur={onBlur}
      onChange={onChange}
      fontSize={15}
      value={jsonInput.input}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );

  const jmesEditor = (
    <AceEditor
      mode="json"
      theme="github"
      width="100%"
      height={`${height - 200}px`}
      fontSize={15}
      value={jmesOutput.output}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.box}>
        <CssBaseline />
        <Container maxWidth="xl">
          <Box sx={styles.header}>{'jsonmate.pro'}</Box>
          <Box sx={styles.alert}>
            {jsonInput.error && !jsonInput.valid && (
              <Alert severity="error">{jsonInput.error}</Alert>
            )}
            {!jsonInput.error && jsonInput.valid && (
              <Alert severity="success">JSON is valid</Alert>
            )}
          </Box>
          {jmesOutput.showPanel && (
            <Grid container>
              <Grid item xs={6}>
                {jsonEditor}
              </Grid>
              <Grid item xs={6}>
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
