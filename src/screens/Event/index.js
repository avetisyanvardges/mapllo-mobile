import * as React from 'react'
import Dating from './dating'
import Event from './event'
import Poster from '../Poster'

export default class GeneralEvent extends React.PureComponent {
  render() {
    const active = this.props.active
    const event = this.props.event
    const height = this.props.height
    const popup = this.props.popup
    const fullscreen = this.props.fullscreen

    if (event.type === 'DATING') {
      return (
        <Dating
          active={active}
          eventInitial={event}
          height={height}
          popup={popup}
          fullscreen={fullscreen}
        />
      )
    } else if (event.type === 'EVENT') {
      return (
        <Event
          active={active}
          eventInitial={event}
          height={height}
          popup={popup}
          fullscreen={fullscreen}
        />
      )
    } else {
      return (
        <Poster
          active={active}
          popup={popup}
          height={height}
          poster={event}
          fullScreen={fullscreen}
        />
      )
    }
  }
}
