import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import locations from "./Data/yeshuvim.json";
import Swal from "sweetalert2";

const mapStyles = {
  width: "100%",
  height: "100%",
};

const getRandomLocation = () => {
  return locations[Math.floor(Math.random() * locations.length)];
};
const mapStyle = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const _mapLoaded = (mapProps, map) => {
  map.setOptions({
    styles: mapStyle,
  });
};

function MapField(props) {
  const [showingInfoWindow, setShowingInfoWindow] = useState(true); // Hides or shows the InfoWindow
  const [activeMarker, setActiveMarker] = useState({}); // Shows the active marker upon click
  const [selectedPlace, setSelectedPlace] = useState({}); // Shows the InfoWindow to the selected place upon a marker
  const [randomLocation, setRandomLocation] = useState({});
  const [chosenLocation, setChosenLocation] = useState({});
  const [showCorrectLocation, setShowCorrectLocation] = useState(false);

  const onMarkerClick = (props, marker, e) => {
    setShowingInfoWindow(true);
    setActiveMarker(marker);
    setSelectedPlace(props);
  };

  const onClose = (props) => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  return (
    <div>
      <Map
        onClick={(e, b, c) => {
          setChosenLocation({
            lat: c.latLng.lat(),
            lng: c.latLng.lng(),
          });
          setShowCorrectLocation(true);
        }}
        google={props.google}
        zoom={7.4}
        style={mapStyles}
        initialCenter={{
          lat: 31.46667,
          lng: 34.783333,
        }}
        onReady={(mapProps, map) => {
          _mapLoaded(mapProps, map);
          let checkerForLocation = "";
          let location = getRandomLocation();
          while (checkerForLocation.length === 0) {
            location = getRandomLocation();
            checkerForLocation = location.MGLSDE_LOC;
          }
          setRandomLocation({
            lng: location.X,
            lat: location.Y,
          });

          setTimeout(
            () => Swal.fire(":האם תמצא את", location.MGLSDE_LOC, "question"),
            1500
          );
        }}
      >
        <Marker
          position={chosenLocation}
          onClick={onMarkerClick}
          name={"Kenyatta International Convention Centre"}
        />
        {showCorrectLocation && (
          <Marker
            position={randomLocation}
            visible={true}
            onClick={onMarkerClick}
            name={"Kenyatta International Convention Centre"}
          />
        )}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
          onClose={onClose}
        >
          <div>
            <h4>{selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyA1jO5KCUbo5ifKHb4LK5ilBN2Fp0NZb5Y",
})(MapField);
