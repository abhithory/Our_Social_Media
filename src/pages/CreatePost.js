import React, { useState } from 'react'
import Compress from 'compress.js';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });


export default function CreatePost(props) {

    const { createPost } = props;

    const [loading, setLoading] = useState(false);

    const [imgToShow, SetImgToShow] = useState("");
    const [imgBuffer, SetImgBuffer] = useState("");

    const captureFile = async (event) => {
        event.preventDefault()
        const files = [...event.target.files]

        const compress = new Compress();
        compress.compress(files, {
            size: 1, // the max size in MB, defaults to 2MB
            quality: 0.5 // the quality of the image, max is 1,
        }).then((results) => {
            const img1 = results[0]
            const file = Compress.convertBase64ToFile(img1.data, img1.ext)
            SetImgToShow(URL.createObjectURL(file))

            const reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
                SetImgBuffer(Buffer(reader.result));
            }
        })



    }

    const createPost0 = async () => {

        const _content0 = document.getElementById('postTextBox').value;
        const _content = _content0.trim();

        if (!loading) {

            if (imgBuffer) {
                setLoading(true)
                uploadToIPFS(_content);
            } else if (_content) {
                setLoading(true)
                document.getElementById('postTextBox').value = _content;
                createPost(_content, "")
                setLoading(false)
            }
        }

    }

    const uploadToIPFS = async (_content) => {
        ipfs.add(imgBuffer)
            .then(result => {
                createPost(_content, result.path)
                setLoading(false)

            })
            .catch(error =>
                console.error(error)
            )

    }

    return (
        <div className="container text-center text-light my-5">
            <h1 className="">Create Post</h1>
            <div className="mt-4">

                <div className="col-12">

                    <textarea className="form-control " rows="8" maxLength="420" placeholder="What's in your mind? type here" id="postTextBox">
                    </textarea>
                </div>

                <div class="col-12 my-3 text-start">
                    <label for="formFile" class="form-label">Select image (if you want to upload image)</label>
                    <input class="form-control" accept="image/*" onChange={captureFile} type="file" id="formFile" />
                </div>
                <div className="col-12">
                    {imgToShow &&
                        <img className='img-fluid' style={{ height: 200 }} src={imgToShow} alt="" />
                    }
                </div>
                <button onClick={createPost0} className="btn btn-warning mt-3">
                    {loading && <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
                    Create Post</button>

            </div>
        </div>
    )
}
