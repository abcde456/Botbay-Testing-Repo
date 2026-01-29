import React from 'react';

import '../../../styles/dashboard.css'

function HomePageDesktop(){
    return (
        <>
        <div className='d-homepagecontainer'>
            <div className='d-titlecontainer'>
                <p>Home</p>
            </div>
            <div className='d-gridcontainer-3c2r'>
                <div className='d-griditem-2r'>
                    <p id="d-griditem-title">Members</p>
                    <table id="d-griditem-membertable">
                        <tbody>
                            <tr>
                                <th>Members</th>
                                <th>Admin</th>
                            </tr>
                            <tr>
                                <td>Test@email.com</td>
                                <td><input type='checkbox'></input></td>
                            </tr>
                            <tr>
                                <td>Test@email.com</td>
                                <td><input type='checkbox'></input></td>
                            </tr>
                            <tr>
                                <td>Test@email.com</td>
                                <td><input type='checkbox'></input></td>
                            </tr>
                            <tr>
                                <td>Test@email.com</td>
                                <td><input type='checkbox'></input></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='d-griditem-membertable-bottombuttoncontainer'>
                        <button id="d-griditem-membertable-bottombuttoncontainer-1">Invite</button>
                        <button id="d-griditem-membertable-bottombuttoncontainer-2">Update</button>
                    </div>
                </div>
                <div className='d-griditem-reg'>
                    <p id="d-griditem-title">Parts</p>
                </div>
                <div className='d-griditem-reg'>
                    <p id="d-griditem-title">Upcoming</p>
                </div>
                <div className='d-griditem-reg'>
                    <p id="d-griditem-title">Batteries</p>
                </div>
                <div className='d-griditem-reg'>
                    <p id="d-griditem-title">Packing List</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default HomePageDesktop;