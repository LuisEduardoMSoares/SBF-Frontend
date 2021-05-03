import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import withGuard from 'utils/withGuard';

function Dashboard() {
  return (
    <Box my={4} mx={4}>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        Dashboard
      </Typography>
    </Box>
  );
}

export default withGuard(Dashboard)
