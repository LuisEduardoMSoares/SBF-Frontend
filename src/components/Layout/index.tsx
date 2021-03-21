import React, { useState } from 'react';
import { Drawer, IconButton, Typography, Toolbar, AppBar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import MainMenu from './MainMenu';
import Container from '@material-ui/core/Container';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: 10000,
    },
    root: {
      display: 'flex',
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      flexShrink: 0,
      width: drawerWidth,
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
      position: 'fixed',
      zIndex: 9998
    },
    drawerOpen: {
      width: drawerWidth,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    drawerPaper: {
      width: drawerWidth
    },
    mainContent: {
      paddingLeft: theme.spacing(8),
      flexGrow: 1
    }
  })
);

export default function Layout({ children }: any) {

  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open?: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setDrawerOpen(open || !drawerOpen)
  };

  return (
    <div className={classes.root}>
      <main className={classes.mainContent}>
        <Toolbar />
        <Container maxWidth="xl">
          { children }
        </Container>
      </main>

      <Drawer
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        onMouseEnter={toggleDrawer(true)}
        onMouseLeave={toggleDrawer(false)}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <Toolbar />
        <MainMenu />
      </Drawer>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(false)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Gestão de Estoque - SBF Impacta
          </Typography>
        </Toolbar>
      </AppBar>

    </div>
  );
}