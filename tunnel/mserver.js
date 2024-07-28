import axios from 'axios';
const { useRecoilValue } = require('recoil');



function fixURL(url) {
    if (url[url.length - 1] === '/') url = url.slice(0, -1);
    if (!url.startsWith("http://")) {
        url =  "http://" + url;
    }
    return url
}



async function isAlive(url) {
    let TIMEOUT = 2000;
    
    try {
        console.log("AXIOS" , axios.get)
        const controller = new AbortController();
        setTimeout(() => controller.abort(), TIMEOUT);
        console.log(fixURL(url)+"/ping")
        const res = await axios.get(fixURL(url)+"/ping", {
            signal: controller.signal
        })
        return res.status === 200;
    }
    catch (err) {
        console.log(err)
        return false
    }
}

async function validateSessionID(sid ,url) {
    const res = await axios.get(fixURL(url)+`/alive_sessions`);
    return res.data.includes(sid) 
}


async function joinSession(cs,url,pubkey) {
    const [mkey, relay, sid, auth] = cs.split('||')
    let data = JSON.stringify({
      "pubkey": pubkey,
      "auth": auth
    });
    console.log(data,sid)
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: fixURL(url)+`/session/${sid}/join`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const res = await axios.request(config)
    console.log(res.data)
    return res.data
}

async function createSession(url,auth,pubkey) {
    let data = JSON.stringify({
    "auth": auth,
    "pubkey": pubkey
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/create_session`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    const res = await axios.request(config)
    return res.data
}

async function sessionMetaData(url , authblob , userid , sid) {
    let data = JSON.stringify({
        'userid': userid,
        'authblob': authblob,
        });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: fixURL(url)+`/session/${sid}`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    let res = await axios.request(config)


    return res.data
}

async function createPR(url,authblob, userid, to , request,sid) {
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "to": to,
    "request": request
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/session/${sid}/createpr`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    const res = await axios.request(config)
    console.log("CREATE PR RESP " , res)
    return res.data
}

async function delPR(url, authblob,userid, prid , sid) {
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "prid": prid
    });

    let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/session/${sid}/delpr`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };
    const response = await axios.request(config);
    console.log("DELETE PR RESP "+response.data)
    return response.data

}

async function appendIMG(url , authblob ,userid, hash , size , sid) {
    
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "hash": hash,
    "size": size
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/session/${sid}/appendimg`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };
    let res=null
    res = await axios.request(config)
    console.log("APPEND IMG RESPONSE",JSON.stringify(res.data).toString())
    return res.data
}

async function mms(url, authblob, userid, imgid ,sid) {
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "imageid": imgid
    });

    let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/session/${sid}/mms`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    const res = await axios.request(config)
    console.log("MMS RESP " + res.data)
    return res.data
}


module.exports = {mms,appendIMG,delPR,createPR,sessionMetaData,joinSession,createSession,isAlive}