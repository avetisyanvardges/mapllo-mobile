import {Marker} from 'react-native-maps'
import MapCluster from './cluster'

export default class MapEventClusterMarker extends React.PureComponent {
  render() {
    const latitude = this.props.latitude
    const longitude = this.props.longitude
    const amount = this.props.amount
    const mapRef = this.props.mapRef

    return (
      <Marker
        coordinate={{latitude, longitude}}
        style={{opacity: e.zoom === currentZoom ? 1 : 0}}
        tracksViewChanges={false}
        >
        <MapCluster
          amount={amount}
          zoomIn={async () => {
            const v = await mapRef.current.getMapBoundaries()
            const longitudeDelta =
              (v.northEast.longitude - v.southWest.longitude) / 2
            const latitudeDelta =
              (v.northEast.latitude - v.southWest.latitude) / 2
            mapRef.current.animateToRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta,
              longitudeDelta,
            })
          }}
        />
      </Marker>
    )
  }
}
