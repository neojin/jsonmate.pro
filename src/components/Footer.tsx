import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Container,
  IconButton,
  InputBase,
  Paper,
  Modal,
  Typography,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuestionMarkIcon from '@mui/icons-material/Help';
import jmespath from 'jmespath';
import { jmesOutputActions } from '../store/jmesOutputSlice';

function Footer(): JSX.Element {
  const [jmesInput, setJmesInput] = useState('');
  const [jmesPanelFirstOpen, setJmesPanelFirstOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const styles = {
    box: {
      py: 2,
      mt: 'auto',
      bgcolor: '#cfd8dc',
    },
    paper: {
      p: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#fffde7',
    },
    input: { ml: 1, flex: 1 },
    submit: { p: '10px' },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 2,
    },
  };

  const jmesExamples = () => {
    return (
      <ul>
        <li>
          <code>foo</code> - returns the value of the key "foo"
        </li>
        <li>
          <code>foo.bar</code> - returns the value of the key "bar" in the object "foo"
        </li>
        <li>
          <code>foo[0]</code> - returns the first element of the array "foo"
        </li>
        <li>
          <code>foo[*].bar</code> - returns the value of the key "bar" in all elements of
          the array "foo"
        </li>
        <li>
          <code>foo[*].bar.baz</code> - returns the value of the key "baz" in the object
          "bar" in all elements of the array "foo"
        </li>
        <li>
          <code>foo[?bar==`baz`]</code> - returns all elements of the array "foo" where
          the value of the key "bar" is equal to "baz"
        </li>
        <li>
          <code>foo[?bar==`baz`].qux</code> - returns the value of the key "qux" in all
          elements of the array "foo" where the value of the key "bar" is equal to "baz"
        </li>
      </ul>
    );
  };

  return (
    <Box component="footer" sx={styles.box}>
      <Container maxWidth="lg">
        <Paper component="form" onSubmit={onSubmit} sx={styles.paper}>
          <IconButton sx={{ p: '10px' }} onClick={toggleModal}>
            <QuestionMarkIcon />
          </IconButton>
          <InputBase
            sx={styles.input}
            placeholder={
              jsonInput.valid ? 'JMES Path Query' : 'Please enter valid JSON first'
            }
            value={jmesInput}
            onChange={onChange}
            disabled={!jsonInput.valid}
          />
          <IconButton type="submit" sx={styles.submit}>
            <SearchIcon />
          </IconButton>
        </Paper>
        <Typography sx={{ mt: 1, fontSize: '90%', textAlign: 'center', color: '#666' }}>
          jsonmate.pro runs completely in the browser. No data is sent to a server.
        </Typography>
      </Container>
      <Modal open={openModal} onClose={toggleModal}>
        <Box sx={styles.modal}>
          <Typography variant="h6" component="h2">
            What is JMES Path?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            JMES is a query language for JSON. It allows you extract/transform your
            original JSON into a new JSON object or array.
            <p>For example:</p>
            {jmesExamples()}
            For more information and examples, please visit{' '}
            <Link href="https://jmespath.org/tutorial.html" target={'_blank'}>
              JMES Path
            </Link>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default Footer;
