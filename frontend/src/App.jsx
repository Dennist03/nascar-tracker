import { useState } from 'react';
import Header from './components/Layout/Header.jsx';
import TabNav from './components/Layout/TabNav.jsx';
import MyDriverTab from './components/MyDriver/MyDriverTab.jsx';
import RacesTab from './components/Races/RacesTab.jsx';
import LiveTab from './components/Live/LiveTab.jsx';

export default function App() {
  const [tab, setTab] = useState('live');

  return (
    <div className="min-h-screen bg-nascar-bg flex flex-col">
      <Header />
      <TabNav active={tab} onChange={setTab} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 pb-20 md:pb-4">
        {tab === 'driver' && <MyDriverTab />}
        {tab === 'races' && <RacesTab />}
        {tab === 'live' && <LiveTab />}
      </main>
    </div>
  );
}
