import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { VisualProposal } from '../../.graphclient';
import VoteButton from '../../src/components/actions/vote-button';

export default function VisualCard({ visual }: { visual: VisualProposal }) {
  return (
    <Card>
      <CardMedia>
        <SvgStringToImage svg={visual.svg} />
      </CardMedia>
      <CardSection>
        <CardHeader>
          <CardTitle>
            Category #{visual.catEnum} Visual #{visual.visualId} on Auction #
            {visual.auctionId}
          </CardTitle>
          {/* <CardDescription>{visual.name}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <table>
            <tr>
              <td>Proposer: {visual.proposer.address}</td>
            </tr>
            <tr>
              <td>Votes: {visual.loveVote}</td>
            </tr>
          </table>
        </CardContent>
        <CardFooter>
          <VoteButton
            auctionId={visual.auctionId}
            catId={visual.catEnum}
            vizId={visual.visualId}
          />
        </CardFooter>
      </CardSection>
    </Card>
  );
}

function SvgStringToImage({ svg }: { svg: string }) {
  let image = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" version="1.2" width="200" height="200" viewBox="0 0 1000 1000">${svg}</svg>`;

  return (
    <Image
      src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
      alt="Visual"
      width={200}
      height={200}
    />
  );
}
