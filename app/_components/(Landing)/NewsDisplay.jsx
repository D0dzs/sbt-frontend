'use client';

import { useContext } from 'react';
import { MobileContext } from '../Providers/Screen-provider';
import NewsCard from './NewsCard';
import NewsSwiper from './NewsSwiper';
import { mockUpNews } from '~/lib/mockupData';

const NewsDisplay = () => {
  const isMobile = useContext(MobileContext);

  return isMobile ? (
    <div className="mx-auto w-full">
      <NewsSwiper customArray={mockUpNews} />
    </div>
  ) : (
    <div className="flex justify-around">
      {mockUpNews.map((news, idx) => (
        <NewsCard key={idx} title={news.title} date={news.date} imageURL={news.imageURL} />
      ))}
    </div>
  );
};

export default NewsDisplay;
