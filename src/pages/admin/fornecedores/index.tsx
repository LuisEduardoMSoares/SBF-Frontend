import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListaFornecedores from './ListaFornecedores';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Index(props) {
  const classes = useStyles();
  const { children, index, ...other } = props;
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />&nbsp;
        Fornecedores
      </Typography>
        <Button variant="contained" size="large" color="secondary" onClick={handleClickOpen}>
          + Adicionar Fornecedor
      </Button>
      </Box>

      <FormControl className={clsx(classes.margin, classes.textField)} fullWidth variant="filled">
        <InputLabel htmlFor="fornecedor_search">Fornecedor</InputLabel>
        <FilledInput
          id="fornecedor_search"
          label="Pesquisar"
          placeholder="Pesquisar por Nome do Fornecedor, E-mail, CNPJ, etc."
          fullWidth
          margin="normal"
          variant="filled"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => { }}
                onMouseDown={() => { }}
              >
                <Visibility />
              </IconButton>
            </InputAdornment>
          }
          InputLabelProps={{
            shrink: true,
          }
        }
        />
      </FormControl>

      <Box my={4}>
        <Tabs value={value} onChange={handleChange} aria-label="Abas fornecedores">
          <Tab label="Todos" {...a11yProps(0)} />
          <Tab label="Favoritos" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ListaFornecedores></ListaFornecedores>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <p>Favoritos</p>
        </TabPanel>
      </Box>

      <Dialog
        style={{zIndex: 20000}}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onBackdropClick={() => {}}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-slide-title">Cadastrar fornecedor</DialogTitle>
        <DialogContent>
          <FormControlLabel
            className={classes.formControlLabel}
            control={<Switch checked={true} onChange={() => {}} />}
            label="Marcar como favorito"
          />
          <TextField
            id="filled-full-width"
            label="Nome do fornecedor"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-full-width"
            label="Responsável"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-full-width"
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-full-width"
            label="CNPJ"
            type="number"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-full-width"
            label="Telefone"
            type="phone"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="success">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
