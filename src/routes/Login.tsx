import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Error, Input, Switcher, Title, Wrapper } from "../components/AuthComponents";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      // setError
    } finally {
      setIsLoading(false);
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>Log into 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input type="email" name="email" value={email} onChange={onChange} placeholder="이메일" required />
          <Input type="password" name="password" value={password} onChange={onChange} placeholder="비밀번호" required />
          <Input type="submit" value={isLoading ? "Loading..." : "로그인"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          계정이 없으세요? <Link to="/create-account">회원가입 &rarr;</Link>
        </Switcher>
      </Wrapper>
    </>
  );
}

export default Login;
