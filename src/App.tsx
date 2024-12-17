import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router";
import NamePicker from "./components/NamePicker/NamePicker";
import DataCollector from "./components/DataCollector";
import useLocalStorage from "./Utils/useLocalStorage";
import * as S from "./styles";
import "./App.scss";
import Log from "./assets/TDRA-white.svg";

const getRandomItem = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)];
};

function App() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [help, setHelp] = useState(false);
  const [names, setNames] = useState<any>([]);
  const [hackedNameState, setHackedName] = useState<any>("");
  const [namesL, setNamesL] = useLocalStorage("name", []);

  const handleWindowSizeChange = () => {
    if (help === true) setHelp(false);
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  const isMobile = width <= 768;

  const removeItemArray = (item: string) => {
    const findName = names.filter((n: string) => item !== n);
    setNames(findName);
  };

  useEffect(() => {
    const getHackedName = () => getRandomItem([...names]);
    setHackedName(getHackedName);
  }, [names]);

  useEffect(() => {
    setNamesL(names);
  }, [names]);

  useEffect(() => {
    if (namesL.length) setNames(namesL);
  }, []);

  return (
    <Router>
      <div className="Container">
        <img className="logo" src={Log} alt="Logo" />
        {/* <nav>
          <Link to="/">Home</Link> | <Link to="/data-collector">Data Collector</Link>
        </nav> */}
        <div className="Wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <S.FlexSideBar>
                  <S.Flex>
                    <div className="App">
                      <NamePicker names={names} />
                    </div>
                  </S.Flex>
                </S.FlexSideBar>
              }
            />
            <Route path="/data-collector" element={<DataCollector />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
