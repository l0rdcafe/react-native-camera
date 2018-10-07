import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Permissions, Camera, Constants, MediaLibrary } from "expo";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  button: {
    width: 200,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: "#fff"
  },
  buttonText: {
    fontSize: 24,
    color: "#fff"
  }
});

class App extends React.Component {
  state = { rollGranted: false, cameraGranted: false };
  componentDidMount() {
    this.getCameraPermissions();
  }
  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ cameraGranted: true });
    } else {
      this.setState({ cameraGranted: false });
    }
    this.getCameraRollPermissions();
  };
  getCameraRollPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      this.setState({ rollGranted: true });
    } else {
      this.setState({ rollGranted: false });
    }
  };
  takePictureAndCreateAlbum = async () => {
    const { uri } = await this.camera.takePictureAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
    MediaLibrary.createAlbumAsync("Expo", asset)
      .then(() => {
        Alert.alert("Album created!");
      })
      .catch(err => {
        Alert.alert("An Error Occurred!");
      });
  };
  render() {
    const { rollGranted, cameraGranted } = this.state;
    return (
      <View style={styles.container}>
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 1 }}
          ref={node => {
            this.camera = node;
          }}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            rollGranted && cameraGranted ? this.takePictureAndCreateAlbum() : Alert.alert("Permissions not granted")
          }
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
