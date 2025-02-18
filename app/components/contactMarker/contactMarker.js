import React, {Component} from "react";
import {Image, View, ImageBackground} from 'react-native';
import imageCacheHoc from "react-native-image-cache-hoc";
import apiConfig from "../../utils/apiConfig";
import {sharedStyles} from "../../shared/styles/sharedStyles";
const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});
const defaultImg = require('../../assets/images/avatar.jpg');
const markerImg = require('../../assets/images/marker.png');


const styles = {
    imgBg: {
        width: 40,
        height: 60
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
        position: 'relative',
        left: 5,
        top: 4
}};

const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.avatar,
        source: defaultImg
}};

export default class ContactMarker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false
        };
    }

    onMarkerPress = () => {
        console.log('pressed');
    };

    render() {
        const {
            data,
            onLoad
        } = this.props;
        const avatar = data && data.avatar ? `${apiConfig.static}avatars/${data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
        return (
            <View style={{...sharedStyles.centredRow, position: 'relative'}}>
                <ImageBackground source={markerImg}
                                 style={styles.imgBg}
                                 onPress={this.onMarkerPress}>
                    <CacheableImage style={styles.avatar}
                                    source={avatar ? {
                                        uri: avatar
                                    } : defaultImg}
                                    defaultSource={defaultImg}
                                    placeholder={propOverridePlaceholderObject}
                                    onLoad={()=> {
                                        if(onLoad) {
                                            onLoad();
                                        }
                                    }}
                                    onError={()=> {
                                        console.log('Marker avatar not found');
                                    }}>
                    </CacheableImage>
                </ImageBackground>
            </View>
        );
    }
}
