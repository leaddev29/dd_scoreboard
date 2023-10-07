import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import * as Animatable from 'react-native-animatable';


const ModalTeamName = ({ visible, setVisible, onPress }) => {
    return (
        <Modal
            animated={true}
            visible={visible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            style={{}}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get("window").height * 2, backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <Animatable.View animation={"bounceIn"} duration={500} style={{ paddingVertical: 20, paddingHorizontal: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'lightgrey' }}>
                    <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>TEAM NAMES</Text>
                    <Text>Go into settings to edit names</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => setVisible(false)} style={{ width: 110, height: 30, marginEnd: 10, borderWidth: 1, borderColor: 'black', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'black' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPress} style={{ width: 110, height: 30, marginStart: 10, borderWidth: 1, borderColor: 'black', backgroundColor: 'black', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'white' }} adjustsFontSizeToFit={true}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    )
}
export default ModalTeamName;