'use client';

import * as fal from '@fal-ai/serverless-client';
import Image from "next/image";
import { useEffect, useState, useMemo } from 'react';
import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import io from 'socket.io-client';

// @snippet:start(client.config)
fal.config({
    // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
    requestMiddleware: fal.withProxy({
      targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
      // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
    }),
});

// DATA BASE AI
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// -- moraine
// const MW = [
//     {url:'https://ai.zirolu.id/amero/style/amero/woman-0.jpeg'},
//     {url:'https://ai.zirolu.id/amero/style/amero/woman-4.jpeg'}
// ]
// !DATA BASE AI

// const DEFAULT_PROMPT = 'anime style illustration of techwear, cyborg ninja, holding a sword, wearing a mask, striking pose, all limbs appear in frame, japanese vibe, detailed design for streetwear and urban style t-shirt design, solid color background, etc pro vector';
const DEFAULT_NEG_PROMPT = 'extra head, extra face, double head, double face, (((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), boobs, sexy, blurry, low resolution, low quality, pixelated, interpolated, compression artifacts, noisey, grainy';
let URL_RESULT = ''
let FACE_URL_RESULT = ''
export default function GenerateAmero() {
    const router = useRouter();
    const [prompt, setPrompt] = useState(null);

    const [prompt1, setPrompt1] = useState();
    const [prompt2, setPrompt2] = useState();
    let promptCombine = prompt1 + prompt2;

    const negative_prompt = DEFAULT_NEG_PROMPT;
    const [imageFile, setImageFile] = useState(null);
    const [CGF, setCGF] = useState(13);
    const [numSteps, setNumSteps] = useState(80);
    const [styleGender, setStyleGender] = useState(null);
    const [stylePrompt, setStylePrompt] = useState(null);
    const [styleNumber, setStyleNumber] = useState(null);
    const [character, setCharacter] = useState(null);
    const [characterURL, setCharacterURL] = useState(null);
    
    const [numProses, setNumProses] = useState(0);
    const [numProses1, setNumProses1] = useState(null);
    // Result state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultFaceSwap, setResultFaceSwap] = useState(null);
    const [logs, setLogs] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    // @snippet:end
    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('faceImage')
            setImageFile(item)
        }
    }, [imageFile])

    const generateAI = () => {
        setNumProses1(true)
        // console.log(styleGender)
        // console.log(character)
        
        if(styleGender =='male'){
            setTimeout(() => {
                generateImageSwap(character, styleGender, getRandomInt(0, 11))
            }, 500);
        }else if(styleGender =='female'){
            setTimeout(() => {
                generateImageSwap(character, styleGender, getRandomInt(0, 10))
            }, 500);
        }

    }

    const image = useMemo(() => {
      if (!result) {
        return null;
      }
      if (result.image) {
        return result.image;
      }
      
    }, [result]);
    const imageFaceSwap = useMemo(() => {
      if (!resultFaceSwap) {
        return null;
      }
      if (resultFaceSwap.image) {
        return resultFaceSwap.image;
      }
      return null;
    }, [resultFaceSwap]);
    
    const reset = () => {
      setLoading(false);
      setError(null);
      setResult(null);
      setResultFaceSwap(null);
      setLogs([]);
      setElapsedTime(0);
    };
    const reset2 = () => {
      setLoading(false);
      setError(null);
      // setLogs([]);
      setElapsedTime(0);
    };
  
    const generateImage = async () => {
        setNumProses(1)
      reset();
      // @snippet:start("client.queue.subscribe")
      setLoading(true);
      const start = Date.now();
      try {
        const result = await fal.subscribe(
          'fal-ai/ip-adapter-face-id',
          {
            input: {
              prompt: promptCombine,
              face_image_url: imageFile,
              negative_prompt,
              guidance_scale: CGF,
              num_inference_steps: numSteps,
              width: 624,
              height: 1024
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
              setElapsedTime(Date.now() - start);
              if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
              ) {
                setLogs((update.logs || []).map((log) => log.message));
                // console.log(update)
              }
            },
          }
        );
        setResult(result);
        URL_RESULT = result.image.url
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("generateURLResult", URL_RESULT)
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        setElapsedTime(Date.now() - start);
        generateImageSwap()
      }
      // @snippet:end
    };

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))


    const generateImageSwap = async (character, gender, number) => {
        // console.log(gender)
        // console.log(number)
        // const urlGambar = 'https://ai.mudikbersamakai.com/kai/style/'+gender+'-'+number+'.jpeg'
        const urlGambar = character;
        console.log(urlGambar)
        setNumProses(2)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();
        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                // base_image_url: URL_RESULT,
                // swap_image_url: '/amero/base/'+character
                base_image_url: urlGambar,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap(result);
        FACE_URL_RESULT = result.image.url;

        // emitStrsing("sendImage", result.image.url);

        toDataURL(FACE_URL_RESULT)
        .then(dataUrl => {
            // console.log('RESULT:', dataUrl)

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase64", dataUrl)
                localStorage.setItem("faceURLResult", FACE_URL_RESULT)
            }
        
            setTimeout(() => {
                router.push('/result');
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    return (
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20">
            {numProses1 && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                    {/* <div className='relative w-[250px] h-[78px] lg:w-[655px] lg:h-[206px] overflow-hidden'>
                        <div className='animate-loading1 absolute left-0 top-0 w-full mx-auto flex justify-center items-center pointer-events-none'>
                            <Image src='/loading.png' width={770} height={714} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div> */}
                    <div className='relative w-[80%] overflow-hidden'>
                        <div className='relative w-full'>
                            <Image src='/kai/funfact.png' width={770} height={574} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    <div className='animate-upDownCepet relative py-2 px-4 mt-5 lg:mt-24 lg:p-5 lg:text-4xl border-2 border-[#9B07C9] text-center bg-[#630082] text-[#fff] lg:font-bold rounded-lg'>
                        <p>{`Please wait, loading...`}</p>
                        <p>{`Process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 2)`}</p>
                        {error}
                    </div>

                    <pre className='relative py-2 px-4 mt-5 lg:mt-24 border-2 border-[#9B07C9] text-left bg-[#630082] text-[#fff] text-xs lg:text-3xl overflow-auto no-scrollbar h-[100px] w-[60%] mx-auto rounded-lg'>
                        <code>
                        {logs.filter(Boolean).join('\n')}
                        </code>
                        AI generate face... <br></br>
                        Loading model..<br></br>
                    </pre>
                </div>
            }
            {/* LOADING */}
            {/* PILIH STYLE */}
            <div className='fixed top-14 w-[70%]'>
                <Image src='/title-select.png' width={686} height={112} alt='Zirolu' className='w-full' priority />
            </div>
            <div className={`relative w-full ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative mt-[-12vh] w-full'>
                    <div className='relative w-full hiddenx'>
                        <div className='relative w-[60%] mb-12 mx-auto'>
                            <Image src='/title-identity.png' width={542} height={119} alt='Zirolu' className='w-full' priority />
                        </div>
                        <div className='w-[72%] mx-auto'>
                            {/* GENDER FIX */}
                            <ul className='choose mod6'>
                                <li className='mb-10'>
                                    <input
                                    id='choose_gender1'
                                    type="radio"
                                    name='choose_gender'
                                    value="male"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender1">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/male.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li>
                                    <input
                                    id='choose_gender2'
                                    type="radio"
                                    name='choose_gender'
                                    value="female"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender2">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/female.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* {styleGender && character &&
                    <div className="relative w-full flex justify-center items-center lg:mt-10">
                        <button className="relative mx-auto w-[60%] flex justify-center items-center" onClick={generateAI}>
                            <Image src='/kai/btn-generate.png' width={480} height={96} alt='Zirolu' className='w-full' priority />
                        </button>
                    </div>
                } */}
                <div className={`fixed left-0 bottom-14 w-full`}>
                    <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                        <button className={`w-full relative mx-auto flex justify-center items-center ${!styleGender ? 'hidden' : ''}`} onClick={generateAI}>
                            <Image src='/btn-suprise.png' width={830} height={192} alt='Zirolu' className='w-full' priority />
                        </button>
                        <Link href='/home' className="relative w-full mx-auto flex justify-center items-center">
                            <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                        </Link>
                    </div>
                </div>
            </div>
            {/* !PILIH STYLE */}
        </main>
    );
}
