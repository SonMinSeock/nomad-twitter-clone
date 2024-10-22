import { auth } from "../firebase";

function Home() {
  const logOut = async () => {
    await auth.signOut();
  };
  return (
    <>
      <h1>
        <button onClick={logOut}>로그아웃</button>
      </h1>
    </>
  );
}

export default Home;
