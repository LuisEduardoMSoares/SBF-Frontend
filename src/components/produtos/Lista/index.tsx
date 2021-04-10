import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Product from "models/product";
import ContextMenu from "./contextMenu";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
      textTransform: "uppercase",
      fontSize: 12,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export interface ContextMenuOption {
  title: string;
  action?: Function | any;
}

export default function ListaProdutos({
  list,
  handleProductUpdate,
  handleProductDelete
}: {
  list: Product[];
  handleProductUpdate: Function
  handleProductDelete: Function
}) {
  const classes = useStyles();

  const options: ContextMenuOption[] = [
    { title: "Alterar", action: handleProductUpdate },
    { title: "Entrada/Saída" },
    { title: "Excluir", action: handleProductDelete },
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Produto</StyledTableCell>
            <StyledTableCell align="center">Tamanho</StyledTableCell>
            <StyledTableCell align="center">Quantidade</StyledTableCell>
            <StyledTableCell align="center">Peso</StyledTableCell>
            <StyledTableCell align="center">Última Atualização</StyledTableCell>
            <StyledTableCell align="center">&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list &&
            list.map((product: Product) => (
              <StyledTableRow key={product.id}>
                <StyledTableCell component="th" scope="row">
                  {product.name}
                </StyledTableCell>
                <StyledTableCell align="center">{product.size}</StyledTableCell>
                <StyledTableCell align="center">
                  {product.inventory}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {product.weight ? product.weight : "-"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {product.metadatetime?.updated_on
                    ? product.metadatetime?.updated_on
                    : "-"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <ContextMenu
                    product={product}
                    menuOptions={options}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
