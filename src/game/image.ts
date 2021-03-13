import {
  HU,
  KYO,
  KEI,
  GIN,
  HI,
  KAKU,
  KIN,
  OU,
  TO,
  N_KYO,
  N_KEI,
  N_GIN,
  UMA,
  RYU,
  BLACK,
  WHITE,
} from "./constant";

export const getImage = (koma: number, owner: number): string => {
  if (owner === BLACK) {
    switch (koma) {
      case HU:
        return "/img/koma/60x64/sgl08.png";
      case KYO:
        return "/img/koma/60x64/sgl07.png";
      case KEI:
        return "/img/koma/60x64/sgl06.png";
      case GIN:
        return "/img/koma/60x64/sgl05.png";
      case HI:
        return "/img/koma/60x64/sgl02.png";
      case KAKU:
        return "/img/koma/60x64/sgl03.png";
      case KIN:
        return "/img/koma/60x64/sgl04.png";
      case OU:
        return "/img/koma/60x64/sgl01.png";
      case TO:
        return "/img/koma/60x64/sgl18.png";
      case N_KYO:
        return "/img/koma/60x64/sgl17.png";
      case N_KEI:
        return "/img/koma/60x64/sgl16.png";
      case N_GIN:
        return "/img/koma/60x64/sgl15.png";
      case UMA:
        return "/img/koma/60x64/sgl13.png";
      case RYU:
        return "/img/koma/60x64/sgl12.png";
    }
  } else if (owner === WHITE) {
    switch (koma) {
      case HU:
        return "/img/koma/60x64/sgl38.png";
      case KYO:
        return "/img/koma/60x64/sgl37.png";
      case KEI:
        return "/img/koma/60x64/sgl36.png";
      case GIN:
        return "/img/koma/60x64/sgl35.png";
      case HI:
        return "/img/koma/60x64/sgl32.png";
      case KAKU:
        return "/img/koma/60x64/sgl33.png";
      case KIN:
        return "/img/koma/60x64/sgl34.png";
      case OU:
        return "/img/koma/60x64/sgl41.png";
      case TO:
        return "/img/koma/60x64/sgl48.png";
      case N_KYO:
        return "/img/koma/60x64/sgl47.png";
      case N_KEI:
        return "/img/koma/60x64/sgl46.png";
      case N_GIN:
        return "/img/koma/60x64/sgl45.png";
      case UMA:
        return "/img/koma/60x64/sgl43.png";
      case RYU:
        return "/img/koma/60x64/sgl42.png";
    }
  }
  return "";
};
