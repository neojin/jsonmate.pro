import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Alert } from '@mui/material';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-searchbox';
import { useTheme } from '@mui/material/styles';

interface JmesEditorProps {
  height: number;
}

export default function JmesEditor(props: JmesEditorProps): JSX.Element {
  const jmesOutput = useSelector((state: RootState) => state.jmesOutput);
  const theme = useTheme();
  const aceTheme = theme.palette.mode === 'dark' ? 'monokai' : 'github';

  const styles = {
    alert: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  };

  return (
    <>
      <Box sx={styles.alert}>
        {jmesOutput.error && <Alert severity="error">{jmesOutput.error}</Alert>}
        {!jmesOutput.error && <Alert severity="info">Query Output</Alert>}
      </Box>
      <AceEditor
        mode="json"
        style={{ colorScheme: theme.palette.mode }}
        theme={aceTheme}
        width="100%"
        height={`${props.height}px`}
        fontSize={14}
        value={jmesOutput.output}
        setOptions={{
          showLineNumbers: true,
          showPrintMargin: false,
          tabSize: 2,
          useWorker: false,
        }}
      />
    </>
  );
}
