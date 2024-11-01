import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "../components/Tweet";
import { Unsubscribe } from "firebase/auth";
import { ITweet, tweetsAtom } from "../recoil/tweet-atom";
import { useRecoilState } from "recoil";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
`;

function Timeline() {
  const [tweets, setTweets] = useRecoilState<ITweet[]>(tweetsAtom);

  /*
  // getDocs : 문서들 읽어오기
  const fetchTweets = async () => {
    const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { username, tweet, photo, createdAt, userId } = doc.data();
      return { username, tweet, photo, createdAt, id: doc.id, userId };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);
  */

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    // 실시간으로 문서들 불러오기
    const fetchTweets = async () => {
      const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(25));

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { username, tweet, photo, createdAt, userId } = doc.data();
          return { username, tweet, photo, createdAt, id: doc.id, userId };
        });

        setTweets(tweets);
      });
    };
    fetchTweets();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweetData) => (
        <Tweet key={tweetData.id} {...tweetData} />
      ))}
    </Wrapper>
  );
}

export default Timeline;
