# Plan

UI:

- Trait links don't work on aminal detail page
- Show auction end time and countdown
- Link to parents (kill buttons)
- Child preview on breeding, see what the Aminal looks like based on most popular votes

Contracts:

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever
- Sync env variables between graph, frontend, and contracts (less to replace on new deployments)
- More genes test coverage (renderer, auction, registry, NFT contract)
- Genes implement ERC721URIStorage, ERC721Enumerable?
- Rename "Visuals" to "GeneIds"
- childAminalId is no longer relevant as it is always 1
- Clean up and document scripts
- More docs in general
- Do we need setBreedableWith?
- Investigate if we should use VRGDA with loveDrivenPrice instead
- Rename geneFactory -> geneRegistry

Indexer:

- Switch to ponder?
- Are votes and gene proposals getting indexed?
- Get how much eth a gene creator has earned (UI to allow them to claim)
