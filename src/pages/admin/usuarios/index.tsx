import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import withGuard from 'utils/withGuard';

function Usuarios() {
  return (
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Usuários
        </Typography>
      </Box>
  );
}

export default withGuard(Usuarios);