import {useState, useContext} from "react";
import { Outlet } from "react-router-dom";
import { accountContext } from "../Contexts/authentication";

export const UserAuthentication = () =>{

    const {loggedUser, setLoggedUser} = useContext(accountContext)
    console.log(loggedUser)

    return (
        loggedUser? <Outlet></Outlet> : <div>NOOOOOOOOO</div>
    )
}