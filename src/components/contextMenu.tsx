import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export interface ContextMenuOption {
  title: string;
  action?: Function | any;
}

export default function contextMenu({
  resourceId, 
  menuOptions
}: {
  resourceId: Number,
  menuOptions: ContextMenuOption[]
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls={`long-menu-${resourceId}`}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`long-menu-${resourceId}`}
        anchorEl={anchorEl}         
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
            border: 'solid 1px rgba(0,0,0,0.15)'
          },
          elevation: 1
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option.title} onClick={() => {
            option.action(resourceId)
            handleClose()
          }}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}