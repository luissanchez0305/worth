import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native";
import { Layout, HeadText, SubHeadText, CardContainer } from "../globalStyle";
// import TradingChart from "../components/TradingChart/index";
import { useEffect, useState } from "react";
import { GradientBackground } from "../components/GradientBackground";
import HeadSection from "../components/HeadSection";
import ChartsFilterButton from "../components/ChartsFilterButton";
import ListEvents from "../components/list/ListEvents";
import finnhubDB, {endpoints as epFinnhub} from "../api/finnhubDB";
import LoginForm from "../components/session/LoginForm";


export default function SignalsScreen() {
    const [user, setUser] = useState(false);

    if(user){
        return (
            <GradientBackground>
                <Layout>
                    <SafeAreaView>
                        <HeadText>Señales</HeadText>
                    </SafeAreaView>
                </Layout>
            </GradientBackground>
        );
    }else{
        return(
            <GradientBackground>
                <Layout>
                    <SafeAreaView>
                        <Login />
                    </SafeAreaView>
                </Layout>
            </GradientBackground>
        );
    }
}

function Login() {
    return <LoginForm />;
}