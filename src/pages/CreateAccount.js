import React, { useContext, useState } from 'react'
import { OSMcontext } from '../OSMcontext';

export default function CreateAccount(props) {

    const { createAccount } = props;

    const { account, ourSocialMedia } = useContext(OSMcontext);

    const [isIdAvailable, setIsIdAvailable] = useState(false);
    const [loading, setLoading] = useState(false);


    const checkUserid = async () => {
        const _userid0 = document.getElementById('userid_box').value;

        if (_userid0 && !loading) {
            setLoading(true);
            const _userid = _userid0.trim();
            document.getElementById('userid_box').value = _userid
            
            const _isAvailable = await ourSocialMedia.methods.isUserIDExist(_userid).call();
            setIsIdAvailable(!_isAvailable)
            
            setLoading(false);
            return !_isAvailable;
        }
    }

    const createAccount0 = async () => {
        const _name0 = document.getElementById('username_box').value;
        const _userid0 = document.getElementById('userid_box').value;

        const _isUserId = await checkUserid();

        if (_name0 && _userid0 && _isUserId) {
            const _name = _name0.trim();
            const _userid = _userid0.trim();

            document.getElementById('username_box').value = _name;
            document.getElementById('userid_box').value = _userid;

            createAccount(_name, _userid);
        }

    }

    return (
        <div className="container text-center text-light">
            <h1 className="mt-5">Create Account</h1>
            <div className="m-5">
                <div className="input-group mb-3 mx-5">
                    <input id="username_box" type="text" className="form-control" placeholder={`Enter your Name (Default:${account}) `} />
                </div>

                <div className="input-group mb-3 mx-5">
                    <input id="userid_box" type="text" className="form-control" placeholder={`Enter your unique userid like:- my_id (Default:${account}) `} />



                    <button className={`btn  btn-${isIdAvailable ? 'warning' : 'outline-danger'}`} onClick={checkUserid} type="button" id="button-addon2">
                        {isIdAvailable ? 'Available' : 'Check Availability'} {loading&&<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}</button>
                </div>

                <div className="mb-5">

                    <p>Please Enter <spam className="text-warning">Userid</spam>  and click on <spam className="text-warning">Check Availability</spam></p>
                </div>

                <div className="">
                    {isIdAvailable
                        ?
                        <h6 className="text-warning">✔ This userid is Availability ✔</h6>
                        :
                        <h6 className="text-danger">✘ This userid is already taken ✘</h6>
                    }
                </div>

                <button disabled={!isIdAvailable} onClick={createAccount0} className={`btn ${isIdAvailable ? 'btn-warning' : 'btn-danger'}`}>Create Account</button>

            </div>
        </div>
    )
}
