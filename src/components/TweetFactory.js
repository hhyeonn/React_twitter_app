import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { collection, addDoc, query, getDocs, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "styles/tweetFactory.scss";


function TweetFactory({userObj}) {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");

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
    <form onSubmit={onSubmit} className="factoryForm">

      <div className="factoryInput__container">
        <input type="text" placeholder="What's on your mind"
          value={tweet} onChange={onChange} maxLength={120}
          className="factoryInput__input" />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>

      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </label>
      {/* accept: 사진만 추가, multiful 추가하면 이미지파일 여러개 업로드 가능 */}
      <input type="file" accept='image/*' onChange={onFileChange} 
        id="attach-file" style={{opacity: 0,display:'none'}}
      />

      {/* attachment 값이 있을경우 이미지 사진이 나옴 */}
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} style={{backgroundImage: attachment,}} />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>
        </div>
      )}
    </form>
  )
}

export default TweetFactory