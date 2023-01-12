import React from "react";
import { Outlet, useParams } from "react-router-dom";

export default function User() {
    console.log("in")

    let { topicId } = useParams();


    return (
        <>
            <Outlet />
        </>
    );
}
