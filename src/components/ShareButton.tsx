import React from 'react';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Alert, TextField, Box, Button } from '@mui/material';
import JSONCrush from 'jsoncrush';
import { useRef } from 'react';
import FileCopy from '@mui/icons-material/FileCopy';

interface ShareButtonProps {
  input: string;
}

export default function ShareButton(props: ShareButtonProps): JSX.Element {
  const [error, setError] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const jsonInput = useSelector((state: RootState) => state.jsonInput);
  const jmesOutput = useSelector((state: RootState) => state.jmesOutput);
  const [compressed, setCompressed] = useState<string>('');
  const textFieldRef = useRef(null);

  const handleClick = (input: string) => {
    if (input == 'json') {
      if (jsonInput.input.length > 5000) {
        setError(
          `JSON input is too large to share. Your input must be less than 5000 characters. Your input is ${jsonInput.input.length} characters long.`,
        );
      } else {
        setError('');
        const compressed = JSONCrush.crush(jsonInput.input);
        setCompressed(compressed);
      }
    } else if (input == 'jmes') {
    }
    setDialogOpen(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleCopy = () => {
    if (textFieldRef.current) {
      const textFieldInputElement = textFieldRef.current.querySelector('input');
      textFieldInputElement.select();
      document.execCommand('copy');
    }
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => {
          handleClick(props.input);
        }}
      >
        <ShareIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="alert-dialog-title">Share JSON</DialogTitle>
        <DialogContent>
          {error && (
            <Box>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!error && (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  value={`${window.location.origin}/?d=${encodeURIComponent(compressed)}`}
                  variant="outlined"
                  inputProps={{
                    onFocus: handleFocus,
                  }}
                  ref={textFieldRef}
                />
                <IconButton onClick={handleCopy} color="primary" sx={{ marginLeft: 1 }}>
                  <FileCopy />
                </IconButton>
              </div>
              <br />
              <br />
              Copy the link above to share your JSON with others. Your JSON is in a
              compressed format and contained inside the URL. This is done to avoid making
              any calls to the server, maintaining your privacy.
              <br />
              <br />
              FYI, some apps cannot handle URLs that are too long. Your JSON is currently{' '}
              {jsonInput.input.length} characters long.
            </>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}