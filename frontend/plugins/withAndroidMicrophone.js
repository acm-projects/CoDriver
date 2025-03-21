// plugins/withAndroidMicrophone.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidMicrophone(config) {
    return withAndroidManifest(config, async config => {
        config.modResults.manifest['uses-permission'] = [
            ...config.modResults.manifest['uses-permission'] || [],
            { $: { 'android:name': 'android.permission.RECORD_AUDIO' } },
        ];
        return config;
    });
};