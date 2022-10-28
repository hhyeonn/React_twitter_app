import React, { useEffect, useState } from 'react';
import AppRouter from 'Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from "firebase/auth";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
library.add(fas, faTwitter, faGoogle, faGithub)

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); //로그인한 사용자 정보

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log(user);
      if (user) {
        // User is signed in 로그인 정보가 있으면 true
        setIsLoggedIn(user);
        setUserObj(user);
        
      } else { //사용자 정보가 없는 경우
        // User is signed out 로그인 정보가 없으면 로그아웃(false)
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[])
  // useEffect(() => {} 실행부분 [] 업데이트
  // console.log(authService.currentUser); //currentUser 현재 로그인한 사람 확인 함수

  return (
    <>
    {init ? <AppRouter isLoggedIn = {Boolean(userObj)} userObj={userObj} /> : "initializing..." }
    {/* <footer>&copy; {new Date().getFullYear()} Twitter app</footer> */}
    </>
  );
}

export default App;
