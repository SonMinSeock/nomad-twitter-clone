import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // auth.currentUser 프로퍼티는 유저가 로그인 했는지 여부를 알려준다.
  const user = auth.currentUser;

  if (user === null) {
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default ProtectedRoute;
