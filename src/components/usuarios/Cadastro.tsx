import React, { FormEvent, useEffect, useState } from 'react'
import { Button, Container, createStyles, makeStyles, Snackbar, TextField, Theme, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'
import { faBan, faSave, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useModal from 'hooks/useModal'
import Swal from 'sweetalert2'
import User from 'models/user'
import userService from 'services/userService'
import { emailValidator } from 'utils/functions'


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
)

const initialUserState: User = {
  first_name: "",
  last_name: "",
  email: "",
  password: ""
}

export default function CadastroUsuario() {

  const [user, setUser] = useState<User>(initialUserState)

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const classes = useStyles()
  const { toggleModal, modalParams } = useModal()
  const { userId, afterUserSave } = modalParams

  useEffect(() => {
    console.log("User ID changed: ", userId)

    if (userId) {
      userService
        .getOne(userId)
        .then((user: User) => {
          setUser(user)
          setFirstName(user.first_name)
          setLastName(user.last_name)
          setEmail(user.email)
          setPassword("")
        })
        .catch(console.error)
    }
  }, [modalParams])

  const formChanged = 
    firstName != user.first_name
    || lastName != user.last_name
    || email != user.email


  async function handleSubmit($event: FormEvent) {
    $event.preventDefault()

    const newUser: User = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      password
    }

    await userService.save(newUser).then(() => {
      afterUserSave()
    })

    Swal.fire({
      title: "Sucesso!",
      html: `Perfil de <b>${firstName} ${lastName}</b> ${userId ? 'modificado' : 'cadastrado'} com sucesso!`,
      icon: "success"
    });
    toggleModal({})
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
          <FontAwesomeIcon icon={faUser} /> {!userId ? 'Cadastro de Usuário' : name}
        </Typography>

        <form noValidate onSubmit={handleSubmit} autoComplete="center">
          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="Nome"
            name="first_name"
            autoComplete="off"
            autoFocus
            onChange={event => setFirstName(event.target.value)}
            value={firstName}
          />

          <TextField
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Sobrenome"
            name="last_name"
            autoComplete="off"
            onChange={event => setLastName(event.target.value)}
            value={lastName}
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
            onBlur={event => {
              if (emailValidator(event.target.value)) {
                setIsOpen(false)
              } else {
                setMessage('Atenção, E-mail inválido')
                setIsOpen(true)
              }
            }}
          />

          <TextField
            type="password"
            variant="outlined"
            size="small"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Senha"
            name="password"
            autoComplete="off"
            onChange={event => setPassword(event.target.value)}
            value={password}
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
                {!userId ? "Cadastrar" : "Alterar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}
