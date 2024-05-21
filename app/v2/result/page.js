'use client';

import Link from 'next/link';
import Image from "next/image";
import { getCookie } from 'cookies-next';
import React,{ useEffect, useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
// import io from 'socket.io-client';
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
// import BtnHexagon2 from "../components/BtnHexagon2";


export default function Result() {
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [loadingDownload, setLoadingDownload] = useState(null);
    let componentRef = useRef();

    const [payload, setPayload] = useState({
      name: 'MLB',
      phone: '001',
      stasiun: getCookie('stasiun'),
    });
    const { Canvas } = useQRCode();

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('resulAIBase64')
            const item2 = localStorage.getItem('faceURLResult')
            setImageResultAI(item)
            // setLinkQR(item2)
        }
    }, [imageResultAI, linkQR])

    const downloadImageAI = () => {
        import('html2canvas').then(html2canvas => {
            html2canvas.default(document.querySelector("#capture"), {scale:1}).then(canvas => 
                uploadImage(canvas)
            )
        }).catch(e => {console("load failed")})
    }
    const uploadImage = async (canvas) => {
        setLoadingDownload('≈')

        canvas.toBlob(async function(blob) {
            let bodyFormData = new FormData();
            bodyFormData.append("name", payload.name);
            bodyFormData.append("phone", payload.phone);
            bodyFormData.append("totemId", 1);
            bodyFormData.append("file", blob, payload.name+'-mlb-ai-zirolu.png');
          
            const options = {
                method: 'POST',
                body: bodyFormData,
                headers: {
                    'Authorization': 'af879432-317d-40b4-88f8-d4c02267112b:VDNwFD1gOp86AKVEqlCIbfVN4evXoBxL',
                    'Accept': 'application/json',
                }
            };
            
            await fetch('https://api.discoveryournextjourney.com/v1/photoai', options)
                .then(response => response.json())
                .then(response => {
                    // console.log(response)
                    // console.log(response.file)
                    setLinkQR(response.file)
                    setGenerateQR('true')
                    setLoadingDownload(null)
                })
                .catch(err => {
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem('faceURLResult')
                        setLinkQR(item)
                        setGenerateQR('true')
                        setLoadingDownload(null)
                    }
                });
        });
    }

    

    return (
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20" onContextMenu={(e)=> e.preventDefault()}>
            {/* QR */}
            {generateQR && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col z-40 bg-kai3 text-black bg-opacity-0'>
                    <div className='fixed top-0 mx-auto w-[85%] mt-24'>
                        <Image src='/title-scan2.png' width={815} height={195} alt='Zirolu' className='w-full' priority />
                    </div>
                    <div className='relative mt-[-14vh] w-[60%] mx-auto flex items-center justify-center canvas-qr border-4 border-black' onClick={()=>{setGenerateQR(null)}}>
                        <Canvas
                        text={linkQR}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 500,
                            color: {
                            dark: '#000000',
                            light: '#ffffff',
                            },
                        }}
                        />
                    </div>
                    {/* <p className={`text-center font-semibold text-2xl lg:text-4xl mt-10 ${poppins.className}`}>Scan this QR Code to Download your image.</p> */}

                    {/* <div className={`relative w-full  ${showEmail ? 'hidden' : ''}`}>
                    <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col mt-5">
                        <button className="relative mx-auto flex justify-center items-center" onClick={()=>setSendEmailGak('true')}>
                            <Image src='/btn-send-email.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                        </button>
                        <a href={linkQR} target='_blank' className="relative mx-auto flex justify-center items-center">
                            <Image src='/btn-download-image.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                        </a>
                    </div>
                    </div> */}
                    {/* <Link href='/' className='text-center font-semibold text-lg mt-2 p-20' onClick={()=>{setGenerateQR(null)}}>Tap here to close</Link> */}
                    {/* <a href='/home' className='text-center font-semibold text-4xl py-20 pb-36 p-40'>Tap here to close</a> */}

                    <div className={`fixed left-0 bottom-0 w-full`}>
                        <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                            <Link href='/v2/home' className="relative w-full mx-auto flex justify-center items-center pb-14">
                                <Image src='/btn-back2.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                            </Link>
                        </div>
                    </div>
                </div>
            }
            {/* QR */}

            <div className={generateQR ? `opacity-0 pointer-events-none` : ''}>
                {/*<div className='relative m-auto w-[65%]'>
                    <Image src='/title-discover.png' width={626} height={160} alt='Zirolu' className='w-full' priority />
                </div>*/}
                {imageResultAI && 
                <div className='relative w-[92%] mt-10 mx-auto flex justify-center items-center  border-4 border-[#ffffff] rounded-sm' onClick={downloadImageAI}>
                    <div className='relative w-full' id='capture' ref={(el) => (componentRef = el)}>
                        <Image src={imageResultAI}  width={624} height={832} alt='Zirolu' className='relative block w-full'></Image>

                        <Image width={624} height={832} alt='Zirolu' className='absolute  block left-0 top-0 w-full mx-auto pointer-events-none z-10' src='data:image/png;base64,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IASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACQAIAIhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFAB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' />
                    </div>
                </div>
                }
                {loadingDownload && 
                    <div className='rrelative p-5 mt-14 border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] text-4xl overflow-auto no-scrollbar w-[70%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                }
                <div className={`relative w-full ${loadingDownload ? 'hidden' : ''}`}>
                    <div className={`w-full`} onClick={downloadImageAI}>
                        <div className={`w-full mt-14`}>
                            <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                                <div className="w-full relative mx-auto flex justify-center items-center">
                                    <Image src='/btn-collect.png' width={480} height={96} alt='Zirolu' className='w-full' priority />
                                </div>
                                <Link href='/v2/home' className="relative w-full mx-auto flex justify-center items-center">
                                    <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
