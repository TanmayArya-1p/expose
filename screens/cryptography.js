import RSA from 'react-native-rsa-native';

async function generateKeyPair() {
  const keys = await RSA.generateKeys(2048);
  return {
    publicKey: keys.public, 
    privateKey: keys.private
  };
}

async function verifyMessage(publicKeyString, message, signature) {
  const isValid = await RSA.verify(signature, message, publicKeyString);
  return isValid;
}


async function signMessage(privateKeyString, message) {
  //console.log("FAUHGF" , RSA.signWithAlgorithm)
  const signature = await RSA.signWithAlgorithm(message, privateKeyString , 'SHA256withRSA');
  return signature;
}


async function generateAuthBlob(userid, sid, privkey) {
  const res = await signMessage(privkey , sid+ ":" + userid)
  return res
}



module.exports = {generateKeyPair , signMessage, verifyMessage , generateAuthBlob}