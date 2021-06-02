import React, { FormEvent, useEffect, useState } from 'react'
import { Button, Container, createStyles, makeStyles, Snackbar, TextField, Theme, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'
import { faBan, faSave, faTruckMoving } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal';
import Swal from 'sweetalert2';
import Provider from 'models/provider';
import providerService from 'services/providerService';
import { validatePattern, validatorsPatternList } from 'utils/validators';
import { cnpj } from 'cpf-cnpj-validator';


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

interface providerValidate {
  isOk: boolean,
  messageError: string[]
}

function providerValidation(provider: Provider): providerValidate {
  let isOk = true;
  const listMessagesError = [];
  if (!validatePattern(validatorsPatternList.cnpj, provider.cnpj) || !cnpj.isValid(provider.cnpj)) {
    isOk = false;
    listMessagesError.push('CNPJ inválido');
  }
  if (!validatePattern(validatorsPatternList.email, provider.email)) {
    isOk = false;
    listMessagesError.push('E-mail inválido');
  }
  if (!validatePattern(validatorsPatternList.name, provider.contact_name)) {
    isOk = false;
    listMessagesError.push('Nome do contato inválido');
  }
  if (!validatePattern(validatorsPatternList.name, provider.name)) {
    isOk = false;
    listMessagesError.push('Nome do fornecedor inválido');
  }
  if (!validatePattern(validatorsPatternList.phone, provider.phone_number)) {
    isOk = false;
    listMessagesError.push('Telefone inválido');
  }
  return {
    isOk,
    messageError: listMessagesError
  };
}

export default function CadastroFornecedor() {

  const [provider, setProvider] = useState<Provider>(initialProviderState);

  const [name, setName] = useState<string>('')
  const [cnpj, setCnpj] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [contactName, setContactName] = useState<string>('')
  const [message, _setMessage] = useState<string>('');
  const [isOpen, _setIsOpen] = useState<boolean>(false);

  const classes = useStyles()
  const { toggleModal, modalParams } = useModal();
  const { providerId, afterProviderSave } = modalParams;

  useEffect(() => {
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

    const validation = providerValidation(newProvider);
    if (validation.isOk) {
      await providerService.insert(newProvider).then(() => {
        afterProviderSave();
      });

      Swal.fire({
        text: 'Fornecedor cadastrado com sucesso!'
      })
      toggleModal({});
    } else {
      Swal.fire({
        title: 'Foram encontrados os seguintes erros no cadastro',
        html: `${validation.messageError.join('<br>')}`,
        icon: 'error'
      });
    }
  }

  function handleCancel() {
    if (formChanged) {
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
          <FontAwesomeIcon icon={faTruckMoving} /> {!providerId ? 'Cadastro de Fornecedor' : name}
        </Typography>

        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Fornecedor"
            name="name"
            autoComplete="off"
            autoFocus
            onChange={event => setName(event.target.value)}
            value={name}
          />

          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="contact"
            label="Nome do contato"
            name="contact"
            autoComplete="off"
            onChange={event => setContactName(event.target.value)}
            value={contactName}
          />

          <TextField
            type="email"
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="off"
            onChange={event => setEmail(event.target.value)}
            value={email}
          />

          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            type="number"
            required
            fullWidth
            id="cnpj"
            label="CNPJ"
            name="cnpj"
            autoComplete="off"
            onChange={event => setCnpj(event.target.value)}
            value={cnpj}
          />
          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            type="phone"
            required
            fullWidth
            id="phone"
            label="Telefone"
            name="phone"
            autoComplete="off"
            onChange={event => setPhoneNumber(event.target.value)}
            value={phoneNumber}
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
                <FontAwesomeIcon icon={faBan} />&nbsp;
                Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="primary" type="submit">
                <FontAwesomeIcon icon={faSave} /> &nbsp;
                {!providerId ? "Cadastrar" : "Alterar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}
