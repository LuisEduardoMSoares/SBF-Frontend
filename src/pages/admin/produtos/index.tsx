import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { faTshirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withGuard from "utils/withGuard";
import Product from "models/product";
import productService from "services/productService";
import useModal from "hooks/useModal";
import Swal from "sweetalert2";

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
  GridCellClassParams,
} from "@material-ui/data-grid";
import ContextMenu, { ContextMenuOption } from "components/contextMenu";

const ProductForm = dynamic(() => import("components/produtos/Cadastro"));

function Produtos() {
  const classes = useStyles();

  function defineCellClass(params: GridCellClassParams) {
    return params.rowIndex % 2 === 0 ? classes.rowodd : classes.roweven
  }
  
  const productColumns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 80, headerClassName: classes.head, cellClassName: defineCellClass},
    { field: "productName", headerName: "Nome", flex: 2, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "size", headerName: "Tamanho", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "inventory", headerName: "Quantidade", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "weight", headerName: "Peso", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
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
            productId={params.getValue('productId') as Number} 
            menuOptions={params.value as ContextMenuOption[]} 
          />
        )
      }
    },
  ];

  const { toggleModal } = useModal();
  const [productRows, setProductRows] = useState<GridRowsProp>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  var productList: Product[]

  useEffect(() => {
    fetchProductList();
  }, [page, pageSize, name]);

  async function fetchProductList() {
    setLoading(true);
    await productService.fetch({ page, pageSize, name })
      .then((response) => {
        productList = response.records;
        setLoading(false);
        setRowCount(response.pagination_metadata.total_count);
        setProductRows(
          response.records.map((product) => {
            const { id, name: productName, size, inventory, weight } = product;
            let updatedOn = product.metadatetime
              ? new Date(
                  product.metadatetime.updated_on
                    ? product.metadatetime.updated_on
                    : product.metadatetime.created_on
                )
              : null;
            let actions:ContextMenuOption[] = [
              {
                title: 'Alterar',
                action: handleProductChange
              },
              {  
                title: 'Entrada/Saída',
                action: handleProductMove
              },
              {
                title: 'Excluir',
                action: handleProductDelete
              }
            ]
            return {
              id,
              productId: id,
              productName,
              size,
              inventory,
              weight,
              updatedOn,
              actions,
            };
          })
        );
    }).catch(console.error)
  }

  function handleProductChange(productId: Number | null) {
    toggleModal({
      title: "Cadastro de Produto",
      content: <ProductForm />,
      route: !productId ? "add" : `update/${productId}`,
      params: { productId, afterProductSave: fetchProductList},
    });
  }

  function handleProductMove(productId: Number) {
    console.log("productMoveCalled", productId);
  }

  async function handleProductDelete(productId: Number) {
    const product = productList.find(item => item.id === productId );

    if(product) {
      await Swal.fire({
        showCancelButton: true,
        title: "Excluir Cadastro?",
        html: `Tem certeza de que deseja excluir <b>${product.name} (${product.size})</b>? Não será possível desfazer essa ação!</b>`,
        icon: "question",
        cancelButtonText: "Não",
        confirmButtonText: "Sim, excluir cadastro",
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#556cd6",
      }).then((result: any) => {
        if (result.isConfirmed) {
          productService
            .delete(product)
            .then((deletedProduct: Product) => {
              fetchProductList()
              Swal.fire({
                title: "Sucesso!",
                html: `<b>${deletedProduct.name} (${deletedProduct.size})</b> excluído com sucesso!`,
                icon: "success",
              });
            })
            .catch(console.error);
        }
      });
    }
    console.log("productDeleteCalled", product);
  }

  return (
    <>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4" component="h1" color="primary">
          <FontAwesomeIcon size="lg" icon={faTshirt} />
          &nbsp; Produtos
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => handleProductChange(null)}
        >
          + Adicionar Produto
        </Button>
      </Box>

      <TextField
        id="filled-full-width"
        label="Pesquisar"
        placeholder="Pesquisar por Nome do Produto, Quantidade, Fornecedor, etc."
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
            rows={productRows}
            columns={productColumns}
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

export default withGuard(Produtos);
