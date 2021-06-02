import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Button, debounce, makeStyles, TextField } from "@material-ui/core";
import { faUsersCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "models/user";
import userService from "services/userService";
import useModal from "hooks/useModal";

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
  GridCellClassParams,
} from "@material-ui/data-grid";
import ContextMenu, { ContextMenuOption } from "components/contextMenu";
import Swal from "sweetalert2";

import withAdminGuard from "utils/withAdminGuard";

const Cadastro = dynamic(() => import("components/usuarios/Cadastro"), {
  ssr: false,
});

var userList: User[] = [];

function Usuarios() {
  const classes = useStyles();

  const userColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 2,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "admin",
      headerName: "Tipo",
      flex: 0.75,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
      renderCell: (params: GridCellParams) => <>{params.value ? "Administrador" : "Funcionário"}</>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "updatedOn",
      type: "dateTime",
      headerName: "Últ. Atualização",
      flex: 1,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "actions",
      headerName: "Ações",
      headerClassName: classes.head,
      cellClassName: defineCellClass,
      renderCell: (params: GridCellParams) => {
        return (
          <ContextMenu
            resourceId={params.getValue("id") as number}
            menuOptions={params.value as ContextMenuOption[]}
          />
        );
      },
    },
  ];

  function defineCellClass(params: GridCellClassParams) {
    return params.rowIndex % 2 === 0 ? classes.rowodd : classes.roweven;
  }

  const { toggleModal } = useModal();
  const [userRows, setUserRows] = useState<GridRowsProp>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchUserList();
  }, []);

  async function fetchUserList() {
    setLoading(true);
    await userService
      .list()
      .then((response) => {
        userList = response;
        setLoading(false);
        setUserRows(response.map((user) => formatUserRow(user)));
      })
      .catch(console.error);
  }

  function formatUserRow(user: User) {
    const { id, admin, first_name, last_name, email } = user;
    let updatedOn = user.metadatetime
      ? new Date(
          user.metadatetime.updated_on
            ? user.metadatetime.updated_on
            : user.metadatetime.created_on
        )
      : null;
    let actions: ContextMenuOption[] = [
      {
        title: "Alterar",
        action: handleUserChange,
      },
      {
        title: "Excluir",
        action: handleUserDelete,
      },
    ];
    return {
      id,
      name: first_name + " " + last_name,
      admin,
      email,
      updatedOn,
      actions,
    };
  }

  const debouncedFilter = useCallback(
    debounce((filter:string) => {
      let filteredUsers = userList;

      if(filter.length > 0) {
        const regx = new RegExp(filter)
        filteredUsers = userList.filter(user => regx.test(user.first_name) || regx.test(user.last_name))
      }

      setUserRows(filteredUsers.map(user => formatUserRow(user)))
    }, 450),
    [] // will be created only once initially
  );

  useEffect(() => {
    debouncedFilter(filter)
    //setUserRows(userRows.filter(user => regx.test(user.name)))
  }, [filter])

  function handleUserChange(userId: number | null) {
    toggleModal({
      title: !userId ? "Cadastro de Usuário" : "Alteração de Usuário",
      content: <Cadastro />,
      params: { userId, afterUserSave: fetchUserList },
    });
  }

  async function handleUserDelete(userId: number) {
    const user = userList.find((item) => item.id === userId);

    if (user) {
      await Swal.fire({
        showCancelButton: true,
        title: "Excluir Cadastro?",
        html: `Tem certeza de que deseja excluir <b>${user.first_name}</b>? Não será possível desfazer essa ação!</b>`,
        icon: "question",
        cancelButtonText: "Não",
        confirmButtonText: "Sim, excluir cadastro",
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#556cd6",
      }).then((result: any) => {
        if (result.isConfirmed) {
          userService
            .delete(user)
            .then((deletedUser: User) => {
              fetchUserList();
              Swal.fire({
                title: "Sucesso!",
                html: `<b>${deletedUser.first_name}</b> excluído com sucesso!`,
                icon: "success",
              });
            })
            .catch(console.error);
        }
      });
    }
    console.log("userDeleteCalled", user);
  }

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faUsersCog} />
          &nbsp; Usuários
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => handleUserChange(null)}
        >
          + Adicionar Usuário
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Usuário."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        value={filter}
        onChange={(event: any) => {
          setFilter(event.target.value)
        }}
      />

      <Box my={4}>
        <DataGrid
          hideFooterSelectedRowCount={true}
          autoHeight={true}
          page={page}
          onPageChange={(params) => {
            setPage(params.page);
          }}
          onPageSizeChange={(params) => {
            setPage(0);
            setPageSize(params.pageSize);
          }}
          paginationMode="client"
          rows={userRows}
          columns={userColumns}
          pagination
          loading={loading}
          pageSize={pageSize}
          disableColumnMenu={true}
          rowsPerPageOptions={[3, 5, 10, 20, 50]}
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
  },
}));

export default withAdminGuard(Usuarios);
