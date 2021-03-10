import * as React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Head from 'next/head';

export default function Index() {
  return (
    <>
    <Head>
      <title>Estoque</title>
    </Head>
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Estoque
        </Typography>
      </Box>
    </Container>
    </>
  );
}
