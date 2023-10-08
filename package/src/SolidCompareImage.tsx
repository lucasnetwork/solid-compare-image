import {
  type Component,
  createEffect,
  createSignal,
  onMount,
  onCleanup,
  createMemo,
  JSX,
  mergeProps,
} from "solid-js";
import { IProps } from "./types";

const SolidCompareImage: Component<IProps> = (props) => {
  const merged = mergeProps({
    aspectRatio: "taller",
    handle: null,
    handleSize: 40,
    hover: false,
    leftImageAlt: "",
    leftImageCss: {},
    leftImageLabel: null,
    leftPositionLabel: "center",
    onSliderPositionChange: () => {},
    rightImageAlt: "",
    rightImageCss: {},
    rightImageLabel: null,
    rightPositionLabel: "center",
    skeleton: null,
    sliderLineColor: "#ffffff",
    sliderLineWidth: 2,
    sliderPositionPercentage: 0.5,
    vertical: false,
  }, props);
  const horizontal = !merged.vertical;

  const [sliderPosition, setSliderPosition] = createSignal<number>(
    merged.sliderPositionPercentage
  );
  const [containerWidth, setContainerWidth] = createSignal<number>(0);
  const [containerHeight, setContainerHeight] = createSignal<number>(0);
  const [leftImgLoaded, setLeftImgLoaded] = createSignal<boolean>(false);
  const [rightImgLoaded, setRightImgLoaded] = createSignal<boolean>(false);
  const [isSliding, setIsSliding] = createSignal<boolean>(false);

  let containerRef: HTMLDivElement | undefined;
  let rightImageRef: HTMLImageElement | undefined;
  let leftImageRef: HTMLImageElement | undefined;

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

    const halfSliderLineWidth = merged.sliderLineWidth / 2;
    // Set minimum and maximum values to prevent the slider from overflowing
    const minPos = 0 + halfSliderLineWidth;
    const maxPos = horizontal
      ? containerWidth() - halfSliderLineWidth
      : containerHeight() - halfSliderLineWidth;

    if (pos < minPos) pos = minPos;
    if (pos > maxPos) pos = maxPos;
    const position = horizontal
      ? pos / containerWidth()
      : pos / containerHeight();
    setSliderPosition(position);
    merged.onSliderPositionChange(position);
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
      if (merged.hover) {
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
      merged.aspectRatio === "taller"
          ? Math.max(leftImageWidthHeightRatio, rightImageWidthHeightRatio)
          : Math.min(leftImageWidthHeightRatio, rightImageWidthHeightRatio);

      const idealContainerHeight = containerWidth() * idealWidthHeightRatio;
      setContainerHeight(idealContainerHeight);
    }

    onCleanup(()=>{
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
    })
  });

  const styles = createMemo(() => {
    let cursor = "auto";
    if (!merged.hover) {
      if (horizontal) {
        cursor = "ew-resize";
      } else {
        cursor = "ns-resize";
      }
    }
    let rightPosition = "50%"
    switch(merged.rightPositionLabel){
      case "bottom":
        rightPosition = "85%"
        break
      case "top":
        rightPosition = "10%"
    }
    let leftPosition = "50%"
    switch(merged.leftPositionLabel){
      case "bottom":
        leftPosition = "85%"
        break
      case "top":
        leftPosition = "10%"
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
        ...merged.rightImageCss,
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
        ...merged.leftImageCss,
      },
      slider: {
        "align-items": "center",
        cursor,
        display: "flex",
        "flex-direction": horizontal ? "column" : "row",
        height: horizontal ? "100%" : `${merged.handleSize}px`,
        "justify-content": "center",
        left: horizontal
          ? `${containerWidth() * sliderPosition() - merged.handleSize / 2}px`
          : 0,
        position: "absolute",
        top: horizontal
          ? 0
          : `${containerHeight() * sliderPosition() - merged.handleSize / 2}px`,
        width: horizontal ? `${merged.handleSize}px` : "100%",
      },
      line: {
        background: merged.sliderLineColor,
        "box-shadow":
          "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        flex: "0 1 auto",
        height: horizontal ? "100%" : `${merged.sliderLineWidth}px`,
        width: horizontal ? `${merged.sliderLineWidth}px` : "100%",
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
        border: `${merged.sliderLineWidth}px solid ${merged.sliderLineColor}`,
        "border-radius": "100%",
        "box-shadow":
          "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        "box-sizing": "border-box",
        display: "flex",
        flex: "1 0 auto",
        height: `${merged.handleSize}px`,
        "justify-content": "center",
        width: `${merged.handleSize}px`,
        transform: horizontal ? "none" : "rotate(90deg)",
      },
      leftArrow: {
        border: `inset ${merged.handleSize * 0.15}px rgba(0,0,0,0)`,
        "border-right": `${merged.handleSize * 0.15}px solid ${merged.sliderLineColor}`,
        height: "0px",
        "margin-left": `-${merged.handleSize * 0.25}px`, // for IE11
        "margin-right": `${merged.handleSize * 0.25}px`,
        width: "0px",
      },
      rightArrow: {
        border: `inset ${merged.handleSize * 0.15}px rgba(0,0,0,0)`,
        "border-left": `${merged.handleSize * 0.15}px solid ${merged.sliderLineColor}`,
        height: "0px",
        "margin-right": `-${merged.handleSize * 0.25}px`, // for IE11
        width: "0px",
      },
      leftLabel: {
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        left: horizontal ? "5%" : leftPosition,
        opacity: isSliding() ? 0 : 1,
        padding: "10px 20px",
        position: "absolute",
        top: horizontal ? leftPosition : "3%",
        transform: horizontal ? "translate(0,-50%)" : "translate(-50%, 0)",
        transition: "opacity 0.1s ease-out",
      },
      rightLabel: {
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        opacity: isSliding() ? 0 : 1,
        padding: "10px 20px",
        position: "absolute",
        left: horizontal ? undefined : rightPosition,
        right: horizontal ? "5%" : undefined,
        top: horizontal ? rightPosition : undefined,
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
      {merged.skeleton && (!rightImgLoaded() || !leftImgLoaded() )&& (
        <div style={{ ...styles().container,height:"initial" }}>{merged.skeleton}</div>
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
          alt={merged.rightImageAlt}
          data-testid="right-image"
          ref={rightImageRef}
          src={merged.rightImage}
          style={styles().rightImage}
        />
        <img
          onLoad={() => setLeftImgLoaded(true)}
          alt={merged.leftImageAlt}
          data-testid="left-image"
          ref={leftImageRef}
          src={merged.leftImage}
          style={styles().leftImage}
        />
        <div style={styles().slider}>
          <div style={styles().line} />
          {merged.handle ? (
            <div style={styles().handleCustom}>{merged.handle}</div>
          ) : (
            <div style={styles().handleDefault}>
              <div style={styles().leftArrow} />
              <div style={styles().rightArrow} />
            </div>
          )}
          <div style={styles().line} />
        </div>
        {/* labels */}
        {merged.leftImageLabel && (
          <div style={styles().leftLabelContainer}>
            <div style={styles().leftLabel}>{merged.leftImageLabel}</div>
          </div>
        )}
        {merged.rightImageLabel && (
          <div style={styles().rightLabelContainer}>
            <div style={styles().rightLabel}>{merged.rightImageLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SolidCompareImage;
