import {useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  /*When your React app loads (mounts), the useEffect runs once ([] dependency means run on first render).
    It sends a GET request to your backend's /profile endpoint.
    Because of credentials: 'include', the browser includes cookies (like your JWT token stored earlier) with the request.
    Your backend reads that cookie, verifies the JWT, and if valid, sends back user info (like username, id).
    Your frontend can then know the user is logged in based on that response.*/
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create"> Create new Post</Link>
            <a onClick = {logout}>LogOut</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}


//check about conditional ifs in react