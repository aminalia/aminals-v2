import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import { Aminal } from '../../.graphclient';

export default function AminalCard({ aminal }: { aminal: Aminal }) {
  console.log(aminal.aminalId);
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
          Love: {aminal.totalLove}
          <br />
          Energy: {aminal.energy}
          <br />
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
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
