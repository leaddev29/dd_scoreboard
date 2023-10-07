import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { AppScreens, pushRoot } from '../General/AppRoutes';
import CustomFlip from '../General/Components/CustomFlip';
import MyCustomView from '../General/Components/MyCustomComponent';
import MobxGameState from '../General/GameState';

const Splash = () => {

    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    const ArrayPoints = range(-10, 24, 1);
    const refPager = useRef();

    useEffect(() => {
        console.log(`MobxState.teamAColor = ${MobxGameState.teamAColor}`)
        // Orientation.lockToLandscape();
        setTimeout(() => {
            // navigate();
            refPager?.current?.setPage != undefined && refPager.current.setPage(10)
        }, 6000)
    }, [])

    const navigate = async () => {
        pushRoot({
            name: AppScreens.ScreenScoreboard
        })
    }

    onClick = (event) => {
        alert("Received params: " + JSON.stringify(event))
        // this.setState({ status: !this.state.status })
    }




    return (

        <View style={styles.mainView}>
            {/* <StatusBar backgroundColor={"white"} barStyle={"light-content"} /> */}

            {/* <CustomFlip
                data={ArrayPoints}
                onClick={()=>{
                    console.log("OnClick")
                }}
                renderItem={({ item, index }) => {
                    console.log("renderItem");
                    console.log(index)
                    return (
                        <View style={{ flex: 1, width: '100%', height: "100%", backgroundColor: index % 2 == 0 ? "red" : 'blue', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>{item} item:</Text>
                        </View>
                    )
                }}
            /> */}

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>Spalsh</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'purple',
        backgroundColor: "black"
    }
})

export default Splash;