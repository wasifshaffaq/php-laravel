

import styled from "styled-components";
import Base from "./Base";
import { useEffect, useState } from "react";
import Button from "./Button";
import levels from "../data/levels";
import netLine from "../controllers/netLine";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
`;

const SmallLogo = styled.img`
  height: 100px;
  position: absolute;
  left: 25px;
  top: 25px;
`;

const Input = styled.input`
  display: flex;
  width: 400px;
  outline: none;
  border: none;
  border-radius: 100px;
  text-align: center;
  font-size: 18px;

  padding: 20px 20px;
  background-color: rgba(255, 255, 255, 0.4);

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  border-radius: 10px;
  transform: skewX(150deg);
  transition: 0.25s ease-in-out;

  &:hover {
    transform: skewX(200deg);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Message = styled.div`
  font-size: 30px;
  text-align: center;
`;

const GameEnded = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
`;

const GameStarted = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
`;

const Question = styled.div`
  font-size: 30px;
  width: 62vw;
  text-align: center;
`;
const Hint = styled.div`
  font-size: 20px;
  opacity: 0.5;
`;

const GameUI = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  display: flex;
  flex-direction: row;
  gap: 25px;
`;

function getRandomLevel() {
  let max = levels.length;

  return Math.round(Math.random() * max);
}

let maxSeconds = 60;

const NewGame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  width: 90vw;
`;

export default function Play() {
  const [tmpName, setTmpName] = useState("");
  const [name, setName] = useState("");
  const [ans, setAns] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(getRandomLevel());

  const navigate = useNavigate();

  window.name = name;

  window.score = score;
  window.setScore = setScore;
  window.gameEnded = gameEnded;
  window.setGameEnded = setGameEnded;
  window.setGameStatus = setGameStatus;
  window.gameStatus = gameStatus;
  window.timer = timer;
  window.setTimer = setTimer;

  let level = levels[questionIndex];

  useEffect(() => {
    window.isNewSession = true;

    let theInterval = setInterval(() => {
      if (window.gameStatus && !window.gameEnded) {
        let newTimer = window.timer + 1;
        window.setTimer(newTimer);
        if (newTimer > maxSeconds) {
          window.setGameEnded(true);
          postTheScore();
          window.clearInterval(theInterval);
        }
      }
    }, 1000);
  }, []);

  let content = null;

  let theAns = level.ans;
  let ansWords = theAns.split(" ");
  let hint = "";

  if (ansWords.length == 2) {
    hint =
      ansWords[0].slice(0, 3) + "....   " + ansWords[1].slice(0, 3) + "....   ";
  } else {
    hint = theAns.slice(0, 3) + "..";
  }

  if (!name) {
    content = (
      <NewGame>
        <Input
          placeholder="Type Name Here"
          value={tmpName}
          onChange={(e) => {
            setTmpName(e.target.value);
          }}
        />

        <Button onClick={start}>Start</Button>
        <Button onClick={goToHome}>Home</Button>
      </NewGame>
    );
  } else {
    if (gameEnded) {
      content = (
        <GameEnded>
          <Message> You Scored {score}</Message>
          <Button
            onClick={() => {
              navigate("/leader-board");
            }}
          >
            Show Leaderboard
          </Button>
          <Button onClick={reload}>Restart</Button>
          <Button onClick={goToHome}>Home</Button>
        </GameEnded>
      );
    } else {
      content = (
        <GameStarted>
          <GameUI>
            <Message> Time Left {maxSeconds - timer}</Message>
            <Message> Score {score}</Message>
          </GameUI>

          <Question> {level.question} </Question>
          <Hint> Hint: {hint} </Hint>

          <Input
            placeholder="Type Ans Here"
            value={ans}
            onChange={(e) => {
              setAns(e.target.value);
            }}
          />

          <Button onClick={submitAns}>Submit</Button>
        </GameStarted>
      );
    }
  }

  return (
    <Base>
      <Container>
        <SmallLogo src="/logo.svg" />
        {content}
      </Container>
      {/* <ToastContainer /> */}
    </Base>
  );

  function reload() {
    window.location.reload();
  }

  function goToHome() {
    window.location = "/";
  }

  function submitAns() {
    let lvl = levels[questionIndex];
    let actualAns = lvl.ans;
    actualAns = actualAns.toLowerCase();

    if (actualAns === ans.toLowerCase()) {
      setScore(score + 1);
      alert("You are correct");
    } else {
      alert("You wrong homie");
    }

    setQuestionIndex(getRandomLevel());
    setAns("");
  }

  function start() {
    setName(tmpName);
    setGameStatus(true);
  }

  function postTheScore() {
    if (!window.isNewSession) return;

    window.isNewSession = false;

    netLine.post(`score/?nickName=${window.name}&score=${window.score}`);
  }
}
