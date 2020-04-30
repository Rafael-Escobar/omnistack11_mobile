import React,{useState,useEffect} from 'react';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View,FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from "../../services/Api";

import logoImg from "../../assets/logo.png";

import style from './style';

export default function Detail() {
    const navigation = useNavigation();
    const [incidents,setIncidents]=useState([]);
    const [total,setTotal]=useState(0);
    const [page,setPage]=useState(1);
    const [loading,setLoading]=useState(false);

    function navigateToDetail(incident){
        navigation.navigate('Detail', {incident});
    }

    async function loadIncidents() {
        if(loading){
            return;
        }
        setLoading(true);

        if(total>0 && incidents.length===total){
            return;
        }

        const response = await api.get("/incidents",{params:{page}});
        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total_count']);
        setPage(page+1);
        setLoading(false);
    }

    useEffect(()=>{
        loadIncidents() ;
    },[]);

    return (
        <View style={style.container}>
            <View style={style.header}>
                <Image source={logoImg} />
                <Text style={style.headerText}>
                    Total de <Text style={style.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>
            <Text style={style.title}>Bem-vindo!</Text>
            <Text style={style.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                data={incidents}
                style={style.incidentLists}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={true}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item:incident})=>(
                    <View style={style.incident}>
                        <Text style={style.incidentProperty}>ONG:</Text>
                        <Text style={style.incidentValue}>{incident.name}</Text>

                        <Text style={style.incidentProperty}>Caso:</Text>
                        <Text style={style.incidentValue}>{incident.title}</Text>

                        <Text style={style.incidentProperty}>Valor:</Text>
                        <Text style={style.incidentValue}>{Intl.NumberFormat('pt-BR',{style:'currency', currency:"BRL"}).format(incident.value)}</Text>

                        <TouchableOpacity
                            style={style.detailsButton}
                            onPress={() => navigateToDetail(incident)}>
                            <Text style={style.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={17} color="#e02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}