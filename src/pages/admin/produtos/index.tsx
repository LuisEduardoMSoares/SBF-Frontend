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

const ProductList = dynamic(() => import("components/produtos/Lista"));

const ProductForm = dynamic(() => import("components/produtos/Cadastro"));

function Produtos() {
  const { toggleModal } = useModal();
  const [ productList, setProductList ] = useState([] as Product[]);

  useEffect(() => {
    productService.list().then((response: Product[]) => {
      setProductList(response);
    });
  }, []);

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

  function handleProductDelete(product: Product) {
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
      />

      <Box my={4}>
        <ProductList
          list={productList}
          productChange={handleProductChange}
          productMove={handleProductMove}
          productDelete={handleProductDelete}
        ></ProductList>
      </Box>
    </>
  );
}

export default withGuard(Produtos);
