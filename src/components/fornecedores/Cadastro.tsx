import React, {FormEvent, useState} from 'react'
import { Button, Container, createStyles, InputAdornment, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import { faBan, faSave, faTshirt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal';
import Swal from 'sweetalert2';
import Provider from 'models/provider';
import providerService from 'services/providerService';

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

export default function CadastroFornecedor() {
  const [ name, setName ] = useState<string>('')
  const [ cnpj, setCnpj ] = useState<string>('')
  const [ phoneNumber, setPhoneNumber ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ contactName, setContactName ] = useState<string>('')

  const classes = useStyles()
  const { toggleModal } = useModal()

  const formChanged = name || phoneNumber || cnpj || email || contactName

  async function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    const newProvider: Provider = {
      name,
      cnpj,
      phone_number: phoneNumber,
      email,
      contact_name: contactName
    }

    await providerService.insert(newProvider);

    Swal.fire({
      text: 'Fornecedor cadastrado com sucesso!'
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
          <FontAwesomeIcon icon={faTshirt} /> { !name ? 'Cadastro de Fornecedor' : name }
        </Typography>

        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Fornecedor"
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
            id="contact"
            label="Nome do contato"
            name="contact"
            autoComplete="off"
            onChange={ event => setContactName(event.target.value) }
            value={contactName}
          />

          <TextField
            type="email"
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="off"
            onChange={ event => setEmail(event.target.value) }
            value={email}
          />

          <TextField
            variant="filled"
            margin="normal"
            type="number"
            required
            fullWidth
            id="cnpj"
            label="CNPJ"
            name="cnpj"
            autoComplete="off"
            onChange={ event => setCnpj(event.target.value) }
            value={cnpj}
          />
          <TextField
            variant="filled"
            margin="normal"
            type="phone"
            required
            fullWidth
            id="phone"
            label="Telefone"
            name="phone"
            autoComplete="off"
            onChange={ event => setPhoneNumber(event.target.value) }
            value={phoneNumber}
          />

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            className={classes.formActions}
          >
            <Grid item xs={3}>
              <Button cnpj="large" color="secondary" onClick={handleCancel}>
                <FontAwesomeIcon icon={faBan} />&nbsp;
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" cnpj="large" color="secondary" type="submit">
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
