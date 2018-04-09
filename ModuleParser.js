function moduleParser() {
    let fs = require('fs');
    let path = require('path');
    let modules = {};
    const indexModuleJS = 'index.module.js';
    let args = process.argv.slice(1);
    let reactWorkspace = args[0].substring(0, args[0].lastIndexOf('/') + 1);
    let nativeWorkspace = path.resolve(reactWorkspace + '../');
    const configPath = nativeWorkspace + '/modules.json';

    const whiteList = ['Common', 'Theme', 'ThemeManager'];

    const existPath = function (filePath) {
        if (!fs.existsSync(filePath)) {
            return false;
        }
        let dir = path.dirname(filePath);
        if (dir === '/' || dir === '.') {
            return true;
        }
    };

    const parseModuleConfig = function (configPath) {
        if (!configPath || !existPath(configPath)) {
            return;
        }
        let config = require(configPath);
        let submodules = config.sub;
        for (let key in submodules) {
            if (key.startsWith('react_native/')) {
                continue;
            }
            let modulePath = nativeWorkspace + '/' + key;
            let indexJs = modulePath + '/index.js';
            if (existPath(indexJs)) {
                let content = fs.readFileSync(indexJs, 'utf8');
                let regex = /@providesModule (\S*)/;
                let result = regex.exec(content);
                let module = result[1].trim();
                if (whiteList.indexOf(module) === -1) {
                    modules[module] = {
                        path: modulePath,
                        isPackage: false,
                        relativePath: key.replace('react_native', '.')
                    };
                }
            }
        }
    }

    const registerTheme = function () {

    }

    const createModuleJS = function(){
        fs.writeFileSync(indexModuleJS,'');
    }

    const registerModules = function() {
        fs.appendFileSync(indexModuleJS,'\nvar ModuleManager = require(\'ModuleManager\');\n\n');
        for(let module in modules){
            fs.appendFileSync(indexModuleJS,'ModuleManager.registerModule(\''+module+'\', require(\''+module+'\'));\n');
        }
    }

    let main = function() {
        parseModuleConfig(configPath);
        createModuleJS();
        registerTheme();
        registerModules();
        return process.exit(0);
    }

    main();
}

moduleParser();