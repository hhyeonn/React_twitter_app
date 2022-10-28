import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "styles/tweet.scss";


function Tweet({tweetObj,isOwner}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [nowDate, setNowDate] = useState(tweetObj.createAt);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?"); //팝업창(확인, 취소) 뜨는것
    if(ok){
      // console.log(tweetObj.id); //문서id
      // const data = await db.doc(`tweets/${tweetObj.id}`);
      const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`)); //문자열 대신 변수값 넣을때 `` 사용
      // console.log(data);
      if(tweetObj.attachmentUrl !== ""){
        const deleteRef = ref(storage, tweetObj.attachmentUrl);
        await deleteObject(deleteRef);
      }
    }
  }

  const toggleEditing = () => {
    setEditing((prev) => !prev); //false에서 true로 바뀜
  }

  const onChange = e => {
    const {target:{value}} = e;
    setNewTweet(value);
    //이벤트로 바뀐 텍스트값을 setNewTweet으로 바꿈
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(tweetObj.id, newTweet);
    const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`);
    await updateDoc(newTweetRef, {
      text: newTweet,
      createAt: Date.now()
    });
    setEditing(false);
  }

  /* 시간 */
  useEffect( () => {
    let timeStamp = tweetObj.createAt;
    const now = new Date(timeStamp);
    // console.log(now);
    setNowDate(now.toUTCString()); //.toUTCString() .toDateString()
  },[])

  return (
    <div className="tweet">
        {editing ? ( //수정화면
          <>
            <form onSubmit={onSubmit} className="container tweetEdit">
              <input onChange={onChange} value={newTweet} required className="formInput" style={{borderColor:'gray'}} />
              <input type="submit" value="Update Tweet" className="formBtn" />
            </form>
            <button onClick={toggleEditing} className="formBtn cancelBtn" style={{borderWidth:0}}>Cancle</button>
          </>
        ) : (
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && (
              <img src={tweetObj.attachmentUrl} with="50" height="50" />
            )}
            <span>{nowDate}</span>
            {isOwner && (
              <div className="tweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon="fa-solid fa-trash" />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon="fa-solid fa-pencil" />
                </span>
              </div>
            )}
          </>
        )}
    </div>
  )
}

export default Tweet