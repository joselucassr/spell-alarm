import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Icons
import { IoArrowBack } from 'react-icons/io5';
import { VscDebugBreakpointLog } from 'react-icons/vsc';

// Images
import BarrierImage from '../public/images/barrier.png';
import CleanseImage from '../public/images/cleanse.png';
import ExhaustImage from '../public/images/exhaust.png';
import FlashImage from '../public/images/flash.png';
import GhostImage from '../public/images/ghost.png';
import HealImage from '../public/images/heal.png';
import IgniteImage from '../public/images/ignite.png';
import TeleportImage from '../public/images/teleport.png';

const Settings = ({ setMenuIsOpen, menuIsOpen }) => {
  const images = [
    {
      name: 'barrier',
      src: BarrierImage,
    },
    {
      name: 'cleanse',
      src: CleanseImage,
    },
    {
      name: 'exhaust',
      src: ExhaustImage,
    },
    {
      name: 'flash',
      src: FlashImage,
    },
    {
      name: 'ghost',
      src: GhostImage,
    },
    {
      name: 'heal',
      src: HealImage,
    },
    {
      name: 'ignite',
      src: IgniteImage,
    },
    {
      name: 'teleport',
      src: TeleportImage,
    },
  ];

  const [selectedSpells, setSelectedSpells] = useState([
    'barrier',
    'cleanse',
    'exhaust',
    'flash',
    'ghost',
    'heal',
    'ignite',
    'teleport',
  ]);

  const onSpellClick = (spellName) => {
    let tempArray = [...selectedSpells];

    let index = tempArray.indexOf(spellName);
    if (index > -1) {
      tempArray.splice(index, 1);

      setSelectedSpells(tempArray);
    } else {
      tempArray.push(spellName);
      setSelectedSpells(tempArray);
    }
  };
  const [spellBackVolume, setSpellBackVolume] = useState(0.2);
  const [lookMapVolume, setLookMapVolume] = useState(0.2);
  const [lookItemVolume, setLookItemVolume] = useState(0.2);
  const [lookMapFrequency, setLookMapFrequency] = useState(3000);
  const [lookItemFrequency, setLookItemFrequency] = useState(3000);
  const spellBackAudio = useRef(null);
  const lookMapAudio = useRef(null);
  const lookItemAudio = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('@spell-alarm/selectedSpells'))
      setSelectedSpells(
        JSON.parse(localStorage.getItem('@spell-alarm/selectedSpells')),
      );
    if (localStorage.getItem('@spell-alarm/spellBackVolume'))
      setSpellBackVolume(localStorage.getItem('@spell-alarm/spellBackVolume'));

    if (localStorage.getItem('@spell-alarm/lookMapVolume'))
      setLookMapVolume(localStorage.getItem('@spell-alarm/lookMapVolume'));

    if (localStorage.getItem('@spell-alarm/lookItemVolume'))
      setLookItemVolume(localStorage.getItem('@spell-alarm/lookItemVolume'));

    if (localStorage.getItem('@spell-alarm/lookMapFrequency'))
      setLookMapFrequency(
        localStorage.getItem('@spell-alarm/lookMapFrequency'),
      );

    if (localStorage.getItem('@spell-alarm/lookItemFrequency'))
      setLookItemFrequency(
        localStorage.getItem('@spell-alarm/lookItemFrequency'),
      );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      '@spell-alarm/selectedSpells',
      JSON.stringify(selectedSpells),
    );
  }, [selectedSpells]);

  useEffect(() => {
    localStorage.setItem('@spell-alarm/spellBackVolume', spellBackVolume);
  }, [spellBackVolume]);

  useEffect(() => {
    localStorage.setItem('@spell-alarm/lookMapVolume', lookMapVolume);
  }, [lookMapVolume]);

  useEffect(() => {
    localStorage.setItem('@spell-alarm/lookItemVolume', lookItemVolume);
  }, [lookItemVolume]);

  useEffect(() => {
    localStorage.setItem('@spell-alarm/lookMapFrequency', lookMapFrequency);
  }, [lookMapFrequency]);

  useEffect(() => {
    localStorage.setItem('@spell-alarm/lookItemFrequency', lookItemFrequency);
  }, [lookItemFrequency]);

  return (
    <div
      className={`absolute mx-auto py-4 sm:px-6 bg-gray-900/90 z-10 inset-0 h-screen overflow-y-auto ${
        !menuIsOpen && 'hidden'
      }`}
      onClick={() => setMenuIsOpen(false)}
    >
      <audio id='spellBackTest' src='/audios/spellBack.mp4'></audio>
      <audio id='lookMapTest' src='/audios/lookMap.mp4'></audio>
      <audio id='lookItemTest' src='/audios/lookItem.mp4'></audio>

      <div
        className='max-w-xl mx-auto border-x-2 px-2 border-x-gray-900/20'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='flex justify-between items-center py-6 max-w-xl mx-auto md:justify-start md:space-x-10 text-3xl z-30'>
          <h1 className='font-nunito font-bold text-white left-0 top-0'>
            Configurações
          </h1>
          <div
            className='flex items-center justify-end flex-1 lg:w-0 text-white space-x-3 text-xl'
            onClick={() => setMenuIsOpen(!menuIsOpen)}
          >
            <IoArrowBack
              className='float-right hover:cursor-pointer'
              size={25}
            />
          </div>
        </div>
        <div className='font-nunito mx-auto max-w-xl text-xl text-white mt-4'>
          Clique nos feitiços que quer copiar, PC apenas.
        </div>
        <div className='grid grid-cols-4 gap-4 mx-auto max-w-xl mt-8'>
          {images &&
            images.map((image) => (
              <div key={image.name} className={'w-16 mx-auto'}>
                <Image
                  className={`${
                    !selectedSpells.includes(image.name) && 'grayscale'
                  } hover:brightness-75`}
                  src={image.src}
                  alt={image.name}
                  onClick={() => onSpellClick(image.name)}
                />
              </div>
            ))}
        </div>

        <div className='border-b-2 border-gray-400 my-3 max-w-xl mx-auto'></div>

        <div className='flex flex-col items-center space-y-8 font-mont max-w-xl mx-auto'>
          <div className='w-full'>
            <div className='flex justify-between align-middle mb-3'>
              <p className='self-center text-white font-mont font-light'>
                • Volume de retorno de feitiço:{' '}
                <span className='font-bold'>
                  {Math.floor(spellBackVolume * 100)}
                </span>
              </p>
              <button
                className='bg-gray-200 p-2 text-gray-600 rounded-md'
                onClick={() => {
                  if (!spellBackAudio.current)
                    spellBackAudio.current =
                      document.getElementById('spellBackTest');

                  spellBackAudio.current.volume = spellBackVolume;
                  spellBackAudio.current.load();
                  spellBackAudio.current.play();
                }}
              >
                TESTAR
              </button>
            </div>
            <input
              type={'range'}
              min={1}
              max={100}
              className='w-full'
              value={(spellBackVolume * 100).toString()}
              onChange={(e) => {
                setSpellBackVolume(parseInt(e.target.value) / 100);
              }}
            />
          </div>

          <div className='w-full'>
            <div className='flex justify-between align-middle mb-3'>
              <p className='self-center text-white font-mont font-light'>
                • Volume de aviso de mapa:{' '}
                <span className='font-bold'>
                  {Math.floor(lookMapVolume * 100)}
                </span>
              </p>
              <button
                className='bg-gray-200 p-2 text-gray-600 rounded-md'
                onClick={() => {
                  if (!lookMapAudio.current)
                    lookMapAudio.current =
                      document.getElementById('lookMapTest');

                  lookMapAudio.current.volume = lookMapVolume;
                  lookMapAudio.current.load();
                  lookMapAudio.current.play();
                }}
              >
                TESTAR
              </button>
            </div>
            <input
              type={'range'}
              min={1}
              max={100}
              className='w-full'
              value={(lookMapVolume * 100).toString()}
              onChange={(e) => {
                setLookMapVolume(parseInt(e.target.value) / 100);
              }}
            />
            <div className='flex flex-col space-y-2 mt-2'>
              <p className='text-white font-mont font-light'>
                • Frequência de aviso de mapa (Em segundos)
                <br />
                <span className='text-sm text-white/60'>
                  - Alterar antes de iniciar o timer
                </span>
              </p>
              <input
                type={'number'}
                className='text-center'
                value={(lookMapFrequency / 1000).toString()}
                min={1}
                onChange={(e) => {
                  let tempCheck = parseInt(e.target.value);
                  if (tempCheck < 1 || !tempCheck) tempCheck = 1;
                  setLookMapFrequency(tempCheck * 1000);
                }}
              />
            </div>
          </div>
          <div className='w-full'>
            <div className='flex justify-between align-middle mb-3'>
              <p className='self-center text-white font-mont font-light'>
                Volume de aviso de item:{' '}
                <span className='font-bold'>
                  {Math.floor(lookItemVolume * 100)}
                </span>
              </p>
              <button
                className='bg-gray-200 p-2 text-gray-600 rounded-md'
                onClick={() => {
                  if (!lookMapAudio.current)
                    lookItemAudio.current =
                      document.getElementById('lookItemTest');

                  lookItemAudio.current.volume = lookItemVolume;
                  lookItemAudio.current.load();
                  lookItemAudio.current.play();
                }}
              >
                TESTAR
              </button>
            </div>
            <input
              type={'range'}
              min={1}
              max={100}
              className='w-full'
              value={(lookItemVolume * 100).toString()}
              onChange={(e) => {
                setLookItemVolume(parseInt(e.target.value) / 100);
              }}
            />
            <div className='flex flex-col space-y-2 mt-2 mb-12'>
              <p className='text-white font-mont font-light'>
                • Frequência de aviso de item (Em segundos)
                <br />
                <span className='text-sm text-white/60'>
                  - Alterar antes de iniciar o timer
                </span>
              </p>
              <input
                type={'number'}
                className='text-center'
                value={(lookItemFrequency / 1000).toString()}
                min={1}
                onChange={(e) => {
                  let tempCheck = parseInt(e.target.value);
                  if (tempCheck < 1 || !tempCheck) tempCheck = 1;
                  setLookItemFrequency(tempCheck * 1000);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
