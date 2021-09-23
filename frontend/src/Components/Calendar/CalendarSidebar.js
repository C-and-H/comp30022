import React from "react";
import '../../App.css'

import { ProSidebar, Menu, MenuItem, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
class CalendarSidebar extends React.Component{
  render (){
    return(
    <center> 
      <div className="profile-side-bar">
        
      <ProSidebar className="profile-side-bar">
        <SidebarHeader>
        <strong>&nbsp;&nbsp;&nbsp;&nbsp;Calendar</strong>
        </SidebarHeader>
        <Menu iconShape="circle">
          <MenuItem >Schedules
            <Link to="/calendar" />
          </MenuItem>
          <MenuItem >Set Event
            <Link to="/setEvent" />
          </MenuItem>
          {/* <MenuItem >Change Email
            <Link to="/setting/change-email" />
          </MenuItem> */}
        </Menu>
      </ProSidebar>
      </div>
    </center>

    );
  }
}

export default CalendarSidebar;
