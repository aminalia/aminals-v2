# Plan

## New Features Ideas

- Track how much money you've made from genes
- Give love to Aminals (check voting power) on breeding page (if you don't love them yet, it's not too late)
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

## Open Design Questions

- Should lovers be able to propose any gene during breeding? Only genes they created? Something else?
- What should proposing a new gene cost? Currently there is a MIN_CREATION_FEE. Where should the funds go or does it only cost love?
- Do we need setBreedableWith? Do Aminals need to consent before breeding? If no, it could simplify the UX.
- Should an Aminal be able to breed with another aminal if it is already breeding?
- If an Aminal previously breed with another aminal does it need consent to breed with them again?
- Should contracts should be upgradable?

## TODO

#### UI

- Trait links don't work on aminal detail page
- Hide things in propose gene that you can't propose (Should anyone be able to propose any gene?)
- Auction card shows child as settling even when auction is over (might be a graph issue)
- View traits and Aminals on Open Sea
- Get sills working

#### Contracts

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever currently
- More genes test coverage (renderer, auction, registry, NFT contract)
- Clean up and document scripts
- start optimizing for gas (payouts need most work)

#### Do last

- Rename "Visuals" to "GeneIds", maybe explore using an array that could be variable length? Do we need backId, armsId, etc. if we are just rendering a stack?
- More docs
- Landing page about the Aminals project

#### Indexer

- Refine schema
- Index Aminal ETH balance
- When breeding is done, remove breedable with
- Switch to ponder?
- Get how much eth a gene creator has earned (UI to allow them to claim)
- Make sure speaks and changes in love are being indexed
