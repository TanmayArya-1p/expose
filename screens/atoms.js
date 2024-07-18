import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

import {generateKeyPair , signMessage, verifyMessage} from './cryptography'
import AsyncStorage from '@react-native-async-storage/async-storage';

const motherServerAtom = atom({
    key: 'motherServerAtom',
    default: selector({
        key : "motherServerAtomSelector",
        get: async ({get}) => {
            let temp =  await AsyncStorage.getItem('MServerURL')
            if(!temp) {
                return ''
            }
            return temp
        }
    })
})

const relayServerAtom = atom({
    key: 'relayServerAtom',
    default: selector({
        key : "relayServerAtomSelector",
        get: async ({get}) => {
            let temp =  await AsyncStorage.getItem('RServerURL')
            if(!temp) {
                return ''
            }
            return temp
        }
    })
})

const relayServerKeyAtom = atom({
    key:'relayServerKeyAtom',
    default: selector({
        key : "relayServerKeyAtomSelector",
        get: async ({get}) => {
            let temp = await AsyncStorage.getItem('RServerKey')
            if(!temp) {
                return ''
            }
            return temp
        }
    })
})

const sessionIDAtom = atom({
    key: 'sessionIDAtom',
    default: '',
})

const userIDAtom = atom({
    key: 'userIDAtom',
    default: '',
})

const keyPairAtom = selector({
    key: 'keyPairAtom',
    get: async ({get}) => {
        return await generateKeyPair()
    }
})

const ThemeAtom = atom({
    key: 'ThemeAtom',
    default: selector({
        key : "ThemeAtomSelector",
        get: async ({get}) => {
            let temp = await AsyncStorage.getItem('Theme')
            if(!temp) {
                return 'light'
            }
            return  temp
        }
    })
})

const authblobSelector = selector({
    key: 'authblobSelector',
    get: async ({get}) => {
        const userID = get(userIDAtom)
        const sessionID = get(sessionIDAtom)
        const keypair = get(keyPairAtom)
        let authblob = await signMessage(keypair.privateKey, sessionID + ":" + userID)
        return authblob
    }
})

module.exports = {authblobSelector , ThemeAtom , keyPairAtom , userIDAtom , sessionIDAtom , relayServerAtom , motherServerAtom, relayServerKeyAtom}