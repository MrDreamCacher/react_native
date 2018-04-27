import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AppRegistry from 'AppRegistry';
import ZSQNavigator from 'ZSQNavigator';
import StackManager from 'StackManager';
import ModuleManager from 'ModuleManager';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

class App extends React.Component {

    componentWillMount() {
        let reducers = ModuleManager.combineProperty('reducer');
        let reducer = combineReducers(reducers);
        this.store = createStoreWithMiddleware(reducer);
    }

    initRouter = () => {
        let {screen, ...props} = this.props;
        let [moduleName, screenName] = screen.split('\.');
        let id = screen;
        let route = {props, id};
        StackManager.push(StackManager.TYPE_REACT, id);
        if (screenName === undefined) {
            route.screen = ModuleManager.getMainScreen(moduleName);
        } else {
            route.screen = ModuleManager.getScreen(moduleName, screenName);
        }
        if (!route.screen) {
            route.screen = require('ErrorPage');
            route.props = {moduleName, screenName};
        }
        return route;
    };

    render() {
        let initialRoute = this.initRouter();
        return (
            <Provider store={this.store}>
                <ZSQNavigator id={initialRoute.id} initialRoute={initialRoute}/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('App', () => App);

