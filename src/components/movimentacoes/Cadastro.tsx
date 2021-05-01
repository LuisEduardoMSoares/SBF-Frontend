import React, { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Container,
  createStyles,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { faBan, faBoxOpen, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "hooks/useModal";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Transaction, { transactionType } from "models/transaction";
import { DataGrid, GridColDef, GridRowsProp } from "@material-ui/data-grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: theme.spacing(2),
    },
    formActions: {
      textAlign: "right",
      marginTop: theme.spacing(3),
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
  date: new Date(),
};

export default function CadastroMovimentacao() {
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction>(
    initialTransactionState
  );
  const [transactionType, setTransactionType] = useState<string>("");

  const [productRows, setProductRows] = useState<GridRowsProp>([
    {
      id: 1,
      name: "Teste",
      quantity: 20,
    },
  ]);

  const productColumns: GridColDef[] = [
    { field: "name", headerName: "Nome do Produto", flex: 1 },
    { field: "quantity", headerName: "Quantidade", width: 150 },
  ];

  const classes = useStyles();
  // const { toggleModal, modalParams } = useModal();
  // const { transactionId, afterTransactionSave } = modalParams;

  /*useEffect(() => {
    console.log("Product ID changed: ", productId);

    if (productId) {
      productService
        .getOne(productId)
        .then((product: Product) => {
          setProduct(product);
          setName(product.name);
          setSize(product.size);
          setInventory(product.inventory);
          setWeight(product.weight);
        })
        .catch(console.error);
    }
  }, [modalParams]);

  const isFormChanged =
    name != product.name ||
    inventory != product.inventory ||
    weight != product.weight ||
    size != product.size

  async function handleProductSave($event: FormEvent) {
    $event.preventDefault();

    if(isFormChanged) {

      const newProduct: Product = {
        id: productId,
        name,
        inventory,
        size,
        weight,
      };

      await productService.save(newProduct).then(() => {
        afterProductSave()
      });

      //Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
      Swal.fire({
        title: "Sucesso!", 
        html: `<b>${name} (${size})</b> ${product.id ? 'modificado' : 'cadastrado'} com sucesso!`,
        icon: "success"
      });

      toggleModal({})

      router.push('/admin/produtos',undefined,{shallow: true})
    } else {
      Swal.fire({
        text: "Nada foi alterado",
        position: "bottom",
        timer: 2500,
        showConfirmButton: false,
        toast: true
      })
      toggleModal({})
    }
  }

  async function handleCancel() {
    if (isFormChanged) {
      await Swal.fire({
        showCancelButton: true,
        title: "Cancelar Cadastro",
        text: "Tem certeza de que deseja cancelar suas alterações?",
        icon: "warning",
        cancelButtonText: "Não, voltar ao formulário",
        confirmButtonText: "Sim, descartar alterações",
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#556cd6",
      }).then((result: any) => {
        if (result.isConfirmed) toggleModal({});
      });
    } else toggleModal({});
  }*/

  return (
    <>
      <Container max-width="ls">
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

          <Paper>
            <Grid container direction="row">
              
            </Grid>
          </Paper>

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
