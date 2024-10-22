import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { Form, Error, Input, Title, Wrapper } from "../components/AuthComponents";

function PasswordRest() {
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
      await sendPasswordResetEmail(auth, email);
      alert("해당 계정으로 비밀번호 재설정 링크를 보냈습니다!");
      navigate("/login");
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
        <Title>비밀번호 재설정 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="재설정할 비밀번호인 이메일 작성하세요"
            required
          />
          <Input type="submit" value={isLoading ? "Loading..." : "재설정 메일 보내기"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
      </Wrapper>
    </>
  );
}

export default PasswordRest;
