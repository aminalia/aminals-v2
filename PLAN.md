# Plan

UI:

- Trait links don't work on aminal detail page
- Hide things in propose gene that you can't propose (Should anyone be able to propose any gene?)
- Add footer with GitHub link, and about page
- Overview landing page explaining what Aminals are
- Auction card shows child as settling even when auction is over (might be a graph issue)

Features:

- Track how much money you've made from genes
- Give love to Aminals (check voting power) on breeding page (if you don't love them yet, it's not too late)

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
- Shouldn't be able to breed an Aminal if already breeding? (needs test)
- Reset breedable with after breeding?

Indexer:

- When breeding is done, remove breedable with
- Switch to ponder?
- Get how much eth a gene creator has earned (UI to allow them to claim)
- Make sure speaks and changes in love are being indexed
