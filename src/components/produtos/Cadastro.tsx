import React, { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Container,
  createStyles,
  InputAdornment,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { faBan, faSave, faTshirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "hooks/useModal";
import Swal from "sweetalert2";
import Product from "models/product";
import productService from "services/productService";
import { validatePattern, validatorsPatternList } from "utils/validators";

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

const initialProductState: Product = {
  name: "",
  size: "",
  inventory: 0,
  weight: 0,
};

interface productValidate {
  isOk: boolean,
  messageError: string[]
}

function productValidation(product: Product): productValidate {
  let isOk = true;
  const listMessagesError = [];
  if (!validatePattern(validatorsPatternList.name, product.name)) {
    isOk = false;
    listMessagesError.push('Nome do produto inválido, informe um nome com ao menos com 3 caracteres.');
  }
  if (!validatePattern(validatorsPatternList.productSize, product.size)) {
    isOk = false;
    listMessagesError.push('Tamanho do produto inválido.');
  }
  if (product.inventory < 0) {
    isOk = false;
    listMessagesError.push('Quantidade do produto inválida. Informe 0 ou mais.');
  }
  return {
    isOk,
    messageError: listMessagesError
  };
}

export default function CadastroProdutos() {
  const [product, setProduct] = useState<Product>(initialProductState);
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<string | number>("");
  const [inventory, setInventory] = useState<number>(0);
  const [weight, setWeight] = useState<number | any>(0);

  const classes = useStyles();
  const { toggleModal, modalParams } = useModal();
  const { productId, afterProductSave } = modalParams;

  useEffect(() => {

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

    if (isFormChanged) {

      const newProduct: Product = {
        id: productId,
        name,
        inventory,
        size,
        weight,
      };
      const validation = productValidation(newProduct);
      if (validation.isOk) {
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
      } else {
        Swal.fire({
          title: 'Foram encontrados os seguintes erros no cadastro',
          html: `${validation.messageError.join('<br>')}`,
          icon: 'error'
        });
      }
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
  }

  return (
    <>
      <Container max-width="ls">
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          className={classes.formTitle}
        >
          <FontAwesomeIcon icon={faTshirt} />{" "}
          {!productId ? "Cadastro de Produto" : name}
        </Typography>

        <form noValidate onSubmit={handleProductSave}>
          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Produto"
            name="name"
            autoComplete="off"
            autoFocus
            onChange={(event) => setName(event.target.value)}
            value={name}
          />

          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="size"
            label="Tamanho"
            name="size"
            autoComplete="off"
            onChange={(event) => setSize(event.target.value)}
            value={size}
          />

          <TextField
            type="number"
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            disabled={productId ? true : false}
            id="inventory"
            label="Quantidade"
            name="inventory"
            autoComplete="off"
            onChange={(event) => setInventory(parseFloat(event.target.value))}
            value={inventory}
          />

          <TextField
            color="primary"
            variant="outlined"
            size="small"
            margin="normal"
            type="number"
            required
            fullWidth
            id="weight"
            label="Peso (kg)"
            name="weight"
            autoComplete="off"
            onChange={(event) =>
              setWeight(
                event.target.value
                  ? parseFloat(event.target.value) < 0
                    ? 0
                    : parseFloat(event.target.value)
                  : 0
              )
            }
            value={weight}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Kg</InputAdornment>
              ),
            }}
          />

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            className={classes.formActions}
            spacing={1}
          >
            <Grid item>
              <Button size="large"
                color="primary"
                variant="outlined"
                onClick={handleCancel}>
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
                <FontAwesomeIcon icon={faSave} /> &nbsp; {productId ? "Alterar" : "Cadastrar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
