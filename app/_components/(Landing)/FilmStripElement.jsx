'use client';

import Image from 'next/image';

const FilmStripElement = ({ imageURL }) => {
  return (
    <div className="relative -m-px flex shrink-0 flex-col overflow-hidden lg:h-50">
      {/* eslint-disable */}
      <img src={'/hero/dfilmstrip.svg'} alt="Filmstrip" className="z-10 h-full dark:hidden" />
      <img src={'/hero/lfilmstrip.svg'} alt="Filmstrip" className="z-10 hidden h-full dark:block" />
      {/* eslint-enable */}
      <div className="absolute top-1/2 left-1/2 aspect-[4/3] w-full -translate-x-1/2 -translate-y-1/2">
        <Image src={imageURL} alt="carousel image" width={400} height={300} className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default FilmStripElement;
