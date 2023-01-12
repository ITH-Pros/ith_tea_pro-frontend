import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/AuthProvider';
import './index.css'

export default function AddUser(props) {
    const { userDetails } = useAuth()
    return (
        <div className='registerForm'>
            <div className="rgstrContent">
                <div className="text">Add User</div>

                <form action="#">
                    <div className="rgstrfield">
                        <span className="bx bxs-user"></span>
                        <input type="username" placeholder="Username" required></input>
                    </div>

                    <div className="rgstrfield">
                        <span className="bx bxs-envelope"></span>
                        <input type="email" placeholder="Email" required></input>
                    </div>

                    <div className="rgstrfield">
                        <span className="bx bxs-lock-alt"></span>
                        <input type="password" placeholder="Password" required></input>
                    </div>

                    <button className='rgstrbtn'>Submit</button>
                </form>
            </div>
        </div>
    )
};

