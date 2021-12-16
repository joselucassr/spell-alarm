import Head from 'next/head';

// Icons
import { FaCog, FaRegQuestionCircle } from 'react-icons/fa';

// Images

// Components
import Laner from '../Components/Laner';
import Settings from '../Components/Settings';
import AudioLoops from '../Components/AudioLoops';

// DB
import { laners } from '../DB/laners';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [startTime, setStartTime] = useState();
  const [currTime, setCurrTime] = useState(0);
  const [displayTime, setDisplayTime] = useState('');
  const [timeBegun, setTimeBegun] = useState(false);

  const startTimer = () => {
    setTimeBegun(!timeBegun);
    setCurrTime(0);
    setDisplayTime(`00:00`);
  };

  useEffect(() => {
    if (timeBegun) {
      setStartTime(Date.now());
      setLanersSpellTracker({
        top: {},
        jg: {},
        mid: {},
        adc: {},
        sup: {},
      });
    } else {
      setStartTime(0);
    }
  }, [timeBegun]);

  const formatTime = (totalSecs) => {
    let min = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, '0');
    let sec = (totalSecs % 60).toString().padStart(2, '0');

    return `${min}:${sec}`;
  };

  useEffect(() => {
    console.log(`useEffect => timeBegun: ${timeBegun}`);
    console.log(`useEffect => startTime: ${startTime}`);

    let interval = null;

    if (timeBegun)
      interval = setInterval(() => {
        let delta = Date.now() - startTime; // milliseconds elapsed since start
        let totalSecs = Math.floor(delta / 1000);
        setDisplayTime(formatTime(totalSecs));
        setCurrTime(totalSecs);
      }, 1000);
    // update about every second
    else {
      console.log(`useEffect => entered clearInterval`);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  const [lanersSpellTracker, setLanersSpellTracker] = useState({});

  const getTimes = (data) => {
    if (currTime == 0) return;

    console.log(data);

    setLanersSpellTracker((prevState) => ({
      ...prevState,
      [`${data.laner}`]: {
        ...prevState[`${data.laner}`],
        spell1Name:
          typeof data.spell1Name !== 'undefined'
            ? data.spell1Name
            : prevState[`${data.laner}`].spell1Name || '',
        spell2Name:
          typeof data.spell2Name !== 'undefined'
            ? data.spell2Name
            : prevState[`${data.laner}`].spell2Name || '',
        spell1Duration:
          typeof data.spell1Duration !== 'undefined'
            ? data.spell1Duration
            : prevState[`${data.laner}`].spell1Duration || 0,
        spell2Duration:
          typeof data.spell2Duration !== 'undefined'
            ? data.spell2Duration
            : prevState[`${data.laner}`].spell2Duration || 0,
        spell1UsedAt:
          typeof data.spell1Name !== 'undefined'
            ? currTime
            : prevState[`${data.laner}`].spell1UsedAt || 0,
        spell2UsedAt:
          typeof data.spell2Name !== 'undefined'
            ? currTime
            : prevState[`${data.laner}`].spell2UsedAt || 0,
        spell1Canceled:
          typeof data.spell1Canceled !== 'undefined'
            ? data.spell1Canceled
            : prevState[`${data.laner}`].spell1Canceled || false,
        spell2Canceled:
          typeof data.spell2Canceled !== 'undefined'
            ? data.spell2Canceled
            : prevState[`${data.laner}`].spell2Canceled || false,
      },
    }));
  };

  useEffect(() => {
    if (currTime == 0) return;

    // TOP: flash-10:00, teleport-8:00 | JG: flash-12:30
    let tempString = '';

    Object.keys(lanersSpellTracker).forEach(function (key) {
      if (
        lanersSpellTracker[key].spell1UsedAt +
          lanersSpellTracker[key].spell1Duration >=
          currTime ||
        lanersSpellTracker[key].spell2UsedAt +
          lanersSpellTracker[key].spell2Duration >=
          currTime
      ) {
        console.log('ENTROU');

        tempString = `${tempString}${key.toUpperCase()}: `;
        let count = 0;

        let spell1InConfig = JSON.parse(
          localStorage.getItem('@spell-alarm/selectedSpells'),
        ).includes(lanersSpellTracker[key].spell1Name);

        let spell2InConfig = JSON.parse(
          localStorage.getItem('@spell-alarm/selectedSpells'),
        ).includes(lanersSpellTracker[key].spell2Name);

        if (
          lanersSpellTracker[key].spell1UsedAt +
            lanersSpellTracker[key].spell1Duration >=
            currTime &&
          !lanersSpellTracker[key].spell1Canceled &&
          spell1InConfig
        ) {
          let backAt = formatTime(
            lanersSpellTracker[key].spell1UsedAt +
              lanersSpellTracker[key].spell1Duration,
          );

          tempString = `${tempString}${lanersSpellTracker[key].spell1Name}-${backAt} `;
          count++;
        } else tempString = tempString;

        if (
          lanersSpellTracker[key].spell2UsedAt +
            lanersSpellTracker[key].spell2Duration >=
            currTime &&
          !lanersSpellTracker[key].spell2Canceled &&
          spell2InConfig
        ) {
          let backAt = formatTime(
            lanersSpellTracker[key].spell2UsedAt +
              lanersSpellTracker[key].spell2Duration,
          );

          tempString = `${tempString}${lanersSpellTracker[key].spell2Name}-${backAt} `;
          count++;
        } else tempString = tempString;

        tempString = `${tempString}| `;

        if (count === 0) tempString = '';
      }
    });

    // let isMobile = (window.mobileCheck = function () {
    //   let check = false;
    //   (function (a) {
    //     if (
    //       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    //         a,
    //       ) ||
    //       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    //         a.substr(0, 4),
    //       )
    //     )
    //       check = true;
    //   })(navigator.userAgent || navigator.vendor || window.opera);
    //   return check;
    // });

    navigator.clipboard.writeText(tempString);
    // if (!isMobile())
  }, [lanersSpellTracker]);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className='relative'>
      <Settings setMenuIsOpen={setMenuIsOpen} menuIsOpen={menuIsOpen} />
      <div className={`max-w-xl mx-auto px-4 sm:px-6 ${menuIsOpen && 'blur'}`}>
        <div className='flex justify-between items-center py-6 md:justify-start md:space-x-10'>
          <h1 className='font-customSerif text-4xl font-bold text-gray-900 left-0 top-0'>
            Alarme de <nobr>Feitiços do Zé</nobr>
          </h1>
          <div className='flex items-center justify-end flex-1 lg:w-0 text-gray-900 space-x-3 text-xl'>
            <FaRegQuestionCircle
              className='right-0 top-0 hover:cursor-pointer'
              size={25}
            />
            <FaCog
              className='float-right hover:cursor-pointer'
              size={25}
              onClick={() => setMenuIsOpen(!menuIsOpen)}
            />
          </div>
        </div>

        <div className='space-y-8'>
          {laners &&
            laners.map((laner) => (
              <Laner
                key={laner.name}
                laneName={laner.name}
                laners={laners}
                sendTimes={getTimes}
              />
            ))}
        </div>

        <div className='border-b-2 border-gray-400 my-3 max-w-xl mx-auto'></div>

        <div className='flex flex-col items-center space-y-4 font-mont max-w-xl mx-auto'>
          <audio src='/audios/lookMap.mp4' id='lookMap'></audio>
          <audio src='/audios/lookItem.mp4' id='lookItem'></audio>
          <div className='w-full'>
            <button
              className='bg-white w-full py-1 hover:bg-gray-200'
              onClick={() => startTimer()}
            >
              {!timeBegun ? 'COMEÇAR PARTIDA' : displayTime}
            </button>
          </div>
          <AudioLoops />
        </div>
      </div>
    </div>
  );
}
