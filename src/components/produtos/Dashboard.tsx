import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  DataGrid,
  GridCellClassParams,
  GridCellParams,
  GridColDef,
  GridRowsProp,
} from "@material-ui/data-grid";

import ContextMenu, { ContextMenuOption } from "components/contextMenu";

import useModal from "hooks/useModal";
import { makeStyles, Typography } from "@material-ui/core";
import productService from "services/productService";

const TransactionForm = dynamic(
  () => import("components/movimentacoes/Cadastro")
);

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: 30,
  },
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

export default function Dashboard() {
  const classes = useStyles();

  function defineCellClass(params: GridCellClassParams) {
    return params.rowIndex % 2 === 0 ? classes.rowodd : classes.roweven;
  }

  const productColumns: GridColDef[] = [
    {
      field: "productName",
      headerName: "Nome",
      flex: 2,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "size",
      headerName: "Tamanho",
      flex: 1,
      headerClassName: classes.head,
      cellClassName: defineCellClass,
    },
    {
      field: "inventory",
      headerName: "Quantidade",
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
            resourceId={params.getValue("productId") as Number}
            menuOptions={params.value as ContextMenuOption[]}
          />
        );
      },
    },
  ];

  const { toggleModal } = useModal();
  const [productRows, setProductRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function handleProductTransactionStart(productId: Number) {
    toggleModal({
      title: "Movimentação",
      content: <TransactionForm />,
      params: { productId, afterTransactionSave: fetchProductList },
    });
  }

  useEffect(() => {
    fetchProductList();
  }, []);

  async function fetchProductList() {
    setLoading(true);
    await productService
      .list()
      .then((response) => {
        setLoading(false);
        setProductRows(
          response
            .filter((product) => product.inventory <= 15)
            .map((product) => {
              const { id, name: productName, size, inventory } = product;
              let actions: ContextMenuOption[] = [
                {
                  title: "Registrar Movimentação",
                  action: handleProductTransactionStart,
                },
              ];
              return {
                id,
                productId: id,
                productName,
                size,
                inventory,
                actions,
              };
            })
        );
      })
      .catch(console.error);
  }

  return (
    <>
      <Typography
        variant="h5"
        component="h1"
        color="primary"
        align="center"
        className={classes.title}
      >
        &nbsp; Produtos com baixo volume em estoque
      </Typography>

      <DataGrid
        autoHeight={true}
        rows={productRows}
        columns={productColumns}
        loading={loading}
        disableColumnMenu={true}
        hideFooter={true}
      />
    </>
  );
}
