import { JSX } from "solid-js";

export interface IProps {
  /**
   * Which to choose if the aspect ratios of the images are different
   */
  aspectRatio?: "taller" | "wider";
  /**
   * Custom element
   */
  handle?: JSX.Element;
  /**
   * Diameter of handle
   */
  handleSize?: number;
  /**
   * Whether to slide at hover
   */
  hover?: boolean;
  /**
   * Left image's url
   */
  leftImage: string;
  /**
   * Alt props for left image
   */
  leftImageAlt?: string;
  /**
   * Custom css for left image
   */
  leftImageCss?: JSX.CSSProperties;
  /**
   * Label for left Image 
   */
  leftImageLabel?: string;
  /**
     * Callback function called each time the slider changes.
     * @param {number} position return position (0 to 1) of the slider
     */
  onSliderPositionChange?: (position: number) => void;
  /**
   * Right image's url
   */
  rightImage: string;
  /**
   * Alt props for right image
   */
  rightImageAlt?: string;
  /**
   * Custom css for right image
   */
  rightImageCss?: JSX.CSSProperties;
  /**
   * Label for right Image
   */
  rightImageLabel?: string;
  /**
   * Element to use like preview
   */
  skeleton?: JSX.Element;
  /**
   * Line color of slider
   */
  sliderLineColor?: string;
  /**
   * Line width of slider (by pixel)
   */
  sliderLineWidth?: number;
  /**
   * Default line position (from 0 to 1)
   */
  sliderPositionPercentage?: number;
  /**
   * Compare images vertically instead of horizontally. The left image is on the top and the right image is on the bottom.
   */
  vertical?: boolean;
}
