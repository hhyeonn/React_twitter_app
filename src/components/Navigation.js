import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navigation({userObj}) {
  return (
    <nav>
      <ul style={{display: "flex", justifyContent: "center", marginTop: 50}}>
        <li><Link to={'/'}>
          <FontAwesomeIcon icon="fa-brands fa-twitter" 
          color={"#04AAFF"} size="2x" /></Link>
        </li>
        <li>
          <Link to={'/profile'} 
            style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 10, fontSize: 12}}>
          {/* <FontAwesomeIcon icon="fa-solid fa-user" color={"#04AAFF"} size="2x" /> 아이콘 */}
            <span style={{marginTop: 10}}>
            {userObj.displayName ? `${userObj.displayName}의 profile` : "Profile"}
            {userObj.photoURL && (<img src={userObj.photoURL} width="100" height="100" />)}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation