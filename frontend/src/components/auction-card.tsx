import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Auction } from '../../.graphclient';

export default function AuctionCard({ auction }: { auction: Auction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Link href={`/auctions/${auction.auctionId}`}>
        <Card>
          <CardMedia>
            <TokenUriImage tokenUri={aminalOne.tokenUri} />
          </CardMedia>
          <CardMedia>
            <TokenUriImage tokenUri={aminalTwo.tokenUri} />
          </CardMedia>
          <CardSection>
            <CardHeader>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
              <CardDescription>
                Between {aminalOne.aminalId} and {aminalTwo.aminalId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminalId}</tr>
              </table>
            </CardContent>
            <CardFooter></CardFooter>
          </CardSection>
        </Card>
      </Link>
    </>
  );
}

function TokenUriImage({ tokenUri }: { tokenUri: string }) {
  let image,
    error = null;
  try {
    const base64Payload = tokenUri.split(',')[1];
    const decodedJsonString = atob(base64Payload);
    const json = JSON.parse(decodedJsonString);
    image = json.image;
  } catch (e) {
    error = e;
  }
  if (error || !image) {
    return <span className="text-gray-400">Unable to load image</span>;
  }
  return <img src={image} alt="Aminal" />;
}
