import React from "react";
export default function FileSystem({ videoList, setVideoList }) {
    return (
        <>
            <h1 style={{ color:"black"}}>FileSystem</h1>
            { videoList.length > 0 && 
                <div>
                    <h2>Video List</h2>
                    <ul>
                    {videoList.map((url) => (
                        <li>
                            <video controls width="720" height="480" src={url} />
                        </li>
                    ))}
                    </ul>
                </div>
            }
            
        </>
    );
}