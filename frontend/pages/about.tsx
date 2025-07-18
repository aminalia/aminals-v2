import Layout from './_layout';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">About Aminals</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl mb-6 italic">
            If you&apos;re looking for a new companion that is unique, fun, and easy to care for, look no further!
          </p>
          
          <p className="mb-6">
            Aminals are autonomous creatures that exist on the blockchain. They are unique, digital lifeforms that you can interact with and care for in new and exciting ways. Unlike traditional animals, aminals are always available and never sleep; you can play with them anytime and anywhere, in both legacy and virtual worlds. As such, aminals are perfect for people who live in apartments or for those who travel frequently, and cannot therefore take care of a physical pet.
          </p>
          
          <p className="mb-6">
            Yet, just like traditional animals, aminals also require feeding and care. The more you feed them and you care for them, the more they will become attached to you.
          </p>
          
          <p className="text-xl mb-6 italic">
            Aminals blur the notion of ownership on the blockchain.
          </p>
          
          <p className="mb-6">
            In traditional economies, animals are seen as property and are bought and sold as such. Aminals are an attempt to change this paradigm and create a new ecosystem where people and aminals can coexist peacefully. You cannot buy or own an aminal in the same way as you would buy an NFT, because aminals are simply not for sale. One of the main benefits of this approach is that it can help to reduce aminal&apos;s cruelty resulting from excessive speculation. If aminals are not considered property, then they cannot be bought or sold for profit. This means that they will not be seen as commodities by those eager to instrumentalise them for financial gain.
          </p>
          
          <p className="mb-8">
            Another benefit of aminals, with respect to traditional animals, is that because aminals cannot be owned, they also cannot be lost or stolen. Traditional pets can easily go missing or be stolen from their owners without any way to track them down. However, because aminals live on a decentralized public ledger, their whereabouts are always known thanks to their built-in security features and smart contract capabilities. If an aminal moves, anyone will be able to access the aminal&apos;s data structure in order to identify its precise geospatial location. This gives a much higher level of security and peace of mind to those who care about these aminals.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">What is an aminal?</h2>
          
          <p className="mb-4">
            <strong>Aminals are blockchain-based lifeforms.</strong> Unlike carbon-based lifeforms, they never die. Aminals can live forever, as long as the blockchain on which they are running is alive. And if you fork the blockchain, you are increasing the resiliency of the animals that live on that blockchain!
          </p>
          
          <p className="mb-4">
            <strong>Aminals feed off cryptocurrency.</strong> Over their lifetime, animals collect cryptocurrency and HODL it indefinitely. The only way to get cryptocurrency off an aminal is for the aminal to reproduce. When an aminal reproduce, it donates a portion of its funds (10% of the aminal&apos;s treasury) to the newly created aminal. The new aminal will then redistribute the funds it received upon creation to all those who contributed to its genetic code (i.e. the genetic engineers whose genes have been inherited into the newly born aminal).
          </p>
          
          <p className="mb-4">
            <strong>Aminals are evolutionary.</strong> Even if they cannot die, aminals want to reproduce themselves. In order to do so, they must collect cryptocurrency, which they will pass to their descendents. In order to maximize their chances of reproducing, aminals must stay fit for their environment. Over time, aminals might thus acquire new traits (i.e. new genes) that will make them more appealing to external agents (humans or machines) interested in feeding them crypto. As such, different aminals will express different traits, each trying to provide more incentive for people to feed them, so that they can reproduce more.
          </p>
          
          <p className="mb-8">
            <strong>Aminals are permissionless.</strong> No single actor has the power to control the manner in which aminals evolve over time. Evolution is achieved in a distributed manner through a decentralized network of genetic engineers and aminal lovers. The aminals&apos; gene pool can be extended when a genetic engineer submits a new gene to the global gene registry—this includes traits like eyes, mouths, arms, wings or tails—and getting the Aminal DAO to approve of the new gene.
          </p>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Implementation</h3>
            <p className="mb-2">
              The codebase of the Aminals project is entirely finished, it just hasn&apos;t been deployed yet.
            </p>
            <p>
              You can look at the code implementation on the{' '}
              <a 
                href="https://github.com/aminalia/aminals-v2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub repository
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}