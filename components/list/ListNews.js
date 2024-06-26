import { View } from "react-native";
import styled from "styled-components/native";
import { Title } from "../../globalStyle";

export default function ListNews({ datas }) {
  return (
    <View>
      {datas.map((data, index) => (
        <Container key={index}>
          <Image source={data.image} />
          <ContainerText>
            <Topic>{data.topic}</Topic>
            <Title>{data.title}</Title>
            <Tag>{data.channel}</Tag>
          </ContainerText>
        </Container>
      ))}
    </View>
  );
}

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 6px;
  padding-top: 10px;
  padding-bottom: 14px;
  border-bottom-width: 1px;
  border-bottom-color: #45464f;
`;

export const ContainerText = styled.View`
  flex: 1;
`;

export const Image = styled.Image`
  width: 65px;
  height: 55px;
  margin-right: 8px;
  border-radius: 4px;
`;

export const Tag = styled.Text`
  padding-top: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #aaabb5;
`;

export const Topic = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #cda434;
`;
