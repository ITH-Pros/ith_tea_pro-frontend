
import React from 'react';

export const navigationRef = React.createRef();


 export const logOut = function () {
	console.log("logout")
	localStorage.clear();
	navigationRef.current?.navigate('/login');
}