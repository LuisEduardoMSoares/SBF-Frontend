import React, { useState } from 'react';
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
import Provider from 'models/provider'

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

export default function ListaProdutos({list}: any) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
            <StyledTableCell>Nome</StyledTableCell>
            <StyledTableCell align="center">E-mail</StyledTableCell>
            <StyledTableCell align="center">Telefone</StyledTableCell>
            <StyledTableCell align="center">CNPJ</StyledTableCell>
            <StyledTableCell align="center">Nome do contato</StyledTableCell>
            <StyledTableCell align="center">&nbsp;</StyledTableCell>
            <StyledTableCell align="center">&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list.map((provider: Provider) => (
            <StyledTableRow key={provider.id}>
              <StyledTableCell component="th" scope="row">
                {provider.name}
              </StyledTableCell>
              <StyledTableCell align="center">{provider.email}</StyledTableCell>
              <StyledTableCell align="center">{provider.phone_number}</StyledTableCell>
              <StyledTableCell align="center">{provider.cnpj}</StyledTableCell>
              <StyledTableCell align="center">{provider.contact_name}</StyledTableCell>
              <StyledTableCell align="center">{provider.metadatetime?.updated_on ? provider.metadatetime?.updated_on : "-" }</StyledTableCell>
              <StyledTableCell align="right">
              <IconButton
                aria-label="more"
                aria-controls={`long-menu-${provider.id}`}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`long-menu-${provider.id}`}
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