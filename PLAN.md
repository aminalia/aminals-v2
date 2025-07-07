# Plan

UI:

- Trait links don't work on aminal detail page
- Show auction end time and countdown
- Link to parents (kill buttons)
- Child preview on breeding, see what the Aminal looks like based on most popular votes
- breeding UX sucks

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

Indexer:

- Switch to ponder?
- Are votes and gene proposals getting indexed?
- Get how much eth a gene creator has earned (UI to allow them to claim)

In the `frontend` of Aminals, I want to refactor the breeding pages (both `pages/breeding/index.tsx` and `pages/breeding/[auctionId].tsx`) so that the UX and layout is nicer and most importantly fun. In general, it should have good design principles, feel consistent with the rest of the app, and be responsive.

The auction-card component could use a refresh, but much of the work should go into the breeding detail page itself (`[auctionId].tsx`).

Some improvements:

- Incorporate community proposals into the aminal builder (where you select genes and design an aminal), genes from the parents should be listed first, followed by community proposed genes, and finally the "empty" option.
- Randomize the preview when the page is loaded so that certain genes aren't biased, but ONLY use genes from the parent (no community proposals).
- Kill the community proposals section for now (as they should be incorporated in the Aminal builder) or put it hidden somewhere (a tab or manual selection modal). Pick what you feel will provide the best UX.
- Refine the design of the voting statistics section to more concisely fit a bunch of information. If possible make the images for the traits a little bigger in your design.
- Under voting statistics show a preview would look like if the auction closed at that moment, if there are no votes make sure to handle the empty state.
