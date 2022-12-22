import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import worthDB, { endpoints as epWorth } from "../../api/localDB";
import { View, Text, ToastAndroid, Platform } from "react-native";
import UserContext from "../../context/UserContext";
import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";
import Toast from "react-native-root-toast";
import HeadDetail from "../HeadDetail";

import { useForm, Controller } from "react-hook-form";
import { CardContainer } from "../../globalStyle";

export default function LoginForm(props) {
  const userContext = useContext(UserContext);
  const navigation = useNavigation();
  const successLoginText = "¡Ha iniciado sesión exitosamente!";
  const failLoginText = "Usuario o contraseña invalida";
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      email: "luis.sanchez@esferasoluciones.com",
    },
  });

  useEffect(() => {
    props.getToken();
  }, []);

  const onSubmit = (data) => {
    try {
      if (data) {
        data = {
          email: data.email.toLowerCase(),
          password: data.password,
        };
        worthDB
          .post(epWorth.login, {
            username: data.email,
            password: data.password,
          })
          .then(async (res) => {
            await AsyncStorage.setItem("@token", res.data.access_token);

            const user = await worthDB.get(epWorth.getUser(data.email));
            
            userContext.user = {
              token: res.data.access_token,
              email: data.email,
              isPremium: user.data.isPremium
            };
            if (Platform.OS === "ios") {
              Toast.show(successLoginText, {
                duration: Toast.durations.LONG,
                position: Toast.positions.CENTER,
              });
              props.getToken();
            } else {
              ToastAndroid.showWithGravity(
                successLoginText,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              props.getToken();
            }
          })
          .catch((error) => {
            console.log("Error login ", error);
            if (Platform.OS === "ios") {
              Toast.show(failLoginText, {
                duration: Toast.durations.LONG,
                position: Toast.positions.CENTER,
              });
            } else {
              ToastAndroid.showWithGravity(
                failLoginText,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <ContainerForm>
        <HeadDetail
          title={"Iniciar Sesión"}
          detail={"Disfruta los beneficios de tener una cuenta con Worth"}
        />
      </ContainerForm>
      <CardContainer style={{ height: "100%" }}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <InputGroup>
              <Label>Correo</Label>
              <Input
                placeholder="useless placeholder"
                value={value}
                keyboardType="email-address"
                onChangeText={onChange}
              />
            </InputGroup>
          )}
          name="email"
        />
        {errors.email && <Text>Este campo es requerido.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <InputGroup>
              <Label>Contraseña</Label>
              <Input
                placeholder="useless placeholder"
                value={value}
                secureTextEntry={true}
                onChangeText={onChange}
              />
            </InputGroup>
          )}
          name="password"
        />
        {errors.password && <Text>Este campo es requerido.</Text>}
        <InputGroup>
          <ButtonLogin onPress={handleSubmit(onSubmit)}>
            <Text style={{ color: "black", textAlign: "center", fontSize: 16 }}>
              Iniciar Sesión
            </Text>
          </ButtonLogin>
          <ButtonRegistre onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
              Crear una cuenta
            </Text>
          </ButtonRegistre>
        </InputGroup>
      </CardContainer>
    </View>
  );
}

const ContainerForm = styled.View`
  margin-horizontal: 16px;
  margin-vertical: 16px;
`;

const Label = styled.Text`
  color: white;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 700;
  margin-horizontal: 3%;
`;

const ButtonLogin = styled.TouchableOpacity`
  font-weight: 700;
  padding-vertical: 14px;
  background-color: #cda434;
  border-radius: 8px;
  margin-vertical: 12px;
  margin-horizontal: 3%;
`;

const ButtonRegistre = styled.TouchableOpacity`
  font-weight: 700;
  padding-vertical: 14px;
  background-color: #2d2d2d;
  border-radius: 8px;
  margin-vertical: 12px;
  margin-horizontal: 3%;
`;

const InputGroup = styled.View`
  margin-vertical: 4px;
`;

const Input = styled.TextInput`
  height: 48px;
  margin-top: 8px;
  border-width: 1px;
  border-color: #4c4f63;
  background-color: #202226;
  padding: 10px;
  color: white;
  border-radius: 8px;
  margin-horizontal: 3%;
  margin-bottom: 6px;
  min-width: 43%;
`;
