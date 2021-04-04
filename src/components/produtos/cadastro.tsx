import React, {FormEvent, useState} from 'react'
import { Button, Container, createStyles, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import { faTshirt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal';
import Swal from 'sweetalert2';

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

  function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    console.log("Cadastrar")
  }

  function handleCancel() {
    Swal.fire({
      showCancelButton: true,
      title: "Cancelar Cadastro",
      text: "Tem certeza de que deseja cancelar suas alterações?",
      icon: "warning",
      cancelButtonText: 'Não, voltar ao formulário',
      confirmButtonText: 'Sim, cancelar alterações',
      confirmButtonColor: '#FF0000',
    }).then((result: any) => {
      if (result.isConfirmed) toggleModal({})
    })
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
            autoFocus
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
            autoFocus
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
            autoFocus
            onChange={ event => setWeight(parseFloat(event.target.value)) }
            value={weight}
          />

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            className={classes.formActions}
          >
            <Grid item xs={3}>
              <Button color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" type="submit">
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}