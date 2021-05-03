import React from "react";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import DateFnsUtils from "@date-io/date-fns";
import { Chip, makeStyles } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ptBR } from "date-fns/locale";

const DateUtils = new DateFnsUtils({locale: ptBR});

const useStyles = makeStyles((theme) => ({
  entrada: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  },
  saida: {
    backgroundColor: theme.palette.error.main,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  }
}));

export const DateFormatter = ({ value }:any) => DateUtils.format(value, 'dd/MM/yyyy');

export const DateTypeProvider = (props: any) => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    {...props}
  />
);

export const DateTimeFormatter = ({ value }:any) => DateUtils.format(value, 'dd/MM/yyyy HH:mm:ss');

export const DateTimeTypeProvider = (props: any) => (
  <DataTypeProvider
    formatterComponent={DateTimeFormatter}
    {...props}
  />
);

export const transactionTypeFormatter = ({ value }:any) => {
  const classes = useStyles()
  return (
    <Chip 
      className={value === "SAIDA" ? classes.saida : classes.entrada}
      color="secondary"
      icon={
        <FontAwesomeIcon 
          icon={value === "ENTRADA" ? faPlus : faMinus}/>
      }
      label={value === "ENTRADA" ? "Entrada" : "Saída"}
      size="small"
    />
  )
}

export const TransactionTypeProvider = (props: any) => (
  <DataTypeProvider
    formatterComponent={transactionTypeFormatter}
    {...props}
  />
);

export default {
  DateFormatter,
  DateTypeProvider,
  DateTimeFormatter,
  DateTimeTypeProvider,
  transactionTypeFormatter,
  TransactionTypeProvider
}