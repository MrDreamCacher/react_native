import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>'首页'</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

module.exports = HomeScreen;