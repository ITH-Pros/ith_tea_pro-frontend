import React from "react";
export const navigationRef = React.createRef();

export const logOut = function () {
  localStorage.clear();
  navigationRef.current?.navigate("/login");
};
