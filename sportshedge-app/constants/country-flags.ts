import IndiaFlag from '@/assets/country-flags/india.svg';
import AustraliaFlag from '@/assets/country-flags/australia.svg';
import NewZelandFlag from '@/assets/country-flags/newzeland.svg';
import SouthAfricaFlag from '@/assets/country-flags/south-africa.svg';
import SriLankaFlag from '@/assets/country-flags/srilanka.svg';
import EnglandFlag from '@/assets/country-flags/england.svg';
import AfghanisthanFlag from '@/assets/country-flags/afghanistan.svg';
import NetherLandsFlag from '@/assets/country-flags/netherlands.svg';
import PakistanFlag from '@/assets/country-flags/pakistan.svg';
import BangladeshFlag from '@/assets/country-flags/bangladesh.svg';
import { SvgProps } from 'react-native-svg';

export const COUNTRY_FLAGS: { [countryCode: string]: React.FC<SvgProps> } = {
  India: IndiaFlag,
  IND: IndiaFlag,
  AUS: AustraliaFlag,
  NZ: NewZelandFlag,
  RSA: SouthAfricaFlag,
  SL: SriLankaFlag,
  ENG: EnglandFlag,
  AFG: AfghanisthanFlag,
  NL: NetherLandsFlag,
  PAK: PakistanFlag,
  BAN: BangladeshFlag
};