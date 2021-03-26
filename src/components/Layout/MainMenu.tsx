import React from 'react'
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faHome, faSignOutAlt, faTruckMoving, faTshirt, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import Link from 'components/Link'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';

const menuList = [
  {
    title: 'Início',
    icon: faHome,
    link: '/admin'
  },
  {
    title: 'Estoque',
    icon: faBox,
    link: '/admin/estoque'
  },
  {
    title: 'Produtos',
    icon: faTshirt,
    link: '/admin/produtos'
  },
  {
    title: 'Fornecedores',
    icon: faTruckMoving,
    link: '/admin/fornecedores'
  },
  {
    title: 'Usuários',
    icon: faUsersCog,
    link: '/admin/usuarios'
  }
];

export default function MainMenu() {
  const router = useRouter();

  function handleSignOut() {
    Cookie.remove('token')
    router.replace('/')
  }

  return (
    <>
      <List>
          {menuList.map((menuItem, index) => (
            <Link href={menuItem.link} key={`${menuItem.title}-${index}`}>
            <ListItem button>
              <ListItemIcon><FontAwesomeIcon size="lg" icon={menuItem.icon}></FontAwesomeIcon></ListItemIcon>
              <ListItemText primary={menuItem.title} />
            </ListItem>
            </Link>
          ))}
          <Link href='' onClick={handleSignOut}>
            <ListItem button>
              <ListItemIcon><FontAwesomeIcon size="lg" icon={faSignOutAlt}></FontAwesomeIcon></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </Link>
        </List>
    </>
  )
}