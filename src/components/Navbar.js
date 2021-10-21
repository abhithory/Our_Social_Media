import React, { useContext } from 'react';
import {
  Link
} from "react-router-dom";
import Identicon from 'identicon.js';
import { OSMcontext } from '../OSMcontext';




export default function Navbar(props) {

  const { userProfile } = props;
  const { account,isAccountCreated} = useContext(OSMcontext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transprent ">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img className="img-fluid mr-2" src="img/logo.png" alt="" style={{height:30}}/>
          <b className="text-warning">Our Social Media (OSM)</b></Link>

        <div className="ms-auto d-flex align-items-center text-light" >
          {isAccountCreated
          ?
          <>
          <Link to='/createPost' className="btn btn-outline-light">
            Create Post <i className="bi bi-plus-circle-dotted" ></i>
          </Link>
          <ul className="navbar-nav mb-2 mb-lg-0">

            <li className="nav-item dropdown dropstart">
              <Link className="nav-link" id="navbarDropdown" role="button" data-bs-toggle="dropdown" >
                {account &&
                  <img
                    className='ml-2'
                    width='30'
                    style={{ borderRadius: 20 }}
                    height='30'
                    alt="logo"
                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                  />
                }
              </Link>
              <ul className="dropdown-menu " >
                <li> <Link className="dropdown-item text-primary" to={`/profile/${account}`}>
                  <h4 >Profile</h4>
                </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li> <p className="dropdown-item text-sm" >Name-{userProfile && userProfile.name}</p>
                </li>
                <li> <p className="dropdown-item" >UserID-{userProfile && userProfile.userid}</p>
                </li>
              </ul>
            </li>
          </ul>
          </>
        :
          <Link to='/createProfile' className="btn btn-outline-warning">
            Create Profile <i className="bi bi-emoji-sunglasses" ></i>
          </Link>
        }

          

        </div>


      </div>
    </nav>
  )
}
