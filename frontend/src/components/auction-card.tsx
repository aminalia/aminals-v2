import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Auction } from '../../.graphclient';
import EndAuctionButton from './actions/endauction-button';
import ProposeButton from './actions/propose-button';

export default function AuctionCard({ auction }: { auction: Auction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenUri} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenUri} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalId} and {aminalTwo.aminalId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminalId}</tr>
              </td>
              <td>
                <EndAuctionButton auctionId={auction.auctionId} />
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
            </table>
          </CardContent>
          {/* <CardFooter></CardFooter> */}
        </CardSection>
      </Card>
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
