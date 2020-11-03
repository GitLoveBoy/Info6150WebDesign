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
          icon: '/logos/explorers/etherscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/ethereum.png',
        color: '#c0c2c3',
        website: 'https://ethereum.org',
        coingecko_id: 'ethereum',
      },
      {
        id: 'binance',
        chain_id: 56,
        name: 'BNB Chain',
        short_name: 'BNB',
        provider_params: [
          {
            chainId: '0x38',
            chainName: 'BNB Chain',
            rpcUrls: ['https://rpc.ankr.com/bsc', 'https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed1.binance.org'],
            nativeCurrency: {
              name: 'BNB Token',
              symbol: 'BNB',
              decimals: 18,
            },
            blockExplorerUrls: ['https://bscscan.com'],
          },
        ],
        explorer: {
          name: 'BscScan',
          url: 'https://bscscan.com',
          icon: '/logos/explorers/bscscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/binance.png',
        color: '#e8b30b',
        website: 'https://bnbchain.world',
        coingecko_id: 'binancecoin',
      },
      {
        id: 'avalanche',
        chain_id: 43114,
        name: 'Avalanche',