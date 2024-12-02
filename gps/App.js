import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [trackerID, setTrackerID] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId;

    const startLocationUpdates = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      intervalId = setInterval(async () => {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location.coords);
        sendLocationToServer(
          location.coords.latitude,
          location.coords.longitude
        );
        setLoading(false);
      }, 1000);
    };

    if (isTracking && trackerID) {
      startLocationUpdates();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking, trackerID]);

  const sendLocationToServer = (latitude, longitude) => {
    axios
      .post("http://localhost:5555/coordinates", {
        tracker: {
          trackerId: trackerID,
        },
        point: {
          lng: longitude,
          lat: latitude,
        },
      })
      .then((response) => {
        console.log("Location sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending location:", error);
      });
  };

  const handleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      setLocation(null);
    } else {
      setIsTracking(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter Tracker ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tracker ID"
        value={trackerID}
        onChangeText={setTrackerID}
      />
      <Button
        title={
          isTracking ? "Stop Sending Coordinate" : "Start Sending Coordinate"
        }
        onPress={handleTracking}
        disabled={!trackerID}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.locationInfo}>
          <Text>Sending Location:</Text>
          {errorMsg ? (
            <Text>{errorMsg}</Text>
          ) : location ? (
            <Text>
              Lat: {location.latitude}, Long: {location.longitude}
            </Text>
          ) : (
            <Text>Waiting for location...</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    paddingLeft: 8,
  },
  locationInfo: {
    marginTop: 20,
  },
});
