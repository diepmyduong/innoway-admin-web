import { Injectable } from '@angular/core';
import * as _ from 'lodash'
import * as Console from 'console-prefix'
declare const EnjoyHint: any
@Injectable()
export class IntroService {

  constructor() {
    this.setDefaultOption({
      nextButton: { className: 'i-next-button', text: 'Tiếp theo' },
      skipButton: { className: 'i-skip-button', text: 'Bỏ qua' },
      showSkip: false
    })
    this.log('EnjoyHint', EnjoyHint)
  }

  get log() {
    return Console(['Intro Service']).log 
  }
  defaultOption: iEnjoyHintStepConfig

  setDefaultOption(option: iEnjoyHintStepConfig) {
    this.defaultOption = _.merge(this.defaultOption, option)
    return this.defaultOption
  }

  getInstance(introScript: iEnjoyHintStepConfig[], option: iEnjoyHintOption = {}) {
    introScript.forEach((step, index, array) => {
      array[index] = _.merge({}, this.defaultOption, step)
    })
    const instance = new EnjoyHint(option);
    instance.set(introScript)
    return instance
  }

}

export interface iEnjoyHintOption {
  onStart?: () => void
  onEnd?: () => void
  onSkip?: () => void
}

export interface iEnjoyHintStepConfig {
  nextButton?: iEnjoyHintStepButton,
  skipButton?: iEnjoyHintStepButton,
  scrollAnimationSpeed?: number
  left?: number,
  bottom?: number,
  right?: number,
  top?: number,
  margin?: number,
  radius?: number,
  shape?: 'circle' | 'rect',
  timeout?: number
  showSkip?: boolean
  showNext?: boolean
  selector?: string,
  event?: string
  description?: string,
  keyCode?: number,
  event_type?: string

  [key: string]: any | string
}

export interface iEnjoyHintStepButton {
  className?: string
  text?: string
}
