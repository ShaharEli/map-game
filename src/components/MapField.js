import React, { useCallback, useEffect, useState } from "react";
import {
  Map,
  GoogleApiWrapper,
  InfoWindow,
  Marker,
  Circle,
} from "google-maps-react";
import locations from "./Data/yeshuvim.json";
import Swal from "sweetalert2";
import greenMarker from "./Data/green-marker.png";
import mapStyle from "./Data/mapStyle";
import Controls from "./Controls";

const mapStyles = {
  width: "100%",
  height: "100%",
};

const getRandomLocation = () => {
  return locations[Math.floor(Math.random() * locations.length)];
};

const _mapLoaded = (mapProps, map) => {
  map.setOptions({
    styles: mapStyle,
  });
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function MapField(props) {
  const [showingInfoWindow, setShowingInfoWindow] = useState(true); // Hides or shows the InfoWindow
  const [activeMarker, setActiveMarker] = useState({}); // Shows the active marker upon click
  const [selectedPlace, setSelectedPlace] = useState({}); // Shows the InfoWindow to the selected place upon a marker
  const [randomLocation, setRandomLocation] = useState({});
  const [chosenLocation, setChosenLocation] = useState({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(null);
  const [hint, setHint] = useState(false);
  const [roundCounter, setRoundCounter] = useState(0);
  const [showCorrectLocation, setShowCorrectLocation] = useState(false);

  const startRound = useCallback(() => {
    let checkerForLocation = "";
    let location = getRandomLocation();
    while (checkerForLocation.length === 0) {
      location = getRandomLocation();
      checkerForLocation = location.MGLSDE_LOC;
    }
    setRandomLocation({
      lng: location.X,
      lat: location.Y,
      name: location.MGLSDE_LOC,
    });
  }, []);

  useEffect(() => {
    const isHighScore = localStorage.getItem("highScore");
    isHighScore && setHighScore(isHighScore);
  }, []);

  const resetMap = useCallback(
    (e, ended = false) => {
      if (showCorrectLocation || ended) {
        setHint(false);
        setRoundCounter((prev) => prev + 1);
        setShowCorrectLocation(false);
        setChosenLocation({});
        if (ended) {
          if (score < highScore || !highScore) {
            setHighScore(score);
            localStorage.setItem("highScore", score);
          }
          Swal.fire("סיימת את הסיבוב").then(startRound());
          setScore(0);
          setRoundCounter(0);
        } else {
          startRound();
        }
      } else {
        Swal.fire("טעות", "סיים את הסיבוב לפני מעבר לסיבוב הבא", "error");
      }
    },
    [showCorrectLocation, highScore, score, startRound]
  );

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
      <Controls
        highScore={highScore}
        reset={resetMap}
        score={score}
        location={randomLocation.name}
        roundCounter={roundCounter}
        hintSetter={setHint}
      />
      <Map
        onClick={(e, b, c) => {
          if (!showCorrectLocation) {
            setChosenLocation({
              lat: c.latLng.lat(),
              lng: c.latLng.lng(),
            });
            let distance = getDistanceFromLatLonInKm(
              c.latLng.lat(),
              c.latLng.lng(),
              randomLocation.lat,
              randomLocation.lng
            );
            distance = Math.round(distance);
            setScore((prev) => prev + distance);
            setShowCorrectLocation(true);
            if (distance < 20) {
              Swal.fire(
                "מעולה",
                "המרחק שלך בקילומטרים מהמטרה היה: " + String(distance),
                "success"
              );
            } else {
              Swal.fire(
                "טעות",
                "המרחק שלך בקילומטרים מהמטרה היה: " + String(distance),
                "error"
              );
            }
          } else {
            Swal.fire("שיחקת כבר", "אנא המשך לתור הבא", "error");
          }
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
          startRound();
        }}
      >
        <Marker position={chosenLocation} />
        {showCorrectLocation && (
          <Marker
            position={randomLocation}
            visible={true}
            onClick={onMarkerClick}
            name={randomLocation.name}
            options={{ icon: greenMarker }}
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
        {hint && (
          <Circle
            radius={100200}
            center={{
              lat: randomLocation.lat + Math.random() / 1.6,
              lng: randomLocation.lng + Math.random() / 1.6,
            }}
            clickable={false}
            strokeColor='transparent'
            strokeOpacity={1}
            strokeWeight={5}
            fillColor='#FF0000'
            fillOpacity={0.2}
          />
        )}
      </Map>
    </div>
  );
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyA1jO5KCUbo5ifKHb4LK5ilBN2Fp0NZb5Y",
})(MapField);
