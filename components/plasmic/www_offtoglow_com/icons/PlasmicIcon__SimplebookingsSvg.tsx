/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type SimplebookingsSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function SimplebookingsSvgIcon(props: SimplebookingsSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 800 800"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g clipPath={"url(#3gYldBIvuQyYa)"} fill={"#030104"}>
        <path
          d={
            "M800 780c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V120c0-11.046 8.954-20 20-20h27.914c11.046 0 20 8.954 20 20v592.086c0 11.045 8.955 20 20 20h624.172c11.045 0 20-8.955 20-20V120c0-11.046 8.954-20 20-20H780c11.046 0 20 8.954 20 20v660z"
          }
        ></path>

        <path
          d={
            "M238 300h-76c-6.627 0-12 5.373-12 12v76c0 6.627 5.373 12 12 12h76c6.627 0 12-5.373 12-12v-76c0-6.627-5.373-12-12-12zm200 .203h-76c-6.627 0-12 5.373-12 12v76c0 6.628 5.373 12 12 12h76c6.627 0 12-5.372 12-12v-76c0-6.627-5.373-12-12-12zM638 300h-76c-6.627 0-12 5.373-12 12v76c0 6.627 5.373 12 12 12h76c6.627 0 12-5.373 12-12v-76c0-6.627-5.373-12-12-12zM238 500h-76c-6.627 0-12 5.373-12 12v76c0 6.627 5.373 12 12 12h76c6.627 0 12-5.373 12-12v-76c0-6.627-5.373-12-12-12zm200 0h-76c-6.627 0-12 5.373-12 12v76c0 6.627 5.373 12 12 12h76c6.627 0 12-5.373 12-12v-76c0-6.627-5.373-12-12-12zm132.485 79.515c-7.559 7.559-20.485 2.205-20.485-8.486V512c0-6.627 5.373-12 12-12h59.029c10.691 0 16.045 12.926 8.486 20.485l-59.03 59.03zM200 150V50c0-27.625 22.375-50 50-50s50 22.375 50 50v100c0 27.625-22.375 50-50 50s-50-22.375-50-50zm300 0V50c0-27.625 22.375-50 50-50s50 22.375 50 50v100c0 27.625-22.375 50-50 50s-50-22.375-50-50z"
          }
        ></path>
      </g>

      <defs>
        <clipPath id={"3gYldBIvuQyYa"}>
          <path fill={"#fff"} d={"M0 0h800v800H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default SimplebookingsSvgIcon;
/* prettier-ignore-end */
