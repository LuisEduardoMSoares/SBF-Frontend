import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Button, TextField } from "@material-ui/core";
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
} from "@material-ui/data-grid";

const productColumns: GridColDef[] = [
  { field: "productName", headerName: "Nome", flex: 1 },
  { field: "size", headerName: "Tamanho", width: 120 },
  { field: "inventory", headerName: "Quantidade", width: 120 },
  { field: "weight", headerName: "Peso", width: 120 },
  {
    field: "updatedOn",
    type: "dateTime",
    headerName: "Últ. Atualização",
    width: 220,
  },
  {
    field: "actions",
    headerName: " ",
    renderCell: (params: GridCellParams) => (
      <>
        <p>actions</p>
      </>
    ),
  },
];

const ProductForm = dynamic(() => import("components/produtos/Cadastro"));

function Produtos() {
  const { toggleModal } = useModal();
  const [productRows, setProductRows] = useState<GridRowsProp>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetchProductList();
  }, [page, pageSize, name]);

  function fetchProductList() {
    setLoading(true);
    productService.fetch({ page, pageSize, name })
      .then((response) => {
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
            let actions = {};
            return {
              id,
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

  function handleProductChange(product: Product | null) {
    toggleModal({
      title: "Cadastro de Produto",
      content: <ProductForm />,
      route: !product ? "add" : `update/${product?.id}`,
      params: { productId: product?.id },
    });
  }

  function handleProductMove(product: Product) {
    console.log("productMoveCalled", product);
  }

  async function handleProductDelete(product: Product) {
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
          .then((_response) => {
            Swal.fire({
              title: "Sucesso!",
              html: `<b>${product.name} (${product.size})</b> excluído com sucesso!`,
              icon: "success",
            });
          })
          .catch(console.error);
      }
    });
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
            rowsPerPageOptions={[3, 5, 10, 20, 50, 100]}
          />
      </Box>
    </>
  );
}

export default withGuard(Produtos);
