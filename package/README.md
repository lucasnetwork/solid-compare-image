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
| `handle` | `Component` | No | `-` |description |
| `handleSize` | `number` | No | `40` | description |
| `leftImage` | `string` | Yes | `-` | description |
| `leftImageAlt` | `string` | No | `-` | description |
| `leftImageCss` | `object` | No | `-` | description |
| `leftImageLabel` | `boolean` | No | `-` | description |
| `rightImage` | `string` | Yes | `-` | description |
| `rightImageAlt` | `string` | No | `-` | description |
| `rightImageCss` | `object` | No | `-` | description |
| `rightImageLabel` | `string` | No | `-` | description |
| `skeleton` | `JSX.Element` | No | `-` | description |
| `sliderLineColor` | `string` | No | `-` | description |
| `rightImageCss` | `object` | No | `-` | description |
| `sliderLineColor` | `string` | No | `"#fff"` | description |
| `sliderLineWidth` | `number` | No | `2` | description |
| `sliderPositionPercentage` | `number` | No | `0.5` | description |
| `vertical` | `boolean` | No | `false` | description |

### Events 

| Name | Params |  Description |
| ---- | ----------- | -------- |
| `onSliderPositionChange` | `position:number`| Description |