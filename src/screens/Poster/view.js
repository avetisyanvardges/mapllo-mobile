import React, {useEffect, useRef, useState} from 'react'

import Poster from '.'
import MBack from '../../components/MBack'
import MPopup from '../../components/MPopup'
import {getPoster} from '../../configs/api'

export const PosterView = ({route}) => {
  const [poster, setPoster] = useState()
  const popupRef = useRef()

  useEffect(() => {
    getPoster(route.params.id).then(r => {
      setPoster(r.data)
    })
  }, [])

  if (!poster) {
    return <></>
  }

  return (
    <>
      <MPopup ref={popupRef} />
      <Poster
        active
        poster={poster}
        popup={popupRef}
        fullscreen
        topPadding={0}
      />
    </>
  )
}
