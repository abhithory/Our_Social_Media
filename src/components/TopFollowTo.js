import React from 'react'
import Identicon from 'identicon.js';
import { Link } from 'react-router-dom';


export default function TopFollowTo(props) {
    const { allFollow } = props;

    return (
        <div className="container mt-5">
            <div className="scrollmenu">
                <Link to="/">
                <div className="circle-in-text bg-primary mr-2 scrollmenu-item"><i style={{ fontSize: 18 }} className="bi bi-box text-light " ></i></div>
                </Link>
                <div className="vi scrollmenu-item mr-1" style={{ opacity: 0.5 }}> | </div>
                {allFollow && allFollow.map((fo, key) => {
                    return (
                        <Link to={`/postsOf/${fo}`} key={key}>
                        <div className="ml-1 scrollmenu-item"><img
                            className='ml-2'
                            alt="logo"
                            className="ml-1 circle-in-text bg-primary scrollmenu-item"
                            src={`data:image/png;base64,${new Identicon(fo, 50).toString()}`}
                        /></div>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}
