import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { editTweetAtom, ITweet } from "../recoil/tweet-atom";
import { useRecoilState } from "recoil";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 0;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const BtnController = styled.div`
  display: flex;
  gap: 10px;
`;

function Tweet({ username, photo, tweet, userId, id, createdAt }: ITweet) {
  const [editTweet, setEditTweet] = useRecoilState(editTweetAtom);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("해당 게시글 삭제 하시겠습니까?");

    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${userId}/${id}`);
        await deleteObject(photoRef);
        if (!editTweet) {
          setEditTweet(null);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const onEdit = () => {
    const targetEditTweet = { username, tweet, userId, id, createdAt };
    if (photo) {
      setEditTweet({ ...targetEditTweet, photo });
    } else {
      setEditTweet(targetEditTweet);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <BtnController>
          {user?.uid === userId ? <DeleteBtn onClick={onEdit}>편집</DeleteBtn> : null}
          {user?.uid === userId ? <DeleteBtn onClick={onDelete}>삭제</DeleteBtn> : null}
        </BtnController>
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}

export default Tweet;
