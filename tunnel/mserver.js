const axios = require('axios');
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
        const res = await axios.get(fixURL(url)+"/ping", {
            signal: AbortSignal.timeout(TIMEOUT)
        })
        return res.status === 200;
    }
    catch (err) {
        return false
    }
}

async function validateSessionID(sid ,url) {
    const res = await axios.get(fixURL(url)+`/alive_sessions`);
    return res.data.includes(sid) 
}


async function joinSession(cs,url,pubkey) {
    // 'sid||auth||relay||mkey'
    const [sid, auth, relay, mkey] = cs.split('||')
    let data = JSON.stringify({
      "pubkey": pubkey,
      "auth": auth
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: fixURL(url)+`/${sid}/join`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const res = await axios.request(config)
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

async function sessionMetaData(url , authblob , userid) {
    let data = JSON.stringify({
    "authblob": authblob,
    "userid": userid
    });
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: fixURL(url)+`/${sid}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
    const res = await axios.request(config)
    return res.data
}

async function createPR(url,authblob, userid, to , request) {
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "to": to,
    "request": request
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/${sid}/createpr`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    const res = await axios.request(config)
    return res.data
}

async function delPR(url, authblob,userid, prid ) {
    const axios = require('axios');
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "prid": prid
    });

    let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/${sid}/delpr`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };
    const response = await axios.request(config);
    return response.data

}

async function appendIMG(url , authblob ,userid, hash , size) {
    const axios = require('axios');
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "hash": hash,
    "size": size
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/${sid}/appendimg`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };
    const res = await axios.request(config)
    return res.data
}

async function mms(url, authblob, userid, imgid) {
    const axios = require('axios');
    let data = JSON.stringify({
    "userid": userid,
    "authblob": authblob,
    "imageid": imgid
    });

    let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: fixURL(url)+`/${sid}/mms`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    const res = await axios.request(config)
    return res.data
}


module.exports = {mms,appendIMG,delPR,createPR,sessionMetaData,joinSession,createSession,isAlive}