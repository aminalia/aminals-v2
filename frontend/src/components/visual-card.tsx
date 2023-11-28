import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
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
          <CardTitle>Visual #{visual.visualId}</CardTitle>
          {/* <CardDescription>{visual.name}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <table>
            <tr>
              <td>Proposer: {visual.proposer.address}</td>
            </tr>
            <tr>
              <td>Category: {visual.catEnum}</td>
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

// TODO fix SVG rendering
function SvgStringToImage({ svg }: { svg: string }) {
  let image = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5">${svg}</svg>`;

  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
      alt="Visual"
    />
  );
}
