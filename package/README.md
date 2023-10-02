# Solid Compare Image

> Package based on [react-compare-image](https://github.com/junkboy0315/react-compare-image)


1. [Installation](#installation)
2. [Implementation](#implementation)
3. [References](#references)

## Installation
```bash
# npm
npm install solid-compare-image

# yarn
yarn add solid-compare-image
```

## Implementation

```tsx
import SolidCompareImage from "solid-compare-image";

const App: Component = () => {

  return (
    <SolidCompareImage
        leftImage={...}
        rightImage={...}
    />
  );
};

export default App;
```

## References


### Props

| Name | Values/Type | Required | Default | Description |
| ---- | ----------- | -------- | ------- | ----------- |
| `aspectRatio` | `"taller" \| "wider"` | **No** | `"taller"` | description |
| `handle` | `Element` | No | `-` | Custom element |
| `handleSize` | `number` | No | `40` | diameter of handle  |
| `hover` | `boolean` | No | `40` | diameter of handle  |
| `leftImage` | `string` | Yes | `false` | 	Whether to slide at hover |
| `leftImageAlt` | `string` | No | `-` | alt props for left image |
| `leftImageCss` | `object` | No | `-` | custom css for left image |
| `leftImageLabel` | `boolean` | No | `-` | Label for left Image |
| `rightImage` | `string` | Yes | `-` | right image's url  |
| `rightImageAlt` | `string` | No | `-` | alt props for right image |
| `rightImageCss` | `object` | No | `-` | custom css for right image |
| `rightImageLabel` | `string` | No | `-` | Label for right Image |
| `skeleton` | `Element` | No | `-` | Element to use like preview |
| `sliderLineColor` | `string` | No | `"#fff"` | 	line color of slider |
| `sliderLineWidth` | `number` | No | `2` | line width of slider (by pixel) |
| `sliderPositionPercentage` | `number` | No | `0.5` | Default line position (from 0 to 1) |
| `vertical` | `boolean` | No | `false` | description |

### Events 

| Name | Params |  Description |
| ---- | ----------- | -------- |
| `onSliderPositionChange` | `position:number`| Callback function called each time the slider changes. The position (0 to 1) of the slider is passed as arg |