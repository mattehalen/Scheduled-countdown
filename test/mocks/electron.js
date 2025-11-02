// Mock implementation of electron
const mockApp = {
    getPath: (name) => {
        if (name === 'userData') {
            return require('path').join(__dirname, '..', 'test-data');
        }
        return require('path').join(__dirname, '..');
    }
};

module.exports = {
    app: mockApp,
    remote: {
        app: mockApp
    }
};