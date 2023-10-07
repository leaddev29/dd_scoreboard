import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import * as Animatable from 'react-native-animatable';
import { ACTIONS } from './exports';


const ModalCongrats = ({ visible, setVisible, WinnerTeam, EventHandler }) => {
    return (
        <Modal
            animated={true}
            visible={visible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            style={{
                flex: 1
            }}
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Animatable.View animation={"bounceIn"} duration={500} style={{ paddingVertical: 20, paddingHorizontal: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'lightgrey' }}>
                    {/* <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>Congratulations</Text>
                    <Text>Congratulations!, {WinnerTeam} has won this set.</Text> */}
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => { setVisible(false); EventHandler({ event: ACTIONS.RESET_GAME }) }} style={{ width: 110, height: 30, borderWidth: 1, borderColor: 'black', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'black' }}>Reset</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => { setVisible(false); EventHandler({ event: ACTIONS.NEW_SET }); }} style={{ width: 110, height: 30, marginStart: 10, borderWidth: 1, borderColor: 'black', backgroundColor: 'black', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'white' }} adjustsFontSizeToFit={true}>New Set</Text>
                        </TouchableOpacity> */}
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    )
}
export default ModalCongrats;