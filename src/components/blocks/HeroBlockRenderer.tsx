import React from 'react'
import { HeroSplit } from './HeroSplit'
import { HeroCentered } from './HeroCentered'
import { HeroAsymmetric } from './HeroAsymmetric'

export const HeroBlockRenderer: React.FC<any> = (props) => {
  const { layoutType } = props
  
  switch (layoutType) {
    case 'split':
      return <HeroSplit {...props} />
    case 'asymmetric':
      return <HeroAsymmetric {...props} />
    case 'centered':
    default:
      return <HeroCentered {...props} />
  }
}
