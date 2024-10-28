import { atom, selector } from "recoil";

export interface ITweet {
  username: string;
  tweet: string;
  userId: string;
  photo?: string;
  createdAt: number;
  id: string;
}

export const tweetsAtom = atom<ITweet[]>({
  key: "tweet",
  default: [],
});

export const editTweetAtom = atom<ITweet | null>({
  key: "editTweet",
  default: null,
});
