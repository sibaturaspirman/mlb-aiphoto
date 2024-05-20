'use client';

import Image from "next/image";
// import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });

export default function MLBHome() {
  const router = useRouter();
  const [stasiun, setStasiun] = useState(null);

  const handleSubmit = () => {
    setCookie('stasiun', stasiun);
    setTimeout(() => {
        router.push('/v2/home');
    }, 250);
}

  return (
    <main className="flex fixed h-full w-full bg-kai overflow-auto flex-col justify-center items-center  py-16 px-20">
      <div className="relative w-[90%] mt-5 mb-10 lg:mt-20 lg:mb-14">
        <div className='relative w-full hiddenx'>
            <label htmlFor="choose_stasiun" className={`block mb-5 lg:mb-5 text-2xl lg:text-5xl text-center font-bold text-white ${poppins.className}`}>Pilih Lokasi</label>
            <div>
                <ul className='choose2-amero'>
                    <li>
                        <input
                        id='choose_stasiun1'
                        type="radio"
                        name='choose_stasiun'
                        value="1"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun1" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 1</label>
                    </li>
                    <li>
                        <input
                        id='choose_stasiun2'
                        type="radio"
                        name='choose_stasiun'
                        value="2"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun2" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 2</label>
                    </li>
                    <li>
                        <input
                        id='choose_stasiun3'
                        type="radio"
                        name='choose_stasiun'
                        value="3"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun3" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 3</label>
                    </li>
                </ul>
            </div>
        </div>
      </div>
      {stasiun &&
      <div className="relative w-full flex justify-center items-center lg:mt-20">
        <div className="relative mx-auto flex w-[90%] justify-center items-center" onClick={handleSubmit}>
          <Image src='/btn-continue.png' width={830} height={192} alt='Zirolu' className='w-full' priority />
        </div>
      </div>}
    </main>
  );
}
