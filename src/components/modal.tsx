import React from "react";
import {
  AppBar,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import useModal from "hooks/useModal";
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      zIndex: 1001,
    },
    dialogTitle: {
      padding: 0,
    },
    dialogTitleBar: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(2),
    },
    dialogTitleText: {
      flexGrow: 1,
    },
    dialogContent: {
      padding: 0,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  })
);

export default function Modal() {
  const { isModalOpen, modalTitle, modalContent, toggleModal } = useModal();

  const classes = useStyles();

  const handleClose = (_event: any, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return ;
    }
    toggleModal({})
  };

  return (
    <>
    { isModalOpen && (
      <div>
        <Dialog
          open={isModalOpen}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          className={classes.dialog}
        >
          { modalTitle && (
            <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle}>
              <AppBar position="static">
                <Toolbar className={classes.dialogTitleBar}>
                  <Typography variant="h6" className={classes.dialogTitleText}>
                    {modalTitle ? modalTitle : null}
                  </Typography>
                  <IconButton color="inherit" onClick={() => {toggleModal({})}}>
                    <CloseIcon></CloseIcon>
                  </IconButton>
                </Toolbar>
              </AppBar>
            </DialogTitle>
          )}
          <DialogContent className={classes.dialogContent}>
            {modalContent}
          </DialogContent>
        </Dialog>
      </div>
    )}
    </>
  )
}
