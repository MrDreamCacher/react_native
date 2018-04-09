/*
 * @providesModule HFNavigator
 */
import React from 'react'
import {StackNavigator} from 'react-navigation';

export default class ZSQNavigator extends React.Component {


    render() {
        const Navigator = StackNavigator(
            this.props.initialRoute
        );
        return (
            <Navigator />
        );
    }
}
