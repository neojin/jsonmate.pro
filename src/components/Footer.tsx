import { Box, Container, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FooterProps {
  isJsonValid: boolean;
  json: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function Footer(props: FooterProps): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Paper
          component="form"
          onSubmit={props.onSubmit}
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
        >
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="JMES Path Query" />
          <IconButton type="submit" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>
    </Box>
  );
}

export default Footer;
