/**
 * Global
 * https://github.com/lukejbullard/global
 */

import React, {useState} from 'react';

import {
  SafeAreaView,
  View,
  useColorScheme,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';

import Turbine from 'turbine-js';

function App(): React.JSX.Element {
  const isDarkMode = (useColorScheme() === 'dark');

  //io props
  const [output, setOutput] = useState("Global");
  
  const [loading, setLoading] = useState(false);

  //styling props
  const [outputColor, setOutputColor] = useState(isDarkMode ? "#FFFFFF" : "#000000");
  const toggleOutputColor = () => {
    let newColor = "#AAAAAA";

    switch (outputColor)
    {
      case "#FFFFFF":
        newColor = "#BBBBBB";
        break;
      case "#BBBBBB":
        newColor = "#FFFFFF";
        break;
      case "#000000":
        newColor = "#444444"
        break;
      case "#444444":
        newColor = "#000000";
        break;
    }

    setOutputColor(newColor);
  };

  const {fontScale} = useWindowDimensions();
  const styles = () => StyleSheet.create({
    body: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: isDarkMode ? "black" : "white"
    },
    text: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      color: !isDarkMode ? "black" : "white",
      fontSize: 25 / fontScale
    },
    outputText: {
      fontSize: 50 / fontScale,
      height: "10%",
      color: outputColor
    },
    inputView: {
      display: (loading ? 'none' : 'flex'),
      flex: 1,
      width: "100%",
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingWheel: {
      display: (loading ? 'flex' : 'none'),
      flex: 1,
      justifyContent: 'center'
    },
    input: {
      padding: 10,
      fontSize: 30 / fontScale,
      width: "100%",
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'space-around',
      borderColor: !isDarkMode ? "black" : "white",
      backgroundColor: isDarkMode ? "#222222" : "#DDDDDD",
      color: !isDarkMode ? "black" : "white"
    },
    button: {
      height: "25%",
      width: "100%",
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? (!loading ? "#191919" : "#303030") : (!loading ? "#CCCCCC" : "#EEEEEE"),
    },
    buttonText: {
      flexDirection: 'row',
      textAlign: 'center',
      fontSize: 90 / fontScale,
      color: !isDarkMode ? (!loading ? "black" : "#666666") : (!loading ? "white" : "#CCCCCC")
    }
  });

  const initialInputState : Record<string, any> = {
    low: {
      label: "Low",
      value: "1"
    },
    high: {
      label: "High",
      value: "10"
    },
    certainty: {
      label: "Certainty",
      value: "5",
      min: 1,
      max: 10
    },
    delay: {
      label: "Delay",
      value: "100",
      min: 0
    }
  }

  const [inputs, setInputs] = useState(initialInputState);

  const handleInputChange = (key:string, text:string) => {
    setInputs((prevInputs) => {
      //ensure whole number and not empty
      let regexMatchedWhole = text.match(/^-?[0-9]*/);
      if (regexMatchedWhole != null)
      {
        text = regexMatchedWhole[0];
      } else {
        text = "0";
      }

      //bounds checking
      if (text != "-" && text != "")
      {
        let newNumber = parseInt(text);
        if (typeof(inputs[key].min) !== 'undefined' &&
          newNumber < parseInt(inputs[key].min))
        {
          newNumber = parseInt(inputs[key].min);
        } else if (typeof(inputs[key].max) !== 'undefined' &&
          newNumber > parseInt(inputs[key].max))
        {
          newNumber = parseInt(inputs[key].max);
        }
        text = newNumber.toString()
      }

      let newState : Record<string, any> = {
        ...prevInputs,
        [key]: {
          ...prevInputs[key],
          value: text
        }
      }

      return newState;
    })
  };

  const onPress3 = () => {
    let low = parseInt(inputs.low.value);
    let high = parseInt(inputs.high.value);
    let certainty = parseInt(inputs.certainty.value);
    let delay = parseInt(inputs.delay.value);
  
    if (low >= high ||
      (
        typeof(inputs.certainty.min) === 'number' &&
        certainty < inputs.certainty.min
      ) ||
      (
        typeof(inputs.certainty.max) === 'number' &&
        certainty > inputs.certainty.max
      ) ||
      (
        typeof(inputs.delay.min) === 'number' &&
        delay < inputs.delay.min
      )
    )
    {
      return;
    }

    if (loading)
      return;
    setLoading(true);

    var tb = new Turbine();
    tb.waitForReady().then(() => {
      tb
      .query(low, high, certainty, delay)
      .then((responseValue: number) => {
          setOutput(responseValue.toString());
          toggleOutputColor();
          setLoading(false);
      })
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles().body}>
        <Text style={[styles().text, styles().outputText]}>{output}</Text>
        <View style={styles().loadingWheel}>
          <ActivityIndicator size="large" animating={loading} color="#3535c1" />
        </View>
        {
          Object.entries(inputs).map(([key, input]) => {
            return (
              <View style={[styles().inputView]} key={key}>
                <Text style={styles().text}>{input.label}</Text>
                <TextInput
                  style={[styles().input]}
                  keyboardType='number-pad'
                  onChangeText={text => handleInputChange(key, text)}
                  value={input.value}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            )
          })
        }
        <TouchableOpacity disabled={loading} style={styles().button} onPress={onPress3}>
          <Text style={styles().buttonText}>3</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default App;
