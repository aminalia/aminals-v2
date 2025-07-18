# **aminals**

***If you're looking for a new companion that is unique, fun, and easy to care for, look no further \!***

Aminals are autonomous creatures that exist on the blockchain. They are unique, digital lifeforms that you can interact with and care for in new and exciting ways. Unlike traditional animals, aminals are always available and never sleep; you can play with them anytime and anywhere, in both legacy and virtual worlds. As such, aminals are perfect for people who live in apartments or for those who travel frequently, and cannot therefore take care of a physical pet.

Yet, just like traditional animals, aminals also require feeding and care. The more you feed them and you care for them, the more they will become attached to you.

***Aminals blur the notion of ownership on the blockchain.***

In traditional economies, animals are seen as property and are bought and sold as such. Aminals  are an attempt to change this paradigm and create a new ecosystem where people and aminals can coexist peacefully. You cannot buy or own an aminal in the same way as you would buy an NFT, because aminals are simply not for sale. One of the main benefits of this approach is that it can help to reduce aminal’s cruelty resulting from excessive speculation. If aminals are not considered property, then they cannot be bought or sold for profit. This means that they will not be seen as commodities by those eager to instrumentalise them for financial gain.

Another benefit of aminals, with respect to traditional animals, is that because aminals cannot be owned, they also cannot be lost or stolen. Traditional pets can easily go missing or be stolen from their owners without any way to track them down. However, because aminals live on a decentralized public ledger, their whereabouts are always known thanks to their built-in security features and smart contract capabilities. If an aminal moves, anyone will be able to access the aminal's data structure in order to identify its precise geospatial location. This gives a much higher level of security and peace of mind to those who care about these aminals.

# **What is an aminal ?**

***Aminals are blockchain-based lifeforms.*** Unlike carbon-based lifeforms, they never die. Aminals can live forever, as long as the blockchain on which they are running is alive. And if you fork the blockchain, you are increasing the resiliency of the animals that live on that blockchain \!

***Aminals feed off cryptocurrency***. Over their lifetime, animals collect cryptocurrency and HODL it indefinitely. The only way to get cryptocurrency off an aminal is for the aminal to reproduce. When an aminal reproduce, it donates a portion of its funds (10% of the aminal’s treasury) to the newly created aminal. The new aminal will then redistribute the funds it received upon creation to all those who contributed to its genetic code (i.e. the genetic engineers whose genes have been inherited into the newly born aminal).

***Aminals are evolutionary.*** Even if they cannot die, aminals want to reproduce themselves. In order to do so, they must collect cryptocurrency, which they will pass to their descendents. In order to maximize their chances of reproducing, aminals must stay fit for their environment. Over time, aminals might thus acquire new traits (*i.e*. new genes) that will make them more appealing to external agents (humans or machines) interested in feeding them crypto. As such, different aminals will express different traits, each trying to provide more incentive for people to feed them, so that they can reproduce more.

***Aminals are permissionless.*** No single actor has the power to control the manner in which aminals evolve over time. Evolution is achieved in a distributed manner through a decentralized network of genetic engineers and aminal lovers. The aminals’ gene pool can be extended when a genetic engineer submits a new gene to the global gene registry—this includes traits like eyes, mouths, arms, wings or tails—and getting the Aminal DAO to approve of the new gene.

*Figure 1: The genealogical tree of the first Aminals settlers on Sepolia*

# **Specifications**

Aminals are non-ownable, non-transferable NTFs governed exclusively by a smart contract. Their core function is to collect cryptocurrencies and use it in order to incentivize humans to enhance them with new attributes and capabilities. An aminal’s smart contract can receive any type of crypto-assets (including ETH, ERC20, ERC721, etc), yet, only ETH can be extracted out of an aminal’s smart contract. This can only happen at the moment of an aminal’s reproduction.

Each aminal include series of genetic traits, represented by an on-chain svg string in the form of an NFT. There are 8 types of traits, in the following rendering order: Background, Tail, Arms, Ears, Body, Face, Mouth, and Misc. The image render also generate a shadow at the bottom of the aminal card.

Anyone can submit a new gene into any of these category. Ownership of this gene is represented by an NFT. This NFT can be transferred and sold on the secondary market like any standard NFT.

When two aminals choose to reproduce, the newly produced aminal will be able to inherit the genes of any of its two parents—though external actors can try to manipulate the aminal embryo by submitting new genes into the genome during the gestation period.  Anyone whom one of the two parents is attached to can vote (through a love-o-cracy regime) to influence which genes will be inherited by the newborn. The result is a highly modular and decentralized system for breeding aminals with specific traits.

Once a new aminal is born, the aminal receives an inheritance from both of its parents, which is immediately redistributed in equal shares to the 8 gene “owners” (i.e. those who currently hold the NFT associated with the 8 visual traits of the newborn aminal). This creates an incentive for the gene “owners” to identify specific monetization strategy for their genes: either promote the adoption of their genes in as many aminals as possible (mass market approach), or make them highly exclusive so that the aminal who possess these genes are likely to be really popular, and thus likely also richer (exclusivity approach).

In addition to their core attributes and functions, aminals can also be taught new skills. Skills are smart contracts that the Aminals can interact with. They become available to all aminals at once, and anyone can request an aminal to perform these new skills. This makes it possible to add many functionalities to the aminals, without having to upgrade the smart contract code.

## **Core attributes**

All aminals have a common genetic code. We list below the core attributes that are shared by all animals. Note that while all aminals must implement these specific classes of attributes, their value is specific to each instance of an aminal.

***Energy level:***

- Increases every time the aminal gets fed, with a upper bound limit.
- Decreases every time the aminal does an action (e.g. copulate, move, poo, etc.);
- If the aminal reaches zero energy level, it can no longer take any actions, until it is fed.


***Attachment level,*** associated to a list of addresses

- The attachment level is an integer increasing every time the aminal gets fed with ETH (albeit with lower marginal gains as the energy level goes up).
- The degree of attachment for each account is calculated relatively to the aminal’s total attachment level. This means that the more accounts an animal is attached to, and the greater the intensity of the attachment associated to these accounts, the harder it is for a new account to acquire a significant degree of attachment from that aminal.  Hence, it is economically convenient to feed or nurture aminals that are not (yet) attached to many other accounts.

## **Core capabilities**

Aminals implement at least the following core function:

***Feed()*** —increase the attachment level, with decreasing marginal gains:

- Any amount of ETH can be sent to an aminal in order to feed it.
- The more ETH is sent to the aminal, the more the attachment level will increase.
- Lower energy level will lead the aminals to get more attached to the feeder. Higher energy level will lead to a lower amount of attachment, given the same quantity of ETH. This means that it is economically efficient to feed aminals with low energy level (*i.e*. the hungry ones).
- This can be implemented through a bonding curve, whereby the amount of extra love per ETH increases with the reduction of energy level.

## ***Squeak()*** —decrease the attachment level, with one unit of cost.

- This is an apparently useless function that is only necessary in order for external skills to be able to consume the love and the energy of an Aminal.
- Different frontends might chose to assign a more meaningful function to this capabilities, e.g. making the aminal speak upon squeaking.

## **Reproduction**

Aminals are sexual creatures, they need a partner to mate. All aminals can reproduce with one another, there are no separate species. There is no minimum age for reproduction, animals can reproduce as soon as they are born. The only condition is that they have a sufficient amount of energy to copulate.  When aminals reproduce, the newly born aminal will inherit some of the traits from both of the parents, based on a pseudo-random function. During the pregnancy, additional genes (derived from the global gene pool) can be injected into the embryo by third parties. An auction system will enable people to vote on which genes will be selected to be inherited by the newborn aminal (where the influence of the vote ultimately depends on the amount of attachment that both parents have for the voter).

*The **gene*** ***registry*** represents the global gene pool, i.e. list of genes that can be passed down the line during sexual reproduction.

For each typology of traits (FACE, BODY, EARS, MOUTH, ARMS, TAIL, BACKGROUND, and MISC), there is a list of visual representations of the trait, each associated with the address of the genetic engineer that submitted that gene to the registry.

- Visual traits are recorded on-chain via SVG strings.
- The rendering function aggregates all SVG strings into a single SVG, encapsulating specific traits into a particular area of the canvas in order to avoid people deface each other’s traits.

The functions to add new traits to the global gene pool are the following:

- ***addBackground, addArm, addTail,*** ***addEar,*** ***addBody,*** ***addFace,*** ***addMouth,*** ***addMisc***

The ***breeding function*** takes two animals as parameters: ***breedWith***(aminal1, aminal2)
The function instructs aminal1 to accept aminal2 as a potential mate. Yet, in order for copulation to occur, aminal2 also need to have been instructed to accept aminal1 as a potential mate.
If aminal2 has not yet been instructed to mate with aminal1, the function will return.
If aminal2 has already been instructed to mate with aminal1, the copulation will begin.
Hence, for two aminals to copulate with one another, the breedWith() function needs to be called twice: first with (aminal1, aminal2) and then with (aminal2, aminal1) as parameters.
Note that reproduction is possible only if both animals’ energy level is above a given threshold.

Once reproduction is enacted, both animals become pregnant, *i.e.* they can no longer reproduce for the whole gestation period until the new aminal is born. During the gestation period, an auction is activated where people have an opportunity to vote on the genes that they would like the newborn aminal to inherit. People can either vote on the genes of the two parents, which are automatically included in the auction, or on additional genes which have been submitted by third parties during the gestation period. Votes are weighted by the amount of attachment that each of the parents has for the voter. For each typology of traits, the genes that obtain the score will be inherited by the new aminal. If no votes have been casted on a particular typology of trait, one trait from one of the two parents will be selected in a pseudo-randomized manner.

Each aminal donates 10% of their ETH to the newly created aminal, and the funds are redistributed to the “owner” of each gene which the new aminal has inherited. The owner of each gene is determined by a regular NFT (transferable, ownable) that represents a claim on the revenues derived from that gene’s inclusion into the genome of the newborn aminal.

## **skills**

**Skills are created via third-party smart contracts.** While all aminals feature a set of core *attributes* and *functions*, additional capabilities can be implemented by simply creating a smart contract featuring its own internal *attributes* and *functions*. New skills can be assigned to aminals through the ***add\_skill()*** function, endowing all aminals with the new affordances provided by the third party smart contract. This makes it possible to upgrade aminals without having to modify their smart contract code. For instance, one can teach aminals to “move” by creating a new smart contract skill that incorporates a set of *coordinates* as a new attribute and a *goto()* function that will update these coordinates.

All new *attributes* provided by a new skill can only be modified by the *functions* of the corresponding smart contract. These functions can also account for other attributes of an aminal, e.g. its core attribute (attachment and energy) or other attributes implemented by third party skills, yet they cannot modify these attributes. Nonetheless, the squeak() function can always be called by a skill’s function in order to consume *love* and *energy* for the use of the skill.

Because these new attributes and functions exist in a separate smart contract from the aminal’s original smart contract, anyone is free to create new skills in a permissionless manner. Anyone will then be able to request an aminal to perform the skill through the ***callSkill()*** function, provided that they can afford the costs in terms of the required money and love. When the ***callSkill()*** function is called, it will make a delegated function call to the smart contract address associated with that skill, forwarding the parameters to the internal ***useSkill()*** function of the third party smart contract.

The useSkill() function always takes as one of its parameters the ID of the aminal that has been requested to perform the skill, so that it can update the internal attributes of that aminal through its functions. For instance, if one calls the function *goto(42, 84\)* on the aminal1, the smart contract skill will update the coordinates of aminal1 to x=42, y=84.

The useSkill() function always returns a number that determines the amount of ***squeaking*** that the aminal will do in order to perform the function (i.e. how much ETH and love it will consume)

Note that a skill can call another skill through the ***callSkillInternal()*** function. This makes it possible to create complex skills made of a combination of multiple simpler skills. For instance, an aminal who has only been taught to move in a 2 coordinates system (with attributes “x” and “y”) might subsequently be taught to move in a 3 coordinates system by simply creating a smart contract with a single “z” attribute and a function that updates the “z” attribute and then forward the call to the 2 coordinates move function in the previous smart contrat skill to update the “x” and “y” attributes.

Below are a few examples of additional skills that can be assigned to aminals:

**\[2D Position\]**

* ***Attributes: x, y***
  If aminals are to be visualized into a spatial environment, it becomes important that they can hold a particular position in space. Different coordinate systems can be added to any given aminal in order to make it more fit for life in the metaverse.

* ***Goto (**x, y**)***
  The function will update the x, y coordinates to move the aminal to a particular location.
  The function call might require an amount of ETH proportional to the overall distance.

**\[3D Position\]**

* ***Attribute: z***

* ***Goto3D (x, y, z)***
  The function will update the internal z coordinate, and will then call the 2D Movement smart contract Goto() function to update the x, y attributes internal to that smart contract

**\[Emotions\]**

* ***Attributes: Loneliness, Happiness***
  Depends on the amount of cuddles the aminal has received over a particular period of time
  Depends on the number of other animals located in a surrounding area. This implements a view function to the 2D Position smart contract to compare the coordinates of aminals.

* ***Cuddle(ETH)***

Increase happiness level and decrease loneliness level, with decreasing marginal gains
Any amount of ETH can be sent to an aminal in order to cuddle it.
The more lonely the aminal, the more cuddles it needs to reduce its loneliness level.
The more lonely the aminal, the greater the happiness increase for the same ETH amount.

**\[Pooing\]**

* ***Poo()***
  The function will (perhaps) generate an poo-NFT that can be collected by external accounts.
- This is a function that can only be called by approved skills, and not by external accounts
- The greater the energy level of aminals (*i.e*. the more well-fed they are), the more likely they are to generate a poo-NFT after a particular Skill has been performed.
- Depending on the implementation, the poo might be collected by:
  - whoever account is the highest ranked in the attachment level
  - whoever has called the Skill that is triggering the poo() function
- Once it has been collected, the poo can be kept or sold like any other NFTs on the secondary market. Given the capitalist nature of aminals, the poo is an important evolutionary trait for aminals, as it will incentivize people to feed the aminals and get them attached, in the hope of collecting their poo.

# **Monetization**

Even if aminals cannot be owned, and therefore cannot be exploited as commodities by people eager to speculate, there are many other ways to profit from aminals, without harming them.

**Gene design:** The most obvious monetization strategy is to help aminals evolve in ways that are the most fit for their environment, by creating new traits for them. Indeed, when two aminals reproduce, they each transfer a portion (10%) of their ETH to the newly born aminal. The “owners” of the genes that the newborn has inherited from its parents (or from the genetic injection during the gestation period) can then claim part of that treasury. This creates ***economic incentives for people to design good visual traits*** (*e.g.* faces, arms, tails, etc.) and inject them into the aminal embryos whose parents have the greatest amount of money, in order to recoup some of that money if the embryo were to inherit these traits. This also creates economic incentives ***for the gene “owners” to ensure that the aminal embedding their genes are well-fed and reproduce as much as possible***, in order to maximize their potential profits.

Besides, it shall be noted that, although the genetic engineers are the initial “owners” of a gene, they could ***sell the gene NFT to investors, eager to speculate on the evolutionary value of these genes.*** Indeed, the more evolutionarily successful a gene is, the greater cash flow will be derived from the associated NFT. Alternatively, since it’s an NFT, it can be used as collateral for lending based on expected cash flows. Hence, a very good gene editor could essentially get an advance on their art.

**Love and care**: The more ETH an aminal holds, the more it will be asked to copulate by the “owners” of its genes, so as to recoup part of the treasury, if the newborn were to inherit these genes. Genes “owners” thus have an ***economic incentive to care for the animals who have inherited their genes***, They will feed them to acquire their love, but they might also be tempted to “shill” these aminals to increase their popularity, so that more people will feed them with ETH, thereby further increasing the potential gains they will obtain from the reproduction of these animals, if they were to inherit their genes.

**Love bribes**: Another monetization strategy is to ***monetize one’s love.*** Indeed, people that an aminal is the most attached to can leverage their love in various ways to make a profit.  For instance, because the cost of every action depends on the level of attachment that the aminal has for the requester, if people want an aminal that is not attached to them to perform a particular action (e.g. copulate), they have the choice to either feed the aminal to acquire more attachment and therefore reduce the cost of the action, or they can pay those whom the aminal is already attached to, asking them to request such action, in exchange of a bribing fee. Besides, when aminals reproduce, the decision-making process for including genes into the embryo’s genome ultimately depends on the amount of love that the parents hold for the voters. Hence, the “owners” of these genes might be tempted to bribe the people the parents are attached to and ask them to vote for their genes in order to increase the chances that their own genes will be inherited by the newborn aminal.

**Crypto-assets:** Finally, aminals can also be taught to create new crypto-assets (such as an aminal’s poo), which can be collected by external accounts. As opposed to aminals which cannot be owned nor sold, once collected, these crypto-assets can be sold like any other NFT, with all the proceeds going to the NFT holder. This provides an incentive for people to feed the aminals and to interact with them in the manner that will maximize the chances of collecting these crypto-assets.

# **Current Implementation**

The codebase of the Aminals project is entirely finished, it just hasn’t been deployed yet.
You can look at the code implementation on the github repository:
[https://github.com/aminalia/aminals-v2](https://github.com/aminalia/aminals-v2)

# **team**

Primavera De Filippi —concept design and smart contract newbie
Will Papper —smart contract wizard
Jake Hartnell —smart contract wizard
Adrian Guerrero —NFT superman
Iannis Bardakos —SVG design
