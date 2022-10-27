import React, { useState } from 'react';
import { authService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { async } from '@firebase/util';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = e => {              //onChage로 이벤트 발생
    // console.log(e.target.name);
    const {target: {name, value}} = e; //구조분해할당으로 name, value값 확인
    if(name === "email") {             //input값이 name이 맞냐
        setEmail(value);               //맞으면 (set?)Password로 저장하고 value로 보여라
    }else if(name === "password"){
        setPassword(value);
    }
  }

  const onSubmit = async (e) => { //async await 로딩으로 기다렸다가 실행해라
    e.preventDefault();
    try {
        let data;
        if(newAccount){
            //create newAccount 신규 사용자 가입
            data = await createUserWithEmailAndPassword(authService, email, password)
        }else{
             //log in 기존 user 로그인
             data = await signInWithEmailAndPassword(authService, email, password)
        }
        // console.log(data); //회원가입을 마친 사용자 정보
    } catch (error) {
        // console.log(error);
        setError(error.message);
    }
  }

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = (e) => {
    // console.log(e.target.name);
    const {target: {name}} = e;
    let provider  //button 함수가 똑같아서 name으로 구분
    if(name === "google"){
      provider = new GoogleAuthProvider();
    }else if(name === "github"){
      provider = new GithubAuthProvider();
    }
    const data = signInWithPopup(authService, provider);
    // console.log(data);
  }

  return (
    <div>
        <form onSubmit={onSubmit}>
            <input type="email" placeholder="Email" required
              name='email' value={email} onChange={onChange} />
            <input type="password" placeholder="Password" required
              name='password' value={password} onChange={onChange} />
            <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
            {error}
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        <div>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
            <button onClick={onSocialClick} name="github">Continue with Github</button>
        </div>
    </div>
  )
}

export default Auth