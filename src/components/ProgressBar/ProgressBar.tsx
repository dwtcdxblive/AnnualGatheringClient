import { useEffect, useState } from "react"
import "./ProgressBar.scss"

const ProgressBar = () => {
  const [counterState, setCounter] = useState(0)
  let timer: any
  useEffect(() => {
    clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setInterval(() => {
      if (counterState === 100) {
        clearInterval(timer)
        return
      }
      setCounter((prev) => prev + 1)
      // counter++
    }, 25)

    return () => clearInterval(timer)
  }, [counterState])

  const load1 = (counterState > 0 && counterState < 30)
  const load2 = (counterState >= 30 && counterState < 60)
  const load3 = (counterState >= 60 && counterState < 90)
  const load4 = (counterState >= 90 && counterState < 100)
  return (
    <div className="wrapper">

    </div>
  )
}

export default ProgressBar
