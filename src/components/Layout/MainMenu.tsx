import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faHome,
  faSignOutAlt,
  faTruckMoving,
  faTshirt,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import Link from "components/Link";
import { useRouter } from "next/router";
import authService from "services/authService";
import Cookie from "js-cookie";

const isAdmin = () => Cookie.get("isAdmin") && Cookie.get("isAdmin") === "true"

const menuList = [
  {
    title: "Início",
    icon: faHome,
    link: "/admin",
    needsAdminRole: false
  },
  {
    title: "Movimentações",
    icon: faBox,
    link: "/admin/movimentacoes",
    needsAdminRole: false
  },
  {
    title: "Produtos",
    icon: faTshirt,
    link: "/admin/produtos",
    needsAdminRole: false
  },
  {
    title: "Fornecedores",
    icon: faTruckMoving,
    link: "/admin/fornecedores",
    needsAdminRole: false
  },
  {
    title: "Usuários",
    icon: faUsersCog,
    link: "/admin/usuarios",
    needsAdminRole: true
  },
];

export default function MainMenu() {
  const router = useRouter();

  async function handleSignOut() {
    await authService.signOut();
    router.replace("/");
  }

  return (
    <>
      <List>
        {menuList.map((menuItem, index) => {
          if(!menuItem.needsAdminRole || (menuItem.needsAdminRole && isAdmin())) {
            return (
              <Link href={menuItem.link} key={`${menuItem.title}-${index}`}>
                <ListItem button>
                  <ListItemIcon>
                    <FontAwesomeIcon
                      size="lg"
                      icon={menuItem.icon}
                    ></FontAwesomeIcon>
                  </ListItemIcon>
                  <ListItemText primary={menuItem.title} />
                </ListItem>
              </Link>
            )
          }
        })}
        <Link href="#" onClick={handleSignOut}>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon size="lg" icon={faSignOutAlt}></FontAwesomeIcon>
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </Link>
      </List>
    </>
  );
}
