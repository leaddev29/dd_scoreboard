import { Navigation } from "react-native-navigation";
export const APP_STACK = "AppStack";

export const AppScreens = {
  Splash: "Splash",
  SplashRN: "SplashRN",
  ScreenSettings: "ScreenSettings",
  ScreenScoreboard: "ScreenScoreboard",
  ScreenSetTeamName: "ScreenSetTeamName",
  SettingsScreen: "SettingsScreen",
  FullScreenAdScreen: "FullScreenAdScreen"
};

export function pushScreen(options) {
  Navigation.push(APP_STACK, {
    component: {
      name: options?.name,
      passProps: options?.passProps || {},
      options: {
        topBar: {
          visible: false,
        },
        layout: {
          backgroundColor: "black",
          componentBackgroundColor: "black",
        },
        window: {
          backgroundColor: "black",
        },
        ...options?.options,
      },
    },
  });
}

export function pushNewScreen(options) {
  // Navigation.push(APP_STACK, {
  //     component: {
  //         name: options?.name,
  //         passProps: options?.passProps || {},

  //         options: {
  //             topBar: {
  //                 visible: false
  //             },

  //             layout: {
  //                 fitSystemWindows: false,
  //                 backgroundColor: "rgba(0,0,0,0.2)",
  //                 componentBackgroundColor: "rgba(0,0,0,0.2)",
  //             },
  //             window: {
  //                 backgroundColor: "rgba(0,0,0,0.2)"
  //             },
  //             // layout: {
  //             //     // orientation: ["landscape" | "sensor"]
  //             //     // orientation:["sensorLandscape"]
  //             // },
  //             ...options?.options
  //         },
  //     }
  // })

  Navigation.push(APP_STACK, {
    component: {
      name: options?.name,
      passProps: options?.passProps || {},
      options: {
        topBar: {
          visible: false,
          title: {
            text: options?.title,
          },
        },
        animations: {
          push: {
            content: {
              translationY: {
                from: -require("react-native").Dimensions.get("window").height,
                to: 0,
                duration: 300,
              },
            },
          },
          pop: {
            content: {
              translationY: {
                from: 0,
                to: -require("react-native").Dimensions.get("window").height,
                duration: 300,
              },
            },
          },
        },
      },
    },
  })
    .then((result) => {
      console.log("Navigation.showOverlay result" + { result });
    })
    .catch((error) => {
      console.log("Navigation.showOverlay error ", error);
    });

  // Navigation.push({
  //     component: {
  //         name: options?.name,
  //         passProps: options?.passProps || {},
  //         options: {
  //             topBar: { visible: false },
  //             statusBar: {
  //                 drawBehind: true,
  //                 backgroundColor: 'black',
  //                 visible: false,
  //             },
  //             overlay: {
  //                 interceptTouchOutside: true,
  //             },
  //             window: {
  //                 // backgroundColor:'transparent'
  //             },
  //             layout: {
  //                 componentBackgroundColor: 'transparent',
  //                 fitSystemWindows: true,
  //                 backgroundColor: 'transparent',
  //                 orientation: ["sensorLandscape"],
  //             },
  //             animations: {
  //                 push: {
  //                     content: {
  //                         translationX: {
  //                             from: require('react-native').Dimensions.get('window').width,
  //                             to: 0,
  //                             duration: 300,
  //                         },

  //                     },
  //                 },
  //                 pop: {
  //                     content: {
  //                         translationX: {
  //                             from: 0,
  //                             to: -require('react-native').Dimensions.get('window').width,
  //                             duration: 300,
  //                         },
  //                     },
  //                 },

  //                 //   push: {
  //                 //     content : {
  //                 //         scale
  //                 //     }
  //                 //     // sharedElementTransitions: [{
  //                 //     //   fromId: `view${_options?.passedProps?.sharedId || 0}`,
  //                 //     //   toId: `view${_options?.passedProps?.sharedId || 0}Destination`,
  //                 //     //   interpolation: { type: 'linear' }
  //                 //     // }]
  //                 //   },
  //                 //   pop: {
  //                 //     sharedElementTransitions: [{
  //                 //       fromId: `view${_options?.passedProps?.sharedId || 0}Destination`,
  //                 //       toId: `view${_options?.passedProps?.sharedId || 0}`,
  //                 //       interpolation: { type: 'linear' }
  //                 //     }]
  //                 //   }
  //             }
  //         }
  //     }
  // })
}

export function pushTransparentScreen(options) {
  // Navigation.push(APP_STACK, {
  //     component: {
  //         name: options?.name,
  //         passProps: options?.passProps || {},

  //         options: {
  //             topBar: {
  //                 visible: false
  //             },

  //             layout: {
  //                 fitSystemWindows: false,
  //                 backgroundColor: "rgba(0,0,0,0.2)",
  //                 componentBackgroundColor: "rgba(0,0,0,0.2)",
  //             },
  //             window: {
  //                 backgroundColor: "rgba(0,0,0,0.2)"
  //             },
  //             // layout: {
  //             //     // orientation: ["landscape" | "sensor"]
  //             //     // orientation:["sensorLandscape"]
  //             // },
  //             ...options?.options
  //         },
  //     }
  // })

  Navigation.showOverlay({
    component: {
      name: options?.name,
      passProps: options?.passProps || {},
      options: {
        topBar: { visible: false },
        statusBar: {
          drawBehind: true,
          backgroundColor: "transparent",
          visible: false,
        },
        overlay: {
          interceptTouchOutside: true,
        },
        window: {
          // backgroundColor:'transparent'
        },
        layout: {
          componentBackgroundColor: "transparent",
          fitSystemWindows: true,
          backgroundColor: "transparent",
          orientation: ["sensorLandscape"],
        },
        animations: {
          push: {
            content: {
              translationX: {
                from: require("react-native").Dimensions.get("window").width,
                to: 0,
                duration: 300,
              },
            },
          },
          pop: {
            content: {
              translationX: {
                from: 0,
                to: -require("react-native").Dimensions.get("window").width,
                duration: 300,
              },
            },
          },

          //   push: {
          //     content : {
          //         scale
          //     }
          //     // sharedElementTransitions: [{
          //     //   fromId: `view${_options?.passedProps?.sharedId || 0}`,
          //     //   toId: `view${_options?.passedProps?.sharedId || 0}Destination`,
          //     //   interpolation: { type: 'linear' }
          //     // }]
          //   },
          //   pop: {
          //     sharedElementTransitions: [{
          //       fromId: `view${_options?.passedProps?.sharedId || 0}Destination`,
          //       toId: `view${_options?.passedProps?.sharedId || 0}`,
          //       interpolation: { type: 'linear' }
          //     }]
          //   }
        },
      },
    },
  })
    .then((result) => {
      console.log("Navigation.showOverlay result" + { result });
    })
    .catch((error) => {
      console.log("Navigation.showOverlay error " + { error });
    });
}

// push: {
//     content: {
//       translationX: {
//         from: require('react-native').Dimensions.get('window').width,
//         to: 0,
//         duration: 400,
//       },
//     },
//   },
//   pop: {
//     content: {
//       translationX: {
//         from: 0,
//         to: -require('react-native').Dimensions.get('window').width,
//         duration: 300,
//       },
//     },
//   },

export function pushRoot(options) {
  Navigation.setStackRoot(APP_STACK, {
    component: {
      name: options?.name,
      options: {
        topBar: {
          visible: false,
        },
        layout: {
          backgroundColor: "black",
          componentBackgroundColor: "black",
          orientation: ["landscape"],
        },
        window: {
          backgroundColor: "black",
        },
        statusBar: {
          drawBehind: true,
          visible: false
        },
      },

      passProps: options?.passProps || {},
    },
  });
}
