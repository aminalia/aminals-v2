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
import Image from 'next/image';
import Link from 'next/link';
import { Auction } from '../../.graphclient';
import EndAuctionButton from './actions/endauction-button';
import ProposeButton from './actions/propose-button';

import '../../styles/index.module.css';

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
              <CardTitle className="underline">
                Auction #{auction.auctionId}
              </CardTitle>
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
        </CardSection>
      </Card>
    </>
  );
}

export function AuctionCardActive({ auction }: { auction: Auction }) {
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

export function AuctionCardInActive({ auction }: { auction: Auction }) {
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
                u
                <EndAuctionButton auctionId={auction.auctionId} />
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
            </table>
          </CardContent>
          <CardFooter></CardFooter>
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
  return <Image src={image} alt="Aminal" width={200} height={200} />;
}
