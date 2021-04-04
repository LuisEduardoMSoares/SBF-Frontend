import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useModal from 'hooks/useModal';
import {AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      zIndex: 1001
    },
    dialogTitle: {
      padding: 0
    },
    dialogTitleBar: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(2)
    },
    dialogTitleText: {
      flexGrow: 1
    },
    dialogContent: {
      padding: 0,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
  })
);

export default function Modal() {
  const { modal, modalTitle, modalContent, toggleModal } = useModal();

  const classes = useStyles()

  const handleClose = () => {
    toggleModal({})
  };

  return ( modal && 
    <div>
      <Dialog
        open={modal}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        className={classes.dialog}
      >
        <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle}>
          <AppBar position="static">
            <Toolbar className={classes.dialogTitleBar}>
              <Typography variant="h6" className={classes.dialogTitleText}>
                { modalTitle ? modalTitle : null }
              </Typography>
              <IconButton color="inherit" onClick={handleClose}>
                <CloseIcon></CloseIcon>
              </IconButton>
            </Toolbar>
          </AppBar>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          { modalContent }
        </DialogContent>
      </Dialog>
    </div>
  );
}