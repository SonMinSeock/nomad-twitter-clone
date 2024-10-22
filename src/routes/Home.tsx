import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Home() {
  const navigate = useNavigate();
  const logOut = async () => {
    await auth.signOut();
    navigate("/login");
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
