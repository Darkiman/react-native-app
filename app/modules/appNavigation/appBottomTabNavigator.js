import React from 'react';
import {Platform, Text} from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';
import NavigationRoutes from "../../constants/NavigationRoutes";
import mainNavigationScreens from "../appNavigation/mainNavigationScreens";
import i18nService from '../../utils/i18n/i18nService';
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/IconsService";

const bottomTabNavigator = createBottomTabNavigator(
    mainNavigationScreens,
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                // const iconType = Platform.OS === 'ios' ? 'ionicon': 'material-community';
                const iconPrefix = iconsService.getIconPrefix();
                let iconName;
                switch(routeName) {
                    case NavigationRoutes.HOME:
                        iconName = `${iconPrefix}-home`;
                        break;
                    case NavigationRoutes.PROFILE:
                        iconName = `${iconPrefix}-person`;
                        break;
                    case NavigationRoutes.SETTINGS:
                        iconName = `${iconPrefix}-cog`;
                        break;
                    case NavigationRoutes.MAPS:
                        iconName = `${iconPrefix}-map`;
                        break;
                }
                return <Icon type={IconsType.Ionicon} name={iconName} size={25} color={tintColor} />;
            },
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let text;
                switch(routeName) {
                    case NavigationRoutes.HOME:
                        text = i18nService.t('navigation.home');
                        break;
                    case NavigationRoutes.PROFILE:
                        text = i18nService.t('navigation.profile');
                        break;
                    case NavigationRoutes.SETTINGS:
                        text = i18nService.t('navigation.settings');
                        break;
                    case NavigationRoutes.MAPS:
                        text = i18nService.t('navigation.maps');
                        break;
                }
                return <Text style={{fontSize: 11, color: focused ? tintColor : '#555',  textAlign: 'center'}}>{text}</Text>;
            }
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray'
        },
    }
);
export default bottomTabNavigator;
