import React, {useEffect, useState } from "react";
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
import Transaction, { transactionType, transactionProduct } from "models/transaction";
import Product from "models/product";
import productService from "services/productService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: theme.spacing(2),
    },
    formActions: {
      textAlign: "right",
      marginTop: theme.spacing(3),
    },
    rootContainer: {
      minWidth: 740
    },
    button: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.palette.error.main,

      '&:hover': {
        backgroundColor: theme.palette.error.main
      }
    }
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
  date: new Date(),
};

export default function CadastroMovimentacao() {
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction>(
    initialTransactionState
  );
  const [transactionType, setTransactionType] = useState<string>("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [inputList, setInputList] = useState<transactionProduct[]>([{ product_id: '', quantity: 0 }]);

  // handle input change
  function handleInputChange(e: any, index: number) {
    const { name, value } = e.target;
    const list:any[] = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };
 
  // handle click event of the Remove button
  function handleRemoveClick(index:number) {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
 
  // handle click event of the Add button
  function handleAddClick() {
    setInputList([...inputList, { product_id: "", quantity: 0 }]);
  };

  useEffect(() => {
    productService.list().then((response) => {
      console.log(response);
      setProductList(response);
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

        <form noValidate>
          <TextField
            variant="filled"
            margin="normal"
            select
            required
            fullWidth
            id="name"
            label="Tipo de Transação"
            name="name"
            autoComplete="off"
            autoFocus
            onChange={(event) => setTransactionType(event.target.value)}
            value={transactionType}
          >
            {transactionTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          
          <Box my={2}>
            <Typography
              variant="h5"
              component="h3"
              color="primary"
            >
              Produtos 
            </Typography>

            {inputList.map((input, index) => {
              return (
                <Grid key={index} container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={9}>
                    <TextField
                      variant="filled"
                      margin="normal"
                      select
                      required
                      fullWidth
                      id="product_id"
                      label="Produto"
                      name="product_id"
                      autoComplete="off"
                      autoFocus
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
                      variant="filled"
                      margin="normal"
                      required
                      fullWidth
                      id="quantity"
                      label="Quantidade"
                      name="quantity"
                      autoComplete="off"
                      autoFocus
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <Fab
                      size="medium"
                      color="secondary"
                      type="button"
                      className={classes.button}
                      onClick={() => { handleRemoveClick(index)}}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Grid>
                </Grid>
              )}
            )}

            <Grid container justify="center">
            <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleAddClick}
                >
                  <FontAwesomeIcon icon={faPlus} /> &nbsp; Adicionar Produto
                </Button>
            </Grid>
            </Box>

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              className={classes.formActions}
            >
              <Grid item xs={3}>
                <Button size="large" color="secondary">
                  <FontAwesomeIcon icon={faBan} />
                  &nbsp; Cancelar
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
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
