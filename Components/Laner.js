import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Icons
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

// Images
import BarrierImage from '../public/images/barrier.png';
import CleanseImage from '../public/images/cleanse.png';
import ExhaustImage from '../public/images/exhaust.png';
import FlashImage from '../public/images/flash.png';
import GhostImage from '../public/images/ghost.png';
import HealImage from '../public/images/heal.png';
import IgniteImage from '../public/images/ignite.png';
import IonianImage from '../public/images/ionian.png';
import SmiteImage from '../public/images/smite.png';
import TeleportImage from '../public/images/teleport.png';

// Audio
// import SpellBackAudio from '../public/sounds/spellBack.mp4';

// DB
import { times } from '../DB/times';

const Laner = ({ laneName, laners, sendTimes }) => {
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
    {
      name: 'smite',
      src: SmiteImage,
    },
    {
      name: 'ionian',
      src: IonianImage,
    },
  ];

  const [thisLaner, setThisLaner] = useState({});
  const [spellsRemaining, setSpellsRemaining] = useState({
    spell1: 0,
    spell2: 0,
  });

  useEffect(() => {
    setThisLaner(laners.find((l) => l.name === laneName));

    console.log('Check for loop');
  }, []);

  const timers = useRef([]);
  const spellBackAudio = useRef(null);

  const usedSpell = (pos) => {
    if (thisLaner[`spell${pos}`] == 'smite') return;

    if (!spellBackAudio.current)
      spellBackAudio.current = document.getElementById('spellBack');

    if (!timers.current[`${pos - 1}`]) {
      setThisLaner((prevState) => ({
        ...prevState,
        [`hasSpell${pos}`]: false,
      }));
      let startTime = Date.now();

      let spellDuration = times.spells[thisLaner[`spell${pos}`]].duration;

      if (thisLaner.hasIonian)
        spellDuration = spellDuration * (100 / (100 + times.cd.ionian.haste));

      setSpellsRemaining((prevState) => ({
        ...prevState,
        [`spell${pos}`]: Math.ceil(spellDuration),
        // [`spell${pos}`]: Math.ceil(spellDuration / 100), // For debug
      }));

      sendTimes({
        laner: thisLaner.name,
        [`spell${pos}Name`]: thisLaner[`spell${pos}`],
        [`spell${pos}Duration`]: Math.ceil(spellDuration),
        // [`spell${pos}Duration`]: Math.ceil(spellDuration / 100), // For debug
        [`spell${pos}Canceled`]: false,
      });

      timers.current[`${pos - 1}`] = setInterval(() => {
        let delta = Date.now() - startTime;
        let totalSecs = Math.floor(delta / 1000);

        // console.log(totalSecs);
        // console.log(spellDuration / 100);
        // console.log(totalSecs >= spellDuration / 100);

        setSpellsRemaining((prevState) => ({
          ...prevState,
          [`spell${pos}`]: Math.ceil(spellDuration - totalSecs),
          // [`spell${pos}`]: Math.ceil(spellDuration / 100 - totalSecs), // For debug
        }));

        // Divide by 100 to test
        if (totalSecs >= spellDuration) {
          clearInterval(timers.current[`${pos - 1}`]);
          timers.current[`${pos - 1}`] = null;
          setThisLaner((prevState) => ({
            ...prevState,
            [`hasSpell${pos}`]: true,
          }));

          spellBackAudio.current.volume = localStorage.getItem(
            '@spell-alarm/spellBackVolume',
          );

          spellBackAudio.current.load();
          spellBackAudio.current.play();
        }
      }, 1000);
    } else {
      console.log(`useEffect => entered clearInterval${pos}`);
      clearInterval(timers.current[`${pos - 1}`]);
      timers.current[`${pos - 1}`] = null;
      setThisLaner({
        ...thisLaner,
        [`hasSpell${pos}`]: true,
      });
      sendTimes({
        laner: thisLaner.name,
        [`spell${pos}Canceled`]: true,
      });
    }
  };

  const [changeSpellIsHidden, setChangeSpellIsHidden] = useState(true);
  const [spellPosLabel, setSpellPosLabel] = useState(1);

  const openChangeSpellMenu = (e, pos) => {
    e.preventDefault();
    setSpellPosLabel(pos);
    setChangeSpellIsHidden(!changeSpellIsHidden);
  };

  const changeSpell = (pos, spellName) => {
    console.log(pos, spellName);

    if (
      (pos === 1 && spellName === thisLaner.spell2) ||
      (pos === 2 && spellName === thisLaner.spell1)
    ) {
      setThisLaner((prevState) => ({
        ...prevState,
        spell1: prevState.spell2,
        spell2: prevState.spell1,
      }));
    } else {
      setThisLaner((prevState) => ({
        ...prevState,
        [`spell${pos}`]: spellName,
      }));
    }
  };

  return (
    <div>
      <audio id='spellBack' src='/audios/spellBack.mp4'></audio>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full z-20 ${
          changeSpellIsHidden && 'hidden'
        }`}
        id='my-modal'
        onClick={() => setChangeSpellIsHidden(true)}
      >
        <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white text-center'>
          <div className='font-bold text-lg'>
            Feitiço {spellPosLabel}{' '}
            {thisLaner.name && thisLaner.name.toUpperCase()}
          </div>
          <div className='grid grid-rows-3 grid-flow-col gap-4 mx-auto max-w-xl mt-8'>
            {images &&
              images.map((image) => {
                if (image.name === 'ionian') return;

                return (
                  <div key={image.name} className={'w-16 mx-auto'}>
                    <Image
                      className={`${
                        (image.name == thisLaner.spell1 ||
                          image.name == thisLaner.spell2) &&
                        'grayscale'
                      } hover:brightness-75`}
                      src={image.src}
                      alt={image.name}
                      onClick={() => changeSpell(spellPosLabel, image.name)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center max-w-xl mx-auto'>
        <div className='text-xl flex-2 text-black font-mont'>
          {thisLaner.name && thisLaner.name.toUpperCase()}
          {thisLaner.name === 'jg' && <span className='invisible'>A</span>}
        </div>
        {/* <div
          className={`flex items-center text-3xl font-light flex-1 font-nunito pl-2 ${
            thisLaner.spell1 == 'teleport' || thisLaner.spell2 == 'teleport'
              ? ''
              : 'invisible'
          }`}
        >
          <FiChevronLeft
            className='hover:cursor-pointer'
            onClick={() => {
              thisLaner.level > 1 &&
                setThisLaner((prevState) => ({
                  ...prevState,
                  level: prevState.level - 1,
                }));
            }}
          />
          <div>{thisLaner.level && thisLaner.level}</div>
          <FiChevronRight
            className='hover:cursor-pointer'
            onClick={() => {
              thisLaner.level < 18 &&
                setThisLaner((prevState) => ({
                  ...prevState,
                  level: prevState.level + 1,
                }));
            }}
          />
        </div> */}
        <div className='flex space-x-4'>
          <div
            className='w-12 hover:cursor-pointer'
            onClick={() => usedSpell(1)}
            onContextMenu={(e) => openChangeSpellMenu(e, 1)}
          >
            <div className='absolute text-4xl z-10 h-12 w-12 text-center font-customSerif text-white'>
              <p className='mt-2 text-2xl font-bold drop-shadow-lg'>
                {!thisLaner.hasSpell1 && spellsRemaining['spell1']}
              </p>
            </div>
            <Image
              className={
                thisLaner.hasSpell1 && thisLaner.spell1 != 'smite'
                  ? ''
                  : 'saturate-25 brightness-50'
              }
              src={
                thisLaner.spell1
                  ? images.find((i) => i.name == [thisLaner.spell1]).src
                  : FlashImage
              }
              alt={thisLaner.spell1}
            />
          </div>
          <div
            className='w-12 hover:cursor-pointer'
            onClick={() => usedSpell(2)}
            onContextMenu={(e) => openChangeSpellMenu(e, 2)}
          >
            <div className='absolute text-4xl z-10 h-12 w-12 text-center font-customSerif text-white'>
              <p className='mt-2 text-2xl font-bold drop-shadow-lg'>
                {!thisLaner.hasSpell2 && spellsRemaining['spell2']}
              </p>
            </div>
            <Image
              className={
                thisLaner.hasSpell2 && thisLaner.spell2 != 'smite'
                  ? ''
                  : 'saturate-25 brightness-50'
              }
              src={
                thisLaner.spell2
                  ? images.find((i) => i.name == [thisLaner.spell2]).src
                  : IgniteImage
              }
              alt={thisLaner.spell2}
            />
          </div>
          <div className='w-12 hover:cursor-pointer'>
            <Image
              className={thisLaner.hasIonian ? '' : 'grayscale'}
              src={images.find((i) => i.name == 'ionian').src}
              alt='ionian'
              onClick={() =>
                setThisLaner({ ...thisLaner, hasIonian: !thisLaner.hasIonian })
              }
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laner;
