import AsyncStorage from '@react-native-async-storage/async-storage';
class GAME_STATE {
    TeamNames = []
    TeamColors = []
}

const KeyUserData = "KEY_GAME_STATE";
export async function asyncSaveState(gameState) {
    try {
        const data = JSON.stringify(gameState);
        AsyncStorage.setItem(KeyUserData, data)
            .then(item => {
                console.log(`asyncStoreFunction AsyncStorage.setItem .then item = ${JSON.stringify(item)}`);
            });
        return true
    } catch (e) {
        alert('asyncStoreFunction Something went wrong');
        return false;
    }
};

export async function asyncGetState() {
    try {
        const value = await AsyncStorage.getItem(KeyUserData);
        if (value !== null) {
            let parsedValue = JSON.parse(value);
            return parsedValue;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};
