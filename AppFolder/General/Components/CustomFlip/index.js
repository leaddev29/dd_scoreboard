import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity, Animated, PanResponder } from 'react-native';
import Orientation from 'react-native-orientation-locker';
// import { AppScreens, pushRoot } from '../General/AppRoutes';
// import MyCustomView from '../General/Components/MyCustomComponent';
// import MobxGameState from '../General/GameState';

const CustomFlip = forwardRef(({ data, renderItem, onPageScroll, onClick, style }, _ref) => {

    const [currentPage, setCurrentPage] = useState(0);
    const [nextPage, setNextPage] = useState(1);
    const [previousPage, setPreviousPage] = useState(-1);

    const offset = useRef(new Animated.Value(0)).current
    const previouspageX = useRef(offset.interpolate({
        inputRange: [50, 100],
        outputRange: ['-90deg', '0deg'],
        extrapolate: 'clamp'
    })).current
    const nextpageX = useRef(offset.interpolate({
        inputRange: [-100, -50],
        outputRange: ['0deg', '90deg'],
        extrapolate: 'clamp'
    })).current
    const currentpageX = useRef(offset.interpolate({
        inputRange: [-100, -50, 0, 50, 100],
        outputRange: ['-90deg', '-90deg', '0deg', '90deg', "90deg"],
        extrapolate: 'clamp'
    })).current

    // offset.addListener(({ value }) => {
    //     // console.log("offset")
    //     // console.log(value)
    // })

    useImperativeHandle(_ref, () => ({
        setPage: (index) => { setPage(index) }
    }))

    const setPage = (index) => {
        if (index < 0 || index >= data.length) return;
        if (index > currentPage) {//GOING FORWARD.            
            if (nextPage != index) setNextPage(index);
            setTimeout(() => {
                Animated.timing(offset, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    setCurrentPage(index)
                    setNextPage(index + 1)
                    setPreviousPage(index - 1)
                    offset.setValue(0)
                });
            })
        } else if (index < currentPage) {//GOING BACKWORD.
            if (previousPage != index) setPreviousPage(index)
            Animated.timing(offset, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setCurrentPage(index)
                setNextPage(index + 1)
                setPreviousPage(index - 1)
                offset.setValue(0)
            });
        }
    }

    const VideoPanGestures = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (e, state) => {
            // DebugConsole(`state.dy = ${state.dy}`)
            if (state.dy > 10 && currentPage == 0) return false;
            if (state.dy < -10 && nextPage == data.length) return false;

            return (state.dy > 10 || state.dy < -10 || state.dx > 10 || state.dx < -10)
        },
        onPanResponderMove: Animated.event([
            null,
            {
                dy: offset
            }
        ]),
        onPanResponderRelease: (event, gestureState) => {
            // DebugConsole(`ON PAN RESPONDER RELEASE = ${gestureState.dy}`)
            // return;
            if (gestureState.dy > 50) { //PREVIOUS PAGE
                Animated.timing(offset, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true
                }).start(() => {
                    let thisPage = currentPage
                    setCurrentPage(currentPage - 1)
                    setPreviousPage(thisPage - 2)
                    setNextPage(thisPage)
                    offset.setValue(0)
                    if (onPageScroll != undefined) onPageScroll({ page: thisPage - 1 })
                });
            } else if (gestureState.dy < -50) { //GOING NEXT PAGE
                Animated.timing(offset, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true
                }).start(() => {

                    let next = nextPage
                    setCurrentPage(currentPage + 1)
                    setPreviousPage(previousPage + 1)
                    setNextPage(nextPage + 1)
                    offset.setValue(0)
                    setTimeout(() => {
                        if (onPageScroll != undefined) onPageScroll({ page: next })
                        console.log("Current Page");
                        console.log(currentPage)

                        console.log("Next Page")
                        console.log(nextPage)

                        console.log("Previous Page")
                        console.log(previousPage)

                        // setUpdatePage(!updatePage)
                    }, 0);
                });
            } else { //GOING BACK
                Animated.timing(offset, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }).start();
            }
            // if (onClick != undefined && gestureState.dy < 10 && gestureState.dx < 10) onClick()

        }
    })

    function renderCell(type) {
        let index = "current" ? currentPage : "previous" ? previousPage : "next" ? nextPage : null
        if (index == null) return null
        let item = data[index]
        return renderItem({ item, index })
    }

    return (
        <Animated.View
            {...VideoPanGestures.panHandlers}
            style={{
                marginTop: 10,
                width: 300,
                height: 200,
                // backgroundColor: 'red',
                borderRadius: 10,
                ...style
            }}
        >

            <Animated.View
                style={{
                    position: "absolute", width: '100%', height: "100%",
                    transform: [
                        { rotateX: previouspageX }
                    ]
                }}
            >
                {previousPage >= 0 ?
                    (renderItem({ item: data[previousPage], index: previousPage })) : null
                    // (renderCell("previous")) : null
                }

            </Animated.View>

            <Animated.View
                style={{
                    position: "absolute", width: '100%', height: "100%",
                    transform: [
                        { rotateX: currentpageX }
                    ]
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        // setPage(currentPage + 1)
                        if (onClick != undefined) onClick()
                    }}
                    style={{ width: '100%', height: "100%" }}
                >
                    {renderItem({ item: data[currentPage], index: currentPage })}
                </TouchableOpacity>
            </Animated.View>

            <Animated.View
                style={{
                    position: "absolute", width: '100%', height: "100%",
                    transform: [
                        { rotateX: nextpageX }
                    ]
                }}
            >
                {nextPage >= 0 && nextPage < data.length ?
                    (renderItem({ item: data[nextPage], index: nextPage })) : null
                }
            </Animated.View>

        </Animated.View>
    )
})

export default CustomFlip;