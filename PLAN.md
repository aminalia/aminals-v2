# Plan

## New Features Ideas

- Track how much money you've made from genes
- Give love to Aminals (check voting power) on breeding page (if you don't love them yet, it's not too late)
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

## Open Design Questions

- Should lovers be able to propose any gene during breeding? Only genes they created? Something else?
- What should proposing a new gene cost? Currently there is a MIN_CREATION_FEE. Where should the funds go or does it only cost love?

## TODO

#### UI

- Trait links don't work on aminal detail page
- Hide things in propose gene that you can't propose (Should anyone be able to propose any gene?)
- Auction card shows child as settling even when auction is over (might be a graph issue)
- View traits and Aminals on Open Sea
- Get sills working

#### Contracts

- Make sure payouts are working correctly
- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever
- More genes test coverage (renderer, auction, registry, NFT contract)
- Genes implement ERC721URIStorage, ERC721Enumerable?
- childAminalId is no longer relevant as it is always 1
- Clean up and document scripts
- Do we need setBreedableWith?
- Shouldn't be able to breed an Aminal if already breeding? (needs test)
- Reset breedable with after breeding?

We need to make sure that payouts work correctly. The current implementation is incorrect as it only transfers energy. The intended functionality is that when `settleAuction` is called on `GeneAuction.sol`, 10% of the treasury from each Aminal parent goes to those who created the winning genes for the child. Keep in mind that we will also be wanting to index this for a user dashboard so trait creators can keep track of what they earned.

Start by proposing some architectural changes.

#### Do last

- Rename "Visuals" to "GeneIds"
- More docs

#### Indexer

- Index Aminal ETH balance
- When breeding is done, remove breedable with
- Switch to ponder?
- Get how much eth a gene creator has earned (UI to allow them to claim)
- Make sure speaks and changes in love are being indexed
