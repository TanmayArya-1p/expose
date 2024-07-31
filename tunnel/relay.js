import axios from 'axios';
import RNFS from 'react-native-fs';
import base64 from 'base64-js';
import {
  Alert,
  PermissionsAndroid
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RSA from 'react-native-rsa-native';


function fixURL(url) {
    if (url[url.length - 1] === '/') url = url.slice(0, -1);
    if (!url.startsWith("http://")) {
        url =  "http://" + url;
    }
    return url
}

async function isAlive(url,key) {
    let TIMEOUT = 2000;

    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), TIMEOUT);
        console.log("KEY",fixURL(url)+"/?master_key="+key)
        const res = await axios.get(fixURL(url)+"/?master_key="+key, {
            signal: controller.signal
        })
        console.log(res.data)
        if(res.data.message === "Key Verified") {
            return {
                "serverStat" : true,
                "keyStat" : true
            }
        }
        return {
            "serverStat" : true,
            "keyStat" : false
        }
    }
    catch (err) {
        return {
            "serverStat" : false,
            "keyStat" : false
        }
    }
}

const fetchRoutes =async (serverUrl , mkey) => {
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        };
    req = await fetch(`${serverUrl}/routes?master_key=${mkey}`,rq)
    return req.json()
}

const fetchFile = async (serverUrl,authKey,masterKey,routeId) => {
    let returner = null
    const url = `${fixURL(serverUrl)}/fetch/${routeId}?authkey=${authKey}&master_key=${masterKey}`;
    console.log(`Request URL: ${url}`);
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers: ${JSON.stringify(response.headers)}`);
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded_file';
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match != null && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
    dt = new Date()

    function correctDate(a) {
        otpt = String(a)
        if(otpt.length == 1){
            return "0"+otpt
        }
        else {
            return otpt
        }
    }
    filename= `IMG_${dt.getFullYear()}${correctDate(dt.getMonth()+1)}${correctDate(dt.getDate())}_${correctDate(dt.getHours())}${correctDate(dt.getMinutes())}${correctDate(dt.getSeconds())}`
    //const path = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/${filename}.${response.headers['content-type'].split('/')[1]}`;
    const path = `${RNFS.ExternalStorageDirectoryPath}/Download/${filename}.jpg`;
      console.log(`Saving file to: ${path}`);

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const base64Data = base64.fromByteArray(new Uint8Array(response.data));
        await RNFS.writeFile(path, base64Data, 'base64');
        returner = await CameraRoll.saveAsset(`file://${path}`,{album:"Camera"}).then(onfulfilled => console.log(onfulfilled))
        //Alert.alert('Success', `File successfully downloaded to ${path}`);
      } else {
        Alert.alert('Permission Denied', 'Storage permission denied');
      }
    } catch (error) {
      if (error.response) {
        console.error(`Error response status: ${error.response.status}`);
        console.error(`Error response data: ${error.response.data}`);
      } else {
        console.error(`Error message: ${error.message}`);
      }
      Alert.alert('Error', `Error fetching the file: ${error.message}`);
    }
    console.log("RETURNER")
    return returner;
};

// const uploadFile = async (serverUrl,photo,authkey,mkey) => {
//     console.log("Started Upload : ",photo.node.image.uri)
//     const uri = photo.node.image.uri;
//     const filename = "test.jpg";
//     const mimeType = 'image/jpg'
//     const data = new FormData();
//         data.append('file', {
//         uri: uri,
//         type: mimeType,
//         name: filename,
//         });
    
//     fullurl = `${fixURL(serverUrl)}/upload?authkey=${authkey}&master_key=${mkey}`
//     const response =  await fetch(fullurl, {
//     method: 'POST',
//     body: data,
//     });
//     const r= await response.json()
//     console.log("Uploaded Image")
//     return r;
// }



async function encryptFile(filePath, publicKeyString) {
  const fileContent = await RNFS.readFile(filePath, 'base64');
  const SymmetricKey = await AES.randomKey(32);
  let encryptKeyContent = await RSA.encrypt(SymmetricKey, publicKeyString);
  const encryptedContent = await AES.encrypt(fileContent, symmetricKey, 'base64');

  const combinedContent = `${encryptKeyContent}\n\n${encryptedContent}`;
  return combinedContent;
}


const uploadFile = async (serverUrl,photo,authkey,mkey,pubkey) => {
  console.log("Started Upload : ",photo.node.image.uri)
  const uri = photo.node.image.uri;
  console.log("ENCRYPTING")
  let encryptedFile = null
  try {
    encryptedFile = await encryptFile(uri, pubkey);
  }
  catch (err) {
    console.log(err);
  }

  console.log("ENCRYPTED")
  try {
    await RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/encryptedFile.txt`, encryptedFile, 'base64');
  }
  catch (err) {
    console.log("WRITE ERROR"+err);
  }
  console.log("FINISHED CREATING TEMP TXT FILE")
  let formData = new FormData();
  formData.append('file', {
    uri: `${RNFS.DocumentDirectoryPath}/encryptedFile.txt`,
    name: 'encryptedFile.txt',
    type: 'application/octet-stream'
  });
  console.log("BEFORE REQUEST")
  let response = null
  try {
    response = await axios.post(`${fixURL(serverUrl)}/upload?authkey=${authkey}&master_key=${mkey}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  catch (err) {
    console.log(err);
  }

  console.log("AFTER REQUEST")
  console.log(response.data);
  console.log("Uploaded Image")
  return response.data;
}

module.exports = {uploadFile,fetchFile,fetchRoutes,isAlive};




