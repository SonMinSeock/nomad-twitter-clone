import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "../components/Tweet";

export interface ITweet {
  username: string;
  tweet: string;
  userId: string;
  photo?: string;
  createdAt: number;
  id: string;
}

const Wrapper = styled.div``;

function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

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

  return (
    <Wrapper>
      {tweets.map((tweetData) => (
        <Tweet key={tweetData.id} {...tweetData} />
      ))}
    </Wrapper>
  );
}

export default Timeline;
