import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withGuard from 'utils/withGuard';
import Provider from 'models/provider';
import providerService from 'services/providerService';
import useModal from 'hooks/useModal';

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
  GridCellClassParams,
} from "@material-ui/data-grid";
import ContextMenu, { ContextMenuOption } from "components/contextMenu";
import Swal from 'sweetalert2';

// const Lista = dynamic(
//   () => import('components/fornecedores/Lista'),
//   { ssr: false }
// )

const Cadastro = dynamic(
  () => import('components/fornecedores/Cadastro'),
  { ssr: false }
)

function Fornecedores() {
  const classes = useStyles();

  const providerColumns: GridColDef[] = [
    { field: "providerId", headerName: "ID", width: 80, headerClassName: classes.head, cellClassName: defineCellClass},
    { field: "name", headerName: "Nome", flex: 2, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "cnpj", headerName: "CNPJ", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "phoneNumber", headerName: "Telefone", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "email", headerName: "Email", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "contactName", headerName: "Contato", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    {
      field: "updatedOn",
      type: "dateTime",
      headerName: "Últ. Atualização",
      flex: 1,
      headerClassName: classes.head,
      cellClassName: defineCellClass
    },
    {
      field: "actions",
      headerName: "Ações",
      headerClassName: classes.head,
      cellClassName: defineCellClass,
      renderCell: (params: GridCellParams) => {
        return (
          <ContextMenu 
            productId={params.getValue('id') as Number} 
            menuOptions={params.value as ContextMenuOption[]} 
          />
        )
      }
    },
  ];

  function defineCellClass(params: GridCellClassParams) {
    return params.rowIndex % 2 === 0 ? classes.rowodd : classes.roweven
  }

  const { toggleModal } = useModal();
  const [providerList, setProviderList] = useState([] as Provider[]);
  const [providerRows, setProviderRows] = useState<GridRowsProp>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetchProviderList();
  }, [page, pageSize, name]);

  async function fetchProviderList() {
    setLoading(true);
    await providerService.fetch({ page, pageSize, name })
      .then((response) => {
        setProviderList(response.records);
        setLoading(false);
        setRowCount(response.pagination_metadata.total_count);
        setProviderRows(
          response.records.map((provider) => {
            const { id, name, cnpj, phone_number, email, contact_name } = provider;
            let updatedOn = provider.metadatetime
              ? new Date(
                provider.metadatetime.updated_on
                    ? provider.metadatetime.updated_on
                    : provider.metadatetime.created_on
                )
              : null;
            let actions:ContextMenuOption[] = [
              {
                title: 'Alterar',
                action: handleProviderChange
              },
              {
                title: 'Excluir',
                action: handleProviderDelete
              }
            ]
            return {
              id,
              providerId: id,
              name,
              cnpj,
              phone_number,
              email,
              contact_name,
              updatedOn,
              actions,
            };
          })
        );
    }).catch(console.error)
  }

  function handleProviderChange(providerId: Number | null) {
    toggleModal({
      title: "Cadastro de Fornecedor",
      content: <Cadastro />,
      route: !providerId ? "add" : `update/${providerId}`,
      params: { providerId, afterProviderSave: fetchProviderList},
    });
  }

  async function handleProviderDelete(providerId: Number) {
    const provider = providerList.find(item => item.id === providerId );

    if(provider) {
      await Swal.fire({
        showCancelButton: true,
        title: "Excluir Cadastro?",
        html: `Tem certeza de que deseja excluir <b>${provider.name}</b>? Não será possível desfazer essa ação!</b>`,
        icon: "question",
        cancelButtonText: "Não",
        confirmButtonText: "Sim, excluir cadastro",
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#556cd6",
      }).then((result: any) => {
        if (result.isConfirmed) {
          providerService
            .delete(provider)
            .then((deletedProvider: Provider) => {
              fetchProviderList()
              Swal.fire({
                title: "Sucesso!",
                html: `<b>${deletedProvider.name}</b> excluído com sucesso!`,
                icon: "success",
              });
            })
            .catch(console.error);
        }
      });
    }
    console.log("providerDeleteCalled", provider);
  }

  // function insertProvider() {
  //   toggleModal(
  //     { 
  //       title: "Cadastro de Fornecedores",
  //       content: (
  //         <Cadastro />
  //       )
  //     }
  //   )
  // }

  // useEffect(() => {
  //   providerService.list()
  //   .then(response => {
  //     if(response) setProviderList(response)
  //   })
  // }, [])

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />&nbsp;
          Fornecedores
        </Typography>
        <Button variant="contained" size="large" color="secondary" onClick={() => handleProviderChange(null)}>
          + Adicionar Fornecedor
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Fornecedor, E-mail, CNPJ, etc."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <Box my={4}>
        {/* <Lista list={providerList}></Lista> */}
        <DataGrid
            autoHeight={true}
            page={page}
            onPageChange={(params) => {
              setPage(params.page);
            }}
            onPageSizeChange={(params) => {
              setPage(0);
              setPageSize(params.pageSize);
            }}
            paginationMode="server"
            rowCount={rowCount}
            rows={providerRows}
            columns={providerColumns}
            pagination
            loading={loading}
            pageSize={pageSize}
            disableColumnMenu={true}
            rowsPerPageOptions={[3, 5, 10, 20, 50, 100]}
          />
      </Box>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    textTransform: "uppercase",
    fontSize: 12,
  },
  rowodd: {
    backgroundColor: "white",
  },
  roweven: {
    backgroundColor: theme.palette.action.hover,
  }
}));

export default withGuard(Fornecedores)
