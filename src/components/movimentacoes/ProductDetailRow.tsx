import { makeStyles } from '@material-ui/core';
import { DataGrid, GridCellClassParams, GridColDef } from '@material-ui/data-grid';
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    border: 'none',
    borderRadius: 0,
    "& .MuiDataGrid-footer": {
      backgroundColor: "white"
    }
  },
  head: {
    backgroundColor: '#F2F0F9',
    color: theme.palette.primary.dark,
    textTransform: "uppercase",
    fontSize: 12,
  },
  rowodd: {
    backgroundColor: "white",
  },
  roweven: {
    backgroundColor: "#F5F5F5",
  }
}));


export default function ProductDetailRow({ row }: any) {
  const classes = useStyles();

  function defineCellClass(params: GridCellClassParams) {
    return params.rowIndex % 2 === 0 ? classes.rowodd : classes.roweven
  }

  const [loading, _setLoading] = useState<boolean>(false)

  const productColumns: GridColDef[] = [
    { field: "id", headerName: "ID do Produto", width: 220, headerClassName: classes.head, cellClassName: defineCellClass },
    { field: "quantity", headerName: "Quantidade", flex: 1, headerClassName: classes.head, cellClassName: defineCellClass },
  ]
  if (row.products) {
    return (
      <DataGrid
        key={row.products}
        autoHeight={true}
        rows={row.products}
        columns={productColumns}
        loading={loading}
        disableColumnMenu={true}
        className={classes.root}
      />
    );
  } else return null;
};