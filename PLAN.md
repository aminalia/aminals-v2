# Plan

UI:

- Show auction end time and countdown
- Link to parents (kill buttons)
- Propose visuals does not seem to be working

Contracts:

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever
- Sync env variables between graph, frontend, and contracts (less to replace on new deployments)
- More genes test coverage (renderer, auction, registry, NFT contract)
- Genes implement ERC721URIStorage, ERC721Enumerable?
- childAminalId is no longer relevant as it is always 1

Indexer:

- Switch to ponder?
- Get how much eth a gene creator has earned (UI to allow them to claim)
