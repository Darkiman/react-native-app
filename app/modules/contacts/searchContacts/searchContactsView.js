import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl, ActivityIndicator
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import { Text} from "react-native-elements";
import iconsService from "../../../utils/iconsService";
import themeService from "../../../utils/themeService";
import i18nService from "../../../utils/i18n/i18nService";
import messageService from "../../../utils/messageService";
import _ from 'lodash';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import FlashMessage from "react-native-flash-message";
import userService from "../../../utils/userService";
import CustomSearchBar from "../../../components/searchBar/searchBar";
import LinearGradient from "react-native-linear-gradient";
import ContactsList from "../../../components/contactsList/contactsList";
import NavigationBack from "../../../components/navigationBack/navigationBack";

const colors = themeService.currentThemeColors;

const styles = {
    safeArea: {
        ...sharedStyles.safeView,
        backgroundColor: colors.backgroundColor
    },
    mainView: {
        backgroundColor: 'transparent',
        flex: 1
    },
    headerText: {
        fontSize: 34,
        color: 'white',
        width: '100%',
        marginTop: 5,
        marginBottom: 5
    },
    backContainerStyle: {marginTop: 3, width: 35},
    emptyTextContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20
    },
    emptyText: {
        textAlign: 'center', color: colors.textLightColor
    }
};

const MIN_SEARCH_LENGTH = 5;

export default class SearchContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: '',
            refreshing: false,
            loading: false,
            searchResult: [],
        };

        this.debounceSearch = _.debounce(this.searchContacts, 600);
    }

    componentDidMount() {
        userService.getUser().then(user => {
            this.user = user;
        });
    }

    handleSearchChange = (text) => {
        this.setState({
            search: text
        });
        this.debounceSearch();
    };

    async searchContacts() {
        if (this.state.search.length < MIN_SEARCH_LENGTH) {
            return;
        }
        this.setState({
            loading: true
        });
        try {
            const result = await this.props.searchContacts(this.user.id, this.state.search);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(errorText);
            } else {
                this.setState({
                    searchResult: result.source.contacts,
                });
            }
            this.setState({
                loading: false
            });
        } catch (error) {
            this.setState({
                loading: false
            });
        }
    }

    onRefresh = async () => {
        this.setState({refreshing: true});
        if (this.state.search.length < MIN_SEARCH_LENGTH) {
            this.setState({refreshing: false});
            return;
        }
        const result = await this.props.searchContacts(this.user.id, this.state.search);
        if (result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
            this.setState({
                searchResult: [],
                refreshing: false
            });
        } else {
            this.setState({
                searchResult: result.source.contacts,
                refreshing: false
            });
        }
    };

    back = () => {
        this.props.navigation.navigate(NavigationRoutes.CONTACTS);
    };

    render() {
        const {
            isLoading,
            error,
            contacts,
            deleteContact,
            addContact
        } = this.props;
        const {searchResult, search, loading} = this.state;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            start={sharedStyles.headerGradient.start}
                            end={sharedStyles.headerGradient.end}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={{...styles.safeArea, backgroundColor: 'transparent'}}>
                    <View style={styles.mainView}>
                        <View style={sharedStyles.contactsHeader}>
                            <NavigationBack style={{paddingLeft: 0}} onPress={() => {
                                this.back();
                            }}/>
                            <Text style={styles.headerText}>{i18nService.t('search_contacts')}</Text>
                            <View style={sharedStyles.contactsSearchBar}>
                                <CustomSearchBar
                                    placeholder={i18nService.t('search')}
                                    onChangeText={this.handleSearchChange}
                                    onClear={this.handleClearClick}
                                    value={this.state.search}
                                />
                            </View>
                        </View>
                        <ScrollView style={{backgroundColor: 'white'}}
                            refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}>
                            {
                                search && search.length >= MIN_SEARCH_LENGTH ? (loading ? <View style={styles.emptyTextContainer}>
                                        <ActivityIndicator/>
                                    </View> : (searchResult && searchResult.length ? <ContactsList contacts={contacts}
                                                                                                   contactsToShow={this.state.searchResult}
                                                                                                   disableLeftSwipe={true}
                                                                                                   deleteContact={deleteContact}
                                                                                                   addContact={addContact}
                                                                                                   user={this.user}
                                                                                                   flashMessage={this.refs.flashMessage}>
                                    </ContactsList> : <View style={styles.emptyTextContainer}>
                                        <Text style={styles.emptyText}>{i18nService.t('no_contacts_with_that_name')}</Text>
                                    </View>))
                                    :
                                <View style={styles.emptyTextContainer}>
                                    <Text style={styles.emptyText}>{i18nService.t('start_typing_to_search_contacts')}</Text>
                                </View>
                            }
                        </ScrollView>
                    </View>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
