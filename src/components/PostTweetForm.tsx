import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRecoilState } from "recoil";
import { editTweetAtom } from "../recoil/tweet-atom";
import { useLocation } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttatchFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttatchFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const CancleBtn = styled.button`
  background-color: #d3d3d3;
  color: #000000;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

function PostTweetForm() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editTweet, setEditTweet] = useRecoilState(editTweetAtom);
  const [tweet, setTweet] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(event.target.value);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    // 1mb -> 1 * 1024 * 1024 = 1048576
    if (files && files.length === 1) {
      if (files[0].size < 1 * 1024 * 1024) {
        setFile(files[0]);
      } else {
        alert("이미지 크기가 큽니다(1mb 이내 업로드 가능)");
      }
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    if (!editTweet) {
      try {
        setIsLoading(true);
        const doc = await addDoc(collection(db, "tweets"), {
          tweet,
          createdAt: Date.now(),
          username: user.displayName || "익명",
          userId: user.uid,
        });

        if (file) {
          const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
          const result = await uploadBytes(locationRef, file);
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc, {
            photo: url,
          });
        }

        setTweet("");
        setFile(null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const docRef = doc(db, "tweets", editTweet.id);
        if (tweet !== editTweet.tweet) {
          await updateDoc(docRef, {
            tweet,
          });
        }

        if (file) {
          const locationRef = ref(storage, `tweets/${user.uid}/${editTweet.id}`);
          if (!editTweet.photo) {
            const result = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(result.ref);
            await updateDoc(docRef, {
              photo: url,
            });
          } else {
            await deleteObject(locationRef);
            const result = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(result.ref);
            await updateDoc(docRef, {
              photo: url,
            });
          }
        }

        setTweet("");
        setFile(null);
        location.state = null;
        setEditTweet(null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onEditCancle = () => {
    setEditTweet(null);
    setTweet("");
    location.state = null;
    if (file) {
      setFile(null);
    }
  };

  useEffect(() => {
    if (location.state?.editTweet) {
      setEditTweet(location.state.editTweet);
      setTweet(location.state.editTweet.tweet);
    } else if (editTweet) {
      setTweet(editTweet.tweet);
    }
  }, [location.state, editTweet]);

  return (
    <Form onSubmit={onSubmit}>
      {!editTweet ? (
        <>
          <TextArea
            value={tweet}
            required
            onChange={onChange}
            placeholder="무엇을 작성하고 싶나요?"
            rows={5}
            maxLength={180}
          />
          <AttatchFileButton htmlFor="file">{file ? "이미지 추가 성공 ✅" : "이미지 추가"}</AttatchFileButton>
          <AttatchFileInput type="file" id="file" accept="image/*" onChange={onFileChange} />
          <SubmitBtn type="submit" value={isLoading ? "게시글 게시중..." : "게시글 작성"} />
        </>
      ) : (
        <>
          <TextArea
            value={tweet}
            required
            onChange={onChange}
            placeholder="무엇을 작성하고 싶나요?"
            rows={5}
            maxLength={180}
          />
          <AttatchFileButton htmlFor="file">{file ? "이미지 수정 성공 ✅" : "이미지 수정"}</AttatchFileButton>
          <AttatchFileInput type="file" id="file" accept="image/*" onChange={onFileChange} />
          <SubmitBtn type="submit" value={isLoading ? "게시글 게시중..." : "게시글 수정"} />
          <CancleBtn onClick={onEditCancle}>수정 취소</CancleBtn>
        </>
      )}
    </Form>
  );
}

export default PostTweetForm;
