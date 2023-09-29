import {  JSX } from "solid-js";

export interface IProps {
    aspectRatio?: 'taller' | 'wider';
    handle?: JSX.Element 
    handleSize?: number;
    hover?: boolean;
    leftImage: string;
    leftImageAlt?: string;
    leftImageCss?: object;
    leftImageLabel?: string;
    onSliderPositionChange?: (position: number) => void;
    rightImage: string;
    rightImageAlt?: string;
    rightImageCss?: object;
    rightImageLabel?: string;
    skeleton?: JSX.Element 
    sliderLineColor?: string;
    sliderLineWidth?: number;
    sliderPositionPercentage?: number;
    vertical?: boolean;
  }
  