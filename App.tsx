import * as React from 'react';
import { Text, View, Button, Alert, TextInput, SafeAreaView } from 'react-native';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useEffect, useState} from "react";

const flag = false

async function getCache(key: string){
  try {
    let value = await AsyncStorage.getItem(key).then(res => {
      // @ts-ignore
        return JSON.parse(res)
    });
    // console.log('||| Value!!! ->', value)
    return value;
  }
  catch (e){
    return null;
  }

}

function SettingsScreen() {

  const Courses = ["1", "2", "3", "4"]
  const Groups = ["MOIS", "FIIT", "PIVZ"]
  const pocket = {
    backend_address:"none",
    course:"none",
    group: "none"
  }

  // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View>
          <Text style={{
            fontWeight: "bold",
            color:"white",
            marginBottom:30
          }}>Сервер парсинга расписания (Временное решение)</Text>
        </View>
        <View style={{
          marginBottom:20
        }}>
          <TextInput
              style = {{
                padding: 10,
                backgroundColor:'white',
                width: 200
              }}
              placeholder="Server address"
              onChangeText = {text => {
                pocket.backend_address = text
              }
              }
          />
        </View>
        <Text style={{
          fontWeight: "bold",
          color:"white",
          marginBottom:30

        }}> Изменить группу </Text>
        <View style={{ marginBottom:30 }}>
          <SelectDropdown
              defaultButtonText={"Выберете курс"}
              data = {Courses}
              onSelect={ (selectedItem, index) => {
                if (selectedItem != "3"){
                  Alert.alert("Данный курс не доступен", "Парсер для данного курса не прописан, расписание не изменится")
                }
                pocket.course = selectedItem
              }}
          />
        </View>
        <View style={{ marginBottom:30 }}>
          <SelectDropdown
              defaultButtonText={"Выберете группу"}
              data = {Groups}
              onSelect={(selectedItem, index) => {
                if (selectedItem != "MOIS"){
                  Alert.alert("Данная группа не доступна", "Парсер для данной группы не прописан, расписание не изменится")
                }
                pocket.group = selectedItem
              }}
          />
        </View>
        <Button
            color={'#687AF1FF'}
            title="Обновить"
            onPress={ async() => {
              if ((pocket.backend_address != 'none') && (pocket.group != 'none') && (pocket.course != 'none')){
                await AsyncStorage.setItem('pocket', JSON.stringify(pocket));
              }
                let pkg = await getCache('pocket')
              console.log(pkg.backend_address + '/' + pkg.course + '/' + pkg.group)
                let schedule = await axios.get(pkg.backend_address + '/' + pkg.course + '/' + pkg.group)
                    .then(response => {
                        return response.data
                    })
                    .catch(error => {
                        console.log('Error: ', error)
                    })
              await AsyncStorage.setItem('schedule', JSON.stringify(schedule.msg))
              console.log(await getCache('schedule'))
            }
            }/>
      </View>
  );
}




const DataTable = () => {
    const [isPocket, setIsPocket] = useState(Object)
    const [isData, setIsData] = useState(Object)
    useEffect(() => {
        async function LoadData() {

                setIsPocket(await getCache('pocket'))
                setIsData(await getCache('schedule'))
        }
        LoadData();
    }, [])


    const delay = async (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    let today = new Date();
    let currentDay = today.getDay()
    let monthNumber = today.getMonth()
    let currentMonth = 'Декабря'
    if (monthNumber == 11){
        currentMonth = 'Декаб'
    }
    console.log('||| pkg |||')
    console.log(isPocket.length)
    console.log('||| pkg |||')
    console.log(isData.length)
    const gr = isData["1521611"]
    console.log(gr)
    return(
        <View style={{paddingTop:30, paddingLeft: 15, paddingRight:15}}>
            <View style={{flexDirection:'row', justifyContent:'space-between' }}>
                <View>
                    <View style={{backgroundColor:'rgba(107,61,154,0.45)', alignItems:'center', padding: 10, borderRadius:10}}>
                        <Text style={{color:'#fff', paddingBottom: 10, fontSize:24}}>{currentDay}</Text>
                        <Text style={{color:'#fff'}}>{currentMonth}</Text>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>
                        <Text style={{color:'#fff', fontSize:8}}>{''+gr["5"]["1"]["08:40 - 10:15"]}</Text>
                    </View>
                    {/*<View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>*/}
                    {/*    <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>*/}
                    {/*    <Text style={{color:'#fff', fontSize:8}}>{''+gr["5"]["1"]["08:40 - 10:15"]}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>*/}
                    {/*    <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>*/}
                    {/*    <Text style={{color:'#fff', fontSize:8}}>{''+gr["5"]["1"]["08:40 - 10:15"]}</Text>*/}
                    {/*</View>*/}
                </View>
                <View>
                    <View style={{alignItems:'center', padding: 10, borderRadius:10}}>
                        <Text style={{color:'#fff', paddingBottom: 10, fontSize:24}}>{currentDay + 1}</Text>
                        <Text style={{color:'#fff'}}>{currentMonth}</Text>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>
                        <Text style={{color:'#fff', fontSize:8}}>{''+gr["6"]["1"]["08:40 - 10:15"]}</Text>
                    </View>
                </View>
                <View style={{alignItems:'center', padding: 10, borderRadius:10}}>
                    <Text style={{color:'#fff', paddingBottom: 10, fontSize:24}}>{currentDay + 2}</Text>
                    <Text style={{color:'#fff'}}>{currentMonth}</Text>
                </View>
                <View>
                    <View style={{alignItems:'center', padding: 10, borderRadius:10}}>
                        <Text style={{color:'#fff', paddingBottom: 10, fontSize:24}}>{currentDay + 3}</Text>
                        <Text style={{color:'#fff'}}>{currentMonth}</Text>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>
                        <Text style={{color:'#fff', fontSize:8}}>{''+gr["1"]["1"]["08:40 - 10:15"]}</Text>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>
                        <Text style={{color:'#fff', fontSize:8}}>{''+gr["1"]["2"]["10:25 - 12:00"]}</Text>
                    </View>
                </View>
                <View>
                    <View style={{alignItems:'center', padding: 10, borderRadius:10}}>
                        <Text style={{color:'#fff', paddingBottom: 10, fontSize:24}}>{currentDay + 4}</Text>
                        <Text style={{color:'#fff'}}>{currentMonth}</Text>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'center', backgroundColor:'rgba(107,61,154,0.45)', marginTop: 10, padding: 5, borderRadius:10, width:60}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>8:40</Text>
                        <Text style={{color:'#fff', fontSize:8}}>{''+gr["1"]["2"]["10:25 - 12:00"]}</Text>
                    </View>
                </View>

            </View>
        </View>
    )
}
    // return (
    //     <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
    //         <Text style={{fontSize:30, color:'#fff'}}>
    //             Немогу построить таблицу, приложение не настроенно!
    //         </Text>
    //     </View>
    // )



function ScheduleScreen() {
    return (
        <View>
            <DataTable/>
        </View>
    );
  }
function TodayScheduleScreen(){
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <Text style={{fontSize:30, color:'#fff'}}>
                Пока не доступно 😶
            </Text>
        </View>
    )
}
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
      <Tab.Navigator>
          <Tab.Screen name="Сегодня"
                      component={ TodayScheduleScreen }
                      options={{
                          tabBarIcon: ({ color, size }) => (
                              <Ionicons name='calendar-outline' size={size} color={color}/>
                          ),
                      }}
          />
          <Tab.Screen name="Расписание"
                      component={ ScheduleScreen }
                      options={{

                          tabBarIcon: ({ color, size }) => (
                              <Ionicons name='calendar-outline' size={size} color={color}/>
                          ),
                      }}
          />

        <Tab.Screen name="Настройки"
                    component={ SettingsScreen }
                    options={{
                      tabBarIcon: ({ color, size }) => (
                          <Ionicons name='settings-outline' size={size} color={color}/>
                      ),
                    }}
        />

      </Tab.Navigator>
  );
}
const MyTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        background: 'rgb(38,38,38)',
        text: 'rgb(255,255,255)',
        primary: 'rgb(104,122,241)',
        // border: 'rgb(35,35,35)',
        card: 'rgb(35,35,35)',
    },
};
export default function App() {
    return (
        <View style={{flex: 1, backgroundColor:'#212121'}}>
          <NavigationContainer theme={MyTheme}>
            <MyTabs/>
          </NavigationContainer>
        </View>
  );
}
