import type { Component } from 'solid-js';

import styles from './App.module.css';
import SolidCompareImage from "../../package/src/index"
import leftImage from "./assets/imgs/leftImage.jpg"
import rightImage from "./assets/imgs/rightImage.jpg"
const App: Component = () => {
  return (
    <div class={styles.App}>
      <div>

    <SolidCompareImage leftImage={leftImage}  rightImage={rightImage}/>
      </div>
    </div>
  );
};

export default App;
