import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from 'expo-clipboard';
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import worthDB, { endpoints as worthEndpoints } from "../../api/localDB";
import { 
  getRandomNumber, 
  /* useComponentDidMount,
  useComponentDidUpdate,
  useComponentWillUnmount  */
} from "../../utils";

const PanelView = ({ data = [] }) => {

  const copyToClipboard = async (val) => {
    await Clipboard.setStringAsync(val);
  };

  // console.log('rerendered');

  return (
    <Animated.View style={{ height: 150, backgroundColor: "white" }}>
        {data.map((item, index) => (
          <View key={index}>
            <Channel>
              <Text>Price</Text>
              <Text onPress={() => copyToClipboard(item.price)}>
                {item.price}
              </Text>
            </Channel>
            <Channel>
              <Text>Have been reached?</Text>{" "}
              {item.takeProfitReached ? <Text>Yes</Text> : <Text>No</Text>}
            </Channel>
          </View>
        ))}
    </Animated.View>
  );
};

export default function ListSignals({ signals }) {
  const navigation = useNavigation();
  const [expandedSignals, setExpandedSignals] = useState([]);
  const [count, setCount] = useState(0)
  let signalInterval;
  let _signals = [];

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const showLoadMoreButton = () => {};

  const getSymbolPrice = async (exchangeSymbol, signalId) => {
    const res = await worthDB.get(worthEndpoints.getSymbolPrice(exchangeSymbol))
    return res.data
  };

  const setSignals = async () => {
    for(const signal of signals){
      _signals.push({
        price: await getSymbolPrice(signal.exchangeSymbol),
        ...signal,
      });
    }
    setExpandedSignals(_signals);
  };

  const updateSignals = () => {
    signalInterval = !signalInterval && setInterval(() => {
      for(const index in _signals){
          const signal = _signals[index];

          worthDB.get(worthEndpoints.getSymbolPrice(signal.exchangeSymbol))
          .then((res) => {
            const array = [..._signals];
            const item = {...array[index]}
            item.price = res.data
            array[index] = item
            _signals = array
            setExpandedSignals(array);
          })
          .catch((ex) => console.log(ex));
      }
    }, 3000);
  }

  /* useComponentDidMount(() => {
    console.log("Component list signals did mount!");
  });

  useComponentDidUpdate(() => {
    console.log("myProp list signals did update!");
  }, []);

  useComponentWillUnmount(() => {
    console.log("Component will unmount!");
  }); */

  useEffect(() => {
    setSignals();
    updateSignals();
    return () => { clearInterval(signalInterval) }
  }, [])

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          showLoadMoreButton();
        }
      }}
      scrollEventThrottle={400}
    >
      {expandedSignals.map((data, index) => {
        const uri = data.image;
        return (
          <Container key={getRandomNumber(501, 600)}>
            <ContainerText key={getRandomNumber(601, 700)}>
              <Title>{data.symbol}</Title>
              <Tag>{data.type}</Tag>
              <Channel>
                <Text>Price</Text>
                <Datas>{data.price}</Datas>
              </Channel>
              <Channel>
                <Text>Risk</Text>
                <Datas>{data.risk}</Datas>
              </Channel>
              <Channel>
                <Text>Entry Price</Text>
                <Datas>{data.entryPrice}</Datas>{" "}
              </Channel>
              <Channel>
                <Text>Stop Lost</Text>
                <Datas>{data.stopLost}</Datas>
              </Channel>
                <Text style={styles.toggleText}>Take profits</Text>
              <PanelView
                key={getRandomNumber(0, 100)}
                data={data.takeProfits}
              />
            </ContainerText>
          </Container>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 100,
    height: 30,
    marginVertical: 4,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    color: "#fff",
  },
});

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 6px;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 14px;
  padding-right: 10px;
  padding-left: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #45464f;
  background-color: #353c47;
`;

export const ContainerText = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;
export const Channel = styled.Text`
  padding-top: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #aaabb5;
`;

export const Tag = styled.Text`
  padding-top: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #cda434;
`;

export const Datas = styled.Text`
  color: #ffffff;
  font-weight: 800;
  padding-right: 4px;
`;
