import Navigation from 'components/Navigation';
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profiles from 'routes/Profiles';
// 절대경로jsconfig.json 때문에 ./ 지움, 안지워도 됨

function AppRouter({isLoggedIn, userObj}) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        {isLoggedIn && <Navigation userObj={userObj} />}
        {/* 앞에있는 값(isLoggedIn)이 true면 로그인home false면 로그아웃auth */}
        <Routes>
            {isLoggedIn ? (
            <>
              <Route path='/' element={<Home userObj={userObj} />} />
              <Route path='/profile' element={<Profiles userObj={userObj} />} />
            </>
            ) : (
            <Route path='/' element={<Auth />} />
            )}
            <Route />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter