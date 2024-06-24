import axios from 'axios';
import RNFS from 'react-native-fs';
import base64 from 'base64-js';
import {
  Alert,
  PermissionsAndroid
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import CryptoJS from 'react-native-crypto-js';
import BackgroundTimer from 'react-native-background-timer';


async function isAlive(serverUrl) {
    let fixedString = '{"message":"Relay Server is Alive"}'
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), 2000);
    });
    const fetchPromise = fetch(serverUrl)
        .then(response => {
            if (response.status !== 200) {
                return false;
            }
            console.log("PASSED 200 CHECKPOINT")
            return response.json().then(data => {
                console.log(JSON.stringify(data))
                return JSON.stringify(data) === fixedString;
            }).catch(() => {
                return false;
            });
        })
        .catch(() => {
            return false;
        });
    return Promise.race([fetchPromise, timeoutPromise]);
}


const fetchSessions = async (serverUrl,mkey) => {
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        };
    req = await fetch(`${serverUrl}/sessions?master_key=${mkey}`,rq)
    return req.json().sessions
}

const sessionFetch = async (serverUrl,sid,skey,mkey) => {
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        };
    req = await fetch(`${serverUrl}/session/${sid}?session_key=${skey}&master_key=${mkey}`,rq)
    r= await req.json()
    return r
}

const appendImg = async (serverUrl, sid,skey,mkey , imghash, rid) => {
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"data" : [imghash,rid]})
        };
    req = await fetch(`${serverUrl}/session/${sid}/appendImg?session_key=${skey}&master_key=${mkey}`,rq)
    console.log(req)
    r= await req.json()
    console.log(r)
    return r
}

const sessionCreate = async (serverUrl,mkey, skey) => {
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        };
    console.log("REQUESTING")
    req = await fetch(`${serverUrl}/sessionCreate?master_key=${mkey}&session_key=${skey}`,rq)
    console.log("REQUESted")
    resp = await req.json()
    return resp.session_id
}   

const sessionDestroy = async (serverUrl,mkey,sid,skey) => {
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        };
    req = await fetch(`${serverUrl}/sessionDestroy?master_key=${mkey}&session_key=${skey}&session_id=${sid}`,rq)
    return req.json().session_id

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
    const url = `${serverUrl}/fetch/${routeId}?authkey=${authKey}&master_key=${masterKey}&ses=1`;
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
        CameraRoll.saveAsset(`file://${path}`,{album:"Camera"}).then(onfulfilled => console.log(onfulfilled))
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
};

const uploadFile = async (serverUrl,photo,authkey,mkey) => {
    console.log(photo)
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
    const uri = photo.node.image.uri;
    const filename = "test.jpg";
    const mimeType = 'image/jpg'
    const data = new FormData();
        data.append('file', {
        uri: uri,
        type: mimeType,
        name: filename,
        });
    
    fullurl = `${serverUrl}/upload?authkey=${authkey}&master_key=${mkey}`
    console.log(fullurl)
    const response =  await fetch(fullurl, {
    method: 'POST',
    body: data,
    });
    const r= await response.json()
    console.log(r);
    console.log("Uploaded Image")
    return r;
}


// async function latestHashes(sessionstart) {
//     let hashList= []
//     let photos=[]
// 	CameraRoll.getPhotos({first: 5, assetType: 'Photos',})
// 		.then(data => data.edges.map(e => RNFS.stat(e.node.image.uri)
// 		.then(stat=> { 
// 			//console.log(stat)
//             RNFS.hash(stat.originalFilepath, 'md5')
// 		.then(hash=>hashList[0]=(hash)) })))
//     console.log(hashList)
//     return [hashList,photos]
//}

const latestHashes = async (sessionstart) => {
    try {
      const photos = await CameraRoll.getPhotos({
        first: 3,
        assetType: 'Photos',
        fromTime: sessionstart
      });
        const latestPhotos = photos.edges.map(edge => edge.node.image.uri);
        const computedHashes = await Promise.all(latestPhotos.map(async uri => {
        const fileContents = await RNFS.readFile(uri, 'base64');
        const hash = CryptoJS.MD5(CryptoJS.enc.Base64.parse(fileContents)).toString();
        return hash;
      }));
      return [computedHashes,photos.edges]
    } catch (error) {
      console.log(error);
    }
};

async function startListenerThread(serverUrl,skey,sid,mkey) {
    session_start = Date.now()
    console.log(`LISTENER STARTED : ${session_start}`)
    const IntId = await BackgroundTimer.setInterval(() => {photoLibListener(serverUrl,skey,sid,mkey , session_start)}, 10000);
    return IntId
}

function areArraysEqual(arr1, arr2) {
    if (arr1.length!=arr2.length) {
        return false
    }
    for (var i = 0; i < arr2.length; i++) {
      var a = arr1[i];
      var b = arr2[i];
  
      if (a != b) {
        return false;
      }
    }
  
    return true;
}

function membership(search,l) {
    for(let i =0 ; i<l.length; i++) {
        let k = l[i]
        if(search == k) {
            return true
        }
    }
    return false
}

var prevImgList = []
var uploaded = []
const photoLibListener = async (serverUrl,skey,sid,mkey,sessionstart) => {

    
    var [currentImgList, photoObjects] = await latestHashes(sessionstart)
    console.log(!areArraysEqual(currentImgList,prevImgList))
    if(!areArraysEqual(currentImgList,prevImgList)){
        console.log(prevImgList,currentImgList)
        for(let i = 0;i<currentImgList.length; i++){
            if(!(currentImgList[i] in prevImgList)){
                console.log(`Uploading Image ${currentImgList[i]} , ${i+1}/${currentImgList.length}`)
                if(!(membership(currentImgList[i],uploaded))){
                    resp = await uploadFile(serverUrl,photoObjects[i],skey,mkey)
                    uploaded.push(currentImgList[i])
                    console.log(`uploaded : ${uploaded.length}`)
                }
                console.log(resp)
                await appendImg(serverUrl,sid,skey,mkey,currentImgList[i],resp["route_id"])
            }
        }
    }
    serverImgList = await sessionFetch(serverUrl,sid,skey,mkey)
    console.log("SERVER IMG LIST",serverImgList)
    if(!areArraysEqual(serverImgList.map((i) => i[0]),currentImgList)){
        console.log("SERVER RECORDS DONT MATCH")
        for(var i=0;i<serverImgList.length;i++) {
            if(!membership(serverImgList[i][0],currentImgList)) {
                console.log(`DOWNLOADING FROM RID ${serverImgList[i][1]}`)
                await fetchFile(serverUrl,skey,mkey,serverImgList[i][1])
            }
            
        }
    }
    
    // r = sessionFetch(serverUrl,sid,skey,mkey)
    // if(r!= 0) {
    //     console.log(r)
    //     localHashCopy = latestHashes(session_start)
    //     for(var i=0;i<r.length;i++) {
    //         if(!(r[i][0] in localHashCopy)) {
    //             console.log(`MISSING IMAGE ${r[i]}`)
    //             if(fetchFile(serverUrl,skey,mkey) != 0) {
    //                 console.log("File Downloaded")
    //             }

    //         }

    // }
    [prevImgList,photoObjects] = await latestHashes(sessionstart)

}


export {uploadFile,fetchFile,fetchRoutes,fetchSessions,sessionDestroy,sessionCreate,appendImg,sessionFetch,isAlive,startListenerThread};




