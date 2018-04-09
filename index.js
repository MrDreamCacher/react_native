import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AppRegistry from 'AppRegistry';
import ZSQNavigator from 'ZSQNavigator'
import ModuleManager from 'ModuleManager'

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
        let route = {props}
        if (screenName === undefined) {
            route.screen = ModuleManager.getMainScreen(moduleName);
        } else {
            route.screen = ModuleManager.getScreen(moduleName, screenName);
        }
        return route;
    }

    render() {
        let initialRoute = this.initRouter();
        return (
            <Provider store={this.store}>
                <ZSQNavigator initialRoute={initialRoute}/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent("App", () => App);

