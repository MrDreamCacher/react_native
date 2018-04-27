/*
 * @providesModule ModuleManager
 * create by zhaoshengqi
 *
 */

let modules = {};   // 从主工程根目录的module.json文件中读取的配置
let modulesConfig = {};// 从Native层的模块化配置文件读取的配置

function combineProperty(propertyName) {
    let properties = {};
    Object.keys(modules).forEach(moduleName => {
        if (isModuleEnable(moduleName)) {
            return;
        }
        let module = modules[moduleName];
        let property = module[propertyName];
        if (property === undefined) {
            return;
        }
        Object.assign(properties, property)
    });
    return properties;
}

function isModuleEnable(moduleName) {
    return modules[moduleName] !== undefined && isModulesConfigEnable(moduleName);
}

function isModulesConfigEnable(moduleName) {
    let module = modulesConfig[moduleName];
    if (module !== undefined) {
        return module.enable === 'true';
    }
    return true;
}

function getMainScreen(moduleName) {
    if (isModuleEnable(moduleName)) {
        let module = modules[moduleName];
        if (module.mainScreen === undefined) {
            let mainScreen = modules[moduleName];
            return mainScreen && mainScreen();
        }
    }
    return undefined;
}

function getScreen(moduleName, screenName) {
    if (isModuleEnable(moduleName)) {
        let screen = modules[moduleName][screenName];
        return screen && screen();
    }
    return undefined;
}

function registerModule(moduleName, modulePage) {
    modules[moduleName] = modulePage;
}

const ModuleManager = {
    registerModule,
    isModuleEnable,
    combineProperty,
    getMainScreen,
    getScreen
};

module.exports = ModuleManager;
