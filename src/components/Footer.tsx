import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Box, Container, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import jmespath from 'jmespath';
import { jmesOutputActions } from '../store/jmesOutputSlice';

function Footer(): JSX.Element {
  const [jmesInput, setJmesInput] = useState('');
  const [jmesPanelFirstOpen, setJmesPanelFirstOpen] = useState(false);
  const jsonInput = useSelector((state: RootState) => state.jsonInput);
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJmesInput(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!jmesInput) {
      setJmesPanelFirstOpen(false);
      dispatch(jmesOutputActions.setShowPanel(false));
      return;
    }

    if (!jmesPanelFirstOpen) {
      setJmesPanelFirstOpen(true);
      dispatch(jmesOutputActions.setShowPanel(true));
    }

    try {
      const parsed = JSON.parse(jsonInput.input);
      const jmesResult = jmespath.search(parsed, jmesInput);

      if (jmesResult) {
        const output = JSON.stringify(jmesResult, null, 2);

        dispatch(jmesOutputActions.setOutput(output));
        dispatch(jmesOutputActions.setError(''));
      } else {
        dispatch(jmesOutputActions.setOutput(''));
        dispatch(
          jmesOutputActions.setError(
            'JMES Query did not return a result - please click the help icon for more information.',
          ),
        );
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        dispatch(jmesOutputActions.setOutput(''));
        dispatch(
          jmesOutputActions.setError(
            'Invalid Query - please click the help icon for more information.',
          ),
        );
      }
    }
  };

  const styles = {
    box: {
      py: 3,
      px: 2,
      mt: 'auto',
    },
    paper: {
      p: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: { ml: 1, flex: 1 },
    submit: { p: '10px' },
  };

  return (
    <Box component="footer" sx={styles.box}>
      <Container maxWidth="lg">
        <Paper component="form" onSubmit={onSubmit} sx={styles.paper}>
          <InputBase
            sx={styles.input}
            placeholder="JMES Path Query"
            value={jmesInput}
            onChange={onChange}
          />
          <IconButton type="submit" sx={styles.submit}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>
    </Box>
  );
}

export default Footer;
