import React, { useEffect, useState } from "react"
import CyberContent from "../CyberContent/CyberContent"
import Button from "../Button/Button";
import useSound from "use-sound";
import * as S from "./styles";
import JSConfetti from 'js-confetti';
import axios from 'axios';

const ASSETS = `${process.env.PUBLIC_URL}/assets/`
const SOUND_TYPE = ASSETS + "sounds/type.mp3"
const SOUND_CLICK = ASSETS + "sounds/winner-long.mp3"
const jsConfetti = new JSConfetti()

const namesList = [
"Ahmad",
"Fatima",
"Sara",
"Alaa",
"shail",
"Muhammed",
"Omar",
]

let audio = new Audio("./assets/sounds/winner.mp3")
const Winner = () =>{
  audio.play()

}


const TIME_DURING_STOP = 6000 // keep going

interface NamePickerProps {
  names: string[]
}

const NamePicker = ({ names }: NamePickerProps) => {
  const [AllNames, setAllNames] = useState<{ employeeName: string }[]>([]);

  const [playSound] = useSound(SOUND_CLICK)
  const [play, { stop }] = useSound(SOUND_TYPE, { loop: true })


    const fetchAllNames = () => {
    axios
      .get('http://46.19.74.196:3002/api/employeesnames')
      .then((response) => {
        setAllNames(response.data);
        
      })
      .catch((error) => {
        console.error('Error fetching names', error);
      });
  };
const getNames = AllNames.map((name, index) => (
  <div key={index}>
    {name.employeeName}
  </div>
));

  const [content, setContent] = useState<any>()
  const [terminal, enableTerminal] = useState<boolean>(false)
  const [timer, setTimer] = useState<any>(null)
  const [buttonState, setButton] = useState<any>("enable")
  let i = 0

  useEffect(() => {
    fetchAllNames()
    if (names) {
      enableTerminal(false)
    }
  }, [names])

  const handleStart = () => {
        playSound()
    if (timer) {
      console.log("%c Too Fast!", "color: yellow; background: red")
    }
    enableTerminal(false)
    setTimer(
      setInterval(function () {
        setContent(getNames[i++ % getNames.length])
      }, 50)
    )
  }

  const handleStop = () => {
    // playSound()
        jsConfetti.addConfetti({
    confettiColors:["#9D805F"], 
    // confettiRadius:6,
    confettiNumber:500,
  })
    if (buttonState === "disabling") {
      return
    }
    stop()
    if (names.length) {
      if (names.length > 2) {
        enableTerminal(true)
        play()
        setTimeout(() => {
          stop()
        }, 3000)
      } else {
        enableTerminal(false)
      }
      setButton("disabling")
      setTimeout(() => {
        clearInterval(timer)
        setTimer(null)
        setButton("enable")
      }, TIME_DURING_STOP)
    } else {
      clearInterval(timer)
      setTimer(null)
    }
  }

  const renderButton = () => {
    let button: any = null

    if (!timer) {
      button = (
        
        <div onClick={handleStart}>
                    {/* <Confetti
      // wind={.1}
      width={window.innerWidth}
      height={window.innerHeight}
      friction={.99}
      // wind={.05}
      // opacity={.7}
      initialVelocityX={10}
      // initialVelocityY={10}
      numberOfPieces={250}
      // gravity={.5}
      colors={["#9D805F"]}
  //       drawShape={ctx => {
  //   ctx.beginPath()
  //   for(let i = 0; i < 22; i++) {
  //     const angle = 0.35 * i
  //     const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
  //     const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
  //     ctx.lineTo(x, y)
  //   }
  //   ctx.stroke()
  //   ctx.closePath()
  // }}
    /> */}
{/* <ConfettiExplosion 
width={window.innerWidth}
height={window.innerHeight}
force={.2}
particleSize={10}
duration={5000}
particleCount={500}
colors={["#9D805F"]}

/> */}
          <Button onClick={Winner}>Start</Button>
        </div>
      )
    }
    if (timer) {
      button = (
        <div onClick={handleStop}>
          <Button secondary>Stop</Button>
        </div>
      )
    }
    if (buttonState === "disabling") {
      button = (
        <div onClick={handleStop}>
          <Button secondary>WAIT</Button>
        </div>
      )
    }

    return button
  }


  return (
    <S.Wrapper>
      <S.CyberText>
        <CyberContent>{content}</CyberContent>
      </S.CyberText>
      <S.ButtonWrapper>{renderButton()}</S.ButtonWrapper>
    </S.Wrapper>
  )
}

export default NamePicker
