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
| `aspectRatio` | `"taller" \| "wider"` | **No** | `"taller"` | Which to choose if the aspect ratios of the images are different |
| `handle` | `Element` | No | `-` | Custom element |
| `handleSize` | `number` | No | `40` | Diameter of handle  |
| `hover` | `boolean` | No | `40` | Whether to slide at hover |
| `leftImage` | `string` | Yes | `false` | 	Left image's url |
| `leftImageAlt` | `string` | No | `-` | Alt props for left image |
| `leftImageCss` | `object` | No | `-` | Custom css for left image |
| `leftImageLabel` | `boolean` | No | `-` | Label for left Image |
| `rightImage` | `string` | Yes | `-` | Right image's url |
| `rightImageAlt` | `string` | No | `-` | Alt props for right image |
| `rightImageCss` | `object` | No | `-` | Custom css for right image |
| `rightImageLabel` | `string` | No | `-` | Label for right Image |
| `skeleton` | `Element` | No | `-` | Element to use like preview |
| `sliderLineColor` | `string` | No | `"#fff"` | 	Line color of slider |
| `sliderLineWidth` | `number` | No | `2` | Line width of slider (by pixel) |
| `sliderPositionPercentage` | `number` | No | `0.5` | Default line position (from 0 to 1) |
| `vertical` | `boolean` | No | `false` | Compare images vertically instead of horizontally. The left image is on the top and the right image is on the bottom |

### Events 

| Name | Params |  Description |
| ---- | ----------- | -------- |
| `onSliderPositionChange` | `position:number`| Callback function called each time the slider changes. The position (0 to 1) of the slider is passed as arg |