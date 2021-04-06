import React from 'react';
import useMessages from 'hooks/useMessages';

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width:'100%',
      position: 'absolute',
      bottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
  }),
);

export default function Messages() {
  const { isOpen, message, hideMessage } = useMessages();
  const classes = useStyles();

  if(message?.timeout) {
    setTimeout(hideMessage, message.timeout);
  }
  
  return (
    <div className={classes.container}>
      {isOpen && (
        <Alert 
          action={
            <Button color="inherit" size="small" onClick={hideMessage}>
              close
            </Button>
          }
          variant="filled" 
          severity={message?.type}>
          {message?.text}
        </Alert>
      )}
    </div>
  );
}