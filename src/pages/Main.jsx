import Header from '../components/Header';
import MarketsWidget from '../components/MarketsWidget';
import SignalsWidget from '../components/SignalsWidget';
import TodayCoins from '../components/TodayCoins';
import NewsWidget from '../components/NewsWidget';

export default function Main() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-5 py-6">
        <MarketsWidget />
        <div className="mt-4" />
        <SignalsWidget />
        <div className="mt-4" />
        <TodayCoins />
        <NewsWidget />
      </div>
    </div>
  );
}
