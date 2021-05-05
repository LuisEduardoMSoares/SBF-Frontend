import React, {FormEvent, useEffect, useState} from 'react'
import {Button, Container, createStyles, makeStyles, Snackbar, TextField, Theme, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'
import { faBan, faSave, faTruckMoving } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal';
import Swal from 'sweetalert2';
import Provider from 'models/provider';
import providerService from 'services/providerService';
import {cnpj as cnpjValidator} from 'cpf-cnpj-validator';
import {emailValidator} from 'utils/functions'
import { useRouter } from 'next/router';


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

const initialProviderState: Provider = {
  name: "",
  cnpj: "",
  contact_name: "",
  phone_number: "",
  email: ""
};

export default function CadastroFornecedor() {
  const router = useRouter();

  const [provider, setProvider] = useState<Provider>(initialProviderState);

  const [ name, setName ] = useState<string>('')
  const [ cnpj, setCnpj ] = useState<string>('')
  const [ phoneNumber, setPhoneNumber ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ contactName, setContactName ] = useState<string>('')
  const [ message, setMessage ] = useState<string>('');
  const [ isOpen, setIsOpen ] = useState<boolean>(false);

  const classes = useStyles()
  const { toggleModal, modalParams } = useModal();
  const { providerId, afterProviderSave } = modalParams;

  useEffect(() => {
    console.log("Provider ID changed: ", providerId);

    if (providerId) {
      providerService
        .getOne(providerId)
        .then((provider: Provider) => {
          setProvider(provider);
          setName(provider.name);
          setCnpj(provider.cnpj);
          setContactName(provider.contact_name);
          setEmail(provider.email);
          setPhoneNumber(provider.phone_number);
        })
        .catch(console.error);
    }
  }, [modalParams]);

  const formChanged = name != provider.name || phoneNumber != provider.phone_number || cnpj != provider.cnpj || email != provider.email || contactName != provider.contact_name

  async function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    const newProvider: Provider = {
      id: providerId,
      name,
      cnpj,
      phone_number: phoneNumber,
      email,
      contact_name: contactName
    }

    await providerService.insert(newProvider).then(() => {
      afterProviderSave();
    });

    Swal.fire({
      text: 'Fornecedor cadastrado com sucesso!'
    })
    toggleModal({});
    router.push('/admin/fornecedores',undefined,{shallow: true})
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
      <Snackbar open={isOpen} autoHideDuration={10000} >
        <Alert severity="error">
          {message}
        </Alert>
      </Snackbar>
      <Container max-width="ls">
        <Typography variant="h4" component="h1" color="primary" className={classes.formTitle}>
          <FontAwesomeIcon icon={faTruckMoving} /> { !name ? 'Cadastro de Fornecedor' : name }
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
            onBlur={event => {
              if (emailValidator(event.target.value)) {
                setIsOpen(false);
              } else {
                setMessage('Atenção, E-mail inválido');
                setIsOpen(true);
              }
            }}
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
            onBlur={event => {
              if (!cnpjValidator.isValid(event.target.value)) {
                setIsOpen(true);
                setMessage('Atenção, CNPJ inválido');
              } else {
                setIsOpen(false);
              }
            }}
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
            justify="flex-end"
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
