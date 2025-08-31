/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type OtGColorSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function OtGColorSvgIcon(props: OtGColorSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 0 280 280"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M131.632 1.461c-.266.327-.293 1.273-.075 2.577.584 3.494.441 14.117-.247 18.346-1.957 12.032-6.908 22.419-16.311 34.218-14.31 17.956-32.868 32.447-48.094 49.618C48.429 127.058 38.897 151.502 39 177.706l-.001-.05c0 50.22 36.687 91.898 84.798 99.845a98 98 0 0 0 17.25 1.499c38.731 0 71.487-20.914 88.275-52.277 12.727-22.849 16.031-50.362 9.191-75.566-3.685-13.581-9.191-18.026-9.191-12.853s-6.733 10.5-11.897 8.638c-3.308-1.193-5.261-5.078-4.235-10.621.69-3.722 1.594-8.6.927-15.141-1.121-10.993-9.67-23.033-18.401-28.21-.528-.313-.452.055-.234 1.114.635 3.088 2.478 12.049-5.93 27.096-2.585 4.627-6.354 11.1-12.976 18.236-11.806 12.721-33.168 36.808-33.168 54.112h44.658c.374.603-2.066 6.885-3.983 10.541-4.093 7.807-11.1 14.667-20.056 19.639-12.334 6.846-28.117 7.502-42.253 1.756-27.233-11.07-36.977-44.625-20.839-68.978 7.909-11.937 18.422-21.853 28.938-31.772 9.01-8.499 18.022-16.999 25.399-26.774a63.8 63.8 0 0 0 9.715-18.535c4.116-12.546 4.215-26.22-.187-39.176-4.844-14.256-15.569-28.012-29.3-37.579-2.612-1.82-3.206-2.002-3.868-1.189"
        }
      ></path>

      <defs>
        <linearGradient
          id={"a"}
          x1={"140.5"}
          x2={"140.5"}
          y1={"1"}
          y2={"279"}
          gradientUnits={"userSpaceOnUse"}
        >
          <stop stopColor={"#FFF740"}></stop>

          <stop offset={"1"} stopColor={"#FF5E00"}></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default OtGColorSvgIcon;
/* prettier-ignore-end */
