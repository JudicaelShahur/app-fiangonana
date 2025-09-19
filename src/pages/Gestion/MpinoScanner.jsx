import React, { useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";

const MpinoScanner = ({ onDetect, constraints = { facingMode: "environment" }, isOpen }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!isOpen && videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{ width: "100%", marginTop: "10px" }}>
            <QrReader
                videoRef={videoRef}
                onResult={(result, error) => {
                    if (!!result) onDetect(result?.text);
                    if (!!error) console.log(error);
                }}
                constraints={constraints}
            />
        </div>
    );
};

export default MpinoScanner;
