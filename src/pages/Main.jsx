import React from 'react';
import Header from '../components/Header';
import NewsWidget from '../components/NewsWidget';

export default function Main() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-5 py-6">
        <NewsWidget />
      </div>
    </div>
  );
}
