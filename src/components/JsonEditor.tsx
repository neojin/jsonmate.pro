import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Box, Alert } from '@mui/material';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-searchbox';
import { jsonrepair, JSONRepairError } from 'jsonrepair';
import { jsonInputActions } from '../store/jsonInputSlice';
import { useTheme } from '@mui/material/styles';
import ShareButton from './ShareButton';
import { useLocation } from 'react-router-dom';
import JSONCrush from 'jsoncrush';
import { useEffect } from 'react';

interface JsonEditorProps {
  height: number;
}

export default function JsonEditor(props: JsonEditorProps): JSX.Element {
  const jsonInput = useSelector((state: RootState) => state.jsonInput);
  const dispatch = useDispatch();
  const theme = useTheme();
  const aceTheme = theme.palette.mode === 'dark' ? 'monokai' : 'github';

  const styles = {
    alert: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  };

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const compressedInput = query.get('d');
    if (compressedInput) {
      try {
        const uncompressedInput = JSONCrush.uncrush(compressedInput);
        dispatch(jsonInputActions.setAndValidate({ input: uncompressedInput }));
      } catch (e) {
        console.log(e);
        dispatch(
          jsonInputActions.set({
            input: '',
            valid: false,
            error: 'Could not uncompress JSON from URL',
          }),
        );
      }
    }
  }, []);

  const onBlur = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    editor: any,
  ) => {
    const value = editor.getValue();

    if (!value) {
      dispatch(jsonInputActions.reset());
      return;
    }

    dispatch(jsonInputActions.setAndValidate({ input: value }));
  };

  const onChange = (value: string) => {
    dispatch(jsonInputActions.set({ input: value, valid: false, error: '' }));
  };

  return (
    <>
      <Box sx={styles.alert}>
        {jsonInput.error && !jsonInput.valid && (
          <Alert severity="error">{jsonInput.error}</Alert>
        )}
        {!jsonInput.error && jsonInput.valid && (
          <Alert severity="success" action={<ShareButton input={'json'} />}>
            JSON is valid
          </Alert>
        )}
      </Box>
      <AceEditor
        style={{ colorScheme: theme.palette.mode }}
        placeholder="Paste your JSON here. Click anywhere outside this box to format it."
        mode="json"
        theme={aceTheme}
        width="100%"
        height={`${props.height}px`}
        onBlur={onBlur}
        onChange={onChange}
        fontSize={jsonInput.input ? 14 : 16}
        value={jsonInput.input}
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
