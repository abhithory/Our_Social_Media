import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router';
import Identicon from 'identicon.js';
import AllPostOfUser from '../components/AllPostOfUser';

import '../css/ProfileCss.css';
import { OSMcontext } from '../OSMcontext';

export default function Profile(props) {

    const { userid } = useParams();

    const { follow, isFollowedByUser, isAccountCreated, ourSocialMedia } = useContext(OSMcontext);

    const history = useHistory();
    const [userTotalFollowing, setUserTotalFollowing] = useState(0);
    const [profile, setProfile] = useState({});
    const [usertotalpostCount, setUsertotalpostCount] = useState();
    const [isFollowedByUser0, SetIsFollowedByUser] = useState();

    useEffect(() => {
        loadProfile();
        loadPost();
    }, [userid]);

    const loadProfile = async () => {
        const profile0 = await ourSocialMedia.methods.profileOf(userid).call();
        setProfile(profile0);

        const followCount = await ourSocialMedia.methods.totalFollowCountOfUser(userid).call();
        setUserTotalFollowing(followCount);

        const isFollowed = await isFollowedByUser(userid);
        SetIsFollowedByUser(isFollowed);
    }

    const loadPost = async () => {
        const usertotalpostCount0 = await ourSocialMedia.methods.totalPostsCountOfUser(userid).call();
        await setUsertotalpostCount(usertotalpostCount0.toNumber());
    }

    const follow0 = () => {

        if (userid) {
            if (isAccountCreated) {
                follow(userid)
            } else {
                history.push("/createProfile");
            }
        }
    }


    return (
        <div className="container ">
            <div className="row py-5 px-4">
                <div className="col-md-5 mx-auto">
                    <div className="bg-white shadow rounded overflow-hidden">
                        <div className="px-4 pt-0 pb-4 cover">
                            <div className="media align-items-end profile-head">
                                <div className="profile mr-3"><img src={`data:image/png;base64,${new Identicon(userid, 50).toString()}`} alt="..." width="130" className="rounded mb-2 img-thumbnail" />
                                    <button onClick={follow0} disabled={isFollowedByUser0} class="btn btn-outline-dark btn-sm btn-block">{isFollowedByUser0 ? 'Followed' : 'Follow'}</button>
                                </div>
                                <div className="media-body mb-5 text-white">
                                    <h4 className="mt-0 mb-0">{profile.name}</h4>
                                    <p className="small mb-4"> <i className="fas fa-map-marker-alt mr-2"></i>{profile.userid}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-light p-4 d-flex justify-content-end text-center">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                    <h5 className="font-weight-bold mb-0 d-block">{usertotalpostCount}</h5><small className="text-muted"> <i className="fas fa-image mr-1"></i>Posts</small>
                                </li>
                                <li className="list-inline-item">
                                    <h5 className="font-weight-bold mb-0 d-block">{profile.Followers && profile.Followers.toNumber()}</h5><small className="text-muted"> <i className="fas fa-user mr-1"></i>Followers</small>
                                </li>
                                <li className="list-inline-item">
                                    <h5 className="font-weight-bold mb-0 d-block">{userTotalFollowing && userTotalFollowing.toNumber()}</h5><small className="text-muted"> <i className="fas fa-user mr-1"></i>Following</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 px-4 text-light">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Recent Posts:</h5>
                </div>
                <AllPostOfUser userid={userid} />

            </div>
        </div>
    )
}
