import * as buffer from 'buffer';
(window as any).Buffer = buffer.Buffer;

export * from '@web3-react/core'
export * from '@web3-react/types';
export * from '@web3-react/walletlink'
export * from '@web3-react/walletconnect'
export * from '@web3-react/network'
export * from './metamask'
export {HipoContract} from './contract'

import { MetaMask } from './metamask'
import { URLS } from './chains'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
// import { WalletConnect } from '@web3-react/walletconnect';
import { WalletLink } from '@web3-react/walletlink';
import { Connector } from '@web3-react/types';
import { Network } from '@web3-react/network';
// import { Connector } from '@web3-react/types';
export const [network, hooks] = initializeConnector<Network>(
	(actions) => new Network(actions, URLS),
	Object.keys(URLS).map((chainId) => Number(chainId))
)
export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask(actions))
export const [walletLink, walletLinkHooks] = initializeConnector<WalletLink>((actions) =>  new WalletLink(actions, {url: URLS[1][0],appName: 'web3-react'}))
// export const [walletConnect, hooks] = initializeConnector<WalletConnect>((actions) =>
// 	  new WalletConnect(actions, {
// 		rpc: URLS,
// 	  }),
// 	Object.keys(URLS).map((chainId) => Number(chainId))
// )


export type WalletType = 'metaMask' | 'walletLink' | 'WalletConnect'



const walletInstance: any = {
	metaMask: metaMask,
	walletLink: walletLink
}

const walletHooks: any = {
	// metaMask: {...metaMaskHooks, isMetaMask: true},
	// walletLink: {...walletLinkHooks, isWalletLink: true}
	metaMask: metaMaskHooks,
	walletLink: walletLinkHooks
}

const connectWallet: any = {
	metaMask () {
		return metaMask.activate()
	},
	walletLink () {
		return walletLink.activate()
	}
}

const disConnectWallet: any = {
	metaMask () {
		return metaMask.deactivate()
	},
	walletLink () {
		return walletLink.deactivate()
	}
}

export function init () {
	metaMask.connectEagerly()
	walletLink.connectEagerly()
}

// const HipoSdkHooks = {
// 	useDeactivateWallet () {
// 		const isMetaMaskActive = metaMaskHooks.useIsActive()
// 		const iswalletlinkActive = walletLinkHooks.useIsActive()
// 		return () => {
// 			if (!HipoSdk.connector) return false
// 			console.log(HipoSdk.connector)
// 			HipoSdk.connector.deactivate()
// 		}
// 	}
// }

export class HipoSdk {
	static connector: Connector | null = metaMask
	static getHooks = (walletType: WalletType): Web3ReactHooks => {
		return walletHooks[walletType] || metaMaskHooks
	}
	static init = init
	static connect (walletType: WalletType) {
		const connectorWallet = connectWallet[walletType]() || null
		HipoSdk.connector = walletInstance[walletType]
		return connectorWallet
	}
	static disconnect(walletType: WalletType) {
		disConnectWallet[walletType]()
	}
}