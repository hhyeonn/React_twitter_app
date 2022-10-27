/* 프로필 페이지 */
import React, { useEffect, useState } from 'react';
import { authService, db } from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { updateProfile } from "firebase/auth";

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); //홈으로 이동 즉, 리다이렉트 기능이다.
  }

  /* 내가 작성한 글만 가져오는 기능 */
  const getMyTweets = async () => {
    const q = query(collection(db, "tweets"),
                    where("createId", "==", userObj.uid),
                    orderBy("createAt", "asc")) //시간순으로 정렬
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id});
    });
    setTweets(newArray);
  }

  useEffect(() => { //로그인된 사용자의 tweet만 가져옴
    getMyTweets();
  },[]);

  const onChange = e => {
    const {target: {value}} = e;
    setNewDisplayName(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();   
    if(userObj.displayName != newDisplayName){
      await updateProfile(userObj, {displayName: newDisplayName, photoURL: ""});
    }
  }

  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='Display name' 
        onChange={onChange} value={newDisplayName}
      />
      <input type="submit" value="Update Profile" />
    </form>
    <button onClick={onLogOutClick}>Log Out</button>
    <div>
      {tweets.map(tweet => (
        <Tweet key={tweet.id}
               tweetObj={tweet}
               isOwner={tweet.createId === userObj.uid}
        />
      ))}
    </div>
    </>
  )
}

export default Profiles