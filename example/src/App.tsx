import type { Component } from 'solid-js';

import styles from './App.module.css';
import SolidCompareImage from "../../package/dist/index"
import leftImage from "./assets/imgs/leftImage.jpg"
import rightImage from "./assets/imgs/rightImage.jpg"
const App: Component = () => {
  return (
    <div class={styles.App}>
      <div>

      <SolidCompareImage aspectRatio='16:9' leftImage={leftImage}  rightImage={rightImage}/>
      </div>
    </div>
  );
};

export default App;
