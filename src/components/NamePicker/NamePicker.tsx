import React, { useEffect, useState } from "react";
import CyberContent from "../CyberContent/CyberContent";
import Button from "../Button/Button";
import useSound from "use-sound";
import * as S from "./styles";
import JSConfetti from "js-confetti";
import axios from "axios";

const ASSETS = `${process.env.PUBLIC_URL}/assets/`;
const SOUND_TYPE = ASSETS + "sounds/type.mp3";
const SOUND_CLICK = ASSETS + "sounds/winner-long.mp3";
const jsConfetti = new JSConfetti();

const TIME_DURING_STOP = 6000; // Duration before stopping

interface NamePickerProps {
  names: { _id: string; employeeName: string }[];
}

const NamePicker = ({ names }: NamePickerProps) => {
  const [allNames, setAllNames] = useState<{ _id: string; employeeName: string }[]>(names);
  const [currentName, setCurrentName] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [buttonState, setButtonState] = useState("enable");

  const [playSound] = useSound(SOUND_CLICK);

  // Fetch all employee names from the backend
  const fetchAllNames = () => {
    axios
      .get("http://46.19.74.196:3002/api/employeesnames")
      .then((response) => {
        setAllNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching names", error);
      });
  };

  // Delete a selected winner from the database
  const deleteWinner = (id: string) => {
    axios
      .delete(`http://46.19.74.196:3002/api/employees/${id}`)
      .then(() => {
        setAllNames((prevNames) => prevNames.filter((name) => name._id !== id));
        console.log("Winner deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting winner", error);
      });
  };

  useEffect(() => {
    fetchAllNames();
  }, []);

  const handleStart = () => {
    if (timer) {
      console.log("Too fast! Wait before starting again.");
      return;
    }

    playSound();
    setTimer(
      setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % allNames.length;
          setCurrentName(allNames[nextIndex]?.employeeName || "");
          return nextIndex;
        });
      }, 50)
    );
  };

  const handleStop = () => {
    if (buttonState === "disabling") return;

    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    jsConfetti.addConfetti({
      confettiColors: ["#9D805F"],
      confettiNumber: 500,
    });

    setButtonState("disabling");
    setTimeout(() => {
      const winner = allNames[currentIndex];
      if (winner) {
        deleteWinner(winner._id);
      }
      setCurrentIndex(0); // Reset the index
      setButtonState("enable");
    }, TIME_DURING_STOP);
  };

  const renderButton = () => {
    if (!timer) {
      return (
        <div onClick={handleStart}>
          <Button>Start</Button>
        </div>
      );
    }

    if (timer && buttonState === "enable") {
      return (
        <div onClick={handleStop}>
          <Button secondary>Stop</Button>
        </div>
      );
    }

    if (buttonState === "disabling") {
      return (
        <div>
          <Button secondary>WAIT</Button>
        </div>
      );
    }
  };

  return (
    <S.Wrapper>
      <S.CyberText>
        <CyberContent>{currentName}</CyberContent>
      </S.CyberText>
      <S.ButtonWrapper>{renderButton()}</S.ButtonWrapper>
    </S.Wrapper>
  );
};

export default NamePicker;
