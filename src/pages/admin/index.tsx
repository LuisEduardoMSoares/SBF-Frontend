import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import withGuard from "utils/withGuard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@material-ui/core";
import dynamic from "next/dynamic";

const TransactionChart = dynamic(
  () => import('components/movimentacoes/Chart'),
  { ssr: false }
)

const ProductsDashboard = dynamic(
  () => import('components/produtos/Dashboard'),
  { ssr: true }
)

function Dashboard() {
  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faHome} />
          &nbsp; Início
        </Typography>
      </Box>

      <Grid container justify="space-between" spacing={5}>
        <Grid item xs={5}>
            <ProductsDashboard />
        </Grid>
        <Grid item xs={7}>
          <div>
            <TransactionChart />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default withGuard(Dashboard);
