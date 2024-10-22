import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
    } catch (e) {
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
        <Title>Log into 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input type="text" name="name" value={name} onChange={onChange} placeholder="성함" required />
          <Input type="email" name="email" value={email} onChange={onChange} placeholder="이메일" required />
          <Input type="password" name="password" value={password} onChange={onChange} placeholder="비밀번호" required />
          <Input type="submit" value={isLoading ? "Loading..." : "계정 생성"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
      </Wrapper>
    </>
  );
}

export default CreateAccount;
