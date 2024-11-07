import React from 'react';
import CustomText from '@/components/general/Text';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { PlayerRolesT } from '@/types/entities/player';
import { PLAYER_ROLES } from '@/constants/players';

interface IPlayerRoleTextProps {
  role: PlayerRolesT;
}

const PlayerRoleText = ({ role }: IPlayerRoleTextProps) => {
  const classes = twMerge(
    'text-xs leading-[18px] tracking-[0.48px]',
    clsx({
      'text-global-orange-30': role === 'all_rounder',
      'text-global-blue-50': role === 'batsman',
      'text-[#FF89C2]': role === 'keeper',
      'text-global-purple-40': role === 'bowler'
    })
  );
  return <CustomText textClass='text-theme-content-secondary'>{PLAYER_ROLES[role]}</CustomText>;
};

export default PlayerRoleText;
