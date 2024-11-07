import React from 'react'
import { View } from 'react-native'

interface IRodProps {
  containerStyles?: string;
}

const Rod = ( {containerStyles}: IRodProps) => {
  return (
    <View className={`h-[18px] w-[202px] rounded-[6px] bg-global-gray-90 ${containerStyles}`} />
  )
}

export default Rod