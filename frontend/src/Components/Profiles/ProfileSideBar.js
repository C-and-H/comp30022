import React from "react";
import '../../App.css'

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
class ProfileSideBar extends React.Component{
  render (){
    return(
    <center> 
      <div className="profile-side-bar">
        
      <ProSidebar className="profile-side-bar">
        <SidebarHeader>
        <strong>&nbsp;&nbsp;&nbsp;&nbsp;Account settings</strong>
        </SidebarHeader>
        <Menu iconShape="circle">
          <MenuItem >Profile
            <Link to="/setting" />
          </MenuItem>
          <MenuItem >Change Password
            <Link to="/setting/change-password" />
          </MenuItem>
          <MenuItem >Change Email
            <Link to="/setting/change-email" />
          </MenuItem>
        </Menu>
      </ProSidebar>
      </div>
    </center>

    );
  }
}

export default ProfileSideBar;
