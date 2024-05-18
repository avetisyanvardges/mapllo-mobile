import {normalize} from '../../assets/normalize'
import AquariesIcon from '../../icons/zodiacs/Aquarius'
import AriesIcon from '../../icons/zodiacs/Aries'
import CancerIcon from '../../icons/zodiacs/Cancer'
import CapricornIcon from '../../icons/zodiacs/Capricorn'
import GeminiIcon from '../../icons/zodiacs/Gemini'
import LeoIcon from '../../icons/zodiacs/Leo'
import LibraIcon from '../../icons/zodiacs/Libra'
import PiscesIcon from '../../icons/zodiacs/Pisces'
import SagittariusIcon from '../../icons/zodiacs/Sagittarius'
import ScorpioIcon from '../../icons/zodiacs/Scorpio'
import TaurusIcon from '../../icons/zodiacs/Taurus'
import VirgoIcon from '../../icons/zodiacs/Virgo'

export const zodiacDates = {
  aries: {
    symbol: '♈',
    icon: <AriesIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-03-21',
    dateMax: '2000-04-20',
  },
  taurus: {
    symbol: '♉',
    icon: <TaurusIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-04-21',
    dateMax: '2000-05-21',
  },
  gemini: {
    symbol: '♊',
    icon: <GeminiIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-05-22',
    dateMax: '2000-06-21',
  },
  cancer: {
    symbol: '♋',
    icon: <CancerIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-06-22',
    dateMax: '2000-07-22',
  },
  leo: {
    symbol: '♌',
    icon: <LeoIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-07-23',
    dateMax: '2000-08-22',
  },
  virgo: {
    symbol: '♍',
    icon: <VirgoIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-08-23',
    dateMax: '2000-09-23',
  },
  libra: {
    symbol: '♎',
    icon: <LibraIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-09-24',
    dateMax: '2000-10-23',
  },
  scorpio: {
    symbol: '♏',
    icon: <ScorpioIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-10-24',
    dateMax: '2000-11-22',
  },
  sagittarius: {
    symbol: '♐',
    icon: <SagittariusIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-11-23',
    dateMax: '2000-12-21',
  },
  capricorn: {
    symbol: '♑',
    icon: <CapricornIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-12-22',
    dateMax: '2000-01-20',
  },
  aquarius: {
    symbol: '♒',
    icon: <AquariesIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-01-21',
    dateMax: '2000-02-19',
  },
  pisces: {
    symbol: '♓',
    icon: <PiscesIcon width={normalize(11)} height={normalize(11)} />,
    dateMin: '2000-02-20',
    dateMax: '2000-03-20',
  },
}
