# Plan

## New Features Ideas

- Aminal Race
- Give love to Aminals (check voting power) on breeding page (if you don't love them yet, it's not too late)
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

## Open Design Questions

- Do we need remove gene?
- What should proposing a gene cost in terms of love? Should it scale somehow in relation to the number of proposals?

In general we need a review of what things cost (even if the cost is in terms of love or energy).

## TODO

#### UI

- Trait links don't work on aminal detail page
- Hide things in propose gene that you can't propose (Should anyone be able to propose any gene?)
- Auction card shows child as settling even when auction is over (might be a graph issue)
- View traits and Aminals on Open Sea
- Show how much ETH Aminals have

#### Contracts

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever. Need to initialize initial genes, but maybe there is a different pattern we can use?
- start optimizing for gas (payouts need most work)
- measure gas (see how this is done in aminalsV3)
- More genes test coverage (renderer, auction, registry, NFT contract, payouts to owners)
- Clean up and document scripts
- Some events might be redundent (squeak vs EnergyChange / LoveChange)
- Investigate whether there should be some limits on gene proposals during auctions

#### Indexer

- Switch to ponder?

#### Do last

- Rename "Visuals" to "GeneIds", maybe explore using an array that could be variable length? Do we need backId, armsId, etc. if we are just rendering a stack?
- More docs
- Landing page about the Aminals project
