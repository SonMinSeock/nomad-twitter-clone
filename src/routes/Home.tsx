import styled from "styled-components";
import PostTweetForm from "../components/PostTweetForm";
import Timeline from "./Timeline";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { editTweetAtom } from "../recoil/tweet-atom";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

function Home() {
  const [editTweet, setEditTweet] = useRecoilState(editTweetAtom);

  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}

export default Home;
