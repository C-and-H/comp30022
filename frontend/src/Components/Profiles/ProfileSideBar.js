import React from "react";
import '../../App.css'

import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
class ProfileSideBar extends React.Component{
  render (){
    return(
    <center> 
      <div className="profile-side-bar">
      <ProSidebar className="profile-side-bar">
        <Menu iconShape="square">
          <MenuItem >Profile
            <Link to="/profile" />
          </MenuItem>
          <MenuItem >Change Password
            <Link to="/profile/change-password" />
          </MenuItem>
          <MenuItem >Change Email
            <Link to="/profile/change-email" />
          </MenuItem>
        </Menu>
      </ProSidebar>
      </div>
    </center>
    );
  }
}

export default ProfileSideBar;
