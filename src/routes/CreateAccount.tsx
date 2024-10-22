import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form, Error, Input, Switcher, Title, Wrapper } from "../components/AuthComponents";

function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credentials.user, {
        displayName: name,
      });
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
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>Join 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input type="text" name="name" value={name} onChange={onChange} placeholder="성함" required />
          <Input type="email" name="email" value={email} onChange={onChange} placeholder="이메일" required />
          <Input type="password" name="password" value={password} onChange={onChange} placeholder="비밀번호" required />
          <Input type="submit" value={isLoading ? "Loading..." : "계정 생성"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          이미 계정이 있으세요? <Link to="/login">로그인 &rarr;</Link>
        </Switcher>
      </Wrapper>
    </>
  );
}

export default CreateAccount;
