/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ViewClose818SvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ViewClose818SvgrepoComSvgIcon(
  props: ViewClose818SvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"0 0 20 20"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillRule={"evenodd"}
        d={
          "M19.711 18.297a.999.999 0 1 1-1.414 1.414l-2.86-2.86a14 14 0 0 0 1.842-.987zM2.724 15.86q.883.563 1.842.988l-2.859 2.858a.999.999 0 1 1-1.414-1.415zM.297 1.711A.999.999 0 1 1 1.711.297l3.166 3.165a14 14 0 0 0-1.876.952zm16.705 2.7a14 14 0 0 0-1.877-.95L18.293.292a1 1 0 0 1 1.414 1.415zm-4.998 5.814a2 2 0 1 1-4.001-.002 2 2 0 0 1 4.001.002m-2 3.778a9.59 9.59 0 0 1-7.6-3.778 9.59 9.59 0 0 1 7.6-3.78 9.59 9.59 0 0 1 7.601 3.78 9.59 9.59 0 0 1-7.6 3.778m10-3.778c-2-3.452-5.724-5.78-10-5.78s-8 2.328-10 5.78c2 3.45 5.724 5.778 10 5.778s8-2.327 10-5.778"
        }
      ></path>
    </svg>
  );
}

export default ViewClose818SvgrepoComSvgIcon;
/* prettier-ignore-end */
