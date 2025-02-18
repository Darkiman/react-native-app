import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import ErrorMessage from "../../../components/ErrorMessage";
import {sharedStyles} from "../../../shared/styles/sharedStyles";

export default class ProfileDataView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage /> : null}
                    <Text>This is Profile Data</Text>
                    <Button
                        title='Go HOME'
                        onPress={() =>
                            this.props.navigation.navigate(NavigationRoutes.HOME)
                        }
                    />
                </View>
            </SafeAreaView>
        );
    }
}
