import React, { useState } from 'react';
import { db, storage } from 'fbase';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';
import { ref, deleteObject } from "firebase/storage";

function Tweet({tweetObj,isOwner}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

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

  return (
    <div>
        {editing ? ( //수정화면
          <>
            <form onSubmit={onSubmit}>
              <input onChange={onChange} value={newTweet} required />
              <input type="submit" value="update Tweet" />
            </form>
            <button onClick={toggleEditing}>Cancle</button>
          </>
        ) : (
          <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} with="50" height="50" />
          )}
          {isOwner && (
            <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
          </>
        )}
    </div>
  )
}

export default Tweet