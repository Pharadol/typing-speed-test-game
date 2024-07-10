import React from "react";
import { useState, useRef, useEffect } from "react";

const getCloud = () =>
  `Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quia vero quaerat repellat suscipit consequatur, fugiat eius quo facere quisquam iste deleniti quasi, deserunt rerum sequi ipsam ut 
et nihil.`.split(" ");

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct font-bold text-green-300">{text} </span>;
  }

  if (correct === false) {
    return <span className="incorrect font-bold text-yellow-500">{text} </span>;
  }

  if (active) {
    return (
      <span className="active font-bold bg-gray-200 text-black rounded-sm px-1">
        {text}{" "}
      </span>
    );
  }

  return <span>{text} </span>;
}

Word = React.memo(Word);
function Timer(props) {
  const { correctWords, startCounting } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        // do something
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div className="flex justify-center flex-col items-center md:flex-row bg-gradient-to-r from-blue-900 to-green-500">
      <p className="border-4 flex flex-col w-min rounded-full justify-center items-center p-5 text-3xl">
        {timeElapsed} <b className="font-thin text-base">seconds</b>
      </p>
      <p className="text-3xl flex justify-center items-center rounded-md mt-8 md:mt-0 md:px-20">
        <b>Speed</b>: {(correctWords / minutes || 0).toFixed(2)} WPM
      </p>
    </div>
  );
}

function AppTypingTest() {
  const [userInput, setUserInput] = useState("");
  const cloud = useRef(getCloud());

  const [startCounting, setStartCounting] = useState(false);

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    if (activeWordIndex === cloud.current.length) {
      return;
      // stop
    }

    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(" ")) {
      //the user has finish this word

      if (activeWordIndex === cloud.current.length - 1) {
        // over flow
        setStartCounting(false);
        setUserInput("Completed");
      }

      setActiveWordIndex((index) => index + 1);
      setUserInput("");

      // correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  return (
    <div className="w-11/12 md:w-10/12 lg:w-6/12 mx-auto md:pt-6 text-white">
      <h1 className="text-3xl font-bold md:text-5xl text-center pt-12 md:pt-20 pb-10 ">
        Typing Speed Test Game
      </h1>

      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />

      <p className="text-xl mt-10 mb-5">
        {cloud.current.map((word, index) => {
          return (
            <Word
              key={index}
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          );
        })}
      </p>
      <input
        placeholder="Start typing..."
        type="text"
        className="border-2 w-full h-12 text-xl px-2 rounded-md shadow-lg text-black"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default AppTypingTest;
