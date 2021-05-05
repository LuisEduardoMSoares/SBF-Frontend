import React, { useEffect, useState } from "react";
import withGuard from "utils/withGuard";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  makeStyles,
  createStyles
} from "@material-ui/core";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RowDetailState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import { ContextMenuOption } from "components/contextMenu";
import TransactionService from "services/transactionService";
import { transactionProduct } from "models/transaction";

import {
  DateTimeTypeProvider,
  DateTypeProvider,
  TransactionTypeProvider,
} from "components/movimentacoes/Formatters";
import ProductDetailRow from "components/movimentacoes/ProductDetailRow";

const TransactionForm = dynamic(
  () => import("components/movimentacoes/Cadastro")
);

interface transactionRow {
  date: Date;
  type: string;
  description?: string;
  providerId?: string | number;
  products?: transactionProduct[];
  updatedOn?: Date;
  actions?: ContextMenuOption[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTableHead-root": {
        backgroundColor: theme.palette.primary.light
      },
      "& [class*=TableDetailCell-]": {
        backgroundColor: '#DFDFDF',
        padding: 0,
        paddingLeft: theme.spacing(1)
      }
    },
  })
);

function Movimentacoes() {
  const transactionService = new TransactionService();
  const { toggleModal } = useModal();
  const classes = useStyles();

  function handleTransactionChange(transactionId: Number | null) {
    toggleModal({
      title: "Movimentação",
      content: <TransactionForm />,
      route: !transactionId ? "add" : `update/${transactionId}`,
      params: { transactionId, afterTransactionSave: fetchTransactionList },
    });
  }

  async function fetchTransactionList() {
    await transactionService
      .list()
      .then((response) => {
        setTransactionRows(
          response.map((transaction) => {
            const {
              date,
              type,
              description,
              provider_id,
              products,
            } = transaction;

            let transactionProducts = products.map((product) => {
              const newProduct: any = product;
              newProduct.id = product.product_id;
              return newProduct;
            });

            let updatedOn = transaction.metadatetime
              ? new Date(
                  transaction.metadatetime.updated_on
                    ? transaction.metadatetime.updated_on
                    : transaction.metadatetime.created_on
                )
              : undefined;

            let actions: ContextMenuOption[] = [
              {
                title: "Visualizar",
                action: handleTransactionChange,
              },
            ];

            const transactionRow: transactionRow = {
              date: new Date(date),
              type,
              description,
              providerId: provider_id || "-",
              products: transactionProducts,
              updatedOn,
              actions,
            };
            return transactionRow;
          })
        );
      })
      .catch(console.error);
  }

  const [columns] = useState([
    { name: "date", title: "Data", width: 50 },
    { name: "type", title: "Tipo" },
    { name: "description", title: "Descrição" },
    { name: "providerId", title: "Fornecedor" },
    { name: "updatedOn", title: "Últ. Atualização" },
  ]);
  const [tableColumnExtensions] = useState([
    { columnName: 'date', width: 140 },
    { columnName: 'type', width: 140 },
    { columnName: 'description', width: 'auto' },
    { columnName: 'providerId', width: 200 },
    { columnName: 'updatedOn', width: 180 },
  ]);
  const [transactionRows, setTransactionRows] = useState<transactionRow[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    fetchTransactionList();
  }, []);

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faBox} />
          &nbsp; Movimentações
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => handleTransactionChange(null)}
        >
          + Movimentação
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Produto, Quantidade, Fornecedor, etc."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
      />

      <Box my={4}>
        <Paper className={classes.root}>
          <Grid rows={transactionRows} columns={columns}>
            <RowDetailState
              defaultExpandedRowIds={expandedRowIds}
              onExpandedRowIdsChange={setExpandedRowIds}
            />
            <DateTypeProvider for={["date"]} />
            <DateTimeTypeProvider for={["updatedOn"]} />
            <TransactionTypeProvider for={["type"]} />
            <Table tableComponent={TableComponentBase} columnExtensions={tableColumnExtensions} />
            <TableHeaderRow contentComponent={TableHeaderContentBase} />
            <TableRowDetail contentComponent={ProductDetailRow} />
          </Grid>
        </Paper>
      </Box>
    </>
  );
}

const tableStyles = makeStyles(theme => createStyles({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    textTransform: "uppercase",
    fontSize: 12,
  },
  tableStriped: {
    '& tbody tr:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  }
}))

const TableHeaderContentBase = ({
  column,
  children,
  classes,
  ...restProps
}: any) => {
  const styles = tableStyles()
  return (
    <TableHeaderRow.Content className={styles.head} column={column} {...restProps}>
      {children}
    </TableHeaderRow.Content>
  );
};
const TableComponentBase = ({ ...restProps }: any) => {
  const styles = tableStyles()
  return (
    <Table.Table
      {...restProps}
      className={styles.tableStriped}
    />
  )
};

export default withGuard(Movimentacoes);
