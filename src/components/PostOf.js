import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { OSMcontext } from '../OSMcontext';

import AllPostOfUser from './AllPostOfUser';


export default function PostOf(props) {
    const { userid } = useParams();

    const [profile, setProfile] = useState({});

    const [loading, setLoading] = useState(true)

    const { ourSocialMedia } = useContext(OSMcontext);

    useEffect(() => {
        loadUserDetail()
    }, [userid])

    const loadUserDetail = async () => {
        setLoading(true)
        const profile0 = await ourSocialMedia.methods.profileOf(userid).call();
        setProfile(profile0);
        setLoading(false)
    }

    return (
        <div className="container text-light">
            {loading
            ?
            <div className="text-center" id="commentLoader">
                <span class="spinner-border spinner-border"></span>
            </div>
            :
            <div className="d-flex align-items-center">
                <h2 className="mt-4">Posts of <span className="text-warning"> {profile.name}</span></h2>
                <h6 className="text-warning mt-4">{`(@${profile.userid})`}</h6>
                <h2 className="mt-4">:</h2>
            </div>
            }
            <AllPostOfUser userid={userid} />
        </div>
    )
}
