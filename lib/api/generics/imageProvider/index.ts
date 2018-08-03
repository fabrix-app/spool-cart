
import { Generic } from '@fabrix/spool-generics'

export class DefaultImageProvider { // extends Generic {
  // constructor(config) {
  //   super(config)
  // }

  public config: {[key: string]: any} = {}

  constructor(config) {
    this.config = config
  }
}
