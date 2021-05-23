import React, { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Container,
  createStyles,
  FormControlLabel,
  makeStyles,
  Snackbar,
  Switch,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import { faBan, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "hooks/useModal";
import Swal from "sweetalert2";
import User from "models/user";
import userService from "services/userService";
import { emailValidator, passwordValidator } from "utils/functions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: theme.spacing(2),
    },
    formActions: {
      textAlign: "right",
      marginTop: theme.spacing(3),
    },
    formGrid: {
      marginTop: 0,
    },
  })
);

const initialUserState: User = {
  first_name: "",
  last_name: "",
  email: "",
  admin: false,
  password: "",
};

export default function CadastroUsuario() {
  const [user, setUser] = useState<User>(initialUserState);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, setChangePassword] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const classes = useStyles();
  const { toggleModal, modalParams } = useModal();
  const { userId, afterUserSave } = modalParams;

  useEffect(() => {
    console.log("User ID changed: ", userId);

    if (userId) {
      setChangePassword(false);
      userService
        .getOne(userId)
        .then((user: User) => {
          setUser(user);
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setAdmin(user.admin);
          setEmail(user.email);
          setPassword("");
          setConfirmPassword("");
        })
        .catch(console.error);
    }
  }, [modalParams]);

  const isFormChanged =
    firstName != user.first_name ||
    lastName != user.last_name ||
    admin != user.admin
    email != user.email ||
    password != "" ||
    confirmPassword != "";

  function isFormValid() {
    const isValid =
      firstName &&
      lastName &&
      email &&
      ((changePassword && password && confirmPassword) || !changePassword);
    if (!isValid) {
      setMessage(
        "Formulário inválido! Necessário o preenchimento de todos os campos."
      );
      setIsOpen(true);
    } else setIsOpen(false);

    return isValid;
  }

  async function handleSubmit($event: FormEvent) {
    $event.preventDefault();

    if (isFormChanged) {
      if (isFormValid()) {
        if (changePassword && password !== confirmPassword) {
          Swal.fire({
            text: "Senha e confirmação de senha diferentes",
            position: "bottom",
            timer: 2500,
            showConfirmButton: true,
            toast: true,
          });
        }

        const newUser: User = {
          id: userId,
          first_name: firstName,
          last_name: lastName,
          admin,
          email,
        };

        if (changePassword && password === confirmPassword) {
          newUser.password = password;
        }

        await userService.save(newUser).then(() => {
          toggleModal({});
          afterUserSave();
        });

        Swal.fire({
          title: "Sucesso!",
          html: `Perfil de <b>${firstName} ${lastName}</b> ${
            userId ? "modificado" : "cadastrado"
          } com sucesso!`,
          icon: "success",
        });
      }
    } else {
      Swal.fire({
        text: "Altere algo para gravar o usuário",
        position: "bottom",
        timer: 2500,
        showConfirmButton: true,
        toast: true,
      });
    }
  }

  function handleCancel() {
    if (isFormChanged) {
      Swal.fire({
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
      <Snackbar open={isOpen} autoHideDuration={10000}>
        <Alert severity="error">{message}</Alert>
      </Snackbar>
      <Container max-width="ls">
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          className={classes.formTitle}
        >
          <FontAwesomeIcon icon={faUser} />{" "}
          {!userId ? "Cadastro de Usuário" : `${firstName} ${lastName}`}
        </Typography>

        <form
          noValidate
          onSubmit={handleSubmit}
          autoComplete={`section-blue-${Math.random()} register-${Math.random()}`}
        >
          <Grid 
            container
            direction="row"
            alignItems="center" 
            spacing={2}
          >
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                size="small"
                margin="dense"
                required
                fullWidth
                id="first_name"
                label="Nome"
                name="first_name"
                autoComplete="off"
                autoFocus
                onChange={(event) => setFirstName(event.target.value)}
                value={firstName}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                size="small"
                margin="dense"
                required
                fullWidth
                id="last_name"
                label="Sobrenome"
                name="last_name"
                autoComplete="off"
                onChange={(event) => setLastName(event.target.value)}
                value={lastName}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
            <Tooltip title="Concede permissão para acessar e modificar Usuários" placement="top">
              <FormControlLabel
                control={
                  <Switch
                    checked={admin}
                    onChange={(event) => { setAdmin(event.target.checked) }}
                    name="admin"
                    color="primary"
                  />
                }
                label="Administrador?"
              />
            </Tooltip>
            </Grid>

            <Grid item xs={12}>
          <TextField
            type="email"
            variant="outlined"
            size="small"
            margin="dense"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="off"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            onBlur={(event) => {
              if (emailValidator(event.target.value)) {
                setIsOpen(false);
              } else {
                setMessage("Atenção, E-mail inválido");
                setIsOpen(true);
              }
            }}
          />
          </Grid>

          {!changePassword && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setChangePassword(true);
              }}
            >
              Alterar Senha
            </Button>
          )}
          {changePassword && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  required
                  fullWidth
                  id="password"
                  label="Senha"
                  name="password"
                  autoComplete={`section-blue-${Math.random()} register-${Math.random()} new-password`}
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  error={
                    isFormChanged
                      ? !passwordValidator(password, confirmPassword)
                      : undefined
                  }
                  onBlur={(event) => {
                    if (
                      passwordValidator(event.target.value, confirmPassword)
                    ) {
                      setIsOpen(false);
                    } else {
                      setMessage(
                        "Atenção, senha e confirmação de senha estão diferentes"
                      );
                      setIsOpen(true);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirmação de senha"
                  name="confirmPassword"
                  autoComplete={`section-red-${Math.random()} register-${Math.random()} new-password`}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  value={confirmPassword}
                  error={
                    isFormChanged
                      ? !passwordValidator(password, confirmPassword)
                      : undefined
                  }
                  onBlur={(event) => {
                    if (passwordValidator(password, event.target.value)) {
                      setIsOpen(false);
                    } else {
                      setMessage(
                        "Atenção, senha e confirmação de senha estão diferentes"
                      );
                      setIsOpen(true);
                    }
                  }}
                />
              </Grid>
              </>
          )}
          </Grid>

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            className={classes.formActions}
            spacing={1}
          >
            <Grid item>
              <Button
                size="large"
                color="primary"
                variant="outlined"
                onClick={handleCancel}
              >
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
                <FontAwesomeIcon icon={faSave} /> &nbsp;
                {!userId ? "Cadastrar" : "Alterar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
