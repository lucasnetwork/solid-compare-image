import {
  type Component,
  createEffect,
  createSignal,
  onMount,
  onCleanup,
  createMemo,
  JSX,
} from "solid-js";
import { IProps } from "./types";

const SolidCompareImage: Component<IProps> = ({
  aspectRatio = "taller",
  handle = null,
  handleSize = 40,
  hover = false,
  leftImage,
  leftImageAlt = "",
  leftImageCss = {},
  leftImageLabel = null,
  onSliderPositionChange = () => {},
  rightImage,
  rightImageAlt = "",
  rightImageCss = {},
  rightImageLabel = null,
  skeleton = null,
  sliderLineColor = "#ffffff",
  sliderLineWidth = 2,
  sliderPositionPercentage = 0.5,
  vertical = false,
}) => {
  const horizontal = !vertical;

  const [sliderPosition, setSliderPosition] = createSignal<number>(
    sliderPositionPercentage
  );
  const [containerWidth, setContainerWidth] = createSignal<number>(0);
  const [containerHeight, setContainerHeight] = createSignal<number>(0);
  const [leftImgLoaded, setLeftImgLoaded] = createSignal<boolean>(false);
  const [rightImgLoaded, setRightImgLoaded] = createSignal<boolean>(false);
  const [isSliding, setIsSliding] = createSignal<boolean>(false);

  let containerRef: HTMLDivElement | undefined;
  let rightImageRef: HTMLImageElement | undefined;
  let leftImageRef: HTMLImageElement | undefined;

  // make the component responsive
  onMount(() => {
    if (!containerRef) {
      return;
    }
    const resizeObserver = new ResizeObserver(([entry, ..._]) => {
      const currentContainerWidth = entry.target.getBoundingClientRect().width;
      setContainerWidth(currentContainerWidth);
    });
    resizeObserver.observe(containerRef);

    return () => resizeObserver.disconnect();
  });

  onMount(() => {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    const alreadyDone = leftImageRef?.complete;
    alreadyDone && setLeftImgLoaded(true);
  });
  onCleanup(() => {
    setLeftImgLoaded(false);
    setRightImgLoaded(false);
  });

  onMount(() => {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    const alreadyDone = rightImageRef?.complete;
    alreadyDone && setRightImgLoaded(true);
  });

  const handleSliding = (event: TouchEvent | MouseEvent) => {
    if (!rightImageRef) {
      return;
    }
    const e = event;

    let cursorXfromViewport = 0;
    let cursorYfromViewport = 0;
    if (!("touches" in e)) {
      cursorXfromViewport = e.pageX;
      cursorYfromViewport = e.pageY;
    } else {
      cursorXfromViewport = e.touches[0].pageX;
      cursorYfromViewport = e.touches[0].pageY;
    }

    // Calc Cursor Position from the:
    // - left edge of the window (for horizontal)
    // - top edge of the window (for vertical)
    // to consider any page scrolling
    const cursorXfromWindow = cursorXfromViewport - window.scrollX;
    const cursorYfromWindow = cursorYfromViewport - window.scrollY;

    // Calc Cursor Position from the:
    // - left edge of the image(for horizontal)
    // - top edge of the image(for vertical)
    const imagePosition = rightImageRef.getBoundingClientRect();
    let pos = horizontal
      ? cursorXfromWindow - imagePosition.left
      : cursorYfromWindow - imagePosition.top;

    const sliderLineWidthMetade = sliderLineWidth / 2;
    // Set minimum and maximum values to prevent the slider from overflowing
    const minPos = 0 + sliderLineWidthMetade;
    const maxPos = horizontal
      ? containerWidth() - sliderLineWidthMetade
      : containerHeight() - sliderLineWidthMetade;

    if (pos < minPos) pos = minPos;
    if (pos > maxPos) pos = maxPos;
    const position = horizontal
      ? pos / containerWidth()
      : pos / containerHeight();
    setSliderPosition(position);
    onSliderPositionChange(position);
  };

  createEffect(() => {
    const startSliding = (e: TouchEvent | MouseEvent) => {
      setIsSliding(true);

      // Prevent default behavior other than mobile scrolling
      if (!("touches" in e)) {
        e.preventDefault();
      }

      // Slide the image even if you just click or tap (not drag)
      handleSliding(e);

      window.addEventListener("mousemove", handleSliding); // 07
      window.addEventListener("touchmove", handleSliding); // 08
    };

    const finishSliding = () => {
      setIsSliding(false);
      window.removeEventListener("mousemove", handleSliding);
      window.removeEventListener("touchmove", handleSliding);
    };

    if (
      rightImgLoaded() &&
      leftImgLoaded() &&
      containerRef &&
      leftImageRef &&
      rightImageRef
    ) {
      // it's necessary to reset event handlers each time the canvasWidth changes

      // for mobile
      containerRef.addEventListener("touchstart", startSliding); // 01
      window.addEventListener("touchend", finishSliding); // 02

      // for desktop
      if (hover) {
        containerRef.addEventListener("mousemove", handleSliding); // 03
        containerRef.addEventListener("mouseleave", finishSliding); // 04
      } else {
        containerRef.addEventListener("mousedown", startSliding); // 05
        window.addEventListener("mouseup", finishSliding); // 06
      }

      // calc and set the container's size
      const leftImageWidthHeightRatio =
        leftImageRef.naturalHeight / leftImageRef.naturalWidth;
      const rightImageWidthHeightRatio =
        rightImageRef.naturalHeight / rightImageRef.naturalWidth;

      const idealWidthHeightRatio =
        aspectRatio === "taller"
          ? Math.max(leftImageWidthHeightRatio, rightImageWidthHeightRatio)
          : Math.min(leftImageWidthHeightRatio, rightImageWidthHeightRatio);

      const idealContainerHeight = containerWidth() * idealWidthHeightRatio;
      setContainerHeight(idealContainerHeight);
    }

    return () => {
      // cleanup all event resteners

      if (containerRef) {
        containerRef.removeEventListener("touchstart", startSliding); // 01
        containerRef.removeEventListener("mousemove", handleSliding); // 03
        containerRef.removeEventListener("mouseleave", finishSliding); // 04
        containerRef.removeEventListener("mousedown", startSliding); // 05
      }
      window.removeEventListener("touchend", finishSliding); // 02
      window.removeEventListener("mouseup", finishSliding); // 06
      window.removeEventListener("mousemove", handleSliding); // 07
      window.removeEventListener("touchmove", handleSliding); // 08
    };
  });

  const styles = createMemo(() => {
    let cursor = "auto";
    if (!hover) {
      if (horizontal) {
        cursor = "ew-resize";
      } else {
        cursor = "ns-resize";
      }
    }
    const response: { [key: string]: JSX.CSSProperties } = {
      container: {
        "box-sizing": "border-box",
        position: "relative",
        width: "100%",
        height: `${containerHeight()}px`,
        overflow: "hidden",
      },
      rightImage: {
        clip: horizontal
          ? `rect(auto, auto, auto, ${containerWidth() * sliderPosition()}px)`
          : `rect(${containerHeight() * sliderPosition()}px, auto, auto, auto)`,
        display: "block",
        height: "100%",
        "object-fit": "cover",
        position: "absolute",
        width: "100%",
        ...rightImageCss,
      },
      leftImage: {
        clip: horizontal
          ? `rect(auto, ${containerWidth() * sliderPosition()}px, auto, auto)`
          : `rect(auto, auto, ${containerHeight() * sliderPosition()}px, auto)`,
        display: "block",
        height: "100%",
        "object-fit": "cover",
        position: "absolute",
        width: "100%",
        ...leftImageCss,
      },
      slider: {
        "align-items": "center",
        cursor,
        display: "flex",
        "flex-direction": horizontal ? "column" : "row",
        height: horizontal ? "100%" : `${handleSize}px`,
        "justify-content": "center",
        left: horizontal
          ? `${containerWidth() * sliderPosition() - handleSize / 2}px`
          : 0,
        position: "absolute",
        top: horizontal
          ? 0
          : `${containerHeight() * sliderPosition() - handleSize / 2}px`,
        width: horizontal ? `${handleSize}px` : "100%",
      },
      line: {
        background: sliderLineColor,
        "box-shadow":
          "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        flex: "0 1 auto",
        height: horizontal ? "100%" : `${sliderLineWidth}px`,
        width: horizontal ? `${sliderLineWidth}px` : "100%",
      },
      handleCustom: {
        "align-items": "center",
        "box-sizing": "border-box",
        display: "flex",
        flex: "1 0 auto",
        height: "auto",
        "justify-content": "center",
        width: "auto",
      },
      handleDefault: {
        "align-items": "center",
        border: `${sliderLineWidth}px solid ${sliderLineColor}`,
        "border-radius": "100%",
        "box-shadow":
          "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        "box-sizing": "border-box",
        display: "flex",
        flex: "1 0 auto",
        height: `${handleSize}px`,
        "justify-content": "center",
        width: `${handleSize}px`,
        transform: horizontal ? "none" : "rotate(90deg)",
      },
      leftArrow: {
        border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
        "border-right": `${handleSize * 0.15}px solid ${sliderLineColor}`,
        height: "0px",
        "margin-left": `-${handleSize * 0.25}px`, // for IE11
        "margin-right": `${handleSize * 0.25}px`,
        width: "0px",
      },
      rightArrow: {
        border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
        "border-left": `${handleSize * 0.15}px solid ${sliderLineColor}`,
        height: "0px",
        "margin-right": `-${handleSize * 0.25}px`, // for IE11
        width: "0px",
      },
      leftLabel: {
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        left: horizontal ? "5%" : "50%",
        opacity: isSliding() ? 0 : 1,
        padding: "10px 20px",
        position: "absolute",
        top: horizontal ? "50%" : "3%",
        transform: horizontal ? "translate(0,-50%)" : "translate(-50%, 0)",
        transition: "opacity 0.1s ease-out",
      },
      rightLabel: {
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        opacity: isSliding() ? 0 : 1,
        padding: "10px 20px",
        position: "absolute",
        left: horizontal ? undefined : "50%",
        right: horizontal ? "5%" : undefined,
        top: horizontal ? "50%" : undefined,
        bottom: horizontal ? undefined : "3%",
        transform: horizontal ? "translate(0,-50%)" : "translate(-50%, 0)",
        transition: "opacity 0.1s ease-out",
      },
      leftLabelContainer: {
        clip: horizontal
          ? `rect(auto, ${containerWidth() * sliderPosition()}px, auto, auto)`
          : `rect(auto, auto, ${containerHeight() * sliderPosition()}px, auto)`,
        height: "100%",
        position: "absolute",
        width: "100%",
      },
      rightLabelContainer: {
        clip: horizontal
          ? `rect(auto, auto, auto, ${containerWidth() * sliderPosition()}px)`
          : `rect(${containerHeight() * sliderPosition()}px, auto, auto, auto)`,
        height: "100%",
        position: "absolute",
        width: "100%",
      },
    };
    return response;
  });

  return (
    <>
      {skeleton && rightImgLoaded() && leftImgLoaded() && (
        <div style={{ ...styles().container }}>{skeleton}</div>
      )}

      <div
        style={{
          ...styles().container,
          display: rightImgLoaded() && leftImgLoaded() ? "block" : "none",
        }}
        ref={containerRef}
        data-testid="container"
      >
        <img
          onLoad={() => setRightImgLoaded(true)}
          alt={rightImageAlt}
          data-testid="right-image"
          ref={rightImageRef}
          src={rightImage}
          style={styles().rightImage}
        />
        <img
          onLoad={() => setLeftImgLoaded(true)}
          alt={leftImageAlt}
          data-testid="left-image"
          ref={leftImageRef}
          src={leftImage}
          style={styles().leftImage}
        />
        <div style={styles().slider}>
          <div style={styles().line} />
          {handle ? (
            <div style={styles().handleCustom}>{handle}</div>
          ) : (
            <div style={styles().handleDefault}>
              <div style={styles().leftArrow} />
              <div style={styles().rightArrow} />
            </div>
          )}
          <div style={styles().line} />
        </div>
        {/* labels */}
        {leftImageLabel && (
          <div style={styles().leftLabelContainer}>
            <div style={styles().leftLabel}>{leftImageLabel}</div>
          </div>
        )}
        {rightImageLabel && (
          <div style={styles().rightLabelContainer}>
            <div style={styles().rightLabel}>{rightImageLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SolidCompareImage;
