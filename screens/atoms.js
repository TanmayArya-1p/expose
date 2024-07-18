import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

import {generateKeyPair , signMessage, verifyMessage} from './cryptography'

const motherServerAtom = atom({
    key: 'motherServerAtom',
    default: '',
})

const relayServerAtom = atom({
    key: 'relayServerAtom',
    default: '',
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