import axios from 'axios';
import RNFS from 'react-native-fs';
import base64 from 'base64-js';
import {
  Alert,
  PermissionsAndroid
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


const isAlive = async (serverUrl) => {
    rq = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    };

    const req = await fetch(serverUrl,rq)
    if (String(req.status) == "200") {
        return true
    }
    return false
}

const fetchSessions = async (serverUrl,mkey) => {
    if(!isAlive(serverUrl)) {
        return 0 
    }
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        };
    req = await fetch(`${serverUrl}/sessions?master_key=${mkey}`,rq)
    return req.json().sessions
}

const sessionFetch = async (serverUrl,sid,skey,mkey) => {
    if(!isAlive(serverUrl)){
        return 0
    }
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        };
    req = await fetch(`${serverUrl}/session/${sid}?session_key=${skey}&master_key=${mkey}`,rq)
    return req.json()
}

const appendImg = async (serverUrl, sid,skey,mkey , imghash, rid) => {
    if(!isAlive(serverUrl)){
        return 0
    }
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {"data" : [imghash,rid]}
        };
    req = await fetch(`${serverUrl}/session/${sid}/appendImg?session_key=${skey}&master_key=${mkey}`,rq)
    return req.json()
}

const sessionCreate = async (serverUrl,mkey, skey) => {
    if(!isAlive(serverUrl)) {
        return 0
    }
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        };
    req = await fetch(`${serverUrl}/sessionCreate?master_key=${mkey}&session_key=${skey}`,rq)
    return req.json().session_id
}   

const sessionDestroy = async (serverUrl,mkey,sid,skey) => {
    if(!isAlive(serverUrl)) {
        return 0
    }
    rq = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        };
    req = await fetch(`${serverUrl}/sessionDestroy?master_key=${mkey}&session_key=${skey}&session_id=${sid}`,rq)
    return req.json().session_id

}

const fetchRoutes =async (serverUrl , mkey) => {
    if(!isAlive(serverUrl)) {
        return 0
    }
    rq = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        };
    req = await fetch(`${serverUrl}/routes?master_key=${mkey}`,rq)
    return req.json()
}

const fetchFile = async (serverUrl,authKey,masterKey,routeId) => {
    if(!isAlive()) {
        return 0 
    }

    const url = `${serverUrl}/fetch/${routeId}?authkey=${authKey}&master_key=${masterKey}`;
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
      const path = `${RNFS.DownloadDirectoryPath}/${filename}.${response.headers["content-type"].split("/")[1]}`;
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
        CameraRoll.save(path)
        Alert.alert('Success', `File successfully downloaded to ${path}`);
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
    console.log("uploadPhoto Called");
    const uri = photo.node.image.uri;
    const filename = photo.node.image.filename;
    const mimeType = 'image/jpg'
    const data = new FormData();
        data.append('file', {
        uri: uri,
        type: mimeType,
        name: filename,
        });

        const response = await fetch(`${serverUrl}/upload?authkey=${authkey}&master_key=${mkey}`, {
        method: 'POST',
        body: data,
        });
    console.log(response.json());
    console.log("Uploaded Image")
    return response.json()
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function latestHashes(sessionstart) {
    var l= []
    var photos=[]
    CameraRoll.getPhotos({first: 3, assetType: 'Photos', from: sessionstart})
		.then(data => {
            data.edges.map(e => RNFS.stat(e.node.image.uri));
            photos = data.edges;
        })
		.then(stat=> { 
			console.log(stat)
            l.push(RNFS.hash(stat.originalFilepath, 'md5'))})
    return [l,photos]
}


async function startListenerThread(serverUrl,skey,sid,mkey) {
    console.log("LISTENER STARTED")
    var prevImgList = []
    setInterval(photoLibListener, 1000,serverUrl);
}



const photoLibListener = async (serverUrl,skey,sid,mkey) => {

    session_start = Date.now()
    var [currentImgList, photoObjects] = await latestHashes()
    if(currentImgList != prevImgList){
        console.log("PHOTO TAKEN BY USER")
        for(var i = 0;i<currentImgList.length; i++){
            if(!(currentImgList[i] in prevImgList)){
                resp = uploadFile(serverUrl,photoObjects[i],skey,mkey)
                appendImg(serverUrl,sid,skey,mkey,currentImgList[i],resp["route_id"])
                continue
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
    return (latestHashes()[0])

}


export default {uploadFile,fetchFile,fetchRoutes,fetchSessions,sessionDestroy,sessionCreate,appendImg,sessionFetch,isAlive,startListenerThread};




