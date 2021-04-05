import React, {FormEvent, useState} from 'react'
import { Button, Container, createStyles, InputAdornment, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import { faBan, faSave, faTshirt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal';
import Swal from 'sweetalert2';
import Product from 'models/product';
import productService from 'services/productService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: theme.spacing(2)
    },
    formActions: {
      textAlign: 'right',
      marginTop: theme.spacing(3)
    }
  })
);

export default function CadastroProdutos() {
  const [ name, setName ] = useState<string>('')
  const [ size, setSize ] = useState<string>('')
  const [ inventory, setInventory ] = useState<number>(0)
  const [ weight, setWeight ] = useState<number>(0)

  const classes = useStyles()
  const { toggleModal } = useModal()

  const formChanged = name || inventory || size || weight

  async function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    const newProduct:Product = {
      name,
      inventory,
      size,
      weight
    }

    await productService.insert(newProduct);

    Swal.fire({
      text: 'Produto inserido com sucesso!'
    })
    toggleModal({})
  }

  function handleCancel() {
    if(formChanged) {
      Swal.fire({
        showCancelButton: true,
        title: "Cancelar Cadastro",
        text: "Tem certeza de que deseja cancelar suas alterações?",
        icon: "warning",
        cancelButtonText: 'Não, voltar ao formulário',
        confirmButtonText: 'Sim, descartar alterações',
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#556cd6',
      }).then((result: any) => {
        if (result.isConfirmed) toggleModal({})
      })
    } else toggleModal({})
  }

  return (
    <>
      <Container max-width="ls">
        <Typography variant="h4" component="h1" color="primary" className={classes.formTitle}>
          <FontAwesomeIcon icon={faTshirt} /> { !name ? 'Cadastro de Produto' : name }
        </Typography>

        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Produto"
            name="name"
            autoComplete="off"
            autoFocus
            onChange={ event => setName(event.target.value) }
            value={name}
          />

          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="size"
            label="Tamanho"
            name="size"
            autoComplete="off"
            onChange={ event => setSize(event.target.value) }
            value={size}
          />

          <TextField
            type="number"
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="inventory"
            label="Quantidade"
            name="inventory"
            autoComplete="off"
            onChange={ event => setInventory(parseFloat(event.target.value)) }
            value={inventory}
          />

          <TextField
            variant="filled"
            margin="normal"
            type="number"
            required
            fullWidth
            id="weight"
            label="Peso (kg)"
            name="weight"
            autoComplete="off"
            onChange={ event => setWeight(event.target.value ? parseFloat(event.target.value) < 0 ? 0 : parseFloat(event.target.value) : 0) }
            value={weight}
            InputProps={{
              startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
            }}
          />

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            className={classes.formActions}
          >
            <Grid item xs={3}>
              <Button size="large" color="secondary" onClick={handleCancel}>
                <FontAwesomeIcon icon={faBan} />&nbsp;
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" size="large" color="secondary" type="submit">
                <FontAwesomeIcon icon={faSave} /> &nbsp; 
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}