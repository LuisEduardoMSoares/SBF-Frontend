import React from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

interface Provider {
  id: number
  name: string
  contactName: string
  email: string
  document: string
  phone: string
}

const rows: Provider[] = [
  {
    id: 1,
    name: "Cetunel Representante Comerciais e Agente",
    contactName: "Aguinaldo Mota",
    email: "aguinaldo@cetunel.com.br",
    document: "00102612000195",
    phone: "(43) 3028-1814"
  },
  {
    id: 2,
    name: "Rosa Clara Representante Comercial LTDA",
    contactName: "Maria Rosa",
    email: "maria.rosa@yahoo.com.br",
    document: "00102612000195",
    phone: "(43) 3028-1814"
  },
  {
    id: 3,
    name: "Braz Fornecedores",
    contactName: "Augusto Oliveira",
    email: "augustobrazoliv",
    document: "00102612000195",
    phone: "(43) 3028-1814"
  },
  {
    id: 4,
    name: "Componet Centro Fornecedor Comercial LTDA",
    contactName: "José Batista Simião Neto",
    email: "aguinaldo@cetunel.com.br",
    document: "00102612000195",
    phone: "(43) 3028-1814"
  },
  {
    id: 5,
    name: "Cetunel Representante Comerciais e Agente",
    contactName: "Aguinaldo Mota",
    email: "aguinaldo@cetunel.com.br",
    document: "00102612000195",
    phone: "(43) 3028-1814"
  },
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const options = [
  'Alterar',
  'Entrada/Saída',
  'Excluir'
];

export default function CustomizedTables() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nome do Fornecedor</StyledTableCell>
            <StyledTableCell align="center">Responsável</StyledTableCell>
            <StyledTableCell align="center">E-mail</StyledTableCell>
            <StyledTableCell align="center">CNPJ</StyledTableCell>
            <StyledTableCell align="center">Telefone</StyledTableCell>
            <StyledTableCell align="center">&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.contactName}</StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.document }</StyledTableCell>
              <StyledTableCell align="center">{row.phone }</StyledTableCell>
              <StyledTableCell align="right">
              <IconButton
                aria-label="more"
                aria-controls={`long-menu-${row.id}`}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`long-menu-${row.id}`}
                anchorEl={anchorEl}         
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: '20ch',
                    border: 'solid 1px rgba(0,0,0,0.15)'
                  },
                  elevation: 0
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}