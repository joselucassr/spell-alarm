import { useEffect, useRef, useState } from 'react';

const AudioLoops = () => {
  const timers = useRef([]);
  const lookMapAudio = useRef(null);
  const lookItemAudio = useRef(null);

  useEffect(() => {
    if (!lookMapAudio.current)
      lookMapAudio.current = document.getElementById('lookMap');

    if (!lookItemAudio.current)
      lookItemAudio.current = document.getElementById('lookItem');
  }, []);

  const [mapStarted, setMapStarted] = useState(false);
  const startMap = () => {
    if (!timers.current[0]) {
      setMapStarted(true);
      timers.current[0] = setInterval(() => {
        lookMapAudio.current.volume = localStorage.getItem(
          '@spell-alarm/lookMapVolume',
        );
        lookMapAudio.current.load();
        lookMapAudio.current.play();
      }, localStorage.getItem('@spell-alarm/lookMapFrequency'));
    } else {
      clearInterval(timers.current[0]);
      timers.current[0] = null;
      setMapStarted(false);
    }
  };

  const [itemStarted, setItemStarted] = useState(false);
  const startItem = () => {
    if (!timers.current[1]) {
      setItemStarted(true);
      timers.current[1] = setInterval(() => {
        lookItemAudio.current.volume = localStorage.getItem(
          '@spell-alarm/lookItemVolume',
        );
        lookItemAudio.current.load();
        lookItemAudio.current.play();
      }, localStorage.getItem('@spell-alarm/lookItemFrequency'));
    } else {
      clearInterval(timers.current[1]);
      timers.current[1] = null;
      setItemStarted(false);
    }
  };

  return (
    <div className='w-full'>
      <audio src='/audios/lookMap.mp4' id='lookMap'></audio>
      <audio src='/audios/lookItem.mp4' id='lookItem'></audio>
      <div className='flex justify-between w-full'>
        <button
          className={`${
            mapStarted
              ? 'bg-green-600 text-white hover:bg-green-800'
              : 'bg-white hover:bg-gray-200'
          } w-2/5 py-1 `}
          onClick={() => startMap()}
        >
          MAPA
        </button>{' '}
        <button
          className={`${
            itemStarted
              ? 'bg-green-600 text-white hover:bg-green-800'
              : 'bg-white hover:bg-gray-200'
          } w-2/5 py-1 `}
          onClick={() => startItem()}
        >
          ITEM
        </button>
      </div>
    </div>
  );
};

export default AudioLoops;
