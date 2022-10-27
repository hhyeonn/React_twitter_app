import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { collection, addDoc, query, getDocs, onSnapshot } from "firebase/firestore";
import Tweet from '../components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";

function Home({userObj}) {
  // console.log(userObj);
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  /*
  const getTweets = async () => {
    const q = query(collection(db, "tweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      // setTweets(prev => [doc.data(), ...prev]) //새 트윗을 가장 먼저 보여줌
      const tweetObject = {...doc.data(), id:doc.id } //id추가
      setTweets(prev => [tweetObject, ...prev]);
    });
  }
  */
  useEffect( () => { //실시간 데이터베이스 문서들 가져오기
    // getTweets();
    const q = query(collection(db, "tweets"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id});
      });
      // console.log(newArray);
      setTweets(newArray);
    });
  }, []);

  // console.log(tweets);

  const onChange = e => {
    // console.log(e.target.value);
    const {target: {value}} = e;
    setTweet(value);
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    let attachmentUrl="";
    if(attachment !== ""){ //사진이 업로드 된 경우에만
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment, 'data_url');
      // console.log(response);
      attachmentUrl = await getDownloadURL(ref(storage, response.ref))
    }

    await addDoc(collection(db, "tweets"), {
      text: tweet,
      createAt: Date.now(),
      createId: userObj.uid,
      attachmentUrl //키(속성)와 값(value)가 같아서 하나만 적음
    });
    setTweet("");
    setAttachment("");
  }

  const onFileChange = e => {
    // console.log(e.target.files);
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => setAttachment("");

  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="What's on your mind"
        value={tweet} onChange={onChange} maxLength={120} />
      <input type="file" accept='image/*' onChange={onFileChange} />
      {/* accept: 사진만 추가, multiful 추가하면 이미지파일 여러개 업로드 가능 */}
      <input type="submit" value="Tweet" />
      {/* attachment 값이 있을경우 이미지 사진이 나옴 */}
      {attachment && 
        <div>
          <img src={attachment} width="50" height="50" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      }
    </form>
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

export default Home 