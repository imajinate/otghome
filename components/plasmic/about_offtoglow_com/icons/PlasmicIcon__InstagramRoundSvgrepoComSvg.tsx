/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type InstagramRoundSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function InstagramRoundSvgrepoComSvgIcon(
  props: InstagramRoundSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 0 800 800"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g fill={"#000"} clipPath={"url(#a)"}>
        <path
          d={
            "M400 470.313c38.75 0 70.468-31.563 70.468-70.469 0-15.313-5-29.531-13.281-41.094-12.812-17.656-33.594-29.375-57.031-29.375-23.438 0-44.219 11.563-57.031 29.375-8.282 11.563-13.282 25.781-13.282 41.094-.156 38.906 31.407 70.469 70.157 70.469m153.75-156.407v-67.812H545l-59.062.156.312 67.812z"
          }
        ></path>

        <path
          d={
            "M509.375 400c0 60.312-49.063 109.375-109.375 109.375S290.625 460.312 290.625 400c0-14.531 2.969-28.437 8.125-41.094h-59.688v163.75c0 21.094 17.188 38.281 38.282 38.281h245.312c21.094 0 38.282-17.187 38.282-38.281v-163.75H501.25c5.313 12.657 8.125 26.563 8.125 41.094"
          }
        ></path>

        <path
          d={
            "M400 0C179.063 0 0 179.063 0 400s179.063 400 400 400 400-179.063 400-400S620.937 0 400 0m200 358.906v163.75C600 565.312 565.312 600 522.656 600H277.344C234.688 600 200 565.312 200 522.656V277.187c0-42.656 34.688-77.343 77.344-77.343h245.312c42.656 0 77.344 34.687 77.344 77.343z"
          }
        ></path>
      </g>

      <defs>
        <clipPath id={"a"}>
          <path fill={"#fff"} d={"M0 0h800v800H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default InstagramRoundSvgrepoComSvgIcon;
/* prettier-ignore-end */
