module.exports = {
  mainnet: {
    evm: [
      {
        id: 'ethereum',
        chain_id: 1,
        name: 'Ethereum',
        short_name: 'ETH',
        provider_params: [
          {
            chainId: '0x1',
            chainName: 'Ethereum',
            rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', 'https://rpc.ankr.com/eth'],
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://etherscan.io'],
          },
        ],
        explorer: {
          name: 'Etherscan',
          url: 'https://etherscan.io',
          icon: '/logos/explorer