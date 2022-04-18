import { AVATAR_BG_COLOR } from './constants';
import { Hex } from '@/typings';

export const generateColorByHex = (hex: Hex): string => {
    return AVATAR_BG_COLOR[hex];
};
