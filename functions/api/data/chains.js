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
        short_name: 'AVAX',
        provider_params: [
          {
            chainId: '0xa86a',
            chainName: 'Avalanche C-Chain',
            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche'],
            nativeCurrency: {
              name: 'Avalanche',
              symbol: 'AVAX',
              decimals: 18,
            },
            blockExplorerUrls: ['https://snowtrace.io'],
          },
        ],
        explorer: {
          name: 'Snowtrace',
          url: 'https://snowtrace.io',
          icon: '/logos/explorers/snowtrace.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/avalanche.png',
        color: '#e84143',
        website: 'https://avax.network',
        coingecko_id: 'avalanche-2',
      },
      {
        id: 'polygon',
        chain_id: 137,
        name: 'Polygon',
        short_name: 'MATIC',
        provider_params: [
          {
            chainId: '0x89',
            chainName: 'Polygon',
            rpcUrls: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
            nativeCurrency: {
              name: 'Matic',
              symbol: 'MATIC',
              decimals: 18,
            },
            blockExplorerUrls: ['https://polygonscan.com'],
          },
        ],
        explorer: {
          name: 'Polygonscan',
          url: 'https://polygonscan.com',
          icon: '/logos/explorers/polygonscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/polygon.png',
        color: '#8247e5',
        website: 'https://polygon.technology',
        coingecko_id: 'matic-network',
      },
      {
        id: 'optimism',
        chain_id: 10,
        name: 'Optimism',
        short_name: 'OPT',
        provider_params: [
          {
            chainId: '0xa',
            chainName: 'Optimism',
            rpcUrls: ['https://mainnet.optimism.io'],
            nativeCurrency: {
              name: 'Ether',
              symbol: 'OETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://optimistic.etherscan.io'],
          },
        ],
        explorer: {
          name: 'Etherscan',
          url: 'https://optimistic.etherscan.io',
          icon: '/logos/explorers/optimism.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/optimism.png',
        color: '#dc2626',
        website: 'https://optimism.io',
        coingecko_id: 'optimism',
      },
      {
        id: 'arbitrum',
        chain_id: 42161,
        name: 'Arbitrum',
        short_name: 'ARB',
        provider_params: [
          {
            chainId: '0xa4b1',
            chainName: 'Arbitrum',
            rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
            nativeCurrency: {
              name: 'Arbitrum Ether',
              symbol: 'aETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://arbiscan.io'],
          },
        ],
        explorer: {
          name: 'Arbiscan',
          url: 'https://arbiscan.io',
          icon: '/logos/explorers/arbiscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/arbitrum.png',
        color: '#28a0f0',
        website: 'https://arbitrum.io',
        coingecko_id: 'arbitrum',
      },
      {
        id: 'fantom',
        chain_id: 250,
        name: 'Fantom',
        short_name: 'FTM',
        provider_params: [
          {
            chainId: '0xfa',
            chainName: 'Fantom Opera',
            rpcUrls: ['https://rpc.ftm.tools', 'https://rpc.ankr.com/fantom', 'https://rpcapi.fantom.network'],
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            blockExplorerUrls: ['https://ftmscan.com'],
          },
        ],
        explorer: {
          name: 'FTMScan',
          url: 'https://ftmscan.com',
          icon: '/logos/explorers/ftmscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/fantom.png',
        color: '#1869ff',
        website: 'https://fantom.foundation',
        coingecko_id: