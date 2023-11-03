import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import { Aminal } from '../../.graphclient';
import BreedButton from './actions/breed-button';
import FeedButton from './actions/feed-button';

export default function AminalCard({ aminal }: { aminal: Aminal }) {
  return (
    <Card>
      <CardMedia>
        <TokenUriImage tokenUri={aminal.tokenUri} />
      </CardMedia>
      <CardSection>
        <CardHeader>
          <CardTitle>Aminal #{aminal.aminalId}</CardTitle>
          {/* <CardDescription>{aminal.name}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <table>
            <td>
              Love: {aminal.totalLove / 1e18}
              <br />
              Energy: {aminal.energy / 1e18}
            </td>
            <td>Breedable with: ??</td>
          </table>
        </CardContent>
        <CardFooter>
          <FeedButton id={aminal.aminalId} />
          <BreedButton id1={aminal.aminalId} />
        </CardFooter>
      </CardSection>
    </Card>
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
