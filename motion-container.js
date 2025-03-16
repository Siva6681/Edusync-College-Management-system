import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { motion } from 'framer-motion';

export default class MotionContainerComponent extends Component {
  @tracked animate = false;

  @action
  toggleAnimation() {
    this.animate = !this.animate;
  }

  get motionSettings() {
    return {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      whileHover: { scale: 1.05 },
    };
  }
}
