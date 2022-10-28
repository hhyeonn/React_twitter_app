/* 프로필 페이지 */
import React, { useEffect ,useState} from 'react';
import {authService, db ,storage} from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc , query , where, orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import {  updateProfile } from "firebase/auth";
import { async } from '@firebase/util';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import "styles/profiles.scss";
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment ] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); //홈으로 이동 즉, 리다이렉트 기능이다.
  }

  /* 내가 작성한 글만 가져오는 기능 */
  //asc:올림차순,시간순으로 정렬,desc:내림차순
  const getMyTweets = async () => {
    const q = query(collection(db, "tweets"),
                    where("createId", "==", userObj.uid),
                    orderBy("createAt", "desc"))
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      // querySnapshot: firebase에서 컬렉션을 마치 사진찍듯이 찍어서 보여준다.
      newArray.push({...doc.data(), id:doc.id}); //id추가
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
    
    let attachmentUrl ="";
    if(attachment !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment, 'data_url');
      //console.log(response);
      attachmentUrl =  await getDownloadURL(ref(storage, response.ref));
      console.log(attachmentUrl);
      setNewPhotoURL(attachmentUrl);
    }

    if(userObj.displayName != newDisplayName || userObj.photoURL != newPhotoURL){
      await updateProfile(userObj, 
        {displayName: newDisplayName, photoURL: newPhotoURL});
    }
    setAttachment("");
  }

  const onFileChange = e => {
    // console.log(e.target.files);
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataUrl(theFile);
  }

  const onClearAttachment = () => setAttachment("");

  // class 넣으려면 div넣어야 됨
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input type="text" placeholder='Display name' 
          onChange={onChange} value={newDisplayName}
          autoFocus className="formInput"
        />

        <label for="attach-file" className="profileForm__label">
          <span>Profile Image </span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input type="file" accept='image/*' onChange={onFileChange} id="attach-file" style={{opacity: 0,display:'none'}}/>

        <input type="submit" value="Update Profile" 
          className="formBtn" style={{marginTop: 10,}}
        />
  
        {attachment &&
          <div>
            <img src={attachment} width="50" height='50' />
            <button onClick={onClearAttachment}>Clear</button>
          </div>  
        }
      </form>

      <button onClick={onLogOutClick} className="formBtn cancelBtn">Log Out</button>
      <div className="tweet_content">
        {tweets.map(tweet => (
          <Tweet key={tweet.id}
                 tweetObj={tweet}
                 isOwner={tweet.createId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
}

export default Profiles