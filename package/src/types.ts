import { JSX } from "solid-js";

export interface IProps {
  aspectRatio?: "taller" | "wider";
  handle?: JSX.Element;
  handleSize?: number;
  hover?: boolean;
  leftImage: string;
  leftImageAlt?: string;
  leftImageCss?: JSX.CSSProperties;
  leftImageLabel?: string;
  onSliderPositionChange?: (position: number) => void;
  rightImage: string;
  rightImageAlt?: string;
  rightImageCss?: JSX.CSSProperties;
  rightImageLabel?: string;
  skeleton?: JSX.Element;
  sliderLineColor?: string;
  sliderLineWidth?: number;
  sliderPositionPercentage?: number;
  vertical?: boolean;
}
