function parseNetworks(env) {
  const networks = {};
  const NetworkNameRegEx = /^NETWORK_([A-Z]+)$/;

  const networkAwareEnvKeys = Object.keys(env).filter(key => /^NETWORK_/.test(key));
  const networkNames = networkAwareEnvKeys.filter(key => NetworkNameRegEx.test(key));
  for (const networkNameKey of networkNames) {
    const networkName = networkNameKey.match(NetworkNameRegEx)[1];
    const networkUrlKey = networkNameKey + '_URL';
    const url = env[networkUrlKey];
    const NetworkAccountRegEx = new RegExp(`^${networkNameKey}_ACCOUNT([0-9]+)$`);
    const accounts = networkAwareEnvKeys
      .filter(key => NetworkAccountRegEx.test(key))
      .sort((keyA, keyB) =>
        parseInt(keyA.match(NetworkAccountRegEx)[1]) - parseInt(keyB.match(NetworkAccountRegEx)[1])
      ).map(key => env[key])
    networks[networkName.toLowerCase()] = {
      url,
      accounts
    };
  }
  return networks;
}

module.exports = parseNetworks;