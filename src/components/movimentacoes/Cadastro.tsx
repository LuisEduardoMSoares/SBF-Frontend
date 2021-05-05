import React, {
  BaseSyntheticEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Container,
  createStyles,
  Fab,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {
  faBan,
  faBoxOpen,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Transaction, {
  transactionType,
  transactionProduct,
} from "models/transaction";
import Product from "models/product";
import productService from "services/productService";
import providerService from "services/providerService";
import Provider from "models/provider";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TransactionService from "services/transactionService";
import Swal from "sweetalert2";
import useModal from "hooks/useModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    formActions: {
      textAlign: "right",
      marginTop: theme.spacing(3),
    },
    rootContainer: {
      minWidth: 740,
    },
    button: {
      backgroundColor: theme.palette.error.main,

      "&:hover": {
        backgroundColor: theme.palette.error.main,
      },
    },
  })
);

interface transactionTypesSelect {
  value: transactionType;
  label: string;
}
const transactionTypes: transactionTypesSelect[] = [
  {
    value: "ENTRADA",
    label: "Entrada",
  },
  {
    value: "SAIDA",
    label: "Saída",
  },
];

const initialTransactionState: Transaction = {
  type: "ENTRADA",
  products: [],
  provider_id: "",
  date: new Date(),
};

export default function CadastroMovimentacao() {
  const router = useRouter();
  const { toggleModal, modalParams } = useModal();
  const { afterTransactionSave } = modalParams;
  const transactionService = new TransactionService();

  const [_transaction, _setTransaction] = useState<Transaction>(
    initialTransactionState
  );
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<string>();
  const [transactionProviderId, setTransactionProviderId] = useState<string>();
  const [
    transactionDescription,
    setTransactionDescription,
  ] = useState<string>();
  const [transactionProducts, setTransactionProducts] = useState<
    transactionProduct[]
  >([{ product_id: "", quantity: "" }]);

  const [productList, setProductList] = useState<Product[]>([]);
  const [providerList, setProviderList] = useState<Provider[]>([]);

  async function handleTransactionSave(event: FormEvent) {
    event.preventDefault();

    const transactionData: Transaction = {
      date: transactionDate,
      type: transactionType as transactionType,
      description: transactionDescription,
      products: transactionProducts,
    };

    if (transactionData.type === "ENTRADA") {
      transactionData.provider_id = transactionProviderId
        ? transactionProviderId
        : 0;
    }

    await transactionService.save(transactionData).catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Erro ao salvar a movimentação. Mensagem de erro: ${error}`,
      });
    });

    if(afterTransactionSave) afterTransactionSave();

    Swal.fire({
      title: "Sucesso!",
      html: `Movimentação incluída com sucesso!`,
      icon: "success",
    });

    toggleModal({});

    router.push('/admin/movimentacoes',undefined,{shallow: true})
  }

  // handle input change
  function handleInputChange(event: BaseSyntheticEvent, index: number) {
    const { name, value, selected } = event.target;
    const list: any[] = [...transactionProducts];
    list[index][name] = value | selected;
    setTransactionProducts(list);
  }

  // handle click event of the Remove button
  function handleRemoveClick(index: number) {
    const list = [...transactionProducts];
    list.splice(index, 1);
    setTransactionProducts(list);
  }

  // handle click event of the Add button
  function handleAddClick() {
    setTransactionProducts([
      ...transactionProducts,
      { product_id: "", quantity: "" },
    ]);
  }

  function onTransactionTypeChange(event: BaseSyntheticEvent) {
    const { value } = event.target
    setTransactionType(value)
    if(value === "SAIDA") setTransactionProviderId(undefined)
  }

  useEffect(() => {
    productService.list().then((response) => {
      setProductList(response);
    });
    providerService.list().then((response) => {
      setProviderList(response);
    });
  }, []);

  const classes = useStyles();

  return (
    <>
      <Container className={classes.rootContainer}>
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          className={classes.formTitle}
        >
          <FontAwesomeIcon icon={faBoxOpen} /> Registro de Movimentação
        </Typography>

        <form noValidate onSubmit={handleTransactionSave}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  size="small"
                  fullWidth
                  variant="inline"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  margin="dense"
                  id="transaction-date"
                  label="Data da Movimentação"
                  value={transactionDate}
                  onChange={(date) => {
                    setTransactionDate(date as Date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "Mudar Data",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                size="small"
                margin="dense"
                select
                required
                fullWidth
                id="transactionType"
                label="Tipo de Transação"
                name="transactionType"
                autoComplete="off"
                autoFocus
                onChange={(event) => {
                  onTransactionTypeChange(event);
                }}
                value={transactionType}
              >
                {transactionTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {transactionType === "ENTRADA" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  margin="dense"
                  select
                  required
                  fullWidth
                  id="transactionProviderId"
                  label="Fornecedor (opcional)"
                  name="name"
                  autoComplete="off"
                  autoFocus
                  onChange={(event) =>
                    setTransactionProviderId(event.target.value)
                  }
                  value={transactionProviderId}
                >
                  {providerList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size="small"
                margin="dense"
                required
                fullWidth
                id="name"
                label="Descrição"
                name="transactionDescription"
                autoComplete="off"
                autoFocus
                onChange={(event) =>
                  setTransactionDescription(event.target.value)
                }
                value={transactionDescription}
              />
            </Grid>
          </Grid>

          <Box my={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="h5" component="h3" color="primary">
                  Produtos
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleAddClick}
                >
                  <FontAwesomeIcon icon={faPlus} /> &nbsp; Adicionar
                </Button>
              </Grid>
            </Grid>

            {transactionProducts.map((input, index) => {
              return (
                <Grid
                  key={index}
                  container
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={9}>
                    <TextField
                      variant="outlined"
                      size="small"
                      margin="dense"
                      select
                      required
                      fullWidth
                      id="product_id"
                      label="Produto"
                      name="product_id"
                      autoComplete="off"
                      value={input.product_id}
                      onChange={(event) => handleInputChange(event, index)}
                    >
                      <MenuItem value="">Selecione...</MenuItem>
                      {productList &&
                        productList.length > 0 &&
                        productList.map((product) => (
                          <MenuItem
                            key={product.id as number}
                            value={product.id as number}
                          >
                            {product.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      variant="outlined"
                      size="small"
                      margin="dense"
                      required
                      fullWidth
                      id="quantity"
                      label="Quantidade"
                      name="quantity"
                      autoComplete="off"
                      type="number"
                      value={input.quantity}
                      onChange={(event) => {
                        handleInputChange(event, index);
                      }}
                    />
                  </Grid>

                  <Fab
                    size="small"
                    color="secondary"
                    type="button"
                    className={classes.button}
                    onClick={() => {
                      handleRemoveClick(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Fab>
                </Grid>
              );
            })}
          </Box>

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            className={classes.formActions}
            spacing={2}
          >
            <Grid item>
              <Button size="large" color="primary" variant="outlined">
                <FontAwesomeIcon icon={faBan} />
                &nbsp; Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                <FontAwesomeIcon icon={faSave} /> &nbsp; Cadastrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
