import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import withGuard from "utils/withGuard";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  makeStyles,
  createStyles,
  Grid,
  MenuItem,
  debounce,
} from "@material-ui/core";
import { faBox, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  CustomPaging,
  IntegratedSorting,
  PagingState,
  RowDetailState,
  SortingState,
} from "@devexpress/dx-react-grid";
import {
  Grid as DXGrid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import { ContextMenuOption } from "components/contextMenu";
import TransactionService, {
  transactionFilters,
} from "services/transactionService";
import { transactionProduct, transactionType } from "models/transaction";

import {
  DateTimeTypeProvider,
  DateTypeProvider,
  TransactionTypeProvider,
} from "components/movimentacoes/Formatters";
import ProductDetailRow from "components/movimentacoes/ProductDetailRow";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Loading from "components/loading";

const TransactionForm = dynamic(
  () => import("components/movimentacoes/Cadastro")
);

interface transactionRow {
  date: Date | string;
  type: string;
  description?: string;
  providerId?: string | number;
  providerName?: string;
  products?: transactionProduct[];
  updatedOn?: Date;
  actions?: ContextMenuOption[];
}

interface transactionTypesSelect {
  value: transactionType;
  label: string;
}
const transactionTypes: transactionTypesSelect[] = [
  {
    value: "TODAS",
    label: "Todas",
  },
  {
    value: "ENTRADA",
    label: "Entrada",
  },
  {
    value: "SAIDA",
    label: "Saída",
  },
];

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTableHead-root": {
        backgroundColor: theme.palette.primary.light,
      },
      "& [class*=TableDetailCell-]": {
        backgroundColor: "#DFDFDF",
        padding: 0,
        paddingLeft: theme.spacing(1),
      },
    },
  })
);

// initial filter state
var filterReference: transactionFilters = {
  page: 0,
  per_page: 5,
  transaction_type: "TODAS",
  product_name: "",
  provider_name: "",
  description: ""
}

function Movimentacoes() {
  const transactionService = new TransactionService();
  const { toggleModal } = useModal();
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [moreFilters, toggleMoreFilters] = useState<boolean>(false);

  // Filters
  const [filters, setFilters] = useState<transactionFilters>(filterReference);

  function handleFiltersChange(params: transactionFilters) {
    setFilters((prevState) => {
      let newState = Object.assign({}, prevState);
      newState = { ...prevState, ...params };
      filterReference = newState;
      return newState;
    });
  }

  // Grid Columns and Rows
  const [columns] = useState([
    { name: "date", title: "Data", width: 50 },
    { name: "type", title: "Tipo" },
    { name: "description", title: "Descrição" },
    { name: "providerName", title: "Fornecedor" },
    { name: "updatedOn", title: "Últ. Atualização" },
  ]);
  const [tableColumnExtensions] = useState([
    { columnName: "date", width: 140 },
    { columnName: "type", width: 140 },
    { columnName: "description", width: "auto" },
    { columnName: "providerName", width: "auto" },
    { columnName: "updatedOn", width: 180 },
  ]);
  const [transactionRows, setTransactionRows] = useState<transactionRow[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<(string | number)[]>([]);

  const tableMessages : any = {
    noData: loading ? 'Carregando dados...' : 'Não foram encontradas movimentações nos parâmetros fornecidos.',
  };

  const pagingPanelMessages: any = {
    rowsPerPage: 'Linhas por página',
    info: '{from} - {to} de {count}',
  };
  

  function handleTransactionChange(transactionId: Number | null) {
    toggleModal({
      title: "Movimentação",
      content: <TransactionForm />,
      params: { transactionId, afterTransactionSave: fetchTransactionList },
    });
  }

  async function fetchTransactionList() {
    setLoading(true);
    await transactionService
      .fetch(filterReference)
      .then((response) => {
        setLoading(false);
        setRowCount(response.pagination_metadata.total_count);
        setTransactionRows(
          response.records.map((transaction) => {
            const {
              date,
              type,
              description,
              provider_id,
              provider_name,
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
              date,
              type,
              description: description || "-",
              providerId: provider_id || "-",
              providerName: provider_name || "-",
              products: transactionProducts,
              updatedOn,
              actions,
            };
            return transactionRow;
          })
        );
      })
      .catch(() => {
        setLoading(false);
        setTransactionRows((_rows:any) => []);
      });
  }

  useEffect(() => {
    debouncedFetchTransactionList();
  }, [filters]);

  const debouncedFetchTransactionList = useCallback(
    debounce(() => fetchTransactionList(), 350),
    []
  );

  function onTransactionTypeChange(event: BaseSyntheticEvent) {
    const { value } = event.target;
    const filterObj: transactionFilters = {
      transaction_type: value,
      page: 0,
    };
    if (value === "SAIDA") filterObj.provider_name = "";

    handleFiltersChange(filterObj);
  }

  const isSaida = filters.transaction_type === "SAIDA";

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

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            variant="outlined"
            select
            required
            fullWidth
            id="transactionType"
            label="Tipo de Movimentação"
            name="transactionType"
            autoComplete="off"
            autoFocus
            onChange={(event) => {
              onTransactionTypeChange(event);
            }}
            value={filters.transaction_type}
          >
            {transactionTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              variant="inline"
              inputVariant="outlined"
              format="dd/MM/yyyy"
              id="transaction-start-date"
              label="A partir de"
              value={filters.start_date ? filters.start_date : null}
              onChange={(date) => {
                handleFiltersChange({ start_date: date as Date, page: 0 });
              }}
              KeyboardButtonProps={{
                "aria-label": "Mudar Data",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12} sm={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              variant="inline"
              inputVariant="outlined"
              format="dd/MM/yyyy"
              id="transaction-finish-date"
              label="Até"
              value={filters.finish_date ? filters.finish_date : null}
              onChange={(date) => {
                handleFiltersChange({ finish_date: date as Date, page: 0 });
              }}
              KeyboardButtonProps={{
                "aria-label": "Mudar Data",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
            size="large"
            color="primary"
            variant="outlined"
            onClick={() => {
              toggleMoreFilters(!moreFilters);
            }}
          >
            <FontAwesomeIcon icon={moreFilters ? faMinus : faPlus} /> &nbsp;{" "}
            {moreFilters ? "Ocultar" : "Mais"} Filtros
          </Button>
        </Grid>
      </Grid>

      {moreFilters && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={isSaida ? 6 : 4}>
            <TextField
              id="description"
              name="description"
              label="Descrição da Movimentação"
              placeholder="Exemplo: 'Saída de Produtos X'..."
              fullWidth
              margin="normal"
              variant="outlined"
              value={filters.description}
              autoComplete="off"
              onChange={(event) => {
                handleFiltersChange({ description: event.target.value, page: 0 });
              }}
            />
          </Grid>

          <Grid item xs={12} sm={isSaida ? 6 : 4}>
            <TextField
              id="product_name"
              name="product_name"
              label="Nome do Produto"
              placeholder="Exemplo: 'Camisa Preta'..."
              fullWidth
              margin="normal"
              variant="outlined"
              value={filters.product_name}
              autoComplete="off"
              onChange={(event) => {
                handleFiltersChange({ product_name: event.target.value, page: 0 });
              }}
            />
          </Grid>

          {!isSaida && (
            <Grid item xs={12} sm={4}>
              <TextField
                id="provider_name"
                name="provider_name"
                label="Nome do Fornecedor"
                placeholder="Exemplo: 'Fornecedor Batista'..."
                fullWidth
                margin="normal"
                variant="outlined"
                value={filters.provider_name}
                autoComplete="off"
                onChange={(event) => {
                  handleFiltersChange({ provider_name: event.target.value, page: 0 });
                }}
              />
            </Grid>
          )}
        </Grid>
      )}

      <Box my={4}>
        <Paper className={classes.root}>
          <DXGrid rows={transactionRows} columns={columns}>
            <PagingState
              currentPage={filters.page}
              onCurrentPageChange={(page: number) => {
                handleFiltersChange({ page: page });
              }}
              pageSize={filters.per_page}
              onPageSizeChange={(per_page) => {
                handleFiltersChange({ per_page: per_page });
              }}
            />
            <CustomPaging totalCount={rowCount} />
            <RowDetailState
              defaultExpandedRowIds={expandedRowIds}
              onExpandedRowIdsChange={setExpandedRowIds}
            />
            <DateTypeProvider for={["date"]} />
            <DateTimeTypeProvider for={["updatedOn"]} />
            <TransactionTypeProvider for={["type"]} />
            <SortingState />
            <IntegratedSorting />
            <Table
              tableComponent={TableComponentBase}
              columnExtensions={tableColumnExtensions}
              messages={tableMessages}
            />
            <TableHeaderRow
              showSortingControls
              contentComponent={TableHeaderContentBase}
            />
            <TableRowDetail contentComponent={ProductDetailRow} />
            <PagingPanel pageSizes={[3, 5, 10, 20, 50, 100]} messages={pagingPanelMessages} />
          </DXGrid>
          {loading && <Loading />}
        </Paper>
      </Box>
    </>
  );
}

const tableStyles = makeStyles((theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
      textTransform: "uppercase",
      fontSize: 12,
    },
    tableStriped: {
      "& tbody tr:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
);

const TableHeaderContentBase = ({
  column,
  children,
  classes,
  ...restProps
}: any) => {
  const styles = tableStyles();
  return (
    <TableHeaderRow.Content
      className={styles.head}
      column={column}
      {...restProps}
    >
      {children}
    </TableHeaderRow.Content>
  );
};
const TableComponentBase = ({ ...restProps }: any) => {
  const styles = tableStyles();
  return <Table.Table {...restProps} className={styles.tableStriped} />;
};

export default withGuard(Movimentacoes);
